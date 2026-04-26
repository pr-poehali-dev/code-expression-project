import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import Icon from "@/components/ui/icon";

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

const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

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
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "hsl(185, 85%, 96%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "hsl(185, 85%, 32%)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
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
          <option value="Базовый">Базовый</option>
          <option value="Расширенный">Расширенный</option>
          <option value="Полный">Полный</option>
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
      <Helmet>
        <title>Dok Диалог — Развитие массажных салонов и мастеров</title>
        <meta name="description" content="Запускаем массажные услуги в салонах, оцениваем и развиваем компетенции мастеров. Онлайн и офлайн курсы для частной практики и просветительские программы." />
        <meta name="keywords" content="обучение массажу, онлайн курсы массажа, массажный салон, развитие массажистов, частная практика массаж" />
        <meta property="og:title" content="Dok Диалог — Развитие массажных салонов и мастеров" />
        <meta property="og:description" content="Запускаем массажные услуги в салонах, оцениваем и развиваем компетенции мастеров. Онлайн и офлайн курсы для частной практики." />
        <meta property="og:type" content="website" />
      </Helmet>
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
                  Развитие · Обучение · Практика
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
                    Запускаем массажные услуги в салонах, оцениваем работу мастеров и помогаем выстраивать стандарты качества.
                  </p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Для тех, кто ведёт частную практику — онлайн и офлайн курсы по выбору. Для широкой аудитории — точечные просветительские программы под конкретные запросы.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <a
                    href="/catalog"
                    style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                  >
                    Перейти в каталог
                  </a>
                  <a
                    href="/tarify"
                    style={{ display: "inline-block", background: "#fff", color: ACCENT, padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", transition: "all 0.25s ease", border: `1.5px solid ${ACCENT}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${ACCENT}08`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#fff"; el.style.transform = "translateY(0)"; }}
                  >
                    Тарифы для салонов
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right — image */}
            <FadeIn delay={150} style={{ paddingTop: 0 }}>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)", aspectRatio: "4/5" }}>
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/67379baf-e8d1-4cc5-af2c-b545fb2eb4af.jpg"
                  alt="Ресепшен массажного салона Dok Диалог"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 14 }}>Три направления работы</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>Выберите своё</h2>
            </div>
          </FadeIn>
          <div className="dd-features-grid">
            {[
              {
                icon: "Building2",
                label: "Для салонов",
                title: "Массажный салон",
                text: "Запускаем массажные услуги в вашем салоне: подбор и обучение мастеров, оценка компетенций, стандарты работы и контроль качества.",
                items: ["Запуск массажных услуг с нуля", "Оценка и обучение персонала", "Контроль качества и стандарты"],
                href: "/dlya-salonov",
                btnText: "Узнать подробнее",
                accent: ACCENT,
              },
              {
                icon: "UserCheck",
                label: "Для частной практики",
                title: "Частная практика",
                text: "Выбирайте онлайн или офлайн курсы из каталога самостоятельно. Техники, протоколы, развитие компетенций — всё в одном месте.",
                items: ["Онлайн-курсы в удобное время", "Офлайн интенсивы и практикумы", "Развитие профессиональных навыков"],
                href: "/catalog/private",
                btnText: "Смотреть каталог",
                accent: "hsl(270, 60%, 45%)",
              },
              {
                icon: "Lightbulb",
                label: "Для повседневной жизни",
                title: "Просветительские программы",
                text: "Точечные программы под конкретные запросы: снятие стресса, восстановление, работа с телом. Для тех, кто хочет заботиться о себе осознанно.",
                items: ["Практики снятия напряжения", "Программы восстановления", "Работа с телом и состоянием"],
                href: "/catalog/private?tab=point",
                btnText: "Смотреть программы",
                accent: "hsl(12, 80%, 45%)",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <a
                  href={item.href}
                  className="dd-feature-card"
                  style={{
                    display: "flex", flexDirection: "column",
                    background: "#fff", borderRadius: 20,
                    boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    height: "100%", boxSizing: "border-box" as const,
                    textDecoration: "none", color: "inherit",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 24px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: item.accent, marginBottom: 14, background: `${item.accent}12`, borderRadius: 100, padding: "4px 12px" }}>{item.label}</div>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <Icon name={item.icon} size={26} style={{ color: item.accent }} />
                    </div>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{item.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.65, color: "#6a6a6a", marginBottom: 20 }}>{item.text}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {item.items.map((pt, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: item.accent, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 13, color: "#3a3a3a" }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: item.accent, fontSize: 14, fontWeight: 600 }}>
                    {item.btnText}
                    <Icon name="ArrowRight" size={14} style={{ color: item.accent }} />
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Salons CTA */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="dd-cta-block" style={{ background: ACCENT, borderRadius: 24, textAlign: "center", boxShadow: `0 16px 64px ${ACCENT_SHADOW}` }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
                Хотите запустить массаж в своём салоне?
              </div>
              <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, maxWidth: 560, margin: "0 auto 32px" }}>
                Поможем с подбором мастеров, обучением, оценкой компетенций и выстраиванием стандартов работы. Свяжитесь с нами — расскажем, как это работает.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="/tarify"
                  style={{ display: "inline-block", background: "#fff", color: ACCENT, padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
                >
                  Тарифы для салонов →
                </a>
                <a
                  href="/catalog"
                  style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", border: "1px solid rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.22)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.15)"; el.style.transform = "translateY(0)"; }}
                >
                  Войти в систему
                </a>
              </div>
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
                  Ведёте<br />частную практику?
                </h2>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  Самостоятельно выбирайте курсы из каталога — онлайн или офлайн. Техники, протоколы, развитие компетенций — всё доступно без привязки к салону.
                </p>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                  Оставьте заявку — мы подберём подходящий формат и расскажем о доступных программах.
                </p>
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Онлайн-курсы в любое удобное время", "Офлайн интенсивы и практикумы", "Точечные программы под конкретный запрос"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, fontSize: 15 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#3a3a3a" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <a
                    href="/catalog/private"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT, color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
                  >
                    Перейти в каталог
                    <Icon name="ArrowRight" size={14} />
                  </a>
                </div>
              </div>
              <div className="dd-split-col" style={{ background: "#f8f8f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Оставить заявку</div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>Заполните форму, и мы свяжемся с вами для консультации по доступным программам.</p>
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