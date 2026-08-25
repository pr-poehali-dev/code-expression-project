import { SalonForm, EMPTY_FORM, clearDraft } from "./SalonProfileTypes";
import Icon from "@/components/ui/icon";

// ── Баннер бесплатной диагностики роста салона ───────────────────────────────

const DIAG_ACCENT = "hsl(335,80%,50%)";
const DIAG_ACCENT_DARK = "hsl(335,80%,38%)";

export function DiagnosticBanner({ ready, onOpen }: { ready: boolean; onOpen: () => void }) {
  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 16, background: "#F8FAFC", border: "1.5px dashed #CBD5E1", marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Scissors" size={18} style={{ color: "#94A3B8" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Диагностика роста салона PRO — бесплатно</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
            Заполните название, средний чек и выручку ниже — и диагностика откроется автоматически.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: 16,
      background: `linear-gradient(135deg, ${DIAG_ACCENT}, ${DIAG_ACCENT_DARK})`, marginBottom: 24,
      boxShadow: `0 10px 30px ${DIAG_ACCENT}33`, flexWrap: "wrap",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name="Scissors" size={22} style={{ color: "#fff" }} />
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Диагностика роста салона PRO</div>
          <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, textTransform: "uppercase" }}>бесплатно</span>
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
          Поймите, где салон теряет деньги — и какие шаги приведут к вашим целям.
        </div>
      </div>
      <button
        onClick={onOpen}
        style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, background: "#fff", color: DIAG_ACCENT_DARK, border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
      >
        <Icon name="Sparkles" size={14} />
        Открыть
      </button>
    </div>
  );
}

// ── Баннер подарка для нового пользователя ───────────────────────────────────

export function GiftBanner() {
  return (
    <div style={{ background: "linear-gradient(135deg, #0F172A, #112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name="Gift" size={24} style={{ color: "#2DD4BF" }} />
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          Заполните профиль и получите план роста дохода бесплатно
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
          Укажите название, услуги и описание салона — и в разделе «ПоДелам» сразу откроется план роста без оплаты.
        </div>
      </div>
    </div>
  );
}

// ── Баннер восстановленного черновика ─────────────────────────────────────────

interface DraftBannerProps {
  uid: number;
  onClear: () => void;
}

export function DraftRestoredBanner({ uid, onClear }: DraftBannerProps) {
  function handleClear() {
    clearDraft(uid);
    onClear();
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 12, padding: "11px 16px", marginBottom: 20 }}>
      <Icon name="RotateCcw" size={15} style={{ color: "hsl(40,90%,40%)", flexShrink: 0 }} />
      <div style={{ fontSize: 13, color: "hsl(40,90%,35%)", fontWeight: 600 }}>
        Данные восстановлены — продолжайте заполнять с того места, где остановились.
      </div>
      <button
        onClick={handleClear}
        style={{ marginLeft: "auto", fontSize: 11, color: "hsl(40,90%,50%)", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}
      >
        Очистить
      </button>
    </div>
  );
}

// re-export EMPTY_FORM so orchestrator doesn't need two imports
export { EMPTY_FORM };
export type { SalonForm };