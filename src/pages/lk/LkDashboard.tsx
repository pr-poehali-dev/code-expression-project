import { useState, useCallback } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import LkTests from "./LkTests";
import LkBodyMap from "./LkBodyMap";
import LkAdmin from "./LkAdmin";
import LkSalonProfile from "./LkSalonProfile";
import LkAiTools from "./LkAiTools";
import LkEmployees from "./LkEmployees";
import LkTeam from "./LkTeam";
import LkEnergy from "./LkEnergy";
import LkProfile from "./LkProfile";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const BG = "#f4f4f0";

// ── Типы ──────────────────────────────────────────────────────────────────────
type Tab = "home" | "tools" | "academy" | "ai" | "shop" | "employees" | "purchases" | "profile" | "salon" | "admin" | "more";

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

// Приоритетные вкладки для мобильного таббара (4 штуки + «Ещё»)
const MOBILE_PRIMARY: Record<string, Tab[]> = {
  owner:          ["home", "ai", "employees", "salon"],
  admin:          ["home", "tools", "ai", "profile"],
  master:         ["home", "tools", "ai", "profile"],
  body_specialist:["home", "tools", "ai", "profile"],
};

// ── Навигационные пункты ─────────────────────────────────────────────────────
const NAV_ITEMS: { id: Tab; icon: string; label: string; badge?: string }[] = [
  { id: "home",      icon: "Home",          label: "Главная"         },
  { id: "tools",     icon: "Wrench",        label: "Инструменты"     },
  { id: "academy",   icon: "GraduationCap", label: "Академия"        },
  { id: "ai",        icon: "Sparkles",      label: "ИИ-инструменты", badge: "new" },
  { id: "shop",      icon: "Zap",           label: "Энергия"         },
  { id: "employees", icon: "Users",         label: "Сотрудники"      },
  { id: "purchases", icon: "Receipt",       label: "Покупки"         },
  { id: "salon",     icon: "Building2",     label: "Мой салон"       },
  { id: "profile",   icon: "UserCircle",    label: "Профиль"         },
  { id: "admin",     icon: "Settings",      label: "Админка"         },
];

