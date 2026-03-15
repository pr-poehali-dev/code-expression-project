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

const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

function ConsultForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !plan) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phone,
          message: `Тариф: ${plan}\nТелефон: ${phone}`,
        }),
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Заявка принята!</div>
        <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>Мы свяжемся с вами в течение рабочего дня и расскажем всё о доступе к платформе.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Мария Иванова" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Интересующий тариф</label>
        <select value={plan} onChange={e => setPlan(e.target.value)} required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", color: plan ? "#1a1a1a" : "#999" }}
        >
          <option value="" disabled>Выберите тариф</option>
          <option value="Базовый">Базовый — 150 000 ₽</option>
          <option value="Расширенный">Расширенный — 250 000 ₽</option>
          <option value="Полный">Полный — по запросу</option>
        </select>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Я согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
      <button type="submit"
        style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
      >
        {loading ? "Отправляем..." : "Оставить заявку на консультацию"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
    </form>
  );
}

export default function DokDialog() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <style>{`
        .dd-hero-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 64px;
          align-items: start;
        }
        .dd-hero-left { padding-top: 40px; }
        .dd-hero-right { padding-top: 40px; }
        .dd-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .dd-feature-card { padding: 32px 28px; }
        .dd-cta-block { padding: 64px 48px; }
        .dd-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .dd-split-col { padding: 56px 48px; }
        @media (max-width: 640px) {
          .dd-hero-grid { gap: 32px; }
          .dd-hero-left { padding-top: 0; }
          .dd-hero-right { padding-top: 0; }
          .dd-features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .dd-feature-card { padding: 24px 20px; }
          .dd-cta-block { padding: 36px 24px; }
          .dd-split-grid { grid-template-columns: 1fr; }
          .dd-split-col { padding: 32px 24px; }
        }
      `}</style>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="dd-hero-grid">
            {/* Left */}
            <div className="dd-hero-left">
              <FadeIn delay={0}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                  Образовательная платформа
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 28, letterSpacing: "-0.5px" }}>
                  Dok{" "}<span style={{ color: ACCENT }}>Диалог</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                  <p style={{ fontSize: "clamp(16px, 2.5vw, 18px)", lineHeight: 1.75, color: "#3a3a3a", margin: 0 }}>
                    <strong>Образовательная платформа</strong> для{" "}
                    <strong>специалистов</strong> системы <strong>МассоПро</strong>.
                  </p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Платформа объединяет структурированное онлайн-обучение, профессиональное сообщество и базу знаний — всё, что нужно мастеру массажа для роста.
                  </p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Доступ получают специалисты салонов и студий, подключённых к системе МассоПро.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <a
                  href="/tarify"
                  style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                >
                  Смотреть тарифы
                </a>
                <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "#999", lineHeight: 1.5 }}>
                  Доступ предоставляется специалистам салонов и частным мастерам
                </p>
              </FadeIn>
            </div>

            {/* Right — image */}
            <FadeIn delay={150} style={{ paddingTop: 0 }}>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)", aspectRatio: "4/5" }}>
                <img
                  src="https://cdn.poehali.dev/projects/08a371f8-54a3-463b-ba90-37bf9bcbd421/files/56f66ace-211a-4578-a447-96d5332b3eb0.jpg"
                  alt="Специалист Dok Диалог"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="dd-features-grid">
            {[
              { icon: "📚", title: "Онлайн-обучение", text: "Структурированные курсы от практикующих экспертов в удобном формате — смотри в любое время" },
              { icon: "👥", title: "Сообщество", text: "Закрытый клуб специалистов МассоПро: обмен опытом, разборы случаев, поддержка коллег" },
              { icon: "🗂️", title: "База знаний", text: "Методические материалы, протоколы, техники и рекомендации всегда под рукой" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="dd-feature-card"
                  style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease", cursor: "default", height: "100%", boxSizing: "border-box" as const }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 24px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{item.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: "#6a6a6a" }}>{item.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="dd-cta-block" style={{ background: ACCENT, borderRadius: 24, textAlign: "center", boxShadow: `0 16px 64px ${ACCENT_SHADOW}` }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
                Готовы начать обучение?
              </div>
              <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto 32px" }}>
                Три тарифа на любой запрос — от базового доступа до персонального сопровождения куратором. Подписка ежемесячная, без обязательств.
              </p>
              <a
                href="/tarify"
                style={{ display: "inline-block", background: "#fff", color: ACCENT, padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
              >
                Смотреть все тарифы →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Private practice block */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="dd-split-grid">
              <div className="dd-split-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                  Частная практика
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                  Работаете<br />на себя?
                </h2>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  Платформа Dok Диалог создана для мастеров салонов и студий системы МассоПро. Но если вы ведёте <strong>частную практику</strong> и хотите профессионально расти — мы готовы рассмотреть вашу заявку.
                </p>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                  Доступ к платформе предоставляется при <strong>наличии активной подписки</strong> на один из тарифов. Оставьте заявку — мы проконсультируем и поможем выбрать оптимальный план.
                </p>
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Онлайн-обучение в любое удобное время", "Актуальные техники и протоколы", "Поддержка профессионального сообщества"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, fontSize: 15 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#3a3a3a" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dd-split-col" style={{ background: "#f8f8f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Оставить заявку</div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>Заполните форму, и мы свяжемся с вами для консультации. Доступ предоставляется при покупке любого тарифа.</p>
                <ConsultForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
