import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import LkTests from "./LkTests";
import LkBodyMap from "./LkBodyMap";
import LkAdmin from "./LkAdmin";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const BG = "#f4f4f0";

type Tab = "home" | "tests" | "body" | "admin";

const TOOLS = [
  {
    id: "mindset" as const,
    icon: "Brain",
    color: "hsl(280,60%,55%)",
    colorBg: "hsl(280,60%,96%)",
    title: "Мышление с премиум-клиентами",
    desc: "Тест + персональные советы по общению с клиентами высокого сегмента",
  },
  {
    id: "barriers" as const,
    icon: "Shield",
    color: "hsl(20,85%,52%)",
    colorBg: "hsl(20,85%,96%)",
    title: "Внутренние барьеры",
    desc: "Выяви психологические блоки, мешающие профессиональному росту",
  },
  {
    id: "finance" as const,
    icon: "TrendingUp",
    color: "hsl(145,60%,40%)",
    colorBg: "hsl(145,60%,95%)",
    title: "Финансовая грамотность",
    desc: "Проверь и прокачай знания в управлении доходом специалиста",
  },
];

export default function LkDashboard() {
  const { user, logout } = useLkAuth();
  const [tab, setTab] = useState<Tab>("home");

  const navItems: { id: Tab; icon: string; label: string; adminOnly?: boolean }[] = [
    { id: "home", icon: "Home", label: "Главная" },
    { id: "tests", icon: "ClipboardCheck", label: "Инструменты" },
    { id: "body", icon: "User", label: "Схема тела" },
    ...(user?.is_admin ? [{ id: "admin" as Tab, icon: "Settings", label: "Админка", adminOnly: true }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Montserrat, sans-serif", display: "flex" }}>

      {/* Боковая навигация */}
      <aside style={{
        width: 240, background: "#fff", borderRight: "1px solid #eee",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, left: 0, height: "100vh", zIndex: 100,
        padding: "28px 0",
      }} className="lk-sidebar">
        {/* Логотип */}
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid #f0f0ec" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name="BookOpen" size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase" }}>Dok Диалог</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Кабинет</div>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12, border: "none",
                background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "transparent",
                color: tab === item.id ? ACCENT : "#666",
                fontSize: 14, fontWeight: tab === item.id ? 700 : 500,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                marginBottom: 4, transition: "all 0.15s", textAlign: "left",
              }}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Профиль */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0ec" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
            {user?.full_name || user?.username}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>{user?.email}</div>
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: 8, background: "none",
              border: "none", color: "#999", fontSize: 13, cursor: "pointer",
              padding: 0, fontFamily: "Montserrat, sans-serif",
            }}
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main style={{ marginLeft: 240, flex: 1, padding: "36px 40px" }} className="lk-main">
        {tab === "home" && <HomeTab onNav={setTab} />}
        {tab === "tests" && <LkTests />}
        {tab === "body" && <LkBodyMap />}
        {tab === "admin" && user?.is_admin && <LkAdmin />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .lk-sidebar { width: 100% !important; height: auto !important; position: static !important; flex-direction: row !important; padding: 0 !important; overflow-x: auto; border-right: none !important; border-bottom: 1px solid #eee; }
          .lk-sidebar aside { display: none; }
          .lk-main { margin-left: 0 !important; padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

function HomeTab({ onNav }: { onNav: (t: Tab) => void }) {
  const { user } = useLkAuth();
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "Cormorant, serif", fontSize: "clamp(26px,3vw,36px)",
          fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px",
        }}>
          Привет, {user?.full_name?.split(" ")[0] || user?.username}!
        </h1>
        <p style={{ fontSize: 15, color: "#777", margin: 0 }}>
          Здесь — инструменты для профессионального роста специалиста по телу
        </p>
      </div>

      {/* Инструменты */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
          Инструменты роста
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => onNav("tests")}
              style={{
                background: "#fff", border: "1.5px solid #f0f0ec", borderRadius: 16,
                padding: "22px 22px", textAlign: "left", cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: tool.colorBg, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 14,
              }}>
                <Icon name={tool.icon} size={22} style={{ color: tool.color }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.3 }}>
                {tool.title}
              </div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{tool.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Схема тела */}
      <button
        onClick={() => onNav("body")}
        style={{
          width: "100%", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          border: "none", borderRadius: 16, padding: "24px 28px",
          display: "flex", alignItems: "center", gap: 20, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", textAlign: "left",
          boxShadow: `0 8px 28px hsla(185,85%,32%,0.25)`,
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="User" size={26} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            Шпаргалка по телу
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Кликни на зону тела → диагностика, техники и видео
          </div>
        </div>
        <Icon name="ArrowRight" size={20} style={{ color: "rgba(255,255,255,0.7)", marginLeft: "auto" }} />
      </button>
    </div>
  );
}
