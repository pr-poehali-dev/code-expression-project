import { useState, useCallback } from "react";
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
    id: "diag" as const,
    icon: "Stethoscope",
    color: "hsl(210,85%,45%)",
    colorBg: "hsl(210,85%,96%)",
    title: "Системная диагностика клиента",
    desc: "Введите жалобу — получите причины, компенсации и техники из шпаргалки",
  },
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
  {
    id: "profile" as const,
    icon: "ScanFace",
    color: "hsl(240,70%,55%)",
    colorBg: "hsl(240,70%,97%)",
    title: "Финансовый профиль PRO",
    desc: "Определи уровень финансового мышления, привычек и зрелости",
  },
  {
    id: "salon" as const,
    icon: "Scissors",
    color: "hsl(335,80%,50%)",
    colorBg: "hsl(335,80%,97%)",
    title: "Диагностика роста салона PRO",
    desc: "Где салон теряет деньги — и как увеличить прибыль без нового потока",
  },
];

const VALID_TABS: Tab[] = ["home", "tests", "body", "admin"];

export default function LkDashboard() {
  const { user, logout } = useLkAuth();
  const [tab, setTab] = useState<Tab>(() => {
    const saved = sessionStorage.getItem("lk_tab") as Tab | null;
    return saved && VALID_TABS.includes(saved) ? saved : "home";
  });

  const handleTabChange = useCallback((t: Tab) => {
    sessionStorage.setItem("lk_tab", t);
    setTab(t);
  }, []);

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "home",  icon: "Home",          label: "Главная"     },
    { id: "tests", icon: "ClipboardCheck",label: "Инструменты" },
    { id: "body",  icon: "User",          label: "Шпаргалка"   },
    ...(user?.is_admin ? [{ id: "admin" as Tab, icon: "Settings", label: "Админка" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Montserrat, sans-serif" }} className="lk-root">

      {/* ── Боковой сайдбар (десктоп) ── */}
      <aside className="lk-sidebar">
        {/* Логотип */}
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid #f0f0ec" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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
            <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12, border: "none",
              background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "transparent",
              color: tab === item.id ? ACCENT : "#666",
              fontSize: 14, fontWeight: tab === item.id ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              marginBottom: 4, transition: "all 0.15s", textAlign: "left",
            }}>
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
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>{user?.email}</div>
          {user?.access_expires_at && (() => {
            const exp = new Date(user.access_expires_at);
            const now = new Date();
            const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const expired = daysLeft <= 0;
            const soon = daysLeft > 0 && daysLeft <= 30;
            return (
              <div style={{
                fontSize: 11, fontWeight: 600, marginBottom: 10,
                padding: "6px 10px", borderRadius: 8,
                background: expired ? "#fff0f0" : soon ? "hsl(40,100%,95%)" : "hsl(185,85%,95%)",
                color: expired ? "#e55" : soon ? "hsl(40,85%,40%)" : ACCENT,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon name={expired ? "AlertCircle" : "Clock"} size={12} />
                {expired
                  ? "Доступ истёк"
                  : daysLeft === 1
                    ? "Последний день доступа"
                    : `Доступ ещё ${daysLeft} дн.`}
              </div>
            );
          })()}
          <button onClick={logout} style={{
            display: "flex", alignItems: "center", gap: 8, background: "none",
            border: "none", color: "#999", fontSize: 13, cursor: "pointer",
            padding: 0, fontFamily: "Montserrat, sans-serif",
          }}>
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Мобильный хедер ── */}
      <header className="lk-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name="BookOpen" size={16} style={{ color: "#fff" }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Кабинет</div>
        </div>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none",
          border: "1.5px solid #e8e8e4", borderRadius: 8, color: "#999",
          fontSize: 12, cursor: "pointer", padding: "6px 12px",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="LogOut" size={13} />
          Выйти
        </button>
      </header>

      {/* ── Контент ── */}
      <main className="lk-main">
        <div style={{ display: tab === "home" ? "block" : "none" }}>
          <HomeTab onNav={handleTabChange} />
        </div>
        <div style={{ display: tab === "tests" ? "block" : "none" }}>
          <LkTests />
        </div>
        <div style={{ display: tab === "body" ? "block" : "none" }}>
          <LkBodyMap />
        </div>
        {user?.is_admin && (
          <div style={{ display: tab === "admin" ? "block" : "none" }}>
            <LkAdmin />
          </div>
        )}
      </main>

      {/* ── Мобильный нижний таббар ── */}
      <nav className="lk-bottombar">
        {navItems.map(item => (
          <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: tab === item.id ? ACCENT : "#bbb",
            fontSize: 10, fontWeight: tab === item.id ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            padding: "8px 4px",
          }}>
            <Icon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <style>{`
        /* ── RESET ── */
        .lk-root { display: flex; }

        /* ── SIDEBAR (десктоп) ── */
        .lk-sidebar {
          width: 240px;
          background: #fff;
          border-right: 1px solid #eee;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          z-index: 100;
          padding: 28px 0;
        }

        /* ── MAIN ── */
        .lk-main {
          margin-left: 240px;
          flex: 1;
          padding: 36px 40px;
          min-height: 100vh;
        }

        /* ── MOBILE HEADER (скрыт на десктопе) ── */
        .lk-mobile-header {
          display: none;
        }

        /* ── BOTTOM BAR (скрыт на десктопе) ── */
        .lk-bottombar {
          display: none;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .lk-root { flex-direction: column; }

          .lk-sidebar { display: none; }

          .lk-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 52px;
            background: #fff;
            border-bottom: 1px solid #eee;
            padding: 0 16px;
            z-index: 100;
          }

          .lk-main {
            margin-left: 0;
            padding: 68px 16px 80px;
          }

          .lk-bottombar {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            height: 60px;
            background: #fff;
            border-top: 1px solid #eee;
            z-index: 100;
          }
        }

        /* ── TABLET ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .lk-sidebar { width: 200px; }
          .lk-main { margin-left: 200px; padding: 28px 24px; }
        }
      `}</style>
    </div>
  );
}

function HomeTab({ onNav }: { onNav: (t: Tab) => void }) {
  const { user } = useLkAuth();

  const accessBadge = (() => {
    if (!user?.access_expires_at) return null;
    const exp = new Date(user.access_expires_at);
    const daysLeft = Math.ceil((exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const expired = daysLeft <= 0;
    const soon = daysLeft > 0 && daysLeft <= 30;
    return { daysLeft, expired, soon };
  })();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,34px)",
          fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px",
        }}>
          Привет, {user?.full_name?.split(" ")[0] || user?.username}!
        </h1>
        <p style={{ fontSize: 14, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Здесь — инструменты для профессионального роста специалиста по телу
        </p>
        {accessBadge && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 12, padding: "7px 14px", borderRadius: 10,
            fontSize: 13, fontWeight: 600,
            background: accessBadge.expired ? "#fff0f0" : accessBadge.soon ? "hsl(40,100%,94%)" : "hsl(185,85%,94%)",
            color: accessBadge.expired ? "#e55" : accessBadge.soon ? "hsl(40,85%,38%)" : ACCENT,
          }}>
            <Icon name={accessBadge.expired ? "AlertCircle" : "Clock"} size={14} />
            {accessBadge.expired
              ? "Срок доступа истёк"
              : accessBadge.daysLeft === 1
                ? "Последний день доступа"
                : `Доступ ещё ${accessBadge.daysLeft} дн.`}
          </div>
        )}
      </div>

      {/* Диагностика — главный инструмент */}
      <button
        onClick={() => onNav("tests")}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16,
          background: "linear-gradient(135deg, hsl(210,85%,45%), hsl(210,85%,35%))",
          borderRadius: 18, padding: "20px 24px", border: "none", cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", textAlign: "left", marginBottom: 20,
          boxShadow: "0 4px 20px hsla(210,85%,45%,0.25)",
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Stethoscope" size={26} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>
            Системная диагностика клиента
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
            Жалоба → причины, компенсации, красные флаги и техники из шпаргалки
          </div>
        </div>
        <Icon name="ArrowRight" size={20} style={{ color: "rgba(255,255,255,0.6)", marginLeft: "auto", flexShrink: 0 }} />
      </button>

      {/* Инструменты */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 14px" }}>
          Инструменты роста
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
          {TOOLS.filter(tool => tool.id !== "salon" || user?.segment === "salon").filter(tool => tool.id !== "diag").map(tool => (
            <button
              key={tool.id}
              onClick={() => onNav("tests")}
              style={{
                background: "#fff", border: "1.5px solid #f0f0ec", borderRadius: 16,
                padding: "18px 20px", textAlign: "left", cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: tool.colorBg, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 12,
              }}>
                <Icon name={tool.icon} size={20} style={{ color: tool.color }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 5, lineHeight: 1.3 }}>
                {tool.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{tool.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Шпаргалка по телу */}
      <button
        onClick={() => onNav("body")}
        style={{
          width: "100%", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          border: "none", borderRadius: 16, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", textAlign: "left",
          boxShadow: `0 8px 28px hsla(185,85%,32%,0.25)`,
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="User" size={24} style={{ color: "#fff" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
            Шпаргалка по телу
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
            Кликни на зону тела → диагностика, техники и видео
          </div>
        </div>
        <Icon name="ArrowRight" size={18} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
      </button>
    </div>
  );
}