// ── Виджет баланса энергии ────────────────────────────────────────────────────
function EnergyBadge({ onNav, sidebar }: { onNav: (t: Tab) => void; sidebar?: boolean }) {
  const { balance } = useEnergy();
  const low = balance < 50;
  const empty = balance === 0;
  const color = empty ? "hsl(0,75%,55%)" : low ? "hsl(40,90%,42%)" : "hsl(185,85%,32%)";
  const bg    = empty ? "hsl(0,75%,97%)"  : low ? "hsl(40,90%,96%)" : "hsl(185,85%,96%)";

  if (sidebar) return (
    <button onClick={() => onNav("shop")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${empty ? "hsl(0,75%,88%)" : low ? "hsl(40,90%,80%)" : "#eee"}`, background: bg, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 18 }}>⚡</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{balance.toLocaleString()} энергий</div>
        <div style={{ fontSize: 10, color: "#aaa" }}>{empty ? "Пополните баланс" : low ? "Заканчивается" : "Баланс салона"}</div>
      </div>
    </button>
  );

  return (
    <button onClick={() => onNav("shop")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${empty ? "hsl(0,75%,85%)" : low ? "hsl(40,90%,75%)" : "#e8e8e4"}`, background: bg, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 14 }}>⚡</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{balance}</span>
    </button>
  );
}

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
      { tab: "salon" as Tab,      icon: "Building2", color: "hsl(145,60%,40%)", bg: "hsl(145,60%,95%)", title: "Мой салон",  desc: hasSalon ? "Профиль заполнен" : "Заполните профиль салона" },
      { tab: "employees" as Tab,  icon: "Users",     color: "hsl(185,85%,32%)", bg: "hsl(185,85%,95%)", title: "Команда",    desc: "Пригласить и управлять сотрудниками" },
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
    // Если владелец без салона — всегда на заполнение профиля
    if (role === "owner" && !hasSalon) return "salon";
    // Проверяем сохранённую вкладку, но только если она не требует салона
    const saved = sessionStorage.getItem("lk_tab") as Tab | null;
    const needsSalon: Tab[] = ["ai", "shop", "employees"];
    if (saved && allowedTabs.includes(saved)) {
      if (needsSalon.includes(saved) && !hasSalon) return "salon";
      return saved;
    }
    return "home";
  };

  const [tab, setTab] = useState<Tab>(getInitialTab);
  const [moreOpen, setMoreOpen] = useState(false);

  // Вкладки, требующие наличия салона
  const SALON_REQUIRED: Tab[] = ["tools", "ai", "shop", "employees", "purchases"];

  const handleTabChange = useCallback((t: Tab) => {
    if (!allowedTabs.includes(t)) return;
    // Если нет салона — перенаправляем на его создание
    if (!hasSalon && SALON_REQUIRED.includes(t)) {
      setMoreOpen(false);
      sessionStorage.setItem("lk_tab", "salon");
      setTab("salon");
      return;
    }
    setMoreOpen(false);
    sessionStorage.setItem("lk_tab", t);
    setTab(t);
  }, [allowedTabs, hasSalon]);

  const visibleNav = NAV_ITEMS.filter(n => allowedTabs.includes(n.id));

  // Мобильный таббар: 4 приоритетных вкладки + «Ещё»
  const mobilePrimary = (MOBILE_PRIMARY[role] || MOBILE_PRIMARY["body_specialist"])
    .filter(id => allowedTabs.includes(id));
  const moreItems = visibleNav.filter(n => !mobilePrimary.includes(n.id));
  const mobileNav = NAV_ITEMS.filter(n => mobilePrimary.includes(n.id));

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
          {visibleNav.map(item => {
            const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", borderRadius: 10, border: "none",
                background: active ? `hsla(185,85%,32%,0.1)` : "transparent",
                color: locked ? "#ccc" : active ? ACCENT : "#666",
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                marginBottom: 2, transition: "all 0.15s", textAlign: "left",
                opacity: locked ? 0.7 : 1,
              }}>
                <Icon name={item.icon} size={17} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {locked
                  ? <Icon name="Lock" size={12} style={{ color: "#ccc" }} />
                  : item.badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, background: "hsl(40,90%,50%)", color: "#fff", borderRadius: 4, padding: "2px 5px", letterSpacing: 0.5, textTransform: "uppercase" }}>
                      {item.badge}
                    </span>
                  )
                }
              </button>
            );
          })}
        </nav>

        {/* Баланс энергии */}
        {user?.salon_id && (
          <div style={{ padding: "0 12px 10px" }}>
            <EnergyBadge onNav={handleTabChange} sidebar />
          </div>
        )}

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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user?.salon_id && <EnergyBadge onNav={handleTabChange} />}
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #e8e8e4", borderRadius: 8, color: "#999", fontSize: 12, cursor: "pointer", padding: "5px 10px", fontFamily: "Montserrat, sans-serif" }}>
            <Icon name="LogOut" size={12} />
            Выйти
          </button>
        </div>
      </header>

      {/* ── Контент ── */}
      <main className="lk-main">
        {tab === "home" && <HomeTab onNav={handleTabChange} role={role} hasSalon={hasSalon} />}
        {tab === "tools" && <LkTests />}
        {tab === "academy" && <ComingSoonTab title="Академия" description="Курсы и обучение для вашей роли. Раздел находится в разработке." icon="GraduationCap" />}
        {tab === "ai" && <LkAiTools />}
        {tab === "shop" && <LkEnergy />}
        {tab === "employees" && <LkTeam />}
        {tab === "purchases" && <LkEnergy />}
        {tab === "salon" && <LkSalonProfile onSaved={() => handleTabChange("home")} />}
        {tab === "profile" && <LkProfile />}
        {tab === "body" && <LkBodyMap />}
        {user?.is_admin && tab === "admin" && <LkAdmin />}
      </main>

      {/* ── Мобильный нижний таббар ── */}
      <nav className="lk-bottombar">
        {mobileNav.map(item => {
          const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
          return (
            <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 3, border: "none", background: "none",
              color: locked ? "#ddd" : tab === item.id ? ACCENT : "#bbb",
              fontSize: 9, fontWeight: tab === item.id ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
              position: "relative",
            }}>
              <Icon name={item.icon} size={20} />
              {locked && <Icon name="Lock" size={9} style={{ position: "absolute", top: 5, right: "calc(50% - 14px)", color: "#ccc" }} />}
              {item.label}
            </button>
          );
        })}
        {moreItems.length > 0 && (
          <button onClick={() => setMoreOpen(p => !p)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: moreOpen ? ACCENT : "#bbb",
            fontSize: 9, fontWeight: moreOpen ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
          }}>
            <Icon name="MoreHorizontal" size={20} />
            Ещё
          </button>
        )}
      </nav>

      {/* ── Шторка «Ещё» ── */}
      {moreOpen && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }} onClick={() => setMoreOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.35)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", padding: "8px 0 calc(72px + env(safe-area-inset-bottom,0px))", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 16px" }} />
            {moreItems.map(item => {
              const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 24px", border: "none", background: tab === item.id ? `hsla(185,85%,32%,0.06)` : "none",
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif", textAlign: "left",
                  opacity: locked ? 0.5 : 1,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "#f5f5f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={locked ? "Lock" : item.icon} size={18} style={{ color: tab === item.id ? ACCENT : "#888" }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, color: tab === item.id ? ACCENT : "#1a1a1a" }}>{item.label}</span>
                  {!locked && item.badge && <span style={{ fontSize: 9, fontWeight: 700, background: ACCENT, color: "#fff", borderRadius: 4, padding: "2px 6px", marginLeft: "auto" }}>{item.badge.toUpperCase()}</span>}
                  {locked && <span style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }}>Нужен салон</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

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