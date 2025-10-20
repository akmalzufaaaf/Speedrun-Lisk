# Dokumentasi Perubahan pada Template Scaffold-ETH

Dokumen ini mencatat perubahan-perubahan signifikan yang dibuat pada template asli Scaffold-ETH untuk proyek Speedrun Lisk, khususnya untuk mengatasi masalah pada halaman Events.

## Masalah Awal

Halaman `/events` pada awalnya mengalami beberapa masalah:
1.  **Error `query exceeds max block range`**: RPC node Lisk Sepolia menolak permintaan untuk mengambil data event dalam rentang blok yang terlalu besar (lebih dari 100.000 blok).
2.  **Data Historis Tidak Tampil**: Setelah perbaikan awal, aplikasi hanya menampilkan transaksi yang terjadi setelah halaman dimuat. Riwayat transaksi yang lebih lama tidak muncul.
3.  **Race Condition**: Terjadi konflik antara proses pengambilan data historis dan proses pembaruan data baru, yang menyebabkan data historis hilang atau tertimpa.

## Rangkuman Perbaikan pada `useScaffoldEventHistory.ts`

Untuk mengatasi masalah-masalah di atas, file hook `packages/nextjs/hooks/scaffold-eth/useScaffoldEventHistory.ts` telah dirombak secara signifikan. Berikut adalah pilar-pilar utama perbaikannya:

### 1. Implementasi "Chunking" untuk Pengambilan Data

- **Masalah**: Permintaan data untuk rentang blok yang sangat besar (dari blok deploy hingga blok saat ini) ditolak oleh RPC node.
- **Solusi**: Logika "chunking" (pemotongan) diimplementasikan. Hook sekarang secara cerdas memecah satu permintaan besar menjadi beberapa permintaan yang lebih kecil.
- **Bagaimana Cara Kerjanya?**
    1.  **Tentukan Titik Awal dan Akhir**: Hook tetap memulai dari `fromBlock` yang kita tentukan (blok deploy) dan menargetkan `toBlock` (blok terbaru).
    2.  **Tentukan Ukuran Potongan**: Ukuran potongan diatur ke `100000` blok, sesuai batas maksimal RPC Lisk.
    3.  **Permintaan Berulang (Looping)**: Hook melakukan loop, di mana setiap iterasi mengambil data untuk 100.000 blok. Contoh:
        - Permintaan #1: Ambil event dari blok `27657165` hingga `27757164`.
        - Permintaan #2: Ambil event dari blok `27757165` hingga blok terakhir.
    4.  **Gabungkan Hasil**: Semua hasil dari setiap permintaan digabungkan menjadi satu array tunggal yang berisi seluruh riwayat transaksi.

Setelah semua "potongan" data diterima, hook menggabungkannya menjadi satu daftar lengkap.

### 2. Penyederhanaan Logika dengan `useEffect` Tunggal

- **Masalah**: Versi hook sebelumnya menggunakan beberapa `useEffect` dan `useInterval` yang berjalan secara terpisah, menyebabkan *race condition* di mana data historis yang sudah ada tertimpa oleh pembaruan baru yang kosong.
- **Solusi**: Seluruh logika hook disatukan ke dalam **satu `useEffect` utama**. Ini memastikan alur kerja yang teratur dan dapat diprediksi:
    1.  Pertama, mengambil seluruh data historis (menggunakan metode chunking).
    2.  Setelah selesai, mulai mendengarkan event baru.
    3.  Ini menghilangkan konflik dan memastikan data historis tidak pernah hilang.

### 3. Penggunaan `watchContractEvent` untuk Pembaruan Real-time

- **Masalah**: Menggunakan `setInterval` (polling) untuk terus-menerus menanyakan event baru kurang efisien.
- **Solusi**: Hook sekarang menggunakan `watchContractEvent`, sebuah fungsi dari library `viem`. Fungsi ini membuka koneksi *WebSocket* ke RPC node. Ketika ada event baru yang relevan, node akan secara proaktif "mendorong" data tersebut ke aplikasi. Ini jauh lebih cepat, lebih efisien, dan memberikan pengalaman *real-time*.

### 4. Pembaruan State yang Aman

- **Masalah**: Event baru terkadang menggantikan daftar event lama.
- **Solusi**: Logika pembaruan state diubah untuk selalu menambahkan event baru ke daftar yang sudah ada (`setEvents(prevEvents => [...newEvents, ...prevEvents])`), bukan menggantikannya. Ini memastikan data historis tetap terjaga.

---

Dengan perubahan ini, `useScaffoldEventHistory` sekarang menjadi hook yang tangguh dan efisien, mampu menampilkan seluruh riwayat transaksi dari awal deploy kontrak dan memperbaruinya secara *real-time* tanpa masalah.
