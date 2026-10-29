import { Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { TOOL_IMAGES } from "./tool-landings/toolImages";
import ClientViewFeature from "./vozmozhnosti/ClientViewFeature";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SECTIONS = [
  {
    tag: "Маркетинг",
    icon: "Megaphone",
    title: "Маркетинг",
    desc: "Контент и продвижение без специалистов.",
    subdesc: "Публикации, сайт и реклама собираются в одном месте. Реклама идет по цепочке: портрет аудитории, офферы, запросы, объявления, медиаплан с бюджетом и прогнозом клиентов.",
    tools: [
      { icon: "PenLine",        slug: "post-generator",    name: "Генератор постов",            desc: "Пишет публикации для соцсетей под вашу тематику и стиль." },
      { icon: "Video",          slug: "reels-video",        name: "Сценарии и видео для Reels",  desc: "Пишет сценарий для съемки или генерирует готовый ролик." },
      { icon: "Image",          slug: "image-generation",   name: "Генерация изображений",       desc: "Рисует картинки для постов, сторис и баннеров без дизайнера." },
      { icon: "Wand2",          slug: "fitting-room",       name: "Примерочная",                 desc: "Мастер показывает клиенту новый образ на фото прямо на консультации: стрижку, макияж, маникюр." },
      { icon: "MousePointer",   slug: "ad-campaigns",       name: "Контекстная реклама", desc: "Подбирает запросы клиентов, пишет объявления и считает медиаплан: бюджет и прогноз числа клиентов." },
      { icon: "LayoutTemplate", slug: "landing-builder",    name: "Конструктор лендингов и сайта", desc: "Собирает страницу или сайт под вашу услугу без программиста и дизайнера." },
      { icon: "Globe",          slug: "seo-optimization",   name: "SEO-оптимизация сайта",       desc: "Проверяет мета-теги, заголовки и тексты сайта и предлагает готовые правки." },
      { icon: "Target",         slug: "audience-analysis",  name: "Подбор ЦА и ее анализ",       desc: "Первый шаг рекламы: портреты аудитории с болями, мотивацией и каналами, плюс офферы под каждый сегмент." },
    ],
  },
  {
    tag: "Управление",
    icon: "BarChart3",
    title: "Управление",
    desc: "Аналитика показывает, где у бизнеса точки роста.",
    subdesc: "Владелец и частный специалист видят всю картину и решают по данным.",
    tools: [
      { icon: "UserSearch",    slug: "staff-analysis",      name: "Анализ персонала",         desc: "Показывает вклад каждого сотрудника в прибыль и скрытые потери." },
      { icon: "ClipboardList", slug: "business-audit",      name: "Цифровой бизнес-разбор",   desc: "Разбирает состояние бизнеса и дает рекомендации по росту." },
      { icon: "Stethoscope",   slug: "growth-diagnostics",  name: "Диагностика роста дохода", desc: "Оценивает маркетинг, сервис, продажи и загрузку и находит точки роста." },
    ],
  },
  {
    tag: "Продажи",
    icon: "MessagesSquare",
    title: "Продажи и сервис",
    desc: "Грамотное общение превращает нового клиента в постоянного.",
    subdesc: "",
    tools: [
      { icon: "MessagesSquare", slug: "scripts",             name: "Скрипты общения",       desc: "Сценарии для записи, консультации и сложных ситуаций с клиентом." },
      { icon: "ShieldCheck",    slug: "objection-handling",  name: "Работа с возражениями", desc: "Примеры ответов на типовые сомнения клиентов." },
      { icon: "RotateCcw",      slug: "repeat-booking",      name: "Повторная запись",       desc: "Возвращает клиентов и заполняет расписание." },
    ],
  },
  {
    tag: "Специалисты",
    icon: "Heart",
    title: "Развитие специалистов",
    desc: "Инструменты для уверенной работы и доверия клиентов.",
    subdesc: "",
    tools: [
      { icon: "ScanLine",       slug: "client-diagnostics", name: "Системная диагностика клиента", desc: "Структурированный разбор состояния клиента для специалистов по работе с телом." },
      { icon: "BookOpen",       slug: "cheat-sheets",       name: "Шпаргалки специалиста",    desc: "Техники, противопоказания и рабочие рекомендации под рукой." },
      { icon: "HeartPulse",     slug: "recovery-programs",  name: "Программы восстановления",      desc: "Составляет планы восстановления клиента." },
      { icon: "ClipboardCheck", slug: "development-tests",  name: "Тесты и диагностики развития",  desc: "Оценивает навыки общения, финансовое мышление и рост сотрудников." },
    ],
  },
  {
    tag: "Академия",
    icon: "GraduationCap",
    title: "Развитие команды",
    desc: "Тренинги для сотрудников в одном кабинете.",
    subdesc: "Владелец назначает обучение администраторам, мастерам и специалистам и видит прогресс команды.",
    tools: [],
  },
];

const WHY_ITEMS = [
  "Бизнес-модели, проверенные на практике.",
  "Алгоритмы считают по вашим данным.",
  "ИИ готовит рекомендации и тексты.",
  "Обучение сотрудников в одном кабинете.",
  "Не нужно нанимать маркетолога и веб-дизайнера.",
];

const FLOW_STEPS = [
  { icon: "Database",   label: "Ваши данные" },
  { icon: "Calculator", label: "Алгоритмы" },
  { icon: "Cpu",        label: "ИИ" },
  { icon: "Lightbulb",  label: "Конкретные действия" },
  { icon: "TrendingUp", label: "Рост прибыли" },
];

const HOW_STEPS = [
  { num: "1", title: "Анализ данных",              desc: "Алгоритмы считают показатели бизнеса, сотрудников или вашу задачу." },
  { num: "2", title: "Выводы ИИ", desc: "ИИ находит связи в данных и делает выводы." },
  { num: "3", title: "Готовое решение",             desc: "Вы получаете рекомендации, сценарии или готовый контент." },
];

export default function Vozmozhnosti() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Возможности платформы — маркетинг, обучение и ИИ для бизнеса | Промт Диалог</title>
        <meta name="description" content="Более 20 инструментов для роста дохода: генератор постов, конструктор лендингов, сценарии Reels, SEO-оптимизация, анализ персонала, скрипты продаж, обучение команды. Для салонов красоты, психологов и частной практики. Попробуйте бесплатно." />
        <meta name="keywords" content="инструменты для салона красоты, конструктор лендингов, маркетинг для бизнеса, обучение персонала, ИИ для салона, ИИ для психолога, платформа управления бизнесом" />
        <link rel="canonical" href="https://promtdialog.ru/vozmozhnosti" />
        <meta property="og:title" content="Возможности платформы Промт Диалог — все для роста дохода" />
        <meta property="og:description" content="Более 20 инструментов: маркетинг, управление, продажи, обучение команды. Все в одном кабинете." />
        <meta property="og:url" content="https://promtdialog.ru/vozmozhnosti" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Возможности платформы Промт Диалог" />
        <meta name="twitter:description" content="Более 20 инструментов для роста дохода: маркетинг, ИИ, конструктор лендингов, обучение команды." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "applicationCategory": "BusinessApplication",
          "description": "Платформа роста дохода для салонов красоты, психологов и частной практики: маркетинг, управление, обучение персонала и ИИ-инструменты в одном кабинете.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "Получить план роста дохода — бесплатно" },
          "featureList": ["Покажи глазами клиента", "Генератор постов", "Конструктор лендингов", "Сценарии и видео для Reels", "SEO-оптимизация", "Анализ персонала", "Скрипты продаж", "Обучение команды"],
          "operatingSystem": "Web"
        })}</script>
      </Helmet>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="voz-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Возможности</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Больше клиентов, выше доход, сильнее команда
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              20+ ИИ-инструментов для маркетинга, продаж и управления в одном кабинете.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0 0 40px", fontWeight: 500, letterSpacing: "0.5px" }}>
              Маркетинг · Управление · Продажи · Развитие команды
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
              Попробовать бесплатно
            </Link>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="voz-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/5f1dfdfc-e598-4beb-82f5-2b42ebbb2809.jpg"
                alt="Мастер работает с ИИ-инструментами Промт Диалог за ноутбуком в студии"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      <ClientViewFeature />

      {/* ── КАК РАБОТАЮТ ИНСТРУМЕНТЫ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Принцип работы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Как работают инструменты
            </h2>
            <p style={{ fontSize: 18, color: GRAY, fontWeight: 400, margin: "0 0 0", maxWidth: 520 }}>
              ИИ плюс расчеты по вашим данным.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, marginTop: 60, border: "1px solid #E2E8F0" }} className="how-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 36px", borderRight: i < HOW_STEPS.length - 1 ? "1px solid #E2E8F0" : "none", position: "relative" }}>
                {i < HOW_STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -14, transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <Icon name="ArrowRight" size={13} style={{ color: TEAL }} />
                  </div>
                )}
                <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 600, color: "rgba(45,212,191,0.18)", lineHeight: 1, marginBottom: 20 }}>{step.num}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, margin: "0 0 12px" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── СХЕМА-ВОРОНКА ── */}
      <section style={{ background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="flow-steps" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", flexWrap: "nowrap", gap: 0 }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className="flow-step-pair" style={{ display: "flex", alignItems: "center" }}>
                <div className="flow-step-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 84 }}>
                  <div className="flow-step-icon" style={{
                    width: 56, height: 56, borderRadius: 2,
                    background: "rgba(45,212,191,0.08)",
                    border: "1px solid rgba(45,212,191,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name={step.icon} size={20} style={{ color: TEAL }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.4, letterSpacing: "0.3px", minHeight: "2.8em", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>{step.label}</div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flow-arrow" style={{ display: "flex", alignItems: "center", padding: "0 8px", height: 56 }}>
                    <div style={{ width: 16, height: 1, background: "rgba(45,212,191,0.25)" }} />
                    <Icon name="ChevronRight" size={13} style={{ color: "rgba(45,212,191,0.4)", marginLeft: -4 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── РАЗДЕЛЫ ── */}
      {SECTIONS.map((s, si) => (
        <section key={si} style={{ padding: "120px 32px", background: si % 2 === 0 ? "#fff" : "#F8FAFC" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: s.tools.length > 0 ? 64 : 0, flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={s.icon} size={26} style={{ color: TEAL }} />
              </div>
              <div style={{ maxWidth: 680 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>{s.tag}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{s.title}</h2>
                <p style={{ fontSize: 18, color: GRAY, margin: "0 0 10px", fontWeight: 300, lineHeight: 1.6 }}>{s.desc}</p>
                {s.subdesc && <p style={{ fontSize: 15, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.7 }}>{s.subdesc}</p>}
              </div>
            </div>

            {s.tools.length > 0 && (
              <div className="tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 24 }}>
                {s.tools.map((t, ti) => (
                  <div key={ti} style={{ background: si % 2 === 0 ? "#fff" : "#F8FAFC", padding: "40px 32px", transition: "all 0.3s", cursor: "default", display: "flex", flexDirection: "column", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = si % 2 === 0 ? "#fff" : "#F8FAFC"; }}
                  >
                    {TOOL_IMAGES[t.slug] && (
                      <img src={TOOL_IMAGES[t.slug]} alt={t.name} loading="lazy" decoding="async" style={{ width: "calc(100% + 64px)", maxWidth: "none", margin: "-40px -32px 28px", aspectRatio: "16 / 9", objectFit: "cover", display: "block", borderRadius: "16px 16px 0 0" }} />
                    )}
                    <div style={{ width: 48, height: 48, borderRadius: 2, border: "1px solid #EAEEF3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                      <Icon name={t.icon} size={22} style={{ color: TEAL }} />
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 10px", lineHeight: 1.25 }}>{t.name}</h3>
                    <p style={{ fontSize: 14, color: GRAY, margin: "0 0 20px", lineHeight: 1.7, fontWeight: 300, minHeight: 72 }}>{t.desc}</p>
                    <Link
                      to={`/instrumenty/${t.slug}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: TEAL, textDecoration: "none", marginTop: "auto" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.gap = "9px"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.gap = "6px"}
                    >
                      Подробнее <Icon name="ArrowRight" size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── ПОЧЕМУ ПРОМТ ДИАЛОГ ── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "left", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Преимущества</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Почему Промт Диалог
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 4 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={12} style={{ color: TEAL }} />
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Готовы начать?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 10px", fontWeight: 300, position: "relative" }}>
            Создайте профиль и откройте инструменты.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Без привязки карты.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .voz-hero-grid { grid-template-columns: 1fr !important; }
          .voz-hero-img { margin-top: 32px; }
        }
        @media (max-width: 900px) {
          .cv-two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .cv-actions { flex-direction: column; align-items: stretch !important; }
          .cv-cta { display: flex !important; width: 100%; box-sizing: border-box; padding: 16px 20px !important; }
        }
        @media (max-width: 640px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .how-grid > div { border-right: none !important; border-bottom: 1px solid #E2E8F0; }
          .flow-steps { flex-wrap: wrap !important; row-gap: 24px !important; column-gap: 8px !important; justify-content: center !important; }
          .flow-step-pair { flex: 0 0 auto; }
          .flow-arrow { display: none !important; }
        }
        @media (max-width: 480px) {
          .flow-step-col { width: 74px !important; }
          .flow-step-icon { width: 48px !important; height: 48px !important; }
        }
        @media (max-width: 360px) {
          .flow-step-col { width: 66px !important; }
          .flow-step-icon { width: 44px !important; height: 44px !important; }
        }
      `}</style>
    </div>
  );
}