// [THE WHY]: Kita butuh DUA 'defineChain', satu dari 'viem', satu dari 'thirdweb'.
// Mereka punya nama yang sama tapi fungsinya beda.
import { defineChain as defineChainViem } from "viem";
import { defineChain as defineChainThirdweb } from "thirdweb";

// [THE WHY]: Ini "resep" ASLI buat Wagmi dan Scaffold-Lisk. JANGAN DIHAPUS.
// Kita cuma ganti nama importnya jadi 'defineChainViem' biar nggak bentrok.
export const liskSepolia = /*#__PURE__*/ defineChainViem({
  id: 4202,
  network: "lisk-sepolia",
  name: "Lisk Sepolia Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
    public: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },
  blockExplorers: {
    blockscout: {
      name: "Blockscout",
      url: "https://sepolia-blockscout.lisk.com",
    },
    default: {
      name: "Blockscout",
      url: "https://sepolia-blockscout.lisk.com",
    },
  },
  testnet: true,
});

// --- INI YANG KITA TAMBAHIN ---
// [THE WHY]: Ini "resep" BARU khusus buat SDK thirdweb.
// Kita kasih nama variabel `liskSepoliaThirdweb` biar beda.
export const liskSepoliaThirdweb = defineChainThirdweb({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://rpc.sepolia-api.lisk.com",
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://sepolia-blockscout.lisk.com",
    },
  ],
  testnet: true,
});

