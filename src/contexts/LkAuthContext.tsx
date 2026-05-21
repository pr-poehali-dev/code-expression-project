import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { lkApi, saveSession, clearSession } from "@/lib/lkApi";

interface LkUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  is_admin: boolean;
}

interface LkAuthCtx {
  user: LkUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<LkAuthCtx | null>(null);

export function LkAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LkUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("lk_session");
    if (!session) { setLoading(false); return; }
    lkApi.me()
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const data = await lkApi.login(username, password);
    saveSession(data.session_id);
    setUser(data.user);
  };

  const logout = async () => {
    await lkApi.logout().catch(() => {});
    clearSession();
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useLkAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLkAuth must be inside LkAuthProvider");
  return ctx;
}
