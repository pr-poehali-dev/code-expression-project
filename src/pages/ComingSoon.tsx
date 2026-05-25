import { useState } from "react";
import { Helmet } from "@/lib/helmet";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 24%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

const PLANS = [
  { value: "free",     label: "Бесплатный доступ",                   price: null,        discounted: null },
  { value: "practika", label: "Тариф «Практика»",                    price: "90 900 ₽",  discounted: "27 270 ₽" },
  { value: "premium",  label: "Тариф «Премиальная практика»",         price: "290 000 ₽", discounted: "87 000 ₽" },
  { value: "ekspert",  label: "Тариф «Dok Диалог — Эксперт»",        price: "500 000 ₽", discounted: "150 000 ₽" },
];

export default function ComingSoon() {
  const [contact, setContact] = useState("");
  const [plan, setPlan] = useState("practika");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) { setError("Укажите телефон или Telegram"); return; }
    if (!agreed) { setError("Необходимо согласие с политикой конфиденциальности"); return; }
    setLoading(true); setError("");
    try {
      const selectedPlan = PLANS.find(p => p.value === plan)?.label ?? plan;
      await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "не указано",
          contact: contact.trim(),
          message: `🎯 Ранняя заявка — скидка 70%\nТариф: ${selectedPlan}`,
        }),
      });
      setSent(true);
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Скоро открытие — Dok Диалог</title>
        <meta name="description" content="Платформа Dok Диалог скоро откроется. Оставьте заявку сейчас и получите скидку 70% — это единственная акция, которая будет." />
      </Helmet>

      <DokNavbar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Шапка */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`,
            borderRadius: 24, padding: "6px 16px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Скоро открытие
            </span>
          </div>

          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700, lineHeight: 1.15,
            color: "#1a1a1a", margin: "0 0 20px",
          }}>
            Платформа готовится<br />
            <span style={{ color: ACCENT }}>к запуску</span>
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#5a5a5a", lineHeight: 1.8, margin: "0 auto 12px", maxWidth: 580 }}>
            Мы финально настраиваем все инструменты, чтобы с первого дня вы получили полноценный доступ к системе.
          </p>
          <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#5a5a5a", lineHeight: 1.8, margin: 0, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            Но пока платформа ещё не открылась — у вас есть редкая возможность.
          </p>
        </div>

        {/* Блок с оффером */}
        <div style={{
          background: "linear-gradient(135deg, #1a2a2a, #0f1a1a)",
          borderRadius: 24, padding: "36px 40px", marginBottom: 36,
          border: `1px solid ${ACCENT}30`,
          boxShadow: `0 8px 40px ${ACCENT_SHADOW}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
            Только для ранних участников
          </div>

          <h2 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 700, color: "#fff",
            margin: "0 0 20px", lineHeight: 1.2,
          }}>
            Оставьте заявку сейчас —<br />
            <span style={{ color: `hsl(185,60%,70%)` }}>получите скидку 70%</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Когда платформа откроется — вы получите доступ к выбранному тарифу со скидкой 70% от стоимости.",
              "Это не маркетинговый ход и не временная акция. Это наш способ сказать спасибо тем, кто поверил нам до старта.",
              "Подобных скидок больше не будет никогда. Ни на запуске, ни после — цена останется полной.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${ACCENT}25`, border: `1px solid ${ACCENT}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(232,232,232,0.8)", lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Форма */}
        {sent ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "48px 40px",
            textAlign: "center", boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
            border: `1px solid ${ACCENT}20`,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${ACCENT}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
              Заявка принята
            </h3>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Когда платформа откроется — мы свяжемся с вами первыми и предоставим доступ со скидкой 70%.
            </p>
          </div>
        ) : (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "36px 40px",
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
            border: `1px solid #e8e8e4`,
          }}>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
              Оставить заявку
            </h3>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px", lineHeight: 1.6 }}>
              Укажите желаемый тариф и контакт — мы напишем вам при открытии.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Выбор тарифа */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
                  Интересующий тариф
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PLANS.map(p => (
                    <label key={p.value} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${plan === p.value ? ACCENT : "#e8e8e4"}`, background: plan === p.value ? `${ACCENT}08` : "#fafafa", transition: "all 0.15s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${plan === p.value ? ACCENT : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                        {plan === p.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />}
                      </div>
                      <input type="radio" value={p.value} checked={plan === p.value} onChange={() => setPlan(p.value)} style={{ display: "none" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: plan === p.value ? "#1a1a1a" : "#555", fontWeight: plan === p.value ? 600 : 400 }}>{p.label}</div>
                        {p.price && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                            <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>{p.price}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{p.discounted} со скидкой 70%</span>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Имя */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Ваше имя <span style={{ color: "#bbb", fontWeight: 400 }}>(необязательно)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Как вас зовут"
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid #e8e8e4", fontSize: 14, fontFamily: "Montserrat, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                  onFocus={e => (e.target.style.borderColor = ACCENT)}
                  onBlur={e => (e.target.style.borderColor = "#e8e8e4")}
                />
              </div>

              {/* Контакт */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Телефон или Telegram <span style={{ color: "#e55" }}>*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="+7 999 000 00 00 или @username"
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${error ? "#e55" : "#e8e8e4"}`, fontSize: 14, fontFamily: "Montserrat, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                  onFocus={e => (e.target.style.borderColor = ACCENT)}
                  onBlur={e => (e.target.style.borderColor = error ? "#e55" : "#e8e8e4")}
                />
                {error && <div style={{ fontSize: 12, color: "#e55", marginTop: 6 }}>{error}</div>}
              </div>

              {/* Чекбокс */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, accentColor: ACCENT, flexShrink: 0, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                  Согласен с{" "}
                  <a href="/privacy" target="_blank" style={{ color: ACCENT, textDecoration: "none" }}>политикой конфиденциальности</a>
                  {" "}и{" "}
                  <a href="/offer" target="_blank" style={{ color: ACCENT, textDecoration: "none" }}>офертой</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "15px 24px", borderRadius: 14,
                  border: "none", cursor: loading ? "default" : "pointer",
                  background: loading ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: loading ? "none" : `0 4px 20px ${ACCENT_SHADOW}`,
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Отправляем..." : "Забронировать скидку 70%"}
              </button>
            </form>
          </div>
        )}

        {/* Дисклеймер */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
            Скидка действует только для тех, кто оставил заявку <strong style={{ color: "#888" }}>до открытия платформы</strong>.<br />
            После запуска цены будут полными и никаких скидок больше не будет.
          </p>
        </div>
      </main>

      <DokFooter />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}