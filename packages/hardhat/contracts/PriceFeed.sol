// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// [THE WHY]: Kita "mengimpor" kontrak template dari RedStone yang udah kita install.
// Anggap ini kayak kita ngambil cetakan kue yang udah jadi, kita tinggal pake.
import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

/**
 * @title PriceFeed
 * @notice Kontrak ini ngambil data harga real-time pake RedStone Pull oracle.
 */
// [THE WHY]: Kontrak kita "mewarisi" semua kemampuan dari MainDemoConsumerBase.
// `is` itu artinya "adalah anak dari". Jadi, PriceFeed otomatis punya semua
// "kesaktian" dari kontrak RedStone, kayak fungsi buat verifikasi data.
contract PriceFeed is MainDemoConsumerBase {
    /**
     * @notice Kita memodifikasi fungsi validasi timestamp bawaan.
     * @dev Ini penting banget buat development. Waktu di blockchain (block.timestamp)
     * dan waktu di dunia nyata itu kadang suka nggak sinkron. Aturan default RedStone
     * itu ketat (cuma toleransi 3 menit). Kita longgarin jadi 15 menit biar
     * pas testing, transaksi kita nggak ditolak cuma gara-gara jamnya beda dikit.
     */
    function validateTimestamp(uint256 receivedTimestampMilliseconds) public view virtual override {
        uint256 blockTimestampMilliseconds = block.timestamp * 1000;
        uint256 maxTimestampDiffMilliseconds = 15 * 60 * 1000; // 15 menit

        if (blockTimestampMilliseconds > receivedTimestampMilliseconds) {
            require(
                blockTimestampMilliseconds - receivedTimestampMilliseconds <= maxTimestampDiffMilliseconds,
                "Timestamp too old"
            );
        } else {
            require(
                receivedTimestampMilliseconds - blockTimestampMilliseconds <= maxTimestampDiffMilliseconds,
                "Timestamp too far in future"
            );
        }
    }

    /**
     * @notice Fungsi buat ngambil harga ETH/USD terbaru.
     * @return price Harga ETH sekarang dalam USD (dengan 8 angka desimal).
     */
    function getEthPrice() public view returns (uint256) {
        // [THE WHY]: Kita nyiapin "daftar belanjaan" data yang kita mau.
        // Di sini, kita cuma mau 1 data, yaitu "ETH".
        bytes32[] memory dataFeedIds = new bytes32[](1);
        dataFeedIds[0] = bytes32("ETH");

        // [THE WHY]: Ini dia "mesin ajaib"-nya. Fungsi ini kita "warisi" dari RedStone.
        // Tugasnya: ngebongkar "kargo" transaksi yang dikirim dari frontend,
        // verifikasi tanda tangannya, dan ngekstrak harga ETH dari dalem kargo itu.
        uint256[] memory prices = getOracleNumericValuesFromTxMsg(dataFeedIds);
        return prices[0];
    }

    /**
     * @notice Fungsi buat ngambil harga BTC/USD terbaru. Logikanya sama persis.
     */
    function getBtcPrice() public view returns (uint256) {
        bytes32[] memory dataFeedIds = new bytes32[](1);
        dataFeedIds[0] = bytes32("BTC");

        uint256[] memory prices = getOracleNumericValuesFromTxMsg(dataFeedIds);
        return prices[0];
    }

    /**
     * @notice Fungsi buat ngambil banyak harga sekaligus biar efisien.
     */
    function getMultiplePrices() public view returns (uint256 ethPrice, uint256 btcPrice) {
        bytes32[] memory dataFeedIds = new bytes32[](2);
        dataFeedIds[0] = bytes32("ETH");
        dataFeedIds[1] = bytes32("BTC");

        uint256[] memory prices = getOracleNumericValuesFromTxMsg(dataFeedIds);
        return (prices[0], prices[1]);
    }
}
