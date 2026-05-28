import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK } from "./DemoShared";

// ── EmailModal ────────────────────────────────────────────────────────────────

interface EmailModalProps {
  toolTitle: string;
  onConfirm: (email: string, name: string) => void;
  onClose: () => void;
}

export function EmailModal({ toolTitle, onConfirm, onClose }: EmailModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Введите ваше имя"); return; }
    if (!email.includes("@") || !email.includes(".")) { setError("Введите корректный email"); return; }
    if (!agreed) { setError("Необходимо согласие с политикой конфиденциальности"); return; }
    onConfirm(email.trim().toLowerCase(), name.trim());
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: hasError ? "1.5px solid #e55" : "1.5px solid #e0e0d8",
    fontSize: 15, outline: "none", boxSizing: "border-box",
    fontFamily: "Montserrat, sans-serif", marginBottom: 12,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Icon name="Mail" size={26} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#1a1a1a" }}>
            Бесплатный доступ
          </h2>
          <p style={{ fontSize: 14, color: "#777", margin: 0, lineHeight: 1.6 }}>
            Заполните форму, чтобы начать инструмент <strong>«{toolTitle}»</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            placeholder="Ваше имя"
            autoFocus
            style={inputStyle(!!error && !name.trim())}
          />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder="your@email.com"
            style={inputStyle(!!error && (!email.includes("@") || !email.includes(".")))}
          />
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => { setAgreed(e.target.checked); setError(""); }}
              style={{ marginTop: 3, flexShrink: 0, accentColor: ACCENT, width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: 12, color: "#777", lineHeight: 1.55 }}>
              Я согласен(а) с{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer"
                style={{ color: ACCENT, textDecoration: "underline" }}>
                политикой конфиденциальности
              </a>
            </span>
          </label>
          {error && <p style={{ fontSize: 12, color: "#e55", margin: "0 0 12px" }}>{error}</p>}
          <button type="submit" style={{
            width: "100%", padding: "13px", borderRadius: 12,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginBottom: 10,
          }}>
            Начать бесплатно
          </button>
          <button type="button" onClick={onClose} style={{
            width: "100%", padding: "11px", borderRadius: 12,
            background: "transparent", border: "1.5px solid #e0e0d8",
            color: "#888", fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          }}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
}

// ── AlreadyUsedModal ──────────────────────────────────────────────────────────

interface AlreadyUsedModalProps {
  toolTitle: string;
  onClose: () => void;
}

export function AlreadyUsedModal({ toolTitle, onClose }: AlreadyUsedModalProps) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "hsl(20,85%,96%)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <Icon name="Lock" size={26} style={{ color: "hsl(20,85%,52%)" }} />
        </div>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, margin: "0 0 10px", color: "#1a1a1a" }}>
          Вы уже использовали этот инструмент
        </h2>
        <p style={{ fontSize: 14, color: "#777", margin: "0 0 24px", lineHeight: 1.6 }}>
          Инструмент <strong>«{toolTitle}»</strong> доступен бесплатно только один раз. Чтобы использовать его снова — получите доступ к платформе.
        </p>
        <a href="/tarify" style={{
          display: "block", padding: "13px", borderRadius: 12,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: "#fff", fontSize: 15, fontWeight: 700,
          textDecoration: "none", fontFamily: "Montserrat, sans-serif", marginBottom: 10,
        }}>
          Получить полный доступ
        </a>
        <button onClick={onClose} style={{
          width: "100%", padding: "11px", borderRadius: 12,
          background: "transparent", border: "1.5px solid #e0e0d8",
          color: "#888", fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        }}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
