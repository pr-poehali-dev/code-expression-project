import { useState } from "react";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

const CONTACTS = [
  { icon: "Phone", title: "Телефон", value: "+7 (902) 900-74-74", href: "tel:+79029007474" },
  { icon: "Mail", title: "Email", value: "massopro@mail.ru", href: "mailto:massopro@mail.ru" },
  { icon: "Send", title: "Telegram", value: "@prodialog", href: "https://t.me/prodialog" },
  { icon: "Globe", title: "Сайт", value: "promtdialog.ru", href: "https://promtdialog.ru" },
];

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%", padding: "12px 14px", borderRadius: 4,
  border: `1px solid ${focused ? TEAL : "#E2E8F0"}`,
  fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif",
  boxSizing: "border-box", color: DARK, background: "#fff",
  transition: "border-color 0.2s",
});

function MessageForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const f = (k: string) => setFocus(p => ({ ...p, [k]: true }));
  const b = (k: string) => setFocus(p => ({ ...p, [k]: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Необходимо дать согласие на обработку данных"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="CheckCircle" size={26} style={{ color: TEAL }} />
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>Сообщение отправлено</h3>
        <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>Ответим в течение рабочего дня. Обычно быстрее.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" required
          style={inputStyle(!!focus.name)} onFocus={() => f("name")} onBlur={() => b("name")} />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Телефон или email</label>
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+7 (___) ___-__-__ или email@mail.ru" required
          style={inputStyle(!!focus.contact)} onFocus={() => f("contact")} onBlur={() => b("contact")} />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Сообщение</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Расскажите, чем мы можем помочь..." rows={4} required
          style={{ ...inputStyle(!!focus.msg), resize: "vertical" as const }}
          onFocus={() => f("msg")} onBlur={() => b("msg")} />
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <div onClick={() => setAgreed(!agreed)} style={{
          width: 18, height: 18, borderRadius: 2, flexShrink: 0, marginTop: 1,
          border: `1.5px solid ${agreed ? TEAL : "#CBD5E1"}`,
          background: agreed ? TEAL : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", cursor: "pointer",
        }}>
          {agreed && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
        </div>
        <span style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>
          Я согласен(а) на обработку персональных данных в соответствии с{" "}
          <a href="/privacy" style={{ color: TEAL, textDecoration: "none", fontWeight: 500 }}>политикой конфиденциальности</a>
        </span>
      </label>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#BE123C" }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      <button type="submit" disabled={loading || !agreed} style={{
        padding: "14px", borderRadius: 4, border: "none",
        background: loading || !agreed ? "#E2E8F0" : `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
        color: loading || !agreed ? GRAY : DARK,
        fontSize: 14, fontWeight: 600, cursor: loading || !agreed ? "not-allowed" : "pointer",
        fontFamily: "Inter, sans-serif", letterSpacing: "0.3px", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {loading
          ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Отправляю...</>
          : <><Icon name="Send" size={15} /> Отправить сообщение</>
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

export default function Kontakty() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2D2A 100%)", padding: "120px 32px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Контакты</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Связаться с Про Диалог
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.55)", margin: 0, fontWeight: 300, lineHeight: 1.7, maxWidth: 520 }}>
            Хотите узнать, как увеличить возврат клиентов и загрузку мастеров? Напишите — разберём ситуацию вашего салона.
          </p>
        </div>
      </section>

      {/* Contacts + Form */}
      <section style={{ padding: "72px 32px 96px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }} className="contacts-grid">

          {/* Left: contact cards */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20 }}>Способы связи</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONTACTS.map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff", borderRadius: 4, padding: "20px 24px",
                    border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16,
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = TEAL; el.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#E2E8F0"; el.style.transform = "translateX(0)"; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 4, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={c.icon} size={20} style={{ color: TEAL }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: DARK, fontFamily: SERIF }}>{c.value}</div>
                    </div>
                    <Icon name="ArrowRight" size={16} style={{ color: "#CBD5E1", marginLeft: "auto" }} />
                  </div>
                </a>
              ))}
            </div>

            {/* Info block */}
            <div style={{ marginTop: 24, background: DARK, borderRadius: 4, padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEAL, marginBottom: 10 }}>Время ответа</div>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 300 }}>
                По вопросам платформы и тарифов отвечаем в течение рабочего дня, обычно быстрее.
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
                Пн–Пт · 9:00–18:00 МСК
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ background: "#fff", borderRadius: 4, padding: "32px", border: "1px solid #E2E8F0" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 6px" }}>Написать нам</h2>
            <p style={{ fontSize: 14, color: GRAY, margin: "0 0 28px", fontWeight: 300 }}>Опишите задачу — разберёмся вместе</p>
            <MessageForm />
          </div>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .contacts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}