import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import {
  Tab, NAV_ITEMS, ROLE_TABS, SALON_REQUIRED, ROLE_LABELS, TEAL_BRIGHT, ACCENT,
} from "./LkDashboardTypes";

// ── PWA helpers ───────────────────────────────────────────────────────────────
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function detectPlatform(): "ios" | "yandex" | "android-chrome" | "desktop-chrome" | "other" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/YaBrowser/i.test(ua)) return "yandex";
  if (/Android/i.test(ua) && /Chrome\//i.test(ua)) return "android-chrome";
  if (!/Mobi/i.test(ua) && /Chrome\//i.test(ua)) return "desktop-chrome";
  return "other";
}

// ── PWA install hook ───────────────────────────────────────────────────────────
function usePWAInstall() {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) { setInstalled(true); return; }
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    const p = prompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };
    p.prompt();
    const { outcome } = await p.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  const platform = detectPlatform();
  const canNativeInstall = !!prompt && !installed;
  // Показываем инструкцию для iOS и для браузеров без beforeinstallprompt (Яндекс, Firefox и тд)
  const canManualInstall = !installed && !canNativeInstall && platform !== "desktop-chrome";

  return { canNativeInstall, canManualInstall, platform, install };
}

// ── Модалка с инструкцией ──────────────────────────────────────────────────────
const INSTALL_INSTRUCTIONS: Record<string, { subtitle: string; steps: string[] }> = {
  ios: {
    subtitle: "Safari на iPhone / iPad",
    steps: [
      'Нажмите кнопку «Поделиться» внизу браузера Safari — значок квадрата со стрелкой вверх',
      'Прокрутите список и выберите «На экран «Домой»»',
      'Нажмите «Добавить» — иконка появится на главном экране',
    ],
  },
  yandex: {
    subtitle: "Яндекс Браузер",
    steps: [
      'Нажмите на три точки (⋮) или значок «Ещё» в нижней панели браузера',
      'Выберите «Добавить на главный экран»',
      'Нажмите «Добавить» — иконка «Про Диалог» появится на рабочем столе',
    ],
  },
  "android-chrome": {
    subtitle: "Google Chrome на Android",
    steps: [
      'Нажмите три точки (⋮) в правом верхнем углу браузера',
      'Выберите «Добавить на главный экран» или «Установить приложение»',
      'Нажмите «Добавить» — иконка появится на рабочем столе',
    ],
  },
  other: {
    subtitle: "Мобильный браузер",
    steps: [
      'Откройте меню браузера (три точки или значок настроек)',
      'Найдите пункт «Добавить на главный экран» или «Установить»',
      'Подтвердите — иконка «Про Диалог» появится на рабочем столе',
    ],
  },
};

