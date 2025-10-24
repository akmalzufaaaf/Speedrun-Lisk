"use client";

import { useEffect, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  // [THE WHY]: Kita butuh 'state' buat nyimpen data yang dinamis:
  const [price, setPrice] = useState<string>("0.00"); // Harga yang ditampilin
  const [isLoading, setIsLoading] = useState(true); // Status loading (true/false)
  const [error, setError] = useState<string>(""); // Pesan error kalo ada masalah
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date()); // Waktu terakhir update

  // [THE WHY]: Hook ini ngambil info (alamat & ABI) dari kontrak 'PriceFeed' kita yang udah di-deploy.
  const { data: deployedContractData } = useDeployedContractInfo("PriceFeed");

  const fetchPrice = async () => {
    if (!deployedContractData) {
      setError("PriceFeed contract not deployed. Run: yarn deploy");
      setIsLoading(false);
      return;
    }

    // [THE WHY]: RedStone butuh 'provider' dari wallet buat jalan. Kita cek dulu.
    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please connect your wallet to view prices");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // [THE WHY]: Di sinilah kita pake 'ethers.js' v5. Kita bikin 'provider' & 'contract' versi ethers.
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider);

      // [THE WHY]: Ini dia 'magic'-nya. Kita "bungkus" kontrak ethers kita pake WrapperBuilder RedStone.
      // SDK ini bakal 'nyuntikkin' data harga ke transaksi kita secara otomatis.
      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataPackagesIds: [symbol], // Data apa yang kita mau? "ETH" atau "BTC".
        authorizedSigners: getSignersForDataServiceId("redstone-main-demo"), // Siapa "kurir" terpercaya-nya? Kita pake daftar default dari RedStone.
      });

      // [THE WHY]: Kita manggil fungsi di kontrak kita seperti biasa. Tapi di balik layar,
      // 'wrappedContract' bakal nambahin data harga ke panggilan ini.
      const priceData = symbol === "ETH" ? await wrappedContract.getEthPrice() : await wrappedContract.getBtcPrice();

      if (!priceData) {
        throw new Error("No price data returned from oracle");
      }

      // [THE WHY]: Data dari RedStone punya 8 desimal. Kita format jadi angka biasa dengan 2 desimal.
      const formattedPrice = (Number(priceData) / 1e8).toFixed(2);
      setPrice(formattedPrice);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching price:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  };

  // [THE WHY]: Kita pake 'useEffect' biar fungsi 'fetchPrice' otomatis jalan pas komponen pertama kali muncul.
  // Kita juga bikin 'interval' biar harganya nge-refresh otomatis setiap 30 detik.
  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    // [THE WHY]: 'cleanup function' ini penting buat matiin interval pas komponennya udah nggak ditampilin,
    // biar nggak ada 'memory leak'.
    return () => clearInterval(interval);
  }, [deployedContractData, symbol]);

  return (
    // [THE WHY]: Ini cuma bagian UI buat nampilin semua 'state' yang udah kita siapin.
    // Dia bisa nampilin 'error', 'loading spinner', atau data harganya.
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">{symbol}/USD</h2>

        {error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Current Price</div>
              <div className="stat-value text-white">${price}</div>
              <div className="stat-desc">Updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        <div className="card-actions justify-end">
          <button className="btn btn-sm btn-outline" onClick={fetchPrice} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};
