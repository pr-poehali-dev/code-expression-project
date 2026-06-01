import { useState } from "react";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";

const ACCENT = "#2DD4BF";
const ACCENT_DARK = "#14B8A6";
const DARK = "#080E1C";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

const PLANS = [
  { value: "free",     label: "Бесплатный доступ",                price: null,        discounted: null },
  { value: "practika", label: "Тариф «Практика»",                 price: "90 900 ₽",  discounted: "27 270 ₽" },
  { value: "premium",  label: "Тариф «Премиальная практика»",      price: "290 000 ₽", discounted: "87 000 ₽" },
  { value: "ekspert",  label: "Тариф «Про Диалог — Эксперт»",     price: "500 000 ₽", discounted: "150 000 ₽" },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 16px", borderRadius: 10,
  border: "1.5px solid rgba(255,255,255,0.1)", fontSize: 14,
  fontFamily: "Montserrat, sans-serif", outline: "none",
  boxSizing: "border-box", background: "rgba(255,255,255,0.05)",
  color: "#fff", transition: "border-color 0.15s",
};

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
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
      <Helmet>
        <title>Скоро открытие — Про Диалог</title>
        <meta name="description" content="Курсы платформы «Про Диалог» скоро появятся в постоянной продаже. Оставьте заявку сейчас и получите скидку 70% — после запуска такой цены не будет." />
      </Helmet>

      <BizNavbar />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "130px 24px 100px" }}>

        {/* Шапка */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)",
            borderRadius: 24, padding: "6px 18px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, animation: "cs-pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Курсы скоро в продаже
            </span>
          </div>

          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 700, lineHeight: 1.15,
            color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px",
          }}>
            Курсы выходят<br />
            <span style={{ color: ACCENT }}>в постоянную продажу</span>
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: "0 auto 10px", maxWidth: 520 }}>
            Платформа уже работает. Скоро курсы станут доступны для постоянной покупки по полной цене.
          </p>
          <p style={{ fontSize: "clamp(15px, 2vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Пока этого не произошло — у вас есть возможность зафиксировать цену со скидкой 70%.
          </p>
        </div>

        {/* Оффер-блок */}
        <div style={{
          background: "rgba(45,212,191,0.06)",
          border: "1px solid rgba(45,212,191,0.2)",
          borderRadius: 20, padding: "32px 36px", marginBottom: 24,
          boxShadow: "0 8px 40px rgba(45,212,191,0.08)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
            Специальная цена до запуска продаж
          </div>

          <h2 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 700, color: "#fff",
            margin: "0 0 22px", lineHeight: 1.2,
          }}>
            Зафиксируйте цену сейчас —<br />
            <span style={{ color: ACCENT }}>скидка 70% до старта продаж</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Оставьте заявку сейчас — когда курсы выйдут в продажу, вы получите доступ к выбранному тарифу со скидкой 70%.",
              "Это разовая возможность: после того как откроется постоянная продажа, цена станет полной навсегда.",
              "Никакого маркетинга — просто честная цена для тех, кто принял решение раньше других.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Форма / успех */}
        {sent ? (
          <div style={{
            background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)",
            borderRadius: 20, padding: "48px 40px", textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
              Заявка принята
            </h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Когда курсы выйдут в постоянную продажу — мы свяжемся с вами первыми и предоставим доступ со скидкой 70%.
            </p>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "36px 40px",
          }}>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
              Зафиксировать цену со скидкой 70%
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: 1.6 }}>
              Укажите интересующий тариф и контакт — как только откроется постоянная продажа, мы сразу напишем.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Выбор тарифа */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
                  Интересующий тариф
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PLANS.map(p => (
                    <label key={p.value} style={{
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                      padding: "12px 16px", borderRadius: 12,
                      border: `1.5px solid ${plan === p.value ? "rgba(45,212,191,0.4)" : "rgba(255,255,255,0.08)"}`,
                      background: plan === p.value ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.15s",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        border: `2px solid ${plan === p.value ? ACCENT : "rgba(255,255,255,0.2)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.15s",
                      }}>
                        {plan === p.value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />}
                      </div>
                      <input type="radio" value={p.value} checked={plan === p.value} onChange={() => setPlan(p.value)} style={{ display: "none" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: plan === p.value ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: plan === p.value ? 600 : 400 }}>{p.label}</div>
                        {p.price && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>{p.price}</span>
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
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Ваше имя <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>(необязательно)</span>
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Как вас зовут" style={inp}
                  onFocus={e => (e.target.style.borderColor = "rgba(45,212,191,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Контакт */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Телефон или Telegram <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  type="text" value={contact} onChange={e => setContact(e.target.value)}
                  placeholder="+7 999 000 00 00 или @username"
                  style={{ ...inp, borderColor: error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(45,212,191,0.5)")}
                  onBlur={e => (e.target.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}
                />
                {error && <div style={{ fontSize: 12, color: "#f87171", marginTop: 6 }}>{error}</div>}
              </div>

              {/* Чекбокс */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 2, accentColor: ACCENT, flexShrink: 0, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  Согласен с{" "}
                  <a href="/privacy" target="_blank" style={{ color: ACCENT, textDecoration: "none" }}>политикой конфиденциальности</a>
                  {" "}и{" "}
                  <a href="/offer" target="_blank" style={{ color: ACCENT, textDecoration: "none" }}>офертой</a>
                </span>
              </label>

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "15px 24px", borderRadius: 2, border: "none",
                  cursor: loading ? "default" : "pointer",
                  background: loading ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                  color: loading ? "rgba(255,255,255,0.4)" : DARK,
                  fontSize: 15, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(45,212,191,0.3)",
                  transition: "all 0.2s", letterSpacing: "0.3px",
                }}
                onMouseEnter={e => { if (!loading) { const el = e.currentTarget; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 28px rgba(45,212,191,0.4)"; }}}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = "translateY(0)"; el.style.boxShadow = loading ? "none" : "0 4px 20px rgba(45,212,191,0.3)"; }}
              >
                {loading ? "Отправляем..." : "Забронировать скидку 70%"}
              </button>
            </form>
          </div>
        )}

        {/* Дисклеймер */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", lineHeight: 1.7, margin: 0 }}>
            Скидка действует только для тех, кто оставил заявку <strong style={{ color: "rgba(255,255,255,0.35)" }}>до открытия постоянной продажи курсов</strong>.<br />
            После запуска доступ будет продаваться по полной цене — без акций и скидок.
          </p>
        </div>
      </main>

      <BizFooter />

      <style>{`
        @keyframes cs-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}