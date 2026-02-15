import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, QrCode, Wallet, ArrowRight, Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAccount, useBalance, useReadContract, useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { formatUnits, parseUnits, parseEther } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { toast } from "sonner";

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  address: string;
  network: string;
  color: string;
  tokenAddress?: `0x${string}`;
  priceInToken: string;
}

// USDT BEP20 contract address on BSC
const USDT_BEP20_ADDRESS = "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`;
const RECIPIENT_ADDRESS = "0x1be4483300082fD500bB0fbE9c007FbE64eE718B" as `0x${string}`;

// ERC20 ABI for balanceOf and transfer
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    address: "0x1be4483300082fD500bB0fbE9c007FbE64eE718B",
    network: "BNB Smart Chain (BEP20)",
    color: "from-yellow-500/20 to-yellow-600/10",
    priceInToken: "0.8",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    address: "0x1be4483300082fD500bB0fbE9c007FbE64eE718B",
    network: "BNB Smart Chain (BEP20)",
    color: "from-green-500/20 to-green-600/10",
    tokenAddress: USDT_BEP20_ADDRESS,
    priceInToken: "500",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    address: "bc1q5eq7dc604470rsz9agwjerxy7p998z2q74jy26",
    network: "Bitcoin Network",
    color: "from-orange-500/20 to-orange-600/10",
    priceInToken: "0.005",
  },
];

