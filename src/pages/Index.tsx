import { useEffect, useRef, useState } from "react";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/1497cb0f-9443-4357-bd10-0eed4cebff43.jpg";

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

function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !interest) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
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
        <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>Мы свяжемся с вами в течение рабочего дня и расскажем всё о платформе.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Golos Text, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Golos Text, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Интересующий продукт</label>
        <select value={interest} onChange={e => setInterest(e.target.value)} required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "Golos Text, sans-serif", color: interest ? "#1a1a1a" : "#999" }}
        >
          <option value="" disabled>Выберите направление</option>
          <option value="CRM">CRM и продажи</option>
          <option value="Analytics">Финансовая аналитика</option>
          <option value="Tasks">Управление задачами</option>
          <option value="Full">Полный пакет</option>
        </select>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Я согласен с <a href="#" style={{ color: ACCENT }}>политикой конфиденциальности</a> и <a href="#" style={{ color: ACCENT }}>офертой</a>
        </span>
      </label>
      <button type="submit"
        style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Golos Text, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
      >
        {loading ? "Отправляем..." : "Оставить заявку на консультацию"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
    </form>
  );
}

const FEATURES = [
  { icon: "⚡", title: "Быстрый запуск", text: "Внедрите инструменты в бизнес за 1 день без найма разработчиков и долгих настроек." },
  { icon: "📊", title: "Аналитика в реальном времени", text: "Следите за ключевыми показателями в едином дашборде — без Excel и ручной сводки." },
  { icon: "👥", title: "Командная работа", text: "Управляйте сотрудниками, задачами и доступами из одной точки. Всё под контролем." },
];

const STATS = [
  { num: "500+", label: "Компаний используют" },
  { num: "3.4×", label: "Рост производительности" },
  { num: "24/7", label: "Поддержка и мониторинг" },
  { num: "14 дн", label: "Бесплатный пробный период" },
];

const Index = () => {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Golos Text, sans-serif", minHeight: "100vh" }}>
      <style>{`
        .biz-hero-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 64px;
          align-items: start;
        }
        .biz-hero-left { padding-top: 40px; }
        .biz-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .biz-feature-card { padding: 32px 28px; }
        .biz-cta-block { padding: 64px 48px; }
        .biz-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .biz-split-col { padding: 56px 48px; }
        .biz-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .biz-hero-grid { gap: 32px; }
          .biz-hero-left { padding-top: 0; }
          .biz-features-grid { grid-template-columns: 1fr; gap: 16px; }
          .biz-feature-card { padding: 24px 20px; }
          .biz-cta-block { padding: 36px 24px; }
          .biz-split-grid { grid-template-columns: 1fr; }
          .biz-split-col { padding: 32px 24px; }
          .biz-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <BizNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="biz-hero-grid">
            <div className="biz-hero-left">
              <FadeIn delay={0}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
                  B2B платформа
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 28, letterSpacing: "-0.5px" }}>
                  Biz <span style={{ color: ACCENT }}>Tools</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                  <p style={{ fontSize: "clamp(16px, 2.5vw, 18px)", lineHeight: 1.75, color: "#3a3a3a", margin: 0 }}>
                    <strong>Профессиональная платформа</strong> для <strong>предпринимателей</strong> и команд.
                  </p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Объединяем автоматизацию, аналитику и управление командой — всё, что нужно для роста бизнеса в одном месте.
                  </p>
                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
                    Доступ получают компании и индивидуальные предприниматели, подключённые к экосистеме BizTools.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="#pricing"
                    style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                  >
                    Смотреть тарифы
                  </a>
                  <a href="#about"
                    style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", border: `1.5px solid ${ACCENT}`, transition: "all 0.25s ease" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(0,168,150,0.06)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
                  >
                    Узнать больше
                  </a>
                </div>
                <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "#999", lineHeight: 1.5 }}>
                  Доступ предоставляется бизнесам и частным предпринимателям
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={150}>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)", aspectRatio: "4/5", position: "relative" }}>
                <img
                  src={HERO_IMAGE}
                  alt="B2B инструменты для бизнеса"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 20, left: -16, background: "#fff", borderRadius: 14, padding: "12px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #ece9e0", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📈</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Рост выручки</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: ACCENT }}>+34% за квартал</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="platform" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>
                Преимущества
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
                Почему выбирают <span style={{ color: ACCENT }}>BizTools</span>
              </h2>
            </div>
          </FadeIn>
          <div className="biz-features-grid">
            {FEATURES.map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="biz-feature-card"
                  style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease", cursor: "default", height: "100%", boxSizing: "border-box" }}
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

      {/* CTA Banner */}
      <section id="pricing" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="biz-cta-block" style={{ background: ACCENT, borderRadius: 24, textAlign: "center", boxShadow: `0 16px 64px ${ACCENT_SHADOW}` }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
                Готовы запустить бизнес-инструменты?
              </div>
              <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto 32px" }}>
                Три тарифа на любой запрос — от базовой CRM до полного пакета с аналитикой. Подписка ежемесячная, без обязательств.
              </p>
              <a
                href="#contact"
                style={{ display: "inline-block", background: "#fff", color: ACCENT, padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
              >
                Оставить заявку →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About + Stats */}
      <section id="about" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="biz-split-grid">
              <div className="biz-split-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
                  О платформе
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                  Всё для роста<br />вашего бизнеса
                </h2>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  BizTools — экосистема B2B инструментов для предпринимателей, которые хотят управлять бизнесом системно: с данными, автоматизацией и командой.
                </p>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                  Объединяем CRM, финансовую аналитику, управление задачами и базу знаний — в одном рабочем пространстве без лишних интеграций.
                </p>
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Единый дашборд для всех метрик", "Автоматические отчёты и уведомления", "Интеграция с банками и 1С"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, fontSize: 15 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#3a3a3a" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="biz-split-col" style={{ background: "#f8f8f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Результаты клиентов
                </div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>
                  Средние показатели компаний после 3 месяцев использования платформы.
                </p>
                <div className="biz-stats-grid">
                  {STATS.map((s) => (
                    <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "24px 16px", textAlign: "center", border: "1px solid #e8e8e4" }}>
                      <p style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, color: ACCENT, margin: "0 0 4px" }}>{s.num}</p>
                      <p style={{ fontSize: 12, color: "#777", margin: 0, lineHeight: 1.4 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="biz-split-grid">
              <div className="biz-split-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
                  Начать работу
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                  Готовы начать?
                </h2>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                  Оставьте заявку — мы проконсультируем, подберём оптимальный тариф и поможем с внедрением за один рабочий день.
                </p>
                <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                  Доступ предоставляется при <strong>наличии активной подписки</strong> на один из тарифов.
                </p>
              </div>
              <div className="biz-split-col" style={{ background: "#f8f8f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Оставить заявку
                </div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>
                  Заполните форму, и мы свяжемся с вами для консультации.
                </p>
                <LeadForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <BizFooter />
    </div>
  );
};

export default Index;
