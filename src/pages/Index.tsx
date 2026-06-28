import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const DIRECTIONS = [
  {
    icon: "Users",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    tag: "Развитие",
    title: "Развитие салона и команды",
    items: [
      { icon: "Search", text: "ИИ-диагностика клиентов и персонала — выявляем, почему уходят люди и где слабые точки" },
      { icon: "Brain", text: "Глубокий анализ мышления и барьеров роста — на конкретных примерах вашего бизнеса" },
      { icon: "BarChart3", text: "Финансовый профиль и рекомендации — что делать, чтобы расти в 2–3 раза быстрее" },
    ],
  },
  {
    icon: "GraduationCap",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "Обучение",
    title: "Тренинги и профессиональное развитие",
    items: [
      { icon: "Presentation", text: "Онлайн и офлайн тренинги для персонала — сценарии продаж, сервис, коммуникация под вашу специфику" },
      { icon: "FileText", text: "Готовые скрипты, сценарии Reels, ответы на отзывы — индивидуальные разборы и инструкции" },
      { icon: "Bot", text: "Автоматизированное обучение и контроль выполнения через ИИ-агентов" },
    ],
  },
  {
    icon: "Megaphone",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tag: "Маркетинг",
    title: "Маркетинговые инструменты",
    items: [
      { icon: "PenLine", text: "Генератор продающих объявлений и постов — быстро, просто, под вашу аудиторию" },
      { icon: "Globe", text: "Портрет целевой аудитории, подбор офферов, создание лендингов — за 1–2 дня до первых заявок" },
      { icon: "Map", text: "Медиаплан и цепочка маркетинга — от идеи до расписанной стратегии продвижения, без потерь на тестах" },
    ],
  },
];

const FOR_WHOM = [
  { icon: "Building2", title: "Владелец салона красоты", desc: "Хочешь расти быстрее конкурентов, но не знаешь, за что взяться в первую очередь — платформа даёт чёткий ориентир." },
  { icon: "Scissors", title: "Специалист / мастер", desc: "Хочешь больше клиентов и дохода — получи инструменты личного роста, маркетинга и обучения." },
  { icon: "ClipboardList", title: "Управляющий салона", desc: "Не хочешь терять сильных людей — используй систему для удержания команды и прозрачного контроля результата." },
];

const WHY_US = [
  { icon: "TrendingUp", text: "+30% к среднему чеку, сокращение оттока клиентов в 2 раза, рост команды без текучки — реальные кейсы клиентов платформы" },
  { icon: "Bot", text: "ИИ-агенты считают под вашу специфику, а не по шаблону — каждый вывод и совет персонализирован" },
  { icon: "LayoutDashboard", text: "Вся команда в одной системе: прозрачная аналитика и контроль результата без ручной отчётности" },
];

const HOW_IT_WORKS = [
  { num: "01", icon: "Gift", title: "Регистрируетесь и получаете 100 энергий на старт — бесплатно", color: TEAL },
  { num: "02", icon: "ListChecks", title: "Выбираете задачи: диагностика, обучение, маркетинг", color: "#7c3aed" },
  { num: "03", icon: "Bot", title: "ИИ-агенты подстраиваются под ваш салон, дают персональные решения", color: "#0369a1" },
  { num: "04", icon: "Rocket", title: "Используете инструменты, получаете быстрые результаты", color: "#059669" },
];

const REVIEWS = [
  { name: "Анна, Студия Blossom", city: "Москва", text: "За 2 месяца средний чек вырос на 35%. ИИ-диагностика показала, что мастера просто не предлагали уходовые процедуры — теперь это исправлено.", result: "+35% к среднему чеку" },
  { name: "Михаил, Барбершоп GentleMan", city: "Санкт-Петербург", text: "Генератор контента экономит 4 часа в неделю. Посты стали живее, подписчики растут. Клиенты говорят, что нашли нас в Instagram.", result: "–4 часа в неделю на контент" },
  { name: "Ольга, Салон \"Гармония\"", city: "Краснодар", text: "Раньше теряла 2-3 мастера в год. Прошли тренинг по коммуникации через платформу — текучка упала, команда стала работать как единое целое.", result: "Текучка сократилась в 2 раза" },
];

