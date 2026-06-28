import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SECTIONS = [
  {
    tag: "Маркетинг",
    icon: "Megaphone",
    title: "Маркетинг",
    desc: "Контент и продвижение без лишних затрат времени.",
    subdesc: "Инструменты помогают регулярно публиковать качественный контент и поддерживать активность салона в социальных сетях.",
    tools: [
      { icon: "PenLine",       name: "Генератор постов",             desc: "Создает готовые публикации для социальных сетей с учётом тематики вашего салона." },
      { icon: "Video",         name: "Сценарии для Reels",           desc: "Помогают быстро подготовить короткие видео для привлечения новых клиентов." },
      { icon: "Image",         name: "Генерация изображений",        desc: "Создаёт уникальные визуалы для постов, баннеров и рекламных материалов." },
      { icon: "LayoutTemplate", name: "Конструктор лендингов",         desc: "Создаёт готовые продающие страницы для услуг, акций и записи — без дизайнера и верстальщика." },
      { icon: "Calculator",    name: "Расчёт рекламного бюджета",    desc: "Помогает оценить эффективность вложений и распределить бюджет между рекламными каналами." },
      { icon: "MousePointer",  name: "Создание рекламных кампаний",  desc: "Готовые объявления для Яндекс.Директ: заголовки, тексты, ключевые слова — на основе ваших услуг и аудитории." },
      { icon: "Globe",         name: "SEO-оптимизация сайта",        desc: "Анализирует сайт салона: мета-теги, заголовки, структуру страниц. Выдаёт конкретные правки с готовыми вариантами текстов." },
      { icon: "Target",        name: "Подбор ЦА и её анализ",        desc: "ИИ формирует детальные портреты целевой аудитории с болями, мотивацией и каналами охвата — на основе профиля салона." },
    ],
  },
  {
    tag: "Управление",
    icon: "BarChart3",
    title: "Управление",
    desc: "Аналитика, которая показывает, где находится точка роста бизнеса.",
    subdesc: "Инструменты помогают владельцу видеть картину целиком и принимать решения на основе данных.",
    tools: [
      { icon: "UserSearch",    name: "Анализ персонала",          desc: "Показывает вклад каждого сотрудника в прибыль салона и помогает находить скрытые потери." },
      { icon: "ClipboardList", name: "Цифровой бизнес-разбор",    desc: "Комплексный анализ текущего состояния салона с персональными рекомендациями." },
      { icon: "Stethoscope",   name: "Диагностика роста салона",  desc: "Помогает оценить маркетинг, сервис, продажи и работу команды." },
    ],
  },
  {
    tag: "Продажи",
    icon: "MessagesSquare",
    title: "Продажи и сервис",
    desc: "Правильная коммуникация превращает первого клиента в постоянного.",
    subdesc: "",
    tools: [
      { icon: "MessagesSquare", name: "Скрипты общения",       desc: "Готовые сценарии для записи, консультации, продажи и решения сложных ситуаций." },
      { icon: "ShieldCheck",    name: "Работа с возражениями", desc: "Практические модели ответов на типовые сомнения клиентов." },
      { icon: "RotateCcw",      name: "Повторная запись",       desc: "Инструменты для увеличения возврата клиентов и загрузки расписания." },
    ],
  },
  {
    tag: "Специалисты",
    icon: "Heart",
    title: "Развитие специалистов",
    desc: "Инструменты, которые помогают работать увереннее и создавать долгосрочное доверие.",
    subdesc: "",
    tools: [
      { icon: "ScanLine",       name: "Системная диагностика клиента",    desc: "Структурированный анализ состояния клиента для специалистов по телу." },
      { icon: "BookOpen",       name: "Профессиональные шпаргалки",       desc: "Быстрый доступ к техникам, противопоказаниям и рабочим рекомендациям." },
      { icon: "HeartPulse",     name: "Программы восстановления",         desc: "Помогают формировать индивидуальные планы сопровождения клиента." },
      { icon: "ClipboardCheck", name: "Тесты и диагностики развития",     desc: "Оценка навыков общения, финансового мышления и профессионального роста сотрудников." },
    ],
  },
  {
    tag: "Академия",
    icon: "GraduationCap",
    title: "Развитие команды",
    desc: "Тренинги для сотрудников внутри одной экосистемы.",
    subdesc: "Владелец может назначать доступы к обучению администраторам, мастерам и специалистам, отслеживая развитие всей команды.",
    tools: [],
  },
];

const WHY_ITEMS = [
  "Практический опыт и реальные бизнес-модели.",
  "Проверенные алгоритмы анализа.",
  "Искусственный интеллект для персональных рекомендаций.",
  "Развитие сотрудников в одном кабинете.",
  "Инструменты, которые помогают салону расти каждый день.",
];

