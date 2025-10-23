import { createThirdwebClient } from "thirdweb";

// [THE WHY]: Kita bikin 'client' ini di satu tempat terpusat.
// Anggap aja ini "stop kontak" utama buat semua yang berhubungan dengan thirdweb.
// Dengan begini, kita nggak perlu bikin koneksi baru di setiap komponen,
// jadi lebih hemat resource dan ngejaga konsistensi di seluruh aplikasi.
export const thirdwebClient = createThirdwebClient({
  // [THE WHY]: 'createThirdwebClient' adalah fungsi dari thirdweb buat ngebangun koneksi.
  // Dia butuh 'clientId' buat otentikasi, biar thirdweb tau ini request dari dApp lo.
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// [THE WHY]: Tanda seru (!) di belakang 'process.env...' itu adalah 'non-null assertion' di TypeScript.
// Ini 'literally' cara kita bilang ke TypeScript, "Tenang, gue jamin 100% variabel
// NEXT_PUBLIC_THIRDWEB_CLIENT_ID ini PASTI ada isinya di file .env.local. Percaya sama gue."
// Ini perlu karena TypeScript secara default bakal ngira variabel env itu bisa aja kosong.
