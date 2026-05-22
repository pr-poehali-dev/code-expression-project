import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function ApplicationForm({ plan }: { plan: string }) {
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
      const res = await fetch(SEND_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message: `Заявка на тариф: ${plan}. Контакт: ${contact}` }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "28px 16px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: ACCENT }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Свяжемся с вами в течение рабочего дня.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { label: "Имя", value: name, onChange: setName, placeholder: "Ваше имя" },
        { label: "Телефон или Telegram", value: contact, onChange: setContact, placeholder: "+7 или @username" },
      ].map(f => (
        <div key={f.label}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 5 }}>{f.label}</label>
          <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} required
            style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat, sans-serif" }}
            onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
            onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
          />
        </div>
      ))}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, accentColor: ACCENT, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a></span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#e53e3e" }}>{error}</p>}
      <button type="submit"
        style={{ background: ACCENT, color: "#fff", padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Подать заявку"}</button>
    </form>
  );
}

const PLANS = [
  {
    id: "free",
    label: "Бесплатно",
    title: "Вход в профессию нового уровня",
    price: "Бесплатно",
    priceNote: null,
    access: null,
    accent: "#4a7a7a",
    dark: false,
    featured: false,
    cta: "Получить бесплатный доступ",
    forWhom: [
      "Начинающие специалисты",
      "Практики в хаосе",
      "Те, кто не умеет дорого продавать",
      "Специалисты без системы",
    ],
    includes: [
      "Видео: почему специалисты годами не растут",
      "Ошибки работы «за дёшево»",
      "Как выглядит премиальная практика",
      "Почему клиент покупает состояние специалиста",
      "Разборы реальных кейсов",
      "Демонстрация инструментов платформы",
      "Знакомство с тарифами и путём развития",
    ],
    goal: "Познакомиться с подходом, мышлением и системой «Dok Диалог».",
  },
  {
    id: "practika",
    label: "Тариф 1",
    title: "Практика",
    price: "90 900 ₽",
    priceNote: "Доступ 12 месяцев",
    access: "12 месяцев",
    accent: ACCENT,
    dark: false,
    featured: false,
    cta: "Подробнее о тарифе",
    forWhom: [
      "Хотят выйти из хаоса",
      "Начать вести частную практику",
      "Работать с платёжеспособной аудиторией",
      "Уверенно продавать свои услуги",
    ],
    includes: [
      "Мышление специалиста: страх денег, синдром самозванца, уверенность",
      "Привлечение клиентов: личный бренд, доверие, упаковка",
      "Работа с премиальным клиентом: коммуникация, статус, подача",
      "Ценообразование: как повысить чек и перестать работать «за дёшево»",
      "Диагностические техники: анализ состояния клиента",
      "Практические техники: стабилизация, стресс, телесные методы",
    ],
    goal: "Выстроить систему, повысить чек, получить структуру работы с клиентами.",
  },
  {
    id: "premium",
    label: "Тариф 2",
    title: "Премиальная практика",
    price: "290 000 ₽",
    priceNote: "Обучение 24 мес · инструменты 3 мес",
    access: "24 месяца",
    accent: "#1a2a2a",
    dark: true,
    featured: true,
    cta: "Подать заявку",
    forWhom: [
      "Хотят выйти на высокий чек",
      "Работать с премиальными клиентами",
      "Выстроить сильную частную практику",
      "Внедрить современные инструменты и ИИ",
    ],
    includes: [
      "Всё из тарифа «Практика»",
      "Доступ ко всем онлайн-инструментам на 3 месяца",
      "ИИ-анализатор клиента",
      "Интерактивная карта тела",
      "Диагностические системы и конструктор техник",
      "Система сопровождения клиента",
      "Внутренний чат: общение, поддержка, разборы",
      "5 личных встреч: стратегия, мышление, кейсы",
    ],
    goal: "Выйти на новый уровень практики, работать системно, повысить стоимость услуг.",
  },
  {
    id: "expert",
    label: "Тариф 3",
    title: "Dok Диалог — Эксперт",
    price: "500 000 ₽",
    priceNote: "Доступ без ограничений",
    access: "Без ограничений",
    accent: "#0d1a1a",
    dark: true,
    featured: false,
    cta: "Подать заявку",
    forWhom: [
      "Хотят создать сильную премиальную практику",
      "Работать на высоком уровне",
      "Использовать все инструменты без ограничений",
      "Иметь длительное сопровождение",
    ],
    includes: [
      "Всё из тарифа «Премиальная практика»",
      "Безлимитный доступ ко всем инструментам",
      "ИИ, диагностика, аналитика — без ограничений по времени",
      "Все обновления платформы навсегда",
      "Безлимитный доступ ко всему обучению",
      "10 личных встреч: стратегия, масштабирование, трансформация",
      "Разбор сложных ситуаций и профессиональный рост",
    ],
    goal: "Сформировать устойчивую дорогую практику с интеллектуальной системой работы.",
  },
];

function PlanCard({ plan, onApply }: { plan: typeof PLANS[0]; onApply: (title: string) => void }) {
  const [hovered, setHovered] = useState(false);

  const cardBg = plan.dark ? plan.accent : "#fff";
  const textColor = plan.dark ? "#fff" : "#1a1a1a";
  const subColor = plan.dark ? "rgba(255,255,255,0.6)" : "#666";
  const itemColor = plan.dark ? "rgba(255,255,255,0.75)" : "#444";
  const borderColor = plan.featured ? ACCENT : plan.dark ? "transparent" : "#e8e8e4";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        borderRadius: 20,
        border: `2px solid ${plan.featured ? ACCENT : borderColor}`,
        padding: "36px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.15)" : plan.featured ? `0 8px 40px ${ACCENT_SHADOW}` : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        position: "relative" as const,
      }}
    >
      {plan.featured && (
        <div style={{ position: "absolute" as const, top: -14, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" as const }}>
          ПОПУЛЯРНЫЙ ВЫБОР
        </div>
      )}

      {/* Шапка */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: plan.dark ? "rgba(255,255,255,0.4)" : "#aaa", marginBottom: 10 }}>
          {plan.label}
        </div>
        <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, color: textColor, margin: "0 0 16px", lineHeight: 1.2 }}>
          {plan.title}
        </h3>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: plan.price === "Бесплатно" ? 32 : "clamp(28px, 3vw, 36px)", fontWeight: 700, color: plan.dark ? "hsl(185,60%,70%)" : ACCENT, lineHeight: 1 }}>
          {plan.price}
        </div>
        {plan.access && (
          <div style={{ fontSize: 12, color: subColor, marginTop: 6 }}>{plan.priceNote}</div>
        )}
      </div>

      <div style={{ width: "100%", height: 1, background: plan.dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", marginBottom: 20 }} />

      {/* Для кого */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: plan.dark ? "rgba(255,255,255,0.4)" : "#aaa", marginBottom: 10 }}>
          Для кого
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {plan.forWhom.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: 13 }}>—</span>
              <span style={{ fontSize: 13, color: itemColor, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 1, background: plan.dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", marginBottom: 20 }} />

      {/* Что входит */}
      <div style={{ marginBottom: 24, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: plan.dark ? "rgba(255,255,255,0.4)" : "#aaa", marginBottom: 10 }}>
          Что входит
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {plan.includes.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
              <span style={{ fontSize: 13, color: itemColor, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Цель */}
      <div style={{ background: plan.dark ? "rgba(255,255,255,0.05)" : "#f8f8f6", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 12, color: subColor, lineHeight: 1.65, fontStyle: "italic" }}>{plan.goal}</p>
      </div>

      {/* CTA */}
      {plan.id === "free" ? (
        <a href="https://school.brossok.ru" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", textAlign: "center" as const, padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: `1.5px solid ${ACCENT}`, color: ACCENT, background: "transparent", fontFamily: "Montserrat, sans-serif" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `hsla(185,85%,32%,0.07)`; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
        >
          {plan.cta}
        </a>
      ) : plan.id === "practika" ? (
        <a href="/praktika"
          style={{ display: "block", textAlign: "center" as const, padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", background: ACCENT, color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
        >
          {plan.cta}
        </a>
      ) : (
        <button
          onClick={() => onApply(plan.title)}
          style={{ display: "block", width: "100%", padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", background: ACCENT, color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
        >
          {plan.cta}
        </button>
      )}
    </div>
  );
}

function Modal({ plan, onClose }: { plan: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 6 }}>Заявка</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{plan}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#999", lineHeight: 1 }}>×</button>
        </div>
        <ApplicationForm plan={plan} />
      </div>
    </div>
  );
}

const PHILOSOPHY = [
  "Система профессионального мышления",
  "Работа с состоянием специалиста",
  "Построение сильной практики",
  "Современные диагностические инструменты",
  "ИИ и аналитика",
  "Работа с платёжеспособной аудиторией",
  "Новая модель специалиста будущего",
];

export default function Tarify() {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Форматы участия — Dok Диалог</title>
        <meta name="description" content="Тарифы платформы Dok Диалог: бесплатный вход, Практика, Премиальная практика и Эксперт. Система для специалистов, которые хотят работать с платёжеспособной аудиторией." />
        <meta property="og:title" content="Форматы участия — Dok Диалог" />
      </Helmet>
      <style>{`
        .tp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; align-items: stretch; }
        .tp-phil { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        @media (max-width: 1100px) { .tp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .tp-grid { grid-template-columns: 1fr; } .tp-phil { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 440px) { .tp-phil { grid-template-columns: 1fr; } }
      `}</style>

      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 72, background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>
              Форматы участия
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 20 }}>
              Тарифы платформы Dok Диалог
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.8, color: "#5a5a5a", maxWidth: 640, margin: "0 auto" }}>
              Для специалистов по телу, состояниям, стрессу и работе с платёжеспособной аудиторией
            </p>
          </FadeIn>
        </div>
      </section>

      {/* КАРТОЧКИ */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="tp-grid">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.id} delay={i * 80}>
                <PlanCard plan={plan} onApply={(title) => setModal(title)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ФИЛОСОФИЯ */}
      <section style={{ padding: "72px 0", background: "#1a2a2a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
                Философия платформы
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
                «Dok Диалог» — это не просто обучение техникам
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto" }}>
                Это система профессионального роста нового уровня
              </p>
            </div>
          </FadeIn>
          <div className="tp-phil">
            {PHILOSOPHY.map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "20px 20px", background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ width: 28, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 0", background: "#f8f8f6" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>
              Не знаете, какой формат подходит?
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, marginBottom: 32 }}>
              Пройдите диагностику — определим формат участия, который соответствует вашей задаче и уровню практики.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
              <a href="/quiz"
                style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
              >
                Пройти диагностику формата
              </a>
              <a href="/kontakty"
                style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: `1.5px solid ${ACCENT}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `hsla(185,85%,32%,0.07)`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
              >
                Задать вопрос напрямую
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />

      {modal && <Modal plan={modal} onClose={() => setModal(null)} />}
    </div>
  );
}