function InstallHowToModal({ platform, onClose }: { platform: string; onClose: () => void }) {
  const info = INSTALL_INSTRUCTIONS[platform] || INSTALL_INSTRUCTIONS["other"];

  // Стрелка указывает туда, где находится меню браузера
  const arrowPos = platform === "yandex"
    ? { bottom: 90, right: 16, rotate: "150deg", label: "нажмите здесь" }   // нижняя панель Яндекса
    : platform === "ios"
    ? { bottom: 24, left: "50%", rotate: "180deg", label: "нажмите здесь" } // Safari — снизу по центру
    : { top: 56, right: 16, rotate: "30deg", label: "нажмите здесь" };       // Chrome — правый верх

  const isBottom = "bottom" in arrowPos && !("top" in arrowPos);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>

      {/* Стрелка-указатель */}
      <div style={{
        position: "fixed",
        ...(arrowPos.top !== undefined ? { top: arrowPos.top } : {}),
        ...(arrowPos.bottom !== undefined ? { bottom: arrowPos.bottom } : {}),
        ...(arrowPos.right !== undefined ? { right: arrowPos.right } : {}),
        ...("left" in arrowPos ? { left: arrowPos.left, transform: "translateX(-50%)" } : {}),
        display: "flex", flexDirection: isBottom ? "column-reverse" : "column",
        alignItems: "center", gap: 6, zIndex: 2010, pointerEvents: "none",
        animation: "arrow-bounce 1s ease-in-out infinite",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(45,212,191,0.9)", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.3 }}>
          {arrowPos.label}
        </div>
        <div style={{ transform: `rotate(${arrowPos.rotate})`, fontSize: 28, lineHeight: 1 }}>⬆</div>
      </div>

      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 24px calc(24px + env(safe-area-inset-bottom,0px))", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Smartphone" size={22} style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A" }}>Установить приложение</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{info.subtitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {info.steps.map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#2DD4BF" }}>{i + 1}</span>
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.5, paddingTop: 7 }}>{text}</div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: "none", background: "#0F172A", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          Понятно
        </button>
      </div>
      <style>{`@keyframes arrow-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}

// ── Кнопка установки (сайдбар десктоп) ───────────────────────────────────────
function InstallButtonSidebar() {
  const { canNativeInstall, install } = usePWAInstall();
  if (!canNativeInstall) return null;
  return (
    <button onClick={install} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.3)", background: "rgba(45,212,191,0.08)", cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "background 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(45,212,191,0.15)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(45,212,191,0.08)")}
    >
      <Icon name="MonitorDown" size={16} style={{ color: TEAL_BRIGHT, flexShrink: 0 }} />
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TEAL_BRIGHT }}>Установить приложение</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Открывать без браузера</div>
      </div>
    </button>
  );
}

// ── Кнопка установки (мобайл — компактная) ───────────────────────────────────
function InstallButtonMobile() {
  const { canNativeInstall, canManualInstall, platform, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (!canNativeInstall && !canManualInstall) return null;

  return (
    <>
      <button
        onClick={canNativeInstall ? install : () => setShowModal(true)}
        style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "1.5px solid rgba(45,212,191,0.35)", background: "rgba(45,212,191,0.1)", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
      >
        <Icon name="Download" size={13} style={{ color: TEAL_BRIGHT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_BRIGHT }}>Установить</span>
      </button>
      {showModal && <InstallHowToModal platform={platform} onClose={() => setShowModal(false)} />}
    </>
  );
}

// ── Виджет баланса энергии ─────────────────────────────────────────────────────
export function EnergyBadge({ onNav, sidebar }: { onNav: (t: Tab) => void; sidebar?: boolean }) {
  const { balance } = useEnergy();
  const low   = balance < 50;
  const empty = balance === 0;
  const color = empty ? "hsl(0,85%,68%)"  : low ? "hsl(40,95%,60%)"  : "#2DD4BF";
  const bg    = empty ? "hsl(0,75%,97%)"  : low ? "hsl(40,90%,96%)"  : "hsl(185,85%,96%)";

  if (sidebar) return (
    <button onClick={() => onNav("shop")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${empty ? "rgba(248,113,113,0.3)" : low ? "rgba(251,191,36,0.3)" : "rgba(45,212,191,0.25)"}`, background: empty ? "rgba(248,113,113,0.08)" : low ? "rgba(251,191,36,0.08)" : "rgba(45,212,191,0.1)", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 18 }}>⚡</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{balance.toLocaleString()} энергий</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{empty ? "Пополните баланс" : low ? "Заканчивается" : "Баланс салона"}</div>
      </div>
    </button>
  );

  return (
    <button onClick={() => onNav("shop")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${empty ? "rgba(248,113,113,0.35)" : low ? "rgba(251,191,36,0.35)" : "rgba(45,212,191,0.3)"}`, background: empty ? "rgba(248,113,113,0.1)" : low ? "rgba(251,191,36,0.1)" : "rgba(45,212,191,0.12)", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 14 }}>⚡</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{balance}</span>
    </button>
  );
}

// ── Боковой сайдбар ────────────────────────────────────────────────────────────
interface SidebarProps {
  tab: Tab;
  hasSalon: boolean;
  role: string;
  onNav: (t: Tab) => void;
  onLogout: () => void;
}

export function LkSidebar({ tab, hasSalon, role, onNav, onLogout }: SidebarProps) {
  const { user } = useLkAuth();
  const allowedNav = NAV_ITEMS.filter(n => {
    const allowed: Tab[] = user?.is_admin
      ? [...(ROLE_TABS["owner"] as Tab[]), "admin" as Tab]
      : (ROLE_TABS[role] || ROLE_TABS["body_specialist"]);
    return allowed.includes(n.id);
  });

  return (
    <aside className="lk-sidebar">
      {/* Логотип */}
      <div style={{ padding: "0 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(45,212,191,0.3)" }}>
            <Icon name="MessageSquare" size={18} style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Про Диалог</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>Личный кабинет</div>
          </div>
        </div>
      </div>

      {/* Профиль салона */}
      {user?.salon && (
        <div
          onClick={() => onNav("salon")}
          style={{ margin: "12px 12px 0", padding: "10px 12px", borderRadius: 10, background: tab === "salon" ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${tab === "salon" ? "rgba(45,212,191,0.3)" : "rgba(255,255,255,0.08)"}` }}
        >
          {user.salon.logo_url
            ? <img src={user.salon.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
            : <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Building2" size={14} style={{ color: TEAL_BRIGHT }} />
              </div>
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.salon.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{ROLE_LABELS[role]}</div>
          </div>
        </div>
      )}

      {/* Навигация */}
      <nav style={{ flex: 1, padding: "10px 12px", overflowY: "auto" }}>
        {allowedNav.map(item => {
          const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10,
              border: active ? "1px solid rgba(45,212,191,0.25)" : "1px solid transparent",
              background: active ? "rgba(45,212,191,0.12)" : "transparent",
              color: locked ? "rgba(255,255,255,0.25)" : active ? TEAL_BRIGHT : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              marginBottom: 2, transition: "all 0.15s", textAlign: "left",
              opacity: locked ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!active && !locked) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <Icon name={item.icon} size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {locked
                ? <Icon name="Lock" size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                : item.badge && (
                  <span style={{ fontSize: 9, fontWeight: 700, background: "hsl(40,90%,50%)", color: "#0F172A", borderRadius: 4, padding: "2px 5px", letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {item.badge}
                  </span>
                )
              }
            </button>
          );
        })}
      </nav>

      {/* Баланс энергии + кнопка установки */}
      <div style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        {user?.salon_id && <EnergyBadge onNav={onNav} sidebar />}
        <InstallButtonSidebar />
      </div>

      {/* Пользователь */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 1 }}>{user?.full_name || user?.username}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{user?.email}</div>
        {user?.access_expires_at && (() => {
          const daysLeft = Math.ceil((new Date(user.access_expires_at).getTime() - Date.now()) / 86400000);
          const expired  = daysLeft <= 0;
          return (
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, padding: "5px 9px", borderRadius: 7, background: expired ? "#fff0f0" : daysLeft <= 30 ? "hsl(40,100%,95%)" : "hsl(185,85%,95%)", color: expired ? "#e55" : daysLeft <= 30 ? "hsl(40,85%,40%)" : ACCENT, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name={expired ? "AlertCircle" : "Clock"} size={11} />
              {expired ? "Доступ истёк" : daysLeft === 1 ? "Последний день" : `Доступ: ${daysLeft} дн.`}
            </div>
          );
        })()}
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={13} />
          Выйти
        </button>
      </div>
    </aside>
  );
}

// ── Мобильный хедер ────────────────────────────────────────────────────────────
interface MobileHeaderProps {
  hasSalonId: boolean;
  onNav: (t: Tab) => void;
  onLogout: () => void;
}

export function LkMobileHeader({ hasSalonId, onNav, onLogout }: MobileHeaderProps) {
  return (
    <header className="lk-mobile-header">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="MessageSquare" size={15} style={{ color: "#0F172A" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Про Диалог</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {hasSalonId && <EnergyBadge onNav={onNav} />}
        <InstallButtonMobile />
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", padding: "5px 10px", fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={12} />
          Выйти
        </button>
      </div>
    </header>
  );
}

// ── Мобильный боттомбар + шторка «Ещё» ────────────────────────────────────────
interface BottomBarProps {
  tab: Tab;
  hasSalon: boolean;
  mobileNav: typeof NAV_ITEMS;
  moreItems: typeof NAV_ITEMS;
  moreOpen: boolean;
  setMoreOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  onNav: (t: Tab) => void;
}

export function LkBottomBar({ tab, hasSalon, mobileNav, moreItems, moreOpen, setMoreOpen, onNav }: BottomBarProps) {
  return (
    <>
      <nav className="lk-bottombar">
        {mobileNav.map(item => {
          const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 3, border: "none", background: "none",
              color: locked ? "rgba(255,255,255,0.2)" : tab === item.id ? TEAL_BRIGHT : "rgba(255,255,255,0.5)",
              fontSize: 9, fontWeight: tab === item.id ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
              position: "relative",
            }}>
              <Icon name={item.icon} size={20} />
              {locked && <Icon name="Lock" size={9} style={{ position: "absolute", top: 5, right: "calc(50% - 14px)", color: "rgba(255,255,255,0.3)" }} />}
              {item.label}
            </button>
          );
        })}
        {moreItems.length > 0 && (
          <button onClick={() => setMoreOpen(p => !p)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: moreOpen ? TEAL_BRIGHT : "rgba(255,255,255,0.5)",
            fontSize: 9, fontWeight: moreOpen ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
          }}>
            <Icon name="MoreHorizontal" size={20} />
            Ещё
          </button>
        )}
      </nav>

      {/* Шторка «Ещё» */}
      {moreOpen && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }} onClick={() => setMoreOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.35)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", padding: "8px 0 calc(72px + env(safe-area-inset-bottom,0px))", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 16px" }} />
            {moreItems.map(item => {
              const locked = !hasSalon && SALON_REQUIRED.includes(item.id);
              return (
                <button key={item.id} onClick={() => onNav(item.id)} style={{
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
    </>
  );
}