const PaymentQRModal = ({ isOpen, onClose }: PaymentQRModalProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(CRYPTO_OPTIONS[1]);
  const [amountToPay, setAmountToPay] = useState<string>(CRYPTO_OPTIONS[1].priceInToken);
  const [copied, setCopied] = useState(false);

  const { address: walletAddress, isConnected, chain } = useAccount();
  const { open } = useWeb3Modal();
  const { switchChain } = useSwitchChain();

  // Auto-switch to BSC when connected on wrong network
  useEffect(() => {
    if (isConnected && chain?.id !== 56) {
      switchChain({ chainId: 56 });
    }
  }, [isConnected, chain?.id, switchChain]);

  // Get USDT balance using useReadContract on BSC
  const { data: usdtBalanceData, refetch: refetchUsdt } = useReadContract({
    address: USDT_BEP20_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress] : undefined,
    chainId: 56, // BSC mainnet
    query: {
      enabled: !!walletAddress && isConnected,
    },
  });

  // Get native BNB balance on BSC
  const { data: bnbBalance, refetch: refetchBnb } = useBalance({
    address: walletAddress,
    chainId: 56, // BSC mainnet
  });

  // Refetch balances when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      refetchUsdt();
      refetchBnb();
    }
  }, [isConnected, walletAddress, refetchUsdt, refetchBnb]);

  // Keep amountToPay in sync with selected crypto's default price
  useEffect(() => {
    setAmountToPay(selectedCrypto.priceInToken);
  }, [selectedCrypto]);

  // For sending BNB
  const { sendTransaction, data: bnbTxHash, isPending: isBnbPending, reset: resetBnb } = useSendTransaction();

  // For sending USDT (ERC20 transfer)
  const { writeContract, data: usdtTxHash, isPending: isUsdtPending, reset: resetUsdt } = useWriteContract();

  // Wait for BNB transaction
  const { isLoading: isBnbConfirming, isSuccess: isBnbSuccess } = useWaitForTransactionReceipt({
    hash: bnbTxHash,
  });

  // Wait for USDT transaction
  const { isLoading: isUsdtConfirming, isSuccess: isUsdtSuccess } = useWaitForTransactionReceipt({
    hash: usdtTxHash,
  });

  const formattedUsdtBalance = usdtBalanceData ? formatUnits(usdtBalanceData as bigint, 18) : "0";
  const formattedBnbBalance = bnbBalance ? formatUnits(bnbBalance.value, bnbBalance.decimals) : "0";

  // Handle transaction success with useEffect
  useEffect(() => {
    if (isBnbSuccess) {
      toast.success("Payment successful! Your subscription is being activated.");
      resetBnb();
    }
  }, [isBnbSuccess, resetBnb]);

  useEffect(() => {
    if (isUsdtSuccess) {
      toast.success("Payment successful! Your subscription is being activated.");
      resetUsdt();
    }
  }, [isUsdtSuccess, resetUsdt]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDisplayBalance = () => {
    if (!isConnected) return null;
    if (selectedCrypto.id === "usdt") {
      return `${parseFloat(formattedUsdtBalance).toFixed(2)} USDT`;
    }
    if (selectedCrypto.id === "bnb") {
      return `${parseFloat(formattedBnbBalance).toFixed(4)} BNB`;
    }
    return null;
  };

  const hasEnoughBalance = () => {
    if (!isConnected) return false;
    if (selectedCrypto.id === "usdt") {
      // Require USDT balance >= amountToPay
      return parseFloat(formattedUsdtBalance) >= parseFloat(amountToPay);
    }
    if (selectedCrypto.id === "bnb") {
      return parseFloat(formattedBnbBalance) >= parseFloat(amountToPay);
    }
    return false;
  };

  const handlePayment = async () => {
    if (!isConnected || !walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      if (selectedCrypto.id === "bnb") {
        sendTransaction({
          to: RECIPIENT_ADDRESS,
          value: parseEther(amountToPay),
        });
        toast.info("Please confirm the transaction in your wallet");
      } else if (selectedCrypto.id === "usdt") {
        // Transfer the specified USDT amount (amountToPay)
        const amount = parseUnits(amountToPay, 18);
        writeContract({
          address: USDT_BEP20_ADDRESS,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [RECIPIENT_ADDRESS, amount],
        } as any);
        toast.info("Please confirm the transaction in your wallet");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const isPaymentPending = isBnbPending || isUsdtPending || isBnbConfirming || isUsdtConfirming;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] max-w-[360px] p-0 gap-0 bg-card border-border/50 rounded-2xl">
        {/* Compact Header */}
        <DialogHeader className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
        <DialogTitle className="flex items-center gap-2 text-foreground text-base">
            <QrCode className="w-5 h-5 text-primary" />
            <span>Pay $500 Subscription</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 space-y-3">
          {/* Compact Crypto Selector */}
          <div className="grid grid-cols-3 gap-2">
            {CRYPTO_OPTIONS.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                  selectedCrypto.id === crypto.id
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-secondary/30"
                )}
              >
                <img
                  src={crypto.icon}
                  alt={crypto.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/24";
                  }}
                />
                <span className={cn(
                  "text-xs font-medium",
                  selectedCrypto.id === crypto.id ? "text-primary" : "text-foreground"
                )}>
                  {crypto.symbol}
                </span>
              </button>
            ))}
          </div>

          {/* Payment Amount Display */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Amount to pay</p>
              {isConnected && selectedCrypto.id !== "btc" && (
                <button
                  onClick={() => {
                    if (selectedCrypto.id === "usdt") {
                      setAmountToPay(parseFloat(formattedUsdtBalance).toString());
                    } else if (selectedCrypto.id === "bnb") {
                      setAmountToPay(parseFloat(formattedBnbBalance).toString());
                    }
                  }}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  MAX
                </button>
              )}
            </div>
            <p className="text-xl font-bold text-primary text-center">
              {amountToPay} {selectedCrypto.symbol}
            </p>
            <p className="text-xs text-muted-foreground text-center">≈ $500 USD</p>
          </div>

          {/* Connect Wallet or Pay Button */}
          {isConnected && selectedCrypto.id !== "btc" ? (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Your Balance</span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    hasEnoughBalance() ? "text-green-500" : "text-destructive"
                  )}>
                    {getDisplayBalance()}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: hasEnoughBalance() && !isPaymentPending ? 1.02 : 1 }}
                whileTap={{ scale: hasEnoughBalance() && !isPaymentPending ? 0.98 : 1 }}
                onClick={handlePayment}
                disabled={!hasEnoughBalance() || isPaymentPending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                  hasEnoughBalance() && !isPaymentPending
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isPaymentPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Pay {amountToPay} {selectedCrypto.symbol}</span>
                  </>
                )}
              </motion.button>

              {!hasEnoughBalance() && (
                <p className="text-xs text-destructive text-center">
                  Insufficient {selectedCrypto.symbol} balance
                </p>
              )}
            </div>
          ) : !isConnected && selectedCrypto.id !== "btc" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet to Pay</span>
            </motion.button>
          ) : null}

          {/* QR Code for BTC or manual payment */}
          {selectedCrypto.id === "btc" && (
            <>
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br flex flex-col items-center",
                selectedCrypto.color
              )}>
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG
                    value={selectedCrypto.address}
                    size={120}
                    level="M"
                    includeMargin={false}
                    imageSettings={{
                      src: selectedCrypto.icon,
                      height: 20,
                      width: 20,
                      excavate: true,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {selectedCrypto.network}
                </p>
              </div>

              {/* Address for BTC */}
              <div className="flex gap-2">
                <div className="flex-1 px-2 py-2 rounded-lg bg-secondary/50 border border-border/50 font-mono text-[10px] text-foreground overflow-hidden">
                  <span className="block truncate">{selectedCrypto.address}</span>
                </div>
                <button
                  onClick={copyAddress}
                  className={cn(
                    "px-3 rounded-lg flex items-center justify-center transition-all",
                    copied
                      ? "bg-green-500/20 text-green-500 border border-green-500/30"
                      : "bg-primary/10 text-primary border border-primary/30"
                  )}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}

          {/* Compact Warning */}
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-[10px] text-destructive text-center">
              ⚠️ Only send {selectedCrypto.symbol} on {selectedCrypto.network}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentQRModal;
