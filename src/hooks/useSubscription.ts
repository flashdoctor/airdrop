import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// VIP Telegram usernames that get free access
const VIP_TELEGRAM_USERNAMES = ["DarkWebHacker007"];

interface Subscription {
  id: string;
  status: string;
  amount: number;
  payment_date: string | null;
  expiration_date: string | null;
  transaction_hash: string | null;
  payment_method: string | null;
}

export const useSubscription = (telegramUsername?: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if Telegram user is VIP
  const isVIP = telegramUsername 
    ? VIP_TELEGRAM_USERNAMES.some(vip => vip.toLowerCase() === telegramUsername.toLowerCase())
    : false;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    checkAuth();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user?.id || null);
      }
    );

    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    // If VIP Telegram user, grant access immediately
    if (isVIP) {
      setIsActive(true);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      if (!userId) {
        setSubscription(null);
        setIsActive(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "active")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSubscription(data as Subscription);
          const isExpired = data.expiration_date 
            ? new Date(data.expiration_date) < new Date() 
            : false;
          setIsActive(data.status === "active" && !isExpired);
        } else {
          setSubscription(null);
          setIsActive(false);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setSubscription(null);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [userId, isVIP]);

  const createPendingSubscription = async (paymentMethod: string, walletAddress: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          status: "pending",
          amount: 500,
          payment_method: paymentMethod,
          wallet_address: walletAddress,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      return null;
    }
  };

  return {
    subscription,
    isActive,
    isVIP,
    loading,
    userId,
    isAuthenticated: !!userId || isVIP,
    createPendingSubscription,
  };
};
