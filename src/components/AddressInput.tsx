import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  tokenSymbol: string;
  isValid: boolean;
  isTouched: boolean;
}

const AddressInput = ({ value, onChange, tokenSymbol, isValid, isTouched }: AddressInputProps) => {
  const isBTC = tokenSymbol === "BTC";
  
  const placeholder = isBTC
    ? "bc1qw4... or 1A1zP1..."
    : "0x742d35Cc6634...";
  
  const label = isBTC ? "BTC address" : "BSC address";

  return (
    <div className="space-y-1.5">
      <label className={`text-[11px] sm:text-xs font-semibold ${isBTC ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all pr-10"
        />
        
        <AnimatePresence>
          {isTouched && value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              {isValid ? (
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-destructive" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {isTouched && value && !isValid && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-destructive"
          >
            Invalid {isBTC ? "Bitcoin" : "BSC"} address
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressInput;
