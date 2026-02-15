import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { bsc, bscTestnet, mainnet } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

// Web3Modal project ID from WalletConnect Cloud
const projectId = "d4dbdc99b16e1822df0155d0024926f6";

const metadata = {
  name: "Binance Injection",
  description: "BNB Chain Token Injection Platform",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: ["https://images.seeklogo.com/logo-png/59/2/binance-icon-logo-png_seeklogo-598330.png"],
};

const chains = [bsc, bscTestnet, mainnet] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

export const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: false,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#F0B90B",
    "--w3m-color-mix": "#F0B90B",
    "--w3m-color-mix-strength": 20,
  },
});
