import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { lkApi, saveSession, clearSession, AuthError } from "@/lib/lkApi";

export interface LkSalon {
  id: number;
  name: string;
  logo_url: string | null;
}

export interface LkUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  is_representative: boolean;
  rep_permissions: string[] | null;
  access_expires_at: string | null;
  segment: "specialist" | "salon";
  role: "owner" | "admin" | "master" | "body_specialist";
  salon_id: number | null;
  salon: LkSalon | null;
  course_ids: number[];
}

interface LkAuthCtx {
  user: LkUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<LkAuthCtx | null>(null);

export function LkAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LkUser | null>(null);
  const [loading, setLoading] = useState(true);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Сколько раз подряд получили AuthError — сбрасываем сессию только после 3 подряд
  const authFailCountRef = useRef(0);

  const checkSession = (isInitial = false) => {
    const session = localStorage.getItem("lk_session");
    if (!session) {
      if (isInitial) setLoading(false);
      return;
    }
    lkApi.me()
      .then(u => {
        authFailCountRef.current = 0; // сброс счётчика при успехе
        setUser(u);
        if (isInitial) setLoading(false);
      })
      .catch(e => {
        if (e instanceof AuthError) {
          authFailCountRef.current += 1;
          // Сбрасываем сессию только если 3 раза подряд получили 401
          // Это защищает от случайных сбоев сети и перезагрузок Vite
          if (isInitial || authFailCountRef.current >= 3) {
            clearSession();
            setUser(null);
            authFailCountRef.current = 0;
          }
        }
        if (isInitial) setLoading(false);
      });
  };

  useEffect(() => {
    checkSession(true);

    // Проверяем сессию каждые 30 минут — только если вкладка активна
    heartbeatRef.current = setInterval(() => {
      if (!document.hidden && localStorage.getItem("lk_session")) {
        checkSession();
      }
    }, 30 * 60 * 1000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  const login = async (username: string, password: string) => {
    sessionStorage.removeItem("lk_tab");
    const data = await lkApi.login(username, password);
    saveSession(data.session_id);
    setUser(data.user);
  };

  const register = async (full_name: string, email: string, password: string) => {
    sessionStorage.removeItem("lk_tab");
    const data = await lkApi.register(full_name, email, password);
    saveSession(data.session_id);
    setUser(data.user);
  };

  const logout = async () => {
    sessionStorage.removeItem("lk_tab");
    await lkApi.logout().catch(() => {});
    clearSession();
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await lkApi.me();
    setUser(u);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</Ctx.Provider>;
}

export function useLkAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLkAuth must be inside LkAuthProvider");
  return ctx;
}