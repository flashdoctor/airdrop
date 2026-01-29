import { motion } from "framer-motion";

interface Token {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  icon: string;
}

const tokens: Token[] = [
  // Row 1: Base tokens
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    amount: "1,000,000 USDC",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    id: "usdt",
    name: "USDT",
    symbol: "USDT",
    amount: "1,000,000 USDT",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    amount: "50 BTC",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  // Row 2: .z variants
  {
    id: "usdcz",
    name: "USDC.z",
    symbol: "USDC.z",
    amount: "1,000,000 USDC.z",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    id: "usdtz",
    name: "USDT.z",
    symbol: "USDT.z",
    amount: "1,000,000 USDT.z",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    id: "btcz",
    name: "BTC.z",
    symbol: "BTC.z",
    amount: "50 BTC.z",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
];

interface TokenSelectorProps {
  selectedToken: string;
  onSelect: (token: Token) => void;
}

const TokenSelector = ({ selectedToken, onSelect }: TokenSelectorProps) => {
  const selected = tokens.find((t) => t.id === selectedToken) || tokens[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-xs font-semibold text-muted-foreground">Token</label>
        <span className="text-xs sm:text-sm font-bold text-foreground">{selected.amount}</span>
      </div>
      
      {/* Token grid - 3 columns, 2 rows */}
      <div className="grid grid-cols-3 gap-1.5">
        {tokens.map((token) => (
          <motion.button
            key={token.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(token)}
            className={`flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg border transition-all ${
              selectedToken === token.id 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-secondary/50 border-border/50 text-foreground hover:border-primary/20"
            }`}
          >
            <img src={token.icon} alt={token.symbol} className="w-4 h-4 rounded-full" />
            <span className="font-bold text-[10px]">{token.symbol}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector;
export type { Token };
