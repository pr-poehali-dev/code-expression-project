import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";
const BG = "#f8f8f6";

function useInView(threshold = 0.12) {
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    icon: "FileText",
    title: "Договор",
    subtitle: "Старт без рисков",
    desc: "Фиксируем цели, форматы работы и ожидаемые результаты. Вы точно знаете, что получите и за что платите. Никаких скрытых условий — только прозрачное партнёрство.",
    result: "Чёткие договорённости и план работы на руках",
  },
  {
    num: "02",
    icon: "BarChart2",
    title: "Оценка салона и персонала",
    subtitle: "Найдём, где салон теряет деньги",
    desc: "Проводим диагностику: смотрим на компетенции каждого мастера, текущий прайс, загрузку и тайминг процедур. Считаем в деньгах — где и сколько салон не дополучает прямо сейчас.",
    result: "Конкретные цифры: сколько теряет салон и почему",
  },
  {
    num: "03",
    icon: "Target",
    title: "Внедрение под каждого мастера",
    subtitle: "Не курс — а результат",
    desc: "Обучаем конкретным массажным техникам и протоколам — с учётом физических данных, опыта и ресурса каждого специалиста. Цель: больше дохода при меньшем тайминге и нагрузке на тело мастера.",
    result: "Мастер зарабатывает больше, устаёт меньше, работает дольше",
  },
  {
    num: "04",
    icon: "MonitorPlay",
    title: "Бесплатный доступ к онлайн-курсам",
    subtitle: "База знаний всегда под рукой",
    desc: "Все мастера салона получают доступ к платформе Dok Диалог — протоколы, техники, разборы случаев. Обучение продолжается даже между очными встречами.",
    result: "Мастера растут системно, а не только во время тренингов",
  },
  {
    num: "05",
    icon: "Calendar",
    title: "Дополнительные мероприятия",
    subtitle: "Онлайн и офлайн поддержка",
    desc: "По запросу — дополнительные вебинары, интенсивы, разборы работы мастеров. Поддерживаем рост команды на протяжении всего сотрудничества.",
    result: "Команда постоянно в тонусе и развитии",
  },
];

const PAINS = [
  "Массаж есть в прайсе, но клиенты почти не записываются",
  "Мастера перегружены и быстро выгорают",
  "Непонятно, сколько можно заработать на массаже в вашем салоне",
  "Обучили мастера — а он уволился или работает по-старому",
  "Конкуренты растут, а выручка стоит на месте",
  "Хотите добавить услугу, но не знаете, с чего начать",
];

const RESULTS = [
  { icon: "TrendingUp", text: "Рост выручки от массажных услуг уже в первые месяцы" },
  { icon: "Users", text: "Мастера, которые работают в ресурсе и приносят прибыль" },
  { icon: "Clock", text: "Оптимальный тайминг: больше клиентов — меньше усталости" },
  { icon: "Star", text: "Качество услуг, за которое клиенты возвращаются" },
  { icon: "BookOpen", text: "Стандарты работы, которые не зависят от настроения мастера" },
  { icon: "Shield", text: "Управляемый процесс — вы видите, что происходит в услуге" },
];

