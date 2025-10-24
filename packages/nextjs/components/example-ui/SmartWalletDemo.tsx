"use client";

// [THE WHY]: WAJIB! Pake hooks (useState, useActiveAccount, useScaffoldContractRead) & interaksi tombol.
import { useState } from "react";
// [THE WHY]: Impor fungsi-fungsi inti dari thirdweb buat interaksi kontrak via Smart Wallet.
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
// [THE WHY]: Impor hook thirdweb buat dapetin info Smart Wallet yang lagi aktif.
import { useActiveAccount } from "thirdweb/react";
// [THE WHY]: Impor "resep" chain Lisk Sepolia khusus thirdweb.
import { liskSepoliaThirdweb } from "~~/chains";
// [THE WHY]: Impor "peta" alamat kontrak kita yang udah di-deploy (dari hardhat).
import deployedContracts from "~~/contracts/deployedContracts";
// [THE WHY]: Impor hook Scaffold-ETH buat baca data kontrak (kita pake buat nampilin totalSupply & userBalance).
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
// [THE WHY]: Impor "stop kontak" thirdweb utama kita. Wajib pake ini.
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";
// [THE WHY]: Impor helper notifikasi dari Scaffold-ETH biar cakep.
import { notification } from "~~/utils/scaffold-eth";

