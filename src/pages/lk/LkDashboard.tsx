import { useState, useCallback } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import LkTests from "./LkTests";
import LkBodyMap from "./LkBodyMap";
import LkAdmin from "./LkAdmin";
import LkSalonProfile from "./LkSalonProfile";
import LkAiTools from "./LkAiTools";
import LkEmployees from "./LkEmployees";
import LkTeam from "./LkTeam";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const BG = "#f4f4f0";

// ── Типы ──────────────────────────────────────────────────────────────────────
type Tab = "home" | "tools" | "academy" | "ai" | "shop" | "employees" | "purchases" | "profile" | "salon" | "admin";

// ── Доступ по ролям ───────────────────────────────────────────────────────────
const ROLE_TABS: Record<string, Tab[]> = {
  owner:          ["home", "tools", "academy", "ai", "shop", "employees", "purchases", "salon", "profile"],
  admin:          ["home", "tools", "academy", "ai", "profile"],
  master:         ["home", "tools", "academy", "ai", "profile"],
  body_specialist:["home", "tools", "academy", "ai", "profile"],
};

function getAllowedTabs(role: string, isAdmin: boolean): Tab[] {
  const effectiveRole = isAdmin ? "owner" : role;
  const tabs = ROLE_TABS[effectiveRole] || ROLE_TABS["body_specialist"];
  if (isAdmin) return [...new Set([...tabs, "admin" as Tab])];
  return tabs;
}

// ── Навигационные пункты ─────────────────────────────────────────────────────
const NAV_ITEMS: { id: Tab; icon: string; label: string; badge?: string }[] = [
  { id: "home",      icon: "Home",          label: "Главная"         },
  { id: "tools",     icon: "Wrench",        label: "Инструменты"     },
  { id: "academy",   icon: "GraduationCap", label: "Академия"        },
  { id: "ai",        icon: "Sparkles",      label: "ИИ-инструменты", badge: "new" },
  { id: "shop",      icon: "ShoppingBag",   label: "Магазин"         },
  { id: "employees", icon: "Users",         label: "Сотрудники"      },
  { id: "purchases", icon: "Receipt",       label: "Покупки"         },
  { id: "salon",     icon: "Building2",     label: "Мой салон"       },
  { id: "profile",   icon: "UserCircle",    label: "Профиль"         },
  { id: "admin",     icon: "Settings",      label: "Админка"         },
];

