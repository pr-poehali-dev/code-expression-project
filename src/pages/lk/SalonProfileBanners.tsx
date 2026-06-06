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
          Заполните профиль и получите 100 энергий в подарок
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
          Укажите название, услуги и описание салона — и мы зачислим бонус сразу после сохранения.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 10, padding: "10px 18px", flexShrink: 0 }}>
        <Icon name="Zap" size={18} style={{ color: "#2DD4BF" }} />
        <span style={{ fontSize: 22, fontWeight: 800, color: "#2DD4BF" }}>100</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>энергий</span>
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

// ── Баннер приветственного бонуса ─────────────────────────────────────────────

interface WelcomeBonusBannerProps {
  onClose: () => void;
}

export function WelcomeBonusBanner({ onClose }: WelcomeBonusBannerProps) {
  return (
    <div style={{ marginTop: 20, borderRadius: 20, overflow: "hidden", animation: "fadeIn 0.5s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
      <div style={{ background: "linear-gradient(135deg, hsl(280,70%,55%), hsl(220,80%,55%), hsl(185,85%,42%))", padding: "28px 28px 24px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12, animation: "float 2s ease infinite" }}>🎁</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
          Добро пожаловать!
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, marginBottom: 20 }}>
          Мы зачислили на баланс вашего салона
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 28px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <span style={{ fontSize: 36 }}>⚡</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>100</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>энергий в подарок</div>
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
          Используйте ИИ-инструменты прямо сейчас —<br />генерируйте посты, анализируйте команду и многое другое.
        </div>
        <button
          onClick={onClose}
          style={{ marginTop: 20, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 24px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          Начать работу →
        </button>
      </div>
    </div>
  );
}

// re-export EMPTY_FORM so orchestrator doesn't need two imports
export { EMPTY_FORM };
export type { SalonForm };