export const SmartWalletDemo = () => {
  // --- STATE MANAGEMENT ---
  // [THE WHY]: State buat nyimpen alamat tujuan mint (opsional).
  const [mintToAddress, setMintToAddress] = useState("");
  // [THE WHY]: State buat nampilin loading pas lagi proses minting. UX penting!
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  // [THE WHY]: Dapetin info Smart Wallet yang lagi aktif (alamat, dll.).
  const account = useActiveAccount();

  // --- CONTRACT ADDRESS & DATA READING ---
  // [THE WHY]: Ngambil alamat kontrak MyNFT DARI FILE DEPLOYMENT. Ini bikin kode kita dinamis.
  // Kita pake '4202' (Chain ID Lisk Sepolia) buat ngambil alamat yang bener.
  // 'as `0x${string}` | undefined' itu cuma 'mantera' TypeScript biar tipenya aman.
  const nftAddress = deployedContracts?.[4202]?.MyNFT?.address as `0x${string}` | undefined;

  // [THE WHY]: Kita TETEP pake hook Scaffold-ETH buat ngebaca data totalSupply & balanceOf.
  // Kenapa? Karena ini LEBIH GAMPANG & OTOMATIS nge-handle update real-time.
  // Kita cuma pake thirdweb buat NGIRIM transaksi gasless-nya.
  const { data: totalSupply, refetch: refetchSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userNFTBalance, refetch: refetchBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    // [THE WHY]: Kita pake alamat dari hook 'useActiveAccount' thirdweb di sini. Aman!
    args: [account?.address as `0x${string}` | undefined],
  });

  // --- THE GASLESS MAGIC FUNCTION ---
  const handleGaslessMint = async () => {
    // [THE WHY]: Tentukan alamat tujuan. Kalo user nggak ngisi, mint ke diri sendiri.
    const targetAddress = mintToAddress || account?.address;

    // [THE WHY]: Validasi dasar. Pastiin user udah connect & alamat kontraknya ketemu.
    if (!targetAddress || !account || !nftAddress) {
      notification.error("Please connect wallet & ensure NFT contract is deployed");
      return;
    }

    setIsLoadingNFT(true); // [THE WHY]: Nyalain loading spinner. UX!

    try {
      // --- INI DIA INTINYA ---
      // 1. [THE WHY]: Bikin 'instance' kontrak pake thirdweb SDK. Kasih tau client, chain, & alamatnya.
      const nftContract = getContract({
        client: thirdwebClient, // Wajib pake client shared kita
        chain: liskSepoliaThirdweb,
        address: nftAddress,
      });

      // 2. [THE WHY]: "Siapin" panggilan ke fungsi 'mint'. Kita kasih tau kontraknya,
      //    nama fungsinya (harus SAMA PERSIS kayak di Solidity), dan parameternya.
      //    Ini BELUM ngirim transaksi, cuma nyiapin "paket"-nya.
      const transaction = prepareContractCall({
        contract: nftContract,
        method: "function mint(address to)", // <-- Penting! Nama & tipe parameter harus pas.
        params: [targetAddress as `0x${string}`],
      });

      // 3. [THE WHY]: KIRIM TRANSAKSINYA! Ini dia sihirnya. Kita kasih "paket" (`transaction`)
      //    dan "pengirim"-nya (`account`, yaitu Smart Wallet user).
      //    thirdweb SDK bakal OTOMATIS ngurusin sisanya:
      //    - Bikin UserOperation
      //    - Ngirim ke Bundler
      //    - Minta sponsor ke Paymaster
      //    - Nunggu transaksi dieksekusi
      //    - Ngasih kita 'transactionHash'-nya kalo sukses.
      //    User cuma perlu TANDA TANGAN SEKALI (gratis). BOOM! Gasless.
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      // --- SIHIR SELESAI ---

      notification.success(
        // [THE WHY]: Kasih notif sukses + link Blockscout. User seneng.
        `Gasless NFT minted! View on Blockscout: https://sepolia-blockscout.lisk.com/tx/${transactionHash}`,
      );

      setMintToAddress(""); // [THE WHY]: Reset input field. UX lagi.

      // [THE WHY]: Kasih jeda dikit (2 detik) biar blockchain sempet update,
      //    baru kita 'refetch' data totalSupply & userBalance pake hook Scaffold-ETH.
      //    Ini bikin angka di UI kita langsung ke-update tanpa perlu refresh manual.
      setTimeout(() => {
        refetchSupply();
        refetchBalance();
      }, 2000);
    } catch (error: any) {
      // [THE WHY]: Error handling itu WAJIB. Kasih tau user kalo gagal.
      console.error("Mint failed:", error);
      notification.error(error.message || "Mint failed");
    } finally {
      setIsLoadingNFT(false); // [THE WHY]: Apapun hasilnya, matiin loading spinner.
    }
  };

  // --- TAMPILAN UI ---
  // [THE WHY]: Sisanya cuma JSX biasa buat nampilin data & tombol.
  // Kita pake data 'totalSupply' & 'userNFTBalance' dari hook Scaffold-ETH,
  // dan alamat 'account.address' dari hook thirdweb. Semuanya akur!
  return (
    <div className="flex justify-center gap-6 flex-col sm:flex-row">
      {/* Gasless NFT Minting Card */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🎨 Mint NFT (100% Gasless!)</h2>

          {/* Display Stats */}
          <div className="stats stats-vertical shadow mb-4">
            <div className="stat">
              <div className="stat-title">Total Minted</div>
              <div className="stat-value text-secondary">{totalSupply?.toString() ?? "0"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">You Own</div>
              <div className="stat-value text-accent">{userNFTBalance?.toString() ?? "0"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Smart Wallet</div>
              <div className="stat-desc text-xs font-mono break-all">
                {/* [THE WHY]: Nampilin alamat Smart Wallet user biar keren. */}
                {account?.address}
              </div>
            </div>
          </div>

          {/* Mint Input (Optional) */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Mint to address (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave empty to mint to yourself"
              className="input input-bordered w-full"
              value={mintToAddress}
              onChange={e => setMintToAddress(e.target.value)}
            />
          </div>

          {/* Mint Button */}
          <div className="card-actions justify-end mt-4">
            {/* [THE WHY]: Tombolnya nge-trigger fungsi 'handleGaslessMint'.
                Kita juga bikin dia 'disabled' pas lagi loading. UX! */}
            <button className="btn btn-primary" onClick={handleGaslessMint} disabled={isLoadingNFT}>
              {isLoadingNFT ? "Minting..." : "Mint NFT (Gas Free!)"}
            </button>
          </div>

          {/* Info Box */}
          <div className="alert alert-success mt-4">
            <svg /* ... icon ... */>
              {" "}
              {/* SVG icon for visual cue */}
              <path /* ... path data ... */ />
            </svg>
            <span className="text-xs">✨ Minting sponsored by thirdweb paymaster - $0 gas cost!</span>
          </div>
        </div>
      </div>
      {/* Bisa tambahin card lain di sini kalo mau (misal: Gasless Token Transfer) */}
    </div>
  );
};

// [THE WHY]: Kita nggak nge-export default di sini karena ini komponen UI biasa, bukan halaman.