export default function SalonServices() {
  return (
    <div style={{ background: BG, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Услуги для массажных салонов — Dok Диалог</title>
        <meta name="description" content="Запускаем массажные услуги в салонах: оценка персонала, внедрение техник, обучение мастеров. Увеличиваем выручку, сокращаем нагрузку на мастеров." />
      </Helmet>
      <style>{`
        .ss-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
        .ss-steps { display: flex; flex-direction: column; gap: 0; }
        .ss-results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
        .ss-pains-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ss-step-row { display: grid; grid-template-columns: 80px 1fr; gap: 0 32px; }
        @media (max-width: 900px) {
          .ss-hero-grid { grid-template-columns: 1fr; }
          .ss-hero-img { order: -1; }
        }
        @media (max-width: 860px) {
          .ss-results-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .ss-results-grid { grid-template-columns: 1fr; }
          .ss-pains-grid { grid-template-columns: 1fr; }
          .ss-step-row { grid-template-columns: 52px 1fr; gap: 0 16px; }
          .ss-diag-grid { grid-template-columns: 1fr !important; }
          .ss-diag-grid > div:last-child { flex-direction: row !important; align-items: center; }
        }
      `}</style>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 72, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <div className="ss-hero-grid">
            {/* Left */}
            <div>
              <FadeIn>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
                  Для владельцев салонов
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.08, color: "#1a1a1a", marginBottom: 24, letterSpacing: "-0.5px" }}>
                  Массаж в вашем салоне —<br />
                  <span style={{ color: ACCENT }}>источник дохода,<br />а не головная боль</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.8, color: "#4a4a4a", marginBottom: 36 }}>
                  Помогаем запустить или прокачать массажное направление в салоне: находим, где вы теряете деньги, внедряем техники под каждого мастера и выстраиваем систему, которая работает без вашего постоянного контроля.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                  <a
                    href="/tarify"
                    style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "16px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                  >
                    Хочу подключить салон
                  </a>
                  <a
                    href="/kontakty"
                    style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "16px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", border: `1.5px solid ${ACCENT}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${ACCENT}08`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
                  >
                    Задать вопрос
                  </a>
                </div>
              </FadeIn>
            </div>
            {/* Right — photo */}
            <FadeIn delay={150} style={{ paddingTop: 40 }} >
              <div className="ss-hero-img" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.13)", aspectRatio: "4/5", position: "relative" }}>
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/72c03792-a3c6-43c3-bb52-b23dd1c8ce2f.jpg"
                  alt="Массажный салон"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="TrendingUp" size={18} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Рост выручки от массажа</div>
                    <div style={{ fontSize: 12, color: "#888" }}>уже в первые месяцы работы</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PAINS */}
      <section style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px", textAlign: "center" }}>
              Узнаёте себя?
            </h2>
            <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.6vw, 16px)", color: "#777", marginBottom: 40, lineHeight: 1.7 }}>
              Большинство владельцев салонов сталкиваются с одними и теми же проблемами в массажном направлении
            </p>
          </FadeIn>
          <div className="ss-pains-grid">
            {PAINS.map((text, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #e8e8e4" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="X" size={13} style={{ color: "#e05050" }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.65 }}>{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", fontWeight: 600, color: "#333", lineHeight: 1.6, margin: 0 }}>
                Это не случайность — это отсутствие системы.<br />
                <span style={{ color: ACCENT }}>Именно это мы и выстраиваем.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section style={{ background: "#fff", padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Как мы работаем</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                5 шагов к массажу, который приносит деньги
              </h2>
            </div>
          </FadeIn>
          <div className="ss-steps">
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="ss-step-row" style={{ position: "relative" }}>
                  {/* Left — number + line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: i === 0 ? ACCENT : `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                      <Icon name={step.icon} size={24} style={{ color: i === 0 ? "#fff" : ACCENT }} />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 40, background: `${ACCENT}20`, margin: "8px 0" }} />
                    )}
                  </div>
                  {/* Right — content */}
                  <div style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0, paddingTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.15em" }}>ШАГ {step.num}</span>
                      <span style={{ fontSize: 12, color: "#aaa" }}>·</span>
                      <span style={{ fontSize: 12, color: "#888", fontStyle: "italic" }}>{step.subtitle}</span>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>{step.title}</h3>
                    <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#555", lineHeight: 1.8, margin: "0 0 14px" }}>{step.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}0e`, borderRadius: 10, padding: "8px 14px" }}>
                      <Icon name="CheckCircle" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{step.result}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
                Что получает ваш салон
              </h2>
              <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "#777", margin: 0, lineHeight: 1.7 }}>
                Не просто обучение — системный результат, который остаётся в салоне
              </p>
            </div>
          </FadeIn>
          <div className="ss-results-grid">
            {RESULTS.map((r, i) => (
              <FadeIn key={i} delay={i * 70} style={{ height: "100%" }}>
                <div style={{ height: "100%", background: "#fff", borderRadius: 18, padding: "24px 22px", border: "1px solid #e8e8e4", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", display: "flex", gap: 16, alignItems: "flex-start", boxSizing: "border-box" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={r.icon} size={20} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#333", lineHeight: 1.65, fontWeight: 500, paddingTop: 2 }}>{r.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGNOSTICS UPSELL */}
      <section style={{ padding: "0 24px clamp(56px, 8vw, 96px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: "linear-gradient(135deg, hsl(185,85%,10%) 0%, hsl(185,70%,20%) 100%)", borderRadius: 24, padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 52px)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}
              className="ss-diag-grid">
              <div>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
                  Дополнительная услуга
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>
                  Платная диагностика<br />массажного направления
                </h2>
                <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: 0, maxWidth: 520 }}>
                  Хотите понять, сколько именно теряет ваш салон на массажных услугах — до подписания любых договоров? Проведём независимую аудит-диагностику: посмотрим на компетенции мастеров, тайминг, ценообразование и загрузку. Получите конкретный отчёт с цифрами.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
                <a
                  href="#"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: ACCENT, padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
                >
                  Узнать подробнее
                  <Icon name="ArrowRight" size={14} />
                </a>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Скоро</span>
              </div>
            </div>
          </FadeIn>
        </div>
        <style>{`
          @media (max-width: 640px) {
            .ss-diag-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* CTA */}
      <section style={{ background: "#fff", padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Icon name="Sparkles" size={32} style={{ color: ACCENT }} />
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", lineHeight: 1.15 }}>
              Готовы сделать массаж прибыльным?
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.7vw, 16px)", color: "#666", lineHeight: 1.8, margin: "0 0 36px" }}>
              Оставьте заявку — расскажем, как это работает именно для вашего салона. Первая консультация бесплатна.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/tarify"
                style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "16px 36px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
              >
                Смотреть тарифы →
              </a>
              <a
                href="/kontakty"
                style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "16px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", border: `1.5px solid ${ACCENT}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${ACCENT}08`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
              >
                Написать нам
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}