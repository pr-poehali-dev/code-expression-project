import { useState } from "react";
import { GOLD, GOLD_LIGHT, DARK, DARK2, DARK3, TEXT_SUB, FadeIn, GoldLine, SEND_URL } from "./PraktikaShared";

function ApplicationForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Заявка на тариф «Практика» 90 900 ₽. Контакт: ${contact}` }) });
      if (res.ok) setSent(true); else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: GOLD_LIGHT, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.75 }}>Свяжемся с вами в течение рабочего дня и обсудим доступ к программе.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
    background: "rgba(255,255,255,0.05)", color: "#fff",
    transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[{ l: "Имя", v: name, s: setName, p: "Ваше имя" }, { l: "Телефон или Telegram", v: contact, s: setContact, p: "+7 или @username" }].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SUB, marginBottom: 6, letterSpacing: "0.06em" }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}80`)}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>
      ))}
      <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: GOLD }} />
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: GOLD }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: GOLD }} target="_blank">офертой</a></span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ff6b6b" }}>{error}</p>}
      <button type="submit"
        style={{ background: GOLD, color: DARK, padding: "15px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat, sans-serif", letterSpacing: "0.04em" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Получить доступ"}</button>
    </form>
  );
}

export default function PraktikaApplication() {
  return (
    <section id="application" style={{ padding: "80px 0 100px", background: DARK2 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="pr-price-grid">
          <FadeIn>
            <div>
              <GoldLine />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 16 }}>Тариф</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 42, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>«Практика»</h2>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>90 900 ₽</div>
              <div style={{ fontSize: 13, color: TEXT_SUB, marginBottom: 36 }}>Доступ 12 месяцев</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {["Все 9 модулей программы", "Диагностические техники", "Работа с мышлением и ограничениями", "Привлечение и работа с клиентами", "Ценообразование и премиум-аудитория", "Видеоуроки, материалы и схемы"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div style={{ background: DARK3, borderRadius: 20, padding: "36px 32px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_SUB, marginBottom: 24 }}>Получить доступ к программе</div>
              <ApplicationForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
