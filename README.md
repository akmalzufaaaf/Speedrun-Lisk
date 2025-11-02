# 🚀 Speedrun Lisk Journey

Repositori ini mendokumentasikan perjalanan gue menyelesaikan tantangan [Speedrun Lisk](https://www.speedrunlisk.xyz/). Gue bakal *explore* ekosistem Lisk, ngebangun *smart contract*, dan nyelesaiin tantangan baru tiap minggunya.

## 📜 Progress Log

Berikut adalah catatan progres gue:

### 🏁 Week 1: Hello Token + NFT
* **Status:** Completed
* **Deskripsi:** Deploy dan verifikasi ERC20 token dan ERC721 NFT pertama di Lisk Sepolia.

### 🏁 Week 2: Frontend Connect
* **Status:** Completed
* **Deskripsi:** Menghubungkan *smart contract* ke *frontend* React/Next.js dengan integrasi *wallet*.

### 🏁 Week 3: Indexing & Display
* **Status:** Completed
* **Deskripsi:** Melakukan *indexing* data *blockchain* dan menampilkannya di *frontend*.

### 🏁 Week 4: Oracle + Sponsored UX
* **Status:** Completed
* **Deskripsi:** Mengintegrasikan *price oracle* untuk data *real-time*.

### 🏁 Week 5: NFT Marketplace
* **Status:** Completed
* **Deskripsi:** Membangun fungsionalitas *NFT marketplace* yang utuh.
* **Details:** *Di bawah ini adalah detail lengkap untuk proyek Week 5.*

    ---
    
    #### 🚀 Live Demo & Details
    * [**Live Demo (Vercel)**](https://<YOUR_VERCEL_LINK_HERE>](https://speedrun-lisk-nextjs-k4undctv3.vercel.app/))
    * [**Video Demo (Loom/YouTube)**](https://<YOUR_LOOM_OR_YOUTUBE_LINK_HERE>)

    *(Video demo singkat 1-3 menit yang menunjukkan alur kerja: connect wallet, minting, listing, hingga buying).*

    #### 📄 Project Description
    Proyek ini adalah *decentralized NFT Marketplace* yang dibangun di atas Lisk (L2) menggunakan Scaffold-ETH 2. Tujuannya adalah untuk membangun fungsionalitas *marketplace* yang utuh, mendemonstrasikan alur *end-to-end* dari *minting* hingga *listing* dan *buying*.

    Komponen `NFTCard` adalah inti dari *frontend*, yang bertindak sebagai "mesin status" (state machine) untuk menentukan tindakan yang tersedia (Beli, Jual, Setujui, Batal) berdasarkan status *on-chain*.

    #### ✨ Key Features
    * **Connect Wallet:** Terhubung ke aplikasi menggunakan *wallet* Web3.
    * **Mint NFT:** Pengguna dapat *mint* NFT baru (`MyNFT.sol`) dari halaman "Home".
    * **Browse Marketplace:** Melihat semua NFT yang telah di-*mint* di halaman "Marketplace".
    * **Approve Marketplace:** Pemilik NFT memberikan izin (*approval*) kepada *contract marketplace* sebelum menjual.
    * **List NFT for Sale:** Pemilik dapat mendaftarkan NFT mereka untuk dijual dengan harga ETH.
    * **Buy NFT:** Pengguna lain dapat membeli NFT yang terdaftar.
    * **Cancel Listing:** Pemilik dapat membatalkan *listing* NFT mereka.
    * **Real-time UI:** UI diperbarui secara reaktif berdasarkan data *on-chain* (`useScaffoldContractRead`).

    #### 🛠️ Tech Stack
    * **Blockchain:** Lisk (L2)
    * **Smart Contracts:** Solidity
    * **Framework:** Scaffold-ETH 2
    * **Local Node:** Hardhat
    * **Frontend:** Next.js (React)
    * **Styling:** Tailwind CSS (dengan DaisyUI)
    * **Web3 Libraries:** Wagmi, Viem
    * **Deployment:** Vercel (Frontend), Scaffold-ETH CLI (Contracts)

    #### 🏃‍♂️ How to Run Locally
    1.  **Clone repositori:**
        ```bash
        git clone https://github.com/akmalzufaaaf/Speedrun-Lisk.git
        cd Speedrun-Lisk
        ```

    2.  **Install dependencies:**
        ```bash
        yarn install
        ```

    3.  **Jalankan local blockchain:**
        *(Terminal 1)*
        ```bash
        yarn chain
        ```

    4.  **Deploy smart contracts:**
        *(Terminal 2)*
        ```bash
        yarn deploy
        ```

    5.  **Jalankan frontend:**
        *(Terminal 3)*
        ```bash
        yarn start
        ```
    Aplikasi akan tersedia di `http://localhost:3000`.

    ---

### 🏃 Week 6: Mini-DEX / Lending App
* **Status:** Not Started
* **Deskripsi:** Membangun DEX simpel, protokol pinjaman, atau *prediction market*.
* **Details:** *(Link akan ditambahkan nanti)*

---

*Repositori ini akan terus di-update seiring gue menyelesaikan lebih banyak tantangan. Stay tuned!*
