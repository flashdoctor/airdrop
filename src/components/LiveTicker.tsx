import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const LiveTicker = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot&order=market_cap_desc&sparkline=false"
        );
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        // Fallback data
        setPrices([
          { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 67500, price_change_percentage_24h: 2.5, image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
          { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3450, price_change_percentage_24h: 1.8, image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
          { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 580, price_change_percentage_24h: -0.5, image: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
          { id: "solana", symbol: "sol", name: "Solana", current_price: 145, price_change_percentage_24h: 3.2, image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
          { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.52, price_change_percentage_24h: -1.2, image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
          { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.45, price_change_percentage_24h: 0.8, image: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  const tickerContent = prices.length > 0 ? [...prices, ...prices] : []; // Duplicate for seamless loop

  if (loading) {
    return (
      <div className="h-8 bg-secondary/50 border-b border-border/30 flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Loading prices...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-8 bg-secondary/50 border-b border-border/30 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-secondary/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-secondary/50 to-transparent z-10" />
      
      <motion.div
        className="flex items-center gap-4 h-full whitespace-nowrap"
        animate={{ x: [0, -40 * prices.length] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: prices.length * 3,
            ease: "linear",
          },
        }}
      >
        {tickerContent.map((crypto, index) => (
          <div
            key={`${crypto.id}-${index}`}
            className="flex items-center gap-1.5 px-2"
          >
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-4 h-4 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="font-semibold text-foreground text-[11px] uppercase">
              {crypto.symbol}
            </span>
            <span className="text-foreground text-[11px]">
              {formatPrice(crypto.current_price)}
            </span>
            <span
              className={`text-[10px] font-medium ${
                crypto.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
              {crypto.price_change_percentage_24h.toFixed(1)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveTicker;
