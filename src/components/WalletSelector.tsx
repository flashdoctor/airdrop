import { motion } from "framer-motion";

interface Wallet {
  id: string;
  name: string;
  icon: string;
}

const wallets: Wallet[] = [
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
  },
  {
    id: "bybit",
    name: "Bybit",
    icon: "https://d3iuzwoiyg9qa8.cloudfront.net/webadmin/storage/public/exchange-image/bybit_spot.png",
  },
  {
    id: "binance",
    name: "Binance",
    icon: "https://images.seeklogo.com/logo-png/59/2/binance-icon-logo-png_seeklogo-598330.png",
  },
];

interface WalletSelectorProps {
  selectedWallet: string;
  onSelect: (wallet: Wallet) => void;
}

const WalletSelector = ({ selectedWallet, onSelect }: WalletSelectorProps) => {
  const selected = wallets.find((w) => w.id === selectedWallet) || wallets[0];

  return (
    <div className="space-y-2">
      <label className="text-[11px] sm:text-xs font-semibold text-muted-foreground">Wallet</label>
      
      {/* Wallet chips - inline */}
      <div className="flex gap-2">
        {wallets.map((wallet) => (
          <motion.button
            key={wallet.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(wallet)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border transition-all ${
              selectedWallet === wallet.id 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-secondary/50 border-border/50 text-foreground hover:border-primary/20"
            }`}
          >
            <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="font-bold text-xs">{wallet.name.split(" ")[0]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default WalletSelector;
export type { Wallet };
