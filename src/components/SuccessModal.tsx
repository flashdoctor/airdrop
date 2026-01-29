import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Copy, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  tokenSymbol: string;
}

const SuccessModal = ({ isOpen, onClose, txHash, tokenSymbol }: SuccessModalProps) => {
  const isBTC = tokenSymbol === "BTC";
  const explorerUrl = isBTC
    ? `https://blockchair.com/bitcoin/transaction/${txHash}`
    : `https://bscscan.com/tx/${txHash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    toast.success("Transaction hash copied!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card p-6 max-w-md w-full relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-success/10 blur-3xl rounded-full" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="relative">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
              </motion.div>

              <h2 className="text-xl font-bold text-center text-primary mb-2">
                Transaction Completed
              </h2>
              
              <p className="text-center text-muted-foreground mb-6">
                Tokens sent successfully to your address.
              </p>

              {/* Transaction hash */}
              <div className="bg-input rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
                <p className="text-sm font-mono text-primary break-all">
                  {txHash}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="flex-1 btn-ghost-gold flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy TXID
                </motion.button>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-ghost-gold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </motion.a>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 btn-gold"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
