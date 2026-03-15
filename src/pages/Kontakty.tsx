import { useEffect, useRef, useState } from "react";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

const ICONS: Record<string, React.ReactNode> = {
  phone: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12.07 19.79 19.79 0 0 1 1.49 3.4 2 2 0 0 1 3.47 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.66a16 16 0 0 0 6 6l.56-.56a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.21 16.92z" />
    </svg>
  ),
  email: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  telegram: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.073l3.9 1.205 2.306 6.54a.75.75 0 0 0 1.302.21l2.13-2.743 4.14 3.102a2.25 2.25 0 0 0 3.494-1.467l2.25-16.5a2.25 2.25 0 0 0-2.126-2.135z" />
    </svg>
  ),
  web: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

function ContactCard({
  iconKey, title, value, sub, href, delay,
}: {
  iconKey: string; title: string; value: string; sub?: string; href?: string; delay?: number;
}) {
  return (
    <FadeIn delay={delay ?? 0}>
      <a
        href={href ?? "#"}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            background: "#fff", borderRadius: 20, padding: "28px 24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            height: "100%", boxSizing: "border-box", cursor: href ? "pointer" : "default",
          }}
          onMouseEnter={e => {
            if (!href) return;
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "translateY(-4px)";
            el.style.boxShadow = `0 12px 48px ${ACCENT_SHADOW}`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
          }}
        >
          <div style={{ color: ACCENT, marginBottom: 16, lineHeight: 0 }}>{ICONS[iconKey]}</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: ACCENT, marginBottom: sub ? 6 : 0, lineHeight: 1.2 }}>
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{sub}</div>
          )}
        </div>
      </a>
    </FadeIn>
  );
}

const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

function MessageForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true);
    setError("");
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
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Сообщение отправлено!</div>
        <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>Мы ответим вам в течение рабочего дня. Обычно — быстрее.</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Мария Иванова" required
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон или email</label>
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+7 (___) ___-__-__ или email@mail.ru" required
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Сообщение</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Расскажите, чем мы можем помочь..."
          rows={4} required
          style={{ ...inputStyle, resize: "vertical" as const }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <button type="submit"
        style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
      >
        {loading ? "Отправляем..." : "Отправить сообщение"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Я согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
    </form>
  );
}

export default function Kontakty() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <style>{`
        .k-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .k-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .k-form-col { padding: 56px 48px; }
        .k-info-col { padding: 56px 48px; }
        @media (max-width: 640px) {
          .k-cards-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .k-form-grid { grid-template-columns: 1fr; }
          .k-form-col { padding: 32px 24px; }
          .k-info-col { padding: 32px 24px; }
        }
        @media (max-width: 400px) {
          .k-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
              Контакты
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 20, letterSpacing: "-0.5px" }}>
              Свяжитесь с нами
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{ fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", maxWidth: 560, margin: 0 }}>
              Есть вопрос по платформе, тарифам или партнёрской программе? Выберите удобный способ — ответим быстро.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact cards */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="k-cards-grid">
            <ContactCard iconKey="phone" title="Телефон" value="+7 (902) 900-74-74" sub="Пн–Пт, 9:00–18:00" href="tel:+79029007474" delay={0} />
            <ContactCard iconKey="email" title="Электронная почта" value="massopro@mail.ru" sub="Ответим в течение 24 часов" href="mailto:massopro@mail.ru" delay={100} />
            <ContactCard iconKey="telegram" title="Telegram" value="@SergeuVodopianov" sub="Быстрый ответ" href="https://t.me/SergeuVodopianov" delay={200} />
            <ContactCard iconKey="web" title="Основной сайт" value="massopro.ru" sub="Вся информация о системе МассоПро" href="https://massopro.ru" delay={300} />
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="k-form-grid">

            {/* Left — form */}
            <div className="k-form-col">
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                Напишите нам
              </div>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>
                Заполните форму, и мы свяжемся с вами в удобное время.
              </p>
              <MessageForm />
            </div>

            {/* Right — info */}
            <div className="k-info-col" style={{ background: "#1a1a1a", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                  Dok Диалог
                </div>
                <p style={{ fontSize: "clamp(14px, 2vw, 15px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 36 }}>
                  Образовательная платформа для специалистов системы МассоПро. Онлайн-обучение мастеров салонов и студий массажа.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { label: "Телефон", value: "+7 (902) 900-74-74", href: "tel:+79029007474" },
                    { label: "Email", value: "massopro@mail.ru", href: "mailto:massopro@mail.ru" },
                    { label: "Telegram", value: "@SergeuVodopianov", href: "https://t.me/SergeuVodopianov" },
                    { label: "Режим работы", value: "Пн–Пт, 9:00–18:00", href: undefined },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                          style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#fff", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = `hsl(185, 85%, 65%)`)}
                          onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#fff" }}>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  ИП Водопьянов С.Г.<br />
                  ОГРНИП: 321508100047334
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}