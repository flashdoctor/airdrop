import { motion } from "framer-motion";
import Header from "@/components/Header";
import InjectionCard from "@/components/InjectionCard";
import LiveTicker from "@/components/LiveTicker";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col overflow-hidden">
      <LiveTicker />
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-3 py-4 sm:py-6 overflow-y-auto">
        {/* Title - compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-3 sm:mb-6"
        >
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight uppercase">
            BINANCE{" "}
            <span className="text-primary">INJECTION</span>
          </h1>
        </motion.div>

        {/* Main Card */}
        <InjectionCard />

        {/* Footer hint - hidden on very small screens */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 sm:mt-6 text-[10px] sm:text-xs text-muted-foreground text-center max-w-sm hidden xs:block"
        >
          Powered by BNB Chain. Verified on-chain.
        </motion.p>
      </main>
    </div>
  );
};

export default Index;
