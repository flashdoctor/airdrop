import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets } from "lucide-react";

const AboutSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-secondary/30 rounded-lg p-2.5 sm:p-3 border border-border/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            <strong className="text-foreground">Binance Injection</strong> — automated token distributions
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary text-[11px] font-semibold flex items-center gap-0.5"
        >
          {isExpanded ? "Less" : "More"}
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="w-3 h-3" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-1">How it works</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>On request, the system broadcasts an on‑chain transaction transferring the chosen token to your address.</li>
                  <li>Requests are rate‑limited and checked for abuse; they may be queued, delayed, or denied.</li>
                  <li>Transfers are final once confirmed; there is no automatic reversal.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-foreground mb-1">Safety checklist</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Submit only addresses you control; do not share private keys.</li>
                  <li>Confirm the network: BEP20 → BSC/BNB, native BTC → Bitcoin; mixing networks can cause loss.</li>
                  <li>Double‑check address format and expect fees/confirmation delays.</li>
                </ul>
              </div>
              
              <p className="text-[10px] opacity-70">
                By using this service you agree to comply with platform rules and applicable laws.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AboutSection;
