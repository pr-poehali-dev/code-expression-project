import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { TEAL_BRIGHT } from "./LkDashboardTypes";

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
export function InstallButtonSidebar() {
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
export function InstallButtonMobile() {
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
