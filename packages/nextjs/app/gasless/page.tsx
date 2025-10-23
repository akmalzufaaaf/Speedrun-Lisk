"use client"; // [THE WHY]: WAJIB! Karena kita pake hooks (useActiveAccount) & komponen interaktif (ConnectButton).

import type { NextPage } from "next";
// [THE WHY]: Impor komponen & hooks keren dari thirdweb.
import { ConnectButton, useActiveAccount } from "thirdweb/react";
// [THE WHY]: Impor "resep" Lisk Sepolia khusus buat thirdweb yang udah kita buat.
import { liskSepoliaThirdweb } from "~~/chains";
// [THE WHY]: Impor komponen demo yang bakal kita buat di step selanjutnya.
import { SmartWalletDemo } from "~~/components/example-ui/SmartWalletDemo";
// [THE WHY]: Impor "stop kontak" thirdweb utama kita. Harus pake ini biar konsisten.
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";

const Gasless: NextPage = () => {
  // [THE WHY]: Hook dari thirdweb buat dapetin info akun YANG LAGI AKTIF.
  // Ini pinter, dia bisa tau kalo user lagi pake EOA biasa atau Smart Wallet.
  // Kalo pake Smart Wallet, 'account' ini bakal berisi detail Smart Wallet-nya.
  const account = useActiveAccount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">⛽ Gasless Transactions</h1>
        <p className="text-center text-gray-600 mb-4">Powered by ERC-4337 Smart Wallets - Pay $0 in gas fees!</p>

        {/* --- INI DIA SIHIRNYA DIMULAI --- */}
        <div className="flex justify-center mb-8">
          {/* [THE WHY]: Ini BUKAN tombol connect biasa. Ini tombol dari thirdweb
              yang udah di-design buat ngurusin alur pembuatan Smart Wallet. */}
          <ConnectButton
            // [THE WHY]: Kasih tau tombolnya harus pake "stop kontak" mana. Wajib pake client shared kita.
            client={thirdwebClient}
            // [THE WHY]: Kasih tau tombolnya mau nyambung ke jaringan mana (pake resep thirdweb).
            chain={liskSepoliaThirdweb}
            // --- INI KUNCINYA ---
            accountAbstraction={{ // [THE WHY]: Objek ini buat ngaktifin fitur Account Abstraction (Smart Wallet).
              // [THE WHY]: Konfirmasi lagi chain-nya (biar aman).
              chain: liskSepoliaThirdweb,
              // [THE WHY]: INI DIA SAKLAR AJAIBNYA! Dengan 'true', kita bilang:
              // "Tolong aktifin Paymaster. Semua transaksi dari Smart Wallet ini
              // bakal disponsori gas fee-nya!" BOOM! Gasless aktif.
              sponsorGas: true,
            }}
          />
        </div>
        {/* --- SIHIR SELESAI --- */}
      </div>

      {/* [THE WHY]: Logika tampilan simpel: Kalo 'account' ADA (user udah connect pake thirdweb),
          tampilin komponen demo kita. Kalo 'account' KOSONG (belum connect), tampilin pesan suruh connect. */}
      {account ? (
        // Komponen ini bakal kita buat di step selanjutnya.
        <SmartWalletDemo />
      ) : (
        <div className="flex items-center justify-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center">Create a Smart Wallet</h2>
              <p>Connect above to create your gasless Smart Wallet!</p>
              <div className="alert alert-info mt-4">
                <span className="text-xs">
                  ✨ Smart Wallets are deployed on-chain automatically and all transactions are sponsored!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gasless;
