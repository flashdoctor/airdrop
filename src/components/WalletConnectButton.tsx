import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { formatUnits } from "viem";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (value: bigint, decimals: number) => {
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url;
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, "_blank");
      }
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => open()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-medium text-sm transition-all"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </motion.button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-foreground font-medium text-sm transition-all hover:border-primary/50"
        >
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-primary font-semibold">
              {balance ? `${formatBalance(balance.value, balance.decimals)} ${balance.symbol}` : "Loading..."}
            </span>
            <span className="text-xs text-muted-foreground">
              {address ? formatAddress(address) : ""}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {address ? formatAddress(address) : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {chain?.name || "Unknown Network"}
              </p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-lg font-bold text-primary">
              {balance ? `${formatBalance(balance.value, balance.decimals)} ${balance.symbol}` : "0.0000"}
            </p>
          </div>
        </div>

        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 text-green-500"
              >
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          <span>View on Explorer</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => disconnect()} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnectButton;