// ── Заглушки для будущих разделов ─────────────────────────────────────────────
function ComingSoonTab({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 16, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: `hsla(185,85%,32%,0.08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={32} style={{ color: ACCENT }} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#888", maxWidth: 340, lineHeight: 1.6 }}>{description}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "hsla(185,85%,32%,0.08)", borderRadius: 50, padding: "8px 18px" }}>
        <Icon name="Clock" size={13} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Скоро будет доступно</span>
      </div>
    </div>
  );
}

// ── Домашняя вкладка ──────────────────────────────────────────────────────────
function HomeTab({ onNav, role, hasSalon }: { onNav: (t: Tab) => void; role: string; hasSalon: boolean }) {
  const { user } = useLkAuth();

  const ROLE_LABELS: Record<string, string> = {
    owner: "Владелец", admin: "Администратор",
    master: "Мастер красоты", body_specialist: "Специалист по телу",
  };

  const quickItems = [
    { tab: "tools" as Tab,  icon: "Wrench",        color: "hsl(210,85%,45%)", bg: "hsl(210,85%,96%)", title: "Инструменты",     desc: "Диагностики, тесты, шпаргалка" },
    { tab: "academy" as Tab,icon: "GraduationCap", color: "hsl(280,60%,55%)", bg: "hsl(280,60%,96%)", title: "Академия",         desc: "Курсы и обучение" },
    { tab: "ai" as Tab,     icon: "Sparkles",      color: "hsl(40,90%,50%)",  bg: "hsl(40,90%,96%)",  title: "ИИ-инструменты",  desc: "Генерация контента — скоро" },
    ...(role === "owner" ? [
      { tab: "salon" as Tab, icon: "Building2",    color: "hsl(145,60%,40%)", bg: "hsl(145,60%,95%)", title: "Мой салон",        desc: hasSalon ? "Профиль заполнен" : "Заполните профиль салона" },
    ] : []),
  ];

  return (
    <div>
      {/* Приветствие */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          {ROLE_LABELS[role] || "Специалист"} · Про Диалог
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
          Добро пожаловать{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!
        </h1>
        <p style={{ fontSize: 14, color: "#777", margin: 0, lineHeight: 1.6 }}>
          {role === "owner" && !hasSalon
            ? "Чтобы ИИ-инструменты работали под ваш салон — заполните профиль салона."
            : "Выберите раздел для работы или воспользуйтесь быстрым переходом ниже."}
        </p>
      </div>

      {/* Баннер — заполни профиль салона */}
      {role === "owner" && !hasSalon && (
        <div
          onClick={() => onNav("salon")}
          style={{ cursor: "pointer", background: "linear-gradient(135deg,hsl(185,85%,32%),hsl(185,85%,24%))", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Building2" size={22} style={{ color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Заполните профиль вашего салона</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Это займёт 5 минут — после этого все ИИ-инструменты будут знать ваш контекст</div>
          </div>
          <Icon name="ArrowRight" size={20} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
        </div>
      )}

      {/* Быстрый доступ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {quickItems.map(item => (
          <button key={item.tab} onClick={() => onNav(item.tab)} style={{
            background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "18px 18px",
            textAlign: "left", cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "box-shadow 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ width: 40, height: 40, borderRadius: 11, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={item.icon} size={20} style={{ color: item.color }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Новости платформы */}
      <div style={{ marginTop: 32, background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eee" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Новости платформы</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { date: "31 мая 2025", text: "Платформа переименована в «Про Диалог» — новое позиционирование, новые инструменты." },
            { date: "Скоро", text: "Раздел ИИ-инструментов: генерация постов, рилсов и маркетинговых материалов для вашего салона." },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i === 0 ? 12 : 0, borderBottom: i === 0 ? "1px solid #f0f0ec" : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, whiteSpace: "nowrap", marginTop: 1, minWidth: 80 }}>{n.date}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{n.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkDashboard() {
  const { user, logout } = useLkAuth();
  const role = user?.is_admin ? "owner" : (user?.role || "body_specialist");
  const hasSalon = !!user?.salon_id;
  const allowedTabs = getAllowedTabs(role, !!user?.is_admin);

  const getInitialTab = (): Tab => {
    const saved = sessionStorage.getItem("lk_tab") as Tab | null;
    if (saved && allowedTabs.includes(saved)) return saved;
    // Если владелец без салона — отправляем на заполнение
    if (role === "owner" && !hasSalon) return "salon";
    return "home";
  };

  const [tab, setTab] = useState<Tab>(getInitialTab);

  const handleTabChange = useCallback((t: Tab) => {
    if (!allowedTabs.includes(t)) return;
    sessionStorage.setItem("lk_tab", t);
    setTab(t);
  }, [allowedTabs]);

  const visibleNav = NAV_ITEMS.filter(n => allowedTabs.includes(n.id));

  const ROLE_LABELS: Record<string, string> = {
    owner: "Владелец", admin: "Администратор",
    master: "Мастер красоты", body_specialist: "Специалист по телу",
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Montserrat, sans-serif" }} className="lk-root">

      {/* ── Боковой сайдбар ── */}
      <aside className="lk-sidebar">
        {/* Логотип */}
        <div style={{ padding: "0 24px 20px", borderBottom: "1px solid #f0f0ec" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="MessageSquare" size={18} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>Про Диалог</div>
              <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 0.5 }}>Личный кабинет</div>
            </div>
          </div>
        </div>

        {/* Профиль салона (если есть) */}
        {user?.salon && (
          <div
            onClick={() => handleTabChange("salon")}
            style={{ margin: "12px 12px 0", padding: "10px 12px", borderRadius: 10, background: tab === "salon" ? `hsla(185,85%,32%,0.08)` : "#f8f8f5", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, border: "1px solid #eee" }}
          >
            {user.salon.logo_url
              ? <img src={user.salon.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
              : <div style={{ width: 28, height: 28, borderRadius: 7, background: `hsla(185,85%,32%,0.12)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Building2" size={14} style={{ color: ACCENT }} />
                </div>
            }
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.salon.name}</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>{ROLE_LABELS[role]}</div>
            </div>
          </div>
        )}

        {/* Навигация */}
        <nav style={{ flex: 1, padding: "10px 12px", overflowY: "auto" }}>
          {visibleNav.map(item => (
            <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10, border: "none",
              background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "transparent",
              color: tab === item.id ? ACCENT : "#666",
              fontSize: 13, fontWeight: tab === item.id ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              marginBottom: 2, transition: "all 0.15s", textAlign: "left",
            }}>
              <Icon name={item.icon} size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, fontWeight: 700, background: "hsl(40,90%,50%)", color: "#fff", borderRadius: 4, padding: "2px 5px", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Пользователь */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f0f0ec" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", marginBottom: 1 }}>{user?.full_name || user?.username}</div>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>{user?.email}</div>
          {user?.access_expires_at && (() => {
            const daysLeft = Math.ceil((new Date(user.access_expires_at).getTime() - Date.now()) / 86400000);
            const expired = daysLeft <= 0;
            return (
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, padding: "5px 9px", borderRadius: 7, background: expired ? "#fff0f0" : daysLeft <= 30 ? "hsl(40,100%,95%)" : "hsl(185,85%,95%)", color: expired ? "#e55" : daysLeft <= 30 ? "hsl(40,85%,40%)" : ACCENT, display: "flex", alignItems: "center", gap: 5 }}>
                <Icon name={expired ? "AlertCircle" : "Clock"} size={11} />
                {expired ? "Доступ истёк" : daysLeft === 1 ? "Последний день" : `Доступ: ${daysLeft} дн.`}
              </div>
            );
          })()}
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#bbb", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "Montserrat, sans-serif" }}>
            <Icon name="LogOut" size={13} />
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Мобильный хедер ── */}
      <header className="lk-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="MessageSquare" size={15} style={{ color: "#fff" }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Про Диалог</div>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #e8e8e4", borderRadius: 8, color: "#999", fontSize: 12, cursor: "pointer", padding: "5px 10px", fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={12} />
          Выйти
        </button>
      </header>

      {/* ── Контент ── */}
      <main className="lk-main">
        {tab === "home" && <HomeTab onNav={handleTabChange} role={role} hasSalon={hasSalon} />}
        {tab === "tools" && <LkTests />}
        {tab === "academy" && <ComingSoonTab title="Академия" description="Курсы и обучение для вашей роли. Раздел находится в разработке." icon="GraduationCap" />}
        {tab === "ai" && <LkAiTools />}
        {tab === "shop" && <ComingSoonTab title="Магазин" description="Курсы, техники и программы обучения. Скоро откроется." icon="ShoppingBag" />}
        {tab === "employees" && <LkTeam />}
        {tab === "purchases" && <ComingSoonTab title="История покупок" description="Подписки, курсы и дополнительные продукты. Скоро будет доступно." icon="Receipt" />}
        {tab === "salon" && <LkSalonProfile onSaved={() => handleTabChange("home")} />}
        {tab === "profile" && <ComingSoonTab title="Профиль" description="Данные аккаунта, смена пароля и уведомления. В разработке." icon="UserCircle" />}
        {tab === "body" && <LkBodyMap />}
        {user?.is_admin && tab === "admin" && <LkAdmin />}
      </main>

      {/* ── Мобильный нижний таббар ── */}
      <nav className="lk-bottombar">
        {visibleNav.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: tab === item.id ? ACCENT : "#bbb",
            fontSize: 9, fontWeight: tab === item.id ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
          }}>
            <Icon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <style>{`
        .lk-root { display: flex; }
        .lk-sidebar { width: 230px; background: #fff; border-right: 1px solid #eee; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; padding: 24px 0 0; }
        .lk-main { margin-left: 230px; flex: 1; padding: 36px 40px; min-height: 100vh; }
        .lk-mobile-header { display: none; }
        .lk-bottombar { display: none; }
        @media (max-width: 768px) {
          .lk-root { flex-direction: column; }
          .lk-sidebar { display: none; }
          .lk-mobile-header { display: flex; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 50px; background: #fff; border-bottom: 1px solid #eee; padding: 0 16px; z-index: 100; }
          .lk-main { margin-left: 0; padding: 64px 16px 76px; }
          .lk-bottombar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #eee; z-index: 100; padding-bottom: env(safe-area-inset-bottom, 0); }
        }
      `}</style>
    </div>
  );
}