import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { lkApi, saveSession, clearSession, AuthError } from "@/lib/lkApi";

interface LkUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  access_expires_at: string | null;
  segment: "specialist" | "salon";
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
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkSession = (isInitial = false) => {
    const session = localStorage.getItem("lk_session");
    if (!session) {
      if (isInitial) setLoading(false);
      return;
    }
    lkApi.me()
      .then(u => {
        setUser(u);
        if (isInitial) setLoading(false);
      })
      .catch(e => {
        if (e instanceof AuthError) {
          clearSession();
          setUser(null);
        }
        if (isInitial) setLoading(false);
      });
  };

  useEffect(() => {
    checkSession(true);

    // Проверяем сессию каждые 10 минут — только если вкладка активна
    heartbeatRef.current = setInterval(() => {
      if (!document.hidden && localStorage.getItem("lk_session")) {
        checkSession();
      }
    }, 10 * 60 * 1000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
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