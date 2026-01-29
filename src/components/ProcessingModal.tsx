import { motion, AnimatePresence } from "framer-motion";

interface ProcessingModalProps {
  isOpen: boolean;
}

const ProcessingModal = ({ isOpen }: ProcessingModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 flex items-center gap-4 max-w-sm mx-4"
          >
            <div className="spinner" />
            <div>
              <p className="font-bold text-primary">Sending tokens...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please do not close this page while we confirm your payment and send tokens.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessingModal;
