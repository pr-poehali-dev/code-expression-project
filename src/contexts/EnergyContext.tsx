import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLkAuth } from "./LkAuthContext";

const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface EnergyCtx {
  balance: number;
  hasPaid: boolean;
  loading: boolean;
  refresh: () => void;
}

const Ctx = createContext<EnergyCtx>({ balance: 0, hasPaid: false, loading: false, refresh: () => {} });

export function EnergyProvider({ children }: { children: ReactNode }) {
  const { user } = useLkAuth();
  const [balance, setBalance] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!user?.salon_id) return;
    setLoading(true);
    fetch(`${LK_URL}?action=energy_balance`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        if (typeof d.balance === "number") setBalance(d.balance);
        if (typeof d.has_paid === "boolean") setHasPaid(d.has_paid);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.salon_id]);

  useEffect(() => { refresh(); }, [refresh]);

  return <Ctx.Provider value={{ balance, hasPaid, loading, refresh }}>{children}</Ctx.Provider>;
}

export function useEnergy() { return useContext(Ctx); }
