import { useState, useEffect } from "react";

const STORAGE_KEY = "discount_timer_start";
const DURATION_MS = 30 * 60 * 1000;

export function useDiscountTimer() {
  const getOrCreateStart = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, String(now));
    return now;
  };

  const calcRemaining = () => {
    const start = getOrCreateStart();
    const elapsed = Date.now() - start;
    return Math.max(0, DURATION_MS - elapsed);
  };

  const [remaining, setRemaining] = useState<number>(calcRemaining);

  useEffect(() => {
    if (remaining === 0) return;
    const interval = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = remaining > 0;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { isActive, formatted, remaining };
}
