import { useTelegramUser } from "@/hooks/useTelegramUser";
import { useSubscription } from "@/hooks/useSubscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const TelegramUserProfile = () => {
  const { user, isInTelegram, isLoading } = useTelegramUser();
  const { isActive, isVIP, loading: subLoading } = useSubscription(user?.username);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/50 animate-pulse">
        <div className="w-6 h-6 rounded-full bg-muted" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
    );
  }

  if (!isInTelegram || !user) {
    return null;
  }

  const initials = user.first_name
    ? user.first_name.charAt(0).toUpperCase() + (user.last_name?.charAt(0).toUpperCase() || "")
    : "TG";

  const hasPaid = isVIP || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border max-w-[140px] sm:max-w-[180px] ${
        isVIP 
          ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/40" 
          : hasPaid 
            ? "bg-success/10 border-success/30" 
            : "bg-secondary/50 border-border/50"
      }`}
    >
      <Avatar className="w-6 h-6 border border-border/50 shrink-0">
        {user.photo_url ? (
          <AvatarImage src={user.photo_url} alt={user.first_name} />
        ) : null}
        <AvatarFallback className="bg-secondary text-foreground text-[9px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-0.5 min-w-0">
          <span className="text-[11px] font-medium text-foreground truncate">
            {user.first_name}
          </span>
          {isVIP && <Crown className="w-3 h-3 text-primary shrink-0" />}
          {user.is_premium && !isVIP && <Sparkles className="w-3 h-3 text-primary shrink-0" />}
        </div>
        {user.username && (
          <span className="text-[9px] text-muted-foreground truncate">@{user.username}</span>
        )}
      </div>
      
      {/* Paid/VIP Status Badge */}
      {!subLoading && (
        <Badge 
          variant="outline" 
          className={`shrink-0 text-[8px] px-1 py-0 h-4 ${
            isVIP 
              ? "bg-primary/20 border-primary/40 text-primary" 
              : hasPaid 
                ? "bg-success/20 border-success/40 text-success" 
                : "bg-muted/50 border-border/50 text-muted-foreground"
          }`}
        >
          {isVIP ? (
            <><Crown className="w-2.5 h-2.5 mr-0.5" />VIP</>
          ) : hasPaid ? (
            <><CreditCard className="w-2.5 h-2.5 mr-0.5" />Paid</>
          ) : (
            "Free"
          )}
        </Badge>
      )}
    </motion.div>
  );
};

export default TelegramUserProfile;
