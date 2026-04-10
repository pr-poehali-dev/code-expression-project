import { useState } from "react";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, BG, h2style } from "./CoiShared";

const FUNC_URL = "https://functions.poehali.dev/216742a2-a6fb-41bc-82a3-c2d554025422";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: "1.5px solid #e0e0dc",
  background: "#fff",
  fontSize: 15,
  fontFamily: "Montserrat, sans-serif",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.18s",
};

export default function CoiContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Необходимо согласиться с политикой обработки данных");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(FUNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: "80px 0", background: BG }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ ...h2style, textAlign: "center" }}>Узнать про ближайшую группу</h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: 15, margin: "-20px 0 40px", lineHeight: 1.6 }}>
          Оставьте заявку — мы уточним дату ближайшего интенсива и ответим на ваши вопросы
        </p>

        {sent ? (
          <div style={{
            background: "#fff", borderRadius: 18, padding: "48px 36px",
            textAlign: "center", border: `2px solid ${ACCENT}`,
            boxShadow: `0 4px 24px ${ACCENT_SHADOW}`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, margin: "0 0 12px" }}>
              Заявка отправлена!
            </h3>
            <p style={{ color: "#666", fontSize: 15, margin: 0 }}>
              Мы свяжемся с вами в ближайшее время и расскажем про дату и место проведения интенсива.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: "#fff", borderRadius: 18, padding: "40px 36px",
            border: "1px solid #e8e8e4", boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Имя *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="Как вас зовут"
                  required
                  style={{ ...inputStyle, borderColor: focused === "name" ? ACCENT : "#e0e0dc" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Телефон *</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="+7 (___) ___-__-__"
                  required
                  style={{ ...inputStyle, borderColor: focused === "phone" ? ACCENT : "#e0e0dc" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="your@email.ru"
                  required
                  style={{ ...inputStyle, borderColor: focused === "email" ? ACCENT : "#e0e0dc" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Сообщение *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  placeholder="Уточните дату ближайшей группы, есть ли свободные места, условия..."
                  required
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100, borderColor: focused === "message" ? ACCENT : "#e0e0dc" }}
                />
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, accentColor: ACCENT, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
                />
                <span style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                  Я согласен(а) на обработку персональных данных в соответствии с политикой конфиденциальности
                </span>
              </label>

              {error && (
                <div style={{ fontSize: 13, color: "#e53e3e", background: "#fff5f5", borderRadius: 8, padding: "10px 14px", border: "1px solid #feb2b2" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 32px", borderRadius: 12, border: "none",
                  background: loading ? "#aaa" : ACCENT,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: loading ? "none" : `0 6px 20px ${ACCENT_SHADOW}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DARK; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
              >
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
