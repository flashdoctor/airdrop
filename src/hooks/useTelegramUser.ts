import { useState, useEffect } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export const useTelegramUser = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initTelegram = () => {
      try {
        const tg = window.Telegram?.WebApp;
        
        if (tg) {
          tg.ready();
          tg.expand();
          
          const telegramUser = tg.initDataUnsafe?.user;
          
          if (telegramUser) {
            setUser(telegramUser);
            setIsInTelegram(true);
          }
        }
      } catch (error) {
        console.error("Error initializing Telegram WebApp:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure Telegram script is loaded
    const timer = setTimeout(initTelegram, 100);
    return () => clearTimeout(timer);
  }, []);

  return { user, isInTelegram, isLoading };
};
