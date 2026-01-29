import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import AIChatModal from "./AIChatModal";
import TelegramUserProfile from "./TelegramUserProfile";

const Header = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-12 sm:h-14 px-3 sm:px-5 flex items-center justify-between border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
            <img
              src="https://images.seeklogo.com/logo-png/59/2/binance-icon-logo-png_seeklogo-598330.png"
              alt="Binance"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-bold text-primary tracking-tight">BINANCE</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <TelegramUserProfile />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-primary/40 text-primary text-xs sm:text-sm font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">AI</span>
          </motion.button>
        </div>
      </motion.header>
      
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Header;
