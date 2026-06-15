import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const INSIDE_ITEMS = [
  "Мышление и внутреннее состояние специалиста",
  "Коммуникация с клиентами и командой",
  "Продажи без давления",
  "Управление салоном и финансами",
  "Личный бренд и позиционирование",
  "Системная работа с клиентом",
  "Развитие лидерских качеств",
  "Формирование устойчивой профессиональной практики",
];

const TRAJECTORIES = [
  {
    icon: "Crown",
    role: "Для владельцев салонов",
    desc: "Стратегическое мышление, управление командой, финансы и построение сильного бизнеса.",
    topics: [
      "Рост прибыли салона",
      "Финансовое мышление руководителя",
      "Формирование сильной команды",
      "Система управления без постоянного контроля",
    ],
  },
  {
    icon: "Briefcase",
    role: "Для администраторов",
    desc: "Коммуникация, сервис и умение создавать доверие с первых минут общения.",
    topics: [
      "Продажи через заботу о клиенте",
      "Работа с возражениями",
      "Повторная запись",
      "Управление сложными ситуациями",
    ],
  },
  {
    icon: "Scissors",
    role: "Для мастеров",
    desc: "Развитие личного бренда, уверенности и профессиональной ценности.",
    topics: [
      "Как работать с премиальным клиентом",
      "Повышение среднего чека",
      "Продвижение через социальные сети",
      "Построение долгосрочных отношений с клиентами",
    ],
  },
  {
    icon: "HandHeart",
    role: "Для специалистов по телу",
    desc: "Глубокое понимание клиента, системное мышление и построение эффективных программ восстановления.",
    topics: [
      "Диагностика клиента",
      "Логика построения программ",
      "Работа с хроническими состояниями",
      "Ведение клиента на длительной дистанции",
    ],
  },
];

export default function Akademiya() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Академия Про Диалог — обучение для специалистов салона красоты</title>
        <meta name="description" content="Профессиональные курсы и тренинги для мастеров, администраторов и владельцев салонов. Обучение по коммуникациям, продажам, управлению и развитию сервиса." />
        <meta name="keywords" content="академия для салона красоты, обучение мастеров, курсы для администраторов, тренинги для салона" />
        <link rel="canonical" href="https://promtdialog.ru/akademiya" />
        <meta property="og:title" content="Академия Про Диалог — профессиональное обучение для салонов" />
        <meta property="og:description" content="Курсы и тренинги для всей команды салона: коммуникации, продажи, управление, сервис." />
        <meta property="og:url" content="https://promtdialog.ru/akademiya" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Академия Про Диалог",
          "url": "https://promtdialog.ru/akademiya",
          "description": "Профессиональные курсы и тренинги для специалистов салонов красоты.",
          "parentOrganization": { "@type": "Organization", "name": "Про Диалог", "url": "https://promtdialog.ru" }
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
            <Icon name="GraduationCap" size={14} style={{ color: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Академия Про Диалог</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
            Академия Про Диалог
          </h1>
          <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 20px", fontWeight: 300, maxWidth: 620 }}>
            Пространство профессионального и личного роста для команды салона.
          </p>
          <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.8, margin: "0", fontWeight: 300, maxWidth: 680 }}>
            Сильный салон начинается с сильных людей. Академия Про Диалог помогает развивать мышление, коммуникацию, лидерские качества и профессиональные навыки, которые напрямую влияют на доверие клиентов и финансовый результат.
          </p>
          <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, margin: "20px 0 0", fontWeight: 300, maxWidth: 580 }}>
            Это не просто набор уроков. Это система развития владельца, администратора, мастера и специалиста по телу.
          </p>
        </div>
      </section>

      {/* ── МЕДИА-БАННЕР ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", boxShadow: "0 24px 64px rgba(15,23,42,0.18)" }}>
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/4a7b5d70-b350-442c-a621-708565ae81dd.jpg"
              alt="Академия Про Диалог — развитие команды салона"
              style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.35) 55%, transparent 100%)" }} />
            <div style={{ position: "absolute", top: "50%", left: 40, transform: "translateY(-50%)", maxWidth: 480 }} className="akad-img-text">
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, color: "#fff", margin: "0 0 14px", lineHeight: 1.15 }}>
                Развивайтесь в том, что действительно влияет на результат
              </h3>
              <p style={{ fontSize: 15, color: "#fff", margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                Каждая программа создана на основе многолетней практики работы с салонами красоты и помогает формировать привычки, которые работают в ежедневной работе.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ВНУТРИ АКАДЕМИИ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="inside-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Содержание</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: DARK, margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Что внутри Академии
            </h2>
            <p style={{ fontSize: 16, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.7 }}>
              Программы охватывают все ключевые аспекты профессионального роста — от внутреннего состояния до системных бизнес-навыков.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {INSIDE_ITEMS.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={11} style={{ color: TEAL }} />
                </div>
                <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.5, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТРАЕКТОРИИ РАЗВИТИЯ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 72, maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Направления</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Траектории профессионального роста
            </h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.6 }}>Каждая траектория адаптирована под конкретную роль в команде салона</p>
          </div>

          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridTemplateRows: "auto 1fr", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {TRAJECTORIES.map((t, i) => (
              <div key={i} style={{ background: "#fff", display: "grid", gridRow: "span 2", gridTemplateRows: "subgrid", transition: "background 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.04)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
              >
                <div style={{ padding: "40px 32px 28px", borderBottom: "1px solid #EAEEF3", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon name={t.icon} size={24} style={{ color: TEAL }} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>{t.role}</h3>
                  <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{t.desc}</p>
                </div>
                <div style={{ padding: "28px 32px 40px", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>Основные темы</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {t.topics.map((topic, ti) => (
                      <div key={ti} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 8 }} />
                        <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5, fontWeight: 300 }}>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ АКАДЕМИЯ ОТЛИЧАЕТСЯ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 900, textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Наш подход</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 28px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Почему Академия отличается
          </h2>
          <p style={{ fontSize: 18, color: GRAY, margin: "0 0 20px", fontWeight: 300, lineHeight: 1.8, maxWidth: 700 }}>
            Мы не стремимся просто передать информацию.
          </p>
          <p style={{ fontSize: 16, color: GRAY, margin: "0 0 20px", fontWeight: 300, lineHeight: 1.8, maxWidth: 720 }}>
            Наша задача — помочь специалисту и владельцу изменить подход к работе, научиться видеть причинно-следственные связи и принимать более сильные решения.
          </p>
          <p style={{ fontSize: 16, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.8, maxWidth: 680 }}>
            Практический опыт, проверенные методики и современные технологии объединяются в единую систему развития.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Продолжайте расти вместе с Про Диалог
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 10px", fontWeight: 300, position: "relative" }}>
            Все программы, практики и материалы доступны в Академии Про Диалог.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", margin: "0 0 44px", fontWeight: 300, position: "relative" }}>
            Создайте профиль салона и откройте для своей команды пространство постоянного развития.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Перейти в Академию
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .inside-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .akad-img-text { left: 20px !important; right: 20px !important; max-width: none !important; }
        }
      `}</style>
    </div>
  );
}