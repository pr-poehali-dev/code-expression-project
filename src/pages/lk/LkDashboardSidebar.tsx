import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import {
  Tab, NAV_ITEMS, ROLE_TABS, SALON_REQUIRED, ROLE_LABELS, TEAL_BRIGHT, ACCENT, ACCENT_DARK,
} from "./LkDashboardTypes";
import { isPodelamSeenToday, PODELAM_SEEN_EVENT } from "./podelamNotice";

// ── Хук: не открыт ли сегодня план «ПоДелам» ───────────────────────────────────
function usePodelamUnseen() {
  const [unseen, setUnseen] = useState(() => !isPodelamSeenToday());

  useEffect(() => {
    const recheck = () => setUnseen(!isPodelamSeenToday());
    window.addEventListener(PODELAM_SEEN_EVENT, recheck);
    window.addEventListener("storage", recheck);
    document.addEventListener("visibilitychange", recheck);
    return () => {
      window.removeEventListener(PODELAM_SEEN_EVENT, recheck);
      window.removeEventListener("storage", recheck);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, []);

  return unseen;
}

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
  const [installed, setInstalled] = useState(
    () => isStandalone() || localStorage.getItem("pwa_installed") === "1"
  );

  useEffect(() => {
    if (installed) return;
    // Chrome поддерживает getInstalledRelatedApps — проверяем реальную установку
    const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> };
    if (nav.getInstalledRelatedApps) {
      nav.getInstalledRelatedApps().then(apps => {
        if (apps.length > 0) { localStorage.setItem("pwa_installed", "1"); setInstalled(true); }
      });
    }
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); };
    const onInstalled = () => { localStorage.setItem("pwa_installed", "1"); setInstalled(true); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [installed]);

  const install = async () => {
    if (!prompt) return;
    const p = prompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };
    p.prompt();
    const { outcome } = await p.userChoice;
    if (outcome === "accepted") { localStorage.setItem("pwa_installed", "1"); setInstalled(true); }
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
      'Нажмите три точки (⋮) внизу справа — они видны прямо сейчас за этой шторкой',
      'Выберите «Добавить на главный экран»',
      'Нажмите «Добавить» — иконка «Промт Диалог» появится на рабочем столе',
    ],
  },
  "android-chrome": {
    subtitle: "Google Chrome на Android",
    steps: [
      'Нажмите три точки (⋮)',
      'Выберите «Добавить на главный экран» или «Установить приложение»',
      'Нажмите «Добавить» — иконка появится на рабочем столе',
    ],
  },
  other: {
    subtitle: "Мобильный браузер",
    steps: [
      'Откройте меню браузера (три точки или значок настроек)',
      'Найдите пункт «Добавить на главный экран» или «Установить»',
      'Подтвердите — иконка «Промт Диалог» появится на рабочем столе',
    ],
  },
};

function InstallHowToModal({ platform, onClose }: { platform: string; onClose: () => void }) {
  const info = INSTALL_INSTRUCTIONS[platform] || INSTALL_INSTRUCTIONS["other"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
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

// ── Хук: кол-во входящих запросов на тренинги (для владельца) ─────────────────
function useRequestsCount(role: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (role !== "owner") return;
    const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
    const sid = () => localStorage.getItem("lk_session") || "";

    const load = () => {
      fetch(`${LK_URL}?action=course_requests_list`, { headers: { "X-Session-Id": sid() } })
        .then(r => r.json())
        .then(d => { if (Array.isArray(d?.requests)) setCount(d.requests.length); })
        .catch(() => {});
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [role]);

  return count;
}

// ── Баннер-напоминание при входе: новый план «ПоДелам» ещё не открыт ──────────
export function PodelamReminderBanner({ onNav }: { onNav: (t: string) => void }) {
  const podelamUnseen = usePodelamUnseen();
  const [dismissed, setDismissed] = useState(false);

  if (!podelamUnseen || dismissed) return null;

  const close = () => setDismissed(true);
  const go = () => { close(); onNav("home"); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 400, width: "100%", padding: 28, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="Compass" size={26} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Новый план на сегодня готов</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 22 }}>
          В разделе «ПоДелам» вас ждут свежие дела на день — ИИ пересчитал их с учётом вчерашних результатов.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={close} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Позже
          </button>
          <button onClick={go} style={{ flex: 1.4, padding: "11px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Смотреть план
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Виджет баланса энергии ─────────────────────────────────────────────────────
export function EnergyBadge({ onNav, sidebar }: { onNav: (t: string) => void; sidebar?: boolean }) {
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
  onNav: (t: string) => void;
  onLogout: () => void;
}

export function LkSidebar({ tab, hasSalon, role, onNav, onLogout }: SidebarProps) {
  const { user } = useLkAuth();
  const requestsCount = useRequestsCount(role);
  const podelamUnseen = usePodelamUnseen();
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
        <a href="https://promtdialog.ru/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(45,212,191,0.3)" }}>
            <Icon name="MessageSquare" size={18} style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Про Диалог</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>Личный кабинет</div>
          </div>
        </a>
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
          const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
          const active = tab === item.id;
          const highlight = !!item.highlight && !active;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10,
              border: active ? "1px solid rgba(45,212,191,0.25)" : highlight ? "1px solid rgba(45,212,191,0.2)" : "1px solid transparent",
              background: active ? "rgba(45,212,191,0.12)" : highlight ? "rgba(45,212,191,0.06)" : "transparent",
              color: locked ? "rgba(255,255,255,0.25)" : active || highlight ? TEAL_BRIGHT : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: active || highlight ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              marginBottom: 2, transition: "all 0.15s", textAlign: "left",
              opacity: locked ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!active && !locked) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = highlight ? "rgba(45,212,191,0.06)" : "transparent"; }}
            >
              <span style={{ position: "relative", display: "inline-flex" }}>
                <Icon name={item.icon} size={17} />
                {item.id === "home" && podelamUnseen && !locked && (
                  <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "hsl(0,80%,60%)", border: "1.5px solid #0F172A" }} />
                )}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {locked
                ? <Icon name="Lock" size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                : item.id === "employees" && requestsCount > 0
                  ? <span style={{ fontSize: 10, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{requestsCount}</span>
                  : item.id === "home" && podelamUnseen
                    ? <span style={{ fontSize: 9, fontWeight: 700, color: "hsl(0,80%,65%)" }}>Новое</span>
                    : null
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
  onNav: (t: string) => void;
  onLogout: () => void;
}

export function LkMobileHeader({ hasSalonId, onNav, onLogout }: MobileHeaderProps) {
  return (
    <header className="lk-mobile-header">
      <a href="https://promtdialog.ru/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="MessageSquare" size={15} style={{ color: "#0F172A" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Промт Диалог</div>
      </a>
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
  onNav: (t: string) => void;
}

export function LkBottomBar({ tab, hasSalon, mobileNav, moreItems, moreOpen, setMoreOpen, onNav }: BottomBarProps) {
  const { user } = useLkAuth();
  const role = user?.is_admin ? "owner" : (user?.role || "body_specialist");
  const requestsCount = useRequestsCount(role);
  const podelamUnseen = usePodelamUnseen();

  return (
    <>
      <nav className="lk-bottombar">
        {mobileNav.map(item => {
          const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
          const showBadge = item.id === "employees" && requestsCount > 0;
          const showPodelamDot = item.id === "home" && podelamUnseen && !locked;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 3, border: "none", background: "none",
              color: locked ? "rgba(255,255,255,0.2)" : tab === item.id ? TEAL_BRIGHT : "rgba(255,255,255,0.5)",
              fontSize: 9, fontWeight: tab === item.id ? 700 : 500,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
              position: "relative",
            }}>
              <div style={{ position: "relative" }}>
                <Icon name={item.icon} size={20} />
                {showBadge && (
                  <span style={{ position: "absolute", top: -4, right: -6, fontSize: 9, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 8, padding: "1px 5px", minWidth: 14, textAlign: "center", lineHeight: "14px" }}>
                    {requestsCount}
                  </span>
                )}
                {showPodelamDot && (
                  <span style={{ position: "absolute", top: -2, right: -3, width: 7, height: 7, borderRadius: "50%", background: "hsl(0,80%,60%)", border: "1.5px solid #0F172A" }} />
                )}
              </div>
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
              const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
              const showBadge = item.id === "employees" && requestsCount > 0;
              return (
                <button key={item.id} onClick={() => onNav(item.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 24px", border: "none", background: tab === item.id ? `hsla(185,85%,32%,0.06)` : "none",
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif", textAlign: "left",
                  opacity: locked ? 0.5 : 1,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "#f5f5f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    <Icon name={locked ? "Lock" : item.icon} size={18} style={{ color: tab === item.id ? ACCENT : "#888" }} />
                    {showBadge && <span style={{ position: "absolute", top: -4, right: -4, fontSize: 9, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 8, padding: "1px 5px", minWidth: 14, textAlign: "center", lineHeight: "14px" }}>{requestsCount}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, color: tab === item.id ? ACCENT : "#1a1a1a" }}>{item.label}</span>
                  {!locked && showBadge && <span style={{ fontSize: 11, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 6, padding: "2px 8px", marginLeft: "auto" }}>{requestsCount} запроса</span>}
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