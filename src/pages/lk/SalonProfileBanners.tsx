import { SalonForm, EMPTY_FORM, clearDraft } from "./SalonProfileTypes";
import Icon from "@/components/ui/icon";

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