const FAQ = [
  { q: "Чем вы отличаетесь от курсов и тренингов?", a: "Курсы дают общие знания. Мы даём конкретные инструменты и решения под ваш салон — с учётом ваших данных, команды и клиентов. ИИ-агенты анализируют именно ваш бизнес, а не абстрактный пример." },
  { q: "Как быстро увидим результат?", a: "Первые выводы и рекомендации вы получаете сразу после заполнения диагностики — это 15–30 минут. Практические результаты (рост чека, снижение оттока) клиенты отмечают уже в первый месяц." },
  { q: "Что делать, если у меня маленький салон или один мастер?", a: "Платформа работает для любого масштаба. Для мастера — инструменты личного роста, маркетинга и поиска клиентов. Для небольшого салона — диагностика, скрипты и обучение команды." },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог — Платформа ИИ-инструментов для роста салонов красоты</title>
        <meta name="description" content="Диагностика, развитие команды, обучение и маркетинг — всё для роста салона красоты. Индивидуальные ИИ-агенты под задачи вашего бизнеса. 100 энергий бесплатно при регистрации." />
        <meta name="keywords" content="платформа для салона красоты, ИИ для салона, управление салоном, обучение мастеров, маркетинг для салона" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Промт Диалог — ИИ-платформа роста салона красоты" />
        <meta property="og:description" content="Диагностика, обучение, маркетинг и ИИ-агенты — всё для роста вашего салона. Попробуйте бесплатно." />
        <meta property="og:url" content="https://promtdialog.ru/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "Платформа ИИ-инструментов для роста салонов красоты — диагностика, обучение, маркетинг.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "100 энергий бесплатно при регистрации" }
        })}</script>
      </Helmet>
      <BizNavbar />

      {/* ── 1. HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>ИИ-платформа для салона красоты</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Платформа ИИ-инструментов для роста салонов красоты и специалистов
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300, maxWidth: 520 }}>
              Диагностика, развитие команды, обучение и маркетинг — всё, что нужно для увеличения вашего дохода. Индивидуальные ИИ-агенты под задачи вашего салона.
            </p>

            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <Icon name="Zap" size={16} />
              Попробовать бесплатно
            </Link>

            <div style={{ display: "flex", gap: 36, marginTop: 56, flexWrap: "wrap" }}>
              {[["200+", "салонов"], ["20+", "инструментов"], ["4.9", "средняя оценка"]].map(([v, l], i) => (
                <div key={i}>
                  <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.5px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/17441cfe-b66d-4a86-ad10-5a1fca3bfed4.png"
                alt="Промт Диалог — ИИ-инструменты для роста салона красоты"
                fetchpriority="high"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
              <div className="hero-badge" style={{
                position: "absolute", bottom: 16, right: 16, zIndex: 3,
                background: "rgba(8,14,28,0.75)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(45,212,191,0.25)", borderRadius: 4,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="TrendingUp" size={15} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Рост выручки салона</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>через обучение, маркетинг и ИИ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО ── */}
      <section style={{ background: "#F8FAFC", padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="value-grid">
          {[
            { icon: "Target", title: "Работает под ваш бизнес", desc: "Не для всех подряд — ИИ-агенты анализируют именно ваши данные, команду и клиентов, а не абстрактный салон." },
            { icon: "Layers", title: "Весь цикл роста в одном месте", desc: "От анализа клиентов и команды — до маркетинга и обучения. Не нужно собирать инструменты по разным сервисам." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "36px 32px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(45,212,191,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={item.icon} size={22} style={{ color: TEAL }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. ДЛЯ КОГО ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для кого</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Для кого эта платформа?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {FOR_WHOM.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(45,212,191,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={24} style={{ color: TEAL }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ТРИ НАПРАВЛЕНИЯ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Платформа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Три направления для вашего роста
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {DIRECTIONS.map((dir, i) => (
              <div key={i} style={{ background: "#fff", border: `1.5px solid ${dir.border}`, borderRadius: 20, padding: "40px 40px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 48, alignItems: "start" }} className="dir-grid">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dir.bg, border: `1px solid ${dir.border}`, borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
                    <Icon name={dir.icon} size={14} style={{ color: dir.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: dir.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{dir.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 600, color: DARK, margin: 0, lineHeight: 1.2 }}>{dir.title}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {dir.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: dir.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Icon name={item.icon} size={15} style={{ color: dir.color }} />
                      </div>
                      <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ПОЧЕМУ ВЫБИРАЮТ НАС ── */}
      <section style={{ padding: "120px 32px", background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результаты</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Почему выбирают нас?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {WHY_US.map((item, i) => (
              <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(255,255,255,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={20} style={{ color: TEAL }} />
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. КАК ЭТО РАБОТАЕТ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Просто</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Как это работает?
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {HOW_IT_WORKS.map((step, i, arr) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 24, padding: "28px 32px", border: "1.5px solid #E8ECF0", borderRadius: 16, background: "#fff" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 600, color: "#E2E8F0", lineHeight: 1, flexShrink: 0, width: 52 }}>{step.num}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${step.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={step.icon} size={20} style={{ color: step.color }} />
                  </div>
                  <p style={{ margin: 0, fontSize: 16, color: DARK, lineHeight: 1.5, fontWeight: 500 }}>{step.title}</p>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0" }}>
                    <div style={{ width: 2, height: 10, background: "#CBD5E1" }} />
                    <Icon name="ChevronDown" size={16} style={{ color: "#94A3B8", marginTop: -4 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <Icon name="Zap" size={16} />
              Попробовать бесплатно
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. ТАРИФЫ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="tarif-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Тарифы</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Тарифы и условия
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
                {[
                  { icon: "User", title: "Для специалистов", desc: "Бесплатный и PRO тарифы — без скрытых платежей" },
                  { icon: "Building2", title: "Для салонов", desc: "Гибкие пакеты под ваши задачи и команду — от Старт до Премиум" },
                  { icon: "Zap", title: "Внутренняя энергия", desc: "Честная система: платите только за то, что используете" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Icon name={item.icon} size={16} style={{ color: TEAL }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: GRAY, fontWeight: 300 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/tseny" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px", borderRadius: 2, fontSize: 15, fontWeight: 600,
                border: `1.5px solid ${TEAL}`, color: TEAL,
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = TEAL; el.style.color = "#0F172A"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = TEAL; }}
              >
                Смотреть тарифы <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { name: "Старт", price: "990 ₽", energy: "150 энергий", landings: "3 лендинга", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                { name: "Бизнес", price: "2 990 ₽", energy: "550 энергий", landings: "5 лендингов", color: TEAL, bg: "rgba(45,212,191,0.04)", border: TEAL, popular: true },
                { name: "Рост", price: "4 990 ₽", energy: "1 200 энергий", landings: "10 лендингов", color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
                { name: "Премиум", price: "9 990 ₽", energy: "3 000 энергий", landings: "50 лендингов", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
              ].map((pkg, i) => (
                <div key={i} style={{ border: `1.5px solid ${pkg.border}`, borderRadius: 14, padding: "22px 18px", background: pkg.bg, position: "relative" }}>
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: -1, left: 16, background: TEAL, color: "#0F172A", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px", letterSpacing: "1.5px" }}>POPULAR</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, marginTop: pkg.popular ? 8 : 0 }}>{pkg.name}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 12, lineHeight: 1 }}>{pkg.price}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="Zap" size={12} style={{ color: pkg.color }} />
                      <span style={{ fontSize: 12, color: GRAY }}>{pkg.energy}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="Globe" size={12} style={{ color: pkg.color }} />
                      <span style={{ fontSize: 12, color: GRAY }}>{pkg.landings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. ОТЗЫВЫ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Отзывы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Реальные истории роста
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="Star" size={14} style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>«{r.text}»</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                  <Icon name="TrendingUp" size={14} style={{ color: TEAL }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{r.result}</span>
                </div>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{r.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>FAQ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Часто задаваемые вопросы
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: GRAY, flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA финальный ── */}
      <section style={{
        padding: "100px 32px",
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            Начните рост вашего салона сегодня
          </div>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 40, fontWeight: 300, lineHeight: 1.7 }}>
            100 энергий бесплатно при регистрации — без карты, без обязательств.
          </p>
          <Link to="/cabinet" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "18px 48px", borderRadius: 2, fontSize: 15, fontWeight: 600,
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <Icon name="Zap" size={16} />
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img { display: none !important; }
          .value-grid { grid-template-columns: 1fr !important; }
          .dir-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .tarif-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
