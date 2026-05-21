import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

export default function LkLogin() {
  const { login } = useLkAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f8f6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Montserrat, sans-serif", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Лого */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, boxShadow: `0 8px 24px hsla(185,85%,32%,0.3)`,
          }}>
            <Icon name="BookOpen" size={28} style={{ color: "#fff" }} />
          </div>
          <div style={{ fontSize: 13, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            DOK ДИАЛОГ
          </div>
          <h1 style={{
            fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700,
            color: "#1a1a1a", margin: 0,
          }}>
            Личный кабинет
          </h1>
          <p style={{ fontSize: 14, color: "#777", marginTop: 8 }}>
            Профессиональные инструменты специалиста
          </p>
        </div>

        {/* Карточка входа */}
        <form onSubmit={handleSubmit} style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Введите логин"
              required
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1.5px solid #e0e0dc", fontSize: 15, outline: "none",
                fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = ACCENT}
              onBlur={e => e.target.style.borderColor = "#e0e0dc"}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
              Пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                style={{
                  width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10,
                  border: "1.5px solid #e0e0dc", fontSize: 15, outline: "none",
                  fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = ACCENT}
                onBlur={e => e.target.style.borderColor = "#e0e0dc"}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 4, color: "#999",
                }}
              >
                <Icon name={showPw ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10,
              padding: "10px 14px", marginBottom: 20, fontSize: 14, color: "#dc2626",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: loading ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
              color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : `0 6px 20px hsla(185,85%,32%,0.3)`,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 24 }}>
          Доступ предоставляется вручную. По вопросам — свяжитесь с нами.
        </p>
      </div>
    </div>
  );
}