const FLOW_STEPS = [
  { icon: "Database",   label: "Данные салона" },
  { icon: "Calculator", label: "Алгоритмы" },
  { icon: "Cpu",        label: "ИИ" },
  { icon: "Lightbulb",  label: "Конкретные действия" },
  { icon: "TrendingUp", label: "Рост прибыли" },
];

const HOW_STEPS = [
  { num: "1", title: "Анализ данных",              desc: "Алгоритмы обрабатывают показатели салона, сотрудников или задачи пользователя." },
  { num: "2", title: "Интеллектуальная обработка", desc: "ИИ анализирует взаимосвязи и формирует персональные выводы." },
  { num: "3", title: "Готовое решение",             desc: "Вы получаете конкретные рекомендации, сценарии или готовый контент для работы." },
];

export default function Vozmozhnosti() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Возможности платформы — маркетинг, обучение и ИИ для салона | Промт Диалог</title>
        <meta name="description" content="Более 20 инструментов для роста салона красоты: генератор постов, сценарии Reels, SEO-оптимизация, анализ персонала, скрипты продаж, обучение команды. Попробуйте бесплатно." />
        <meta name="keywords" content="инструменты для салона красоты, маркетинг для салона, обучение персонала, ИИ для салона, платформа управления салоном" />
        <link rel="canonical" href="https://promtdialog.ru/vozmozhnosti" />
        <meta property="og:title" content="Возможности платформы Промт Диалог — всё для роста салона" />
        <meta property="og:description" content="Более 20 интеллектуальных инструментов: маркетинг, управление, продажи, обучение команды. Всё в одном кабинете." />
        <meta property="og:url" content="https://promtdialog.ru/vozmozhnosti" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Возможности платформы Промт Диалог" />
        <meta name="twitter:description" content="Более 20 инструментов для роста салона: маркетинг, ИИ, обучение команды." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "applicationCategory": "BusinessApplication",
          "description": "Платформа роста салона красоты: маркетинг, управление, обучение персонала и ИИ-инструменты в одном кабинете.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "100 энергий в подарок при регистрации" },
          "featureList": ["Генератор постов", "Сценарии Reels", "SEO-оптимизация", "Анализ персонала", "Скрипты продаж", "Обучение команды"],
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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px", width: "100%", textAlign: "left", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Возможности</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
            Возможности платформы
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 680 }}>
            Инструменты, которые возвращают клиентов и повышают загрузку каждого мастера.
          </p>
          <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 300, maxWidth: 660 }}>
            Промт Диалог объединяет аналитику, маркетинг, обучение сотрудников и искусственный интеллект в единую систему управления салоном. Каждый инструмент работает по гибридному принципу: сначала анализ данных и проверенные алгоритмы, затем — персональные рекомендации ИИ для вашей ситуации.
          </p>
          <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0 0 40px", fontWeight: 500, letterSpacing: "0.5px" }}>
            Маркетинг · Управление · Продажи · Развитие команды
          </p>

          <Link to="/cabinet" style={{
            display: "inline-block", padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      {/* ── КАК РАБОТАЮТ ИНСТРУМЕНТЫ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Принцип работы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Как работают инструменты
            </h2>
            <p style={{ fontSize: 18, color: GRAY, fontWeight: 400, margin: "0 0 0", maxWidth: 520 }}>
              Не просто ИИ. Система принятия решений.
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
          <div className="flow-steps" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 0 }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 2,
                    background: "rgba(45,212,191,0.08)",
                    border: "1px solid rgba(45,212,191,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name={step.icon} size={20} style={{ color: TEAL }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.55)", textAlign: "center", maxWidth: 80, lineHeight: 1.4, letterSpacing: "0.3px" }}>{step.label}</div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flow-arrow" style={{ display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 26 }}>
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
              <div className="tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
                {s.tools.map((t, ti) => (
                  <div key={ti} style={{ background: si % 2 === 0 ? "#fff" : "#F8FAFC", padding: "40px 32px", transition: "all 0.3s", cursor: "default" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = si % 2 === 0 ? "#fff" : "#F8FAFC"; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 2, border: "1px solid #EAEEF3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                      <Icon name={t.icon} size={22} style={{ color: TEAL }} />
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>{t.name}</h3>
                    <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
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
            Создайте профиль салона и получите доступ к инструментам платформы.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Без привязки карты и долгосрочных обязательств.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 640px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .how-grid > div { border-right: none !important; border-bottom: 1px solid #E2E8F0; }
          .flow-steps { flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; }
          .flow-arrow { display: none !important; }
        }
        @media (max-width: 480px) {
          .flow-steps > div { width: calc(33% - 12px); }
        }
      `}</style>
    </div>
  );
}