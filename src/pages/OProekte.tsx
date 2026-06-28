import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const WHY_ITEMS = [
  "Клиента не услышали.",
  "Не предложили вернуться.",
  "Не помогли сделать выбор.",
  "Не объяснили ценность услуги.",
  "Не поддержали внутри команды.",
];

const PILLARS = [
  {
    icon: "BookOpen",
    title: "Практический опыт",
    desc: "17 лет работы в индустрии красоты, обучения специалистов и сопровождения салонов.",
  },
  {
    icon: "Calculator",
    title: "Проверенные алгоритмы",
    desc: "Математические модели и логика, которые помогают анализировать бизнес, персонал и процессы.",
  },
  {
    icon: "Cpu",
    title: "Искусственный интеллект",
    desc: "Современные технологии, которые превращают данные в персональные рекомендации и помогают быстрее принимать решения.",
  },
];

const DIALOG_POINTS = [
  "Сообщение в мессенджере.",
  "Ответ на отзыв.",
  "Разговор администратора.",
  "Консультация мастера.",
  "Взаимодействие внутри команды.",
];

const VALUES = [
  {
    icon: "MessageCircle",
    title: "Коммуникация — основа роста",
    desc: "Большинство бизнес-задач решается через качественное взаимодействие с клиентами и командой.",
  },
  {
    icon: "Zap",
    title: "Простые решения для ежедневной работы",
    desc: "Мы создаём инструменты, которыми можно пользоваться без специальных технических знаний.",
  },
  {
    icon: "BarChart2",
    title: "Решения на основе данных",
    desc: "Алгоритмы и аналитика помогают увидеть реальные причины проблем, а не бороться с их последствиями.",
  },
  {
    icon: "Users",
    title: "Рост через развитие команды",
    desc: "Когда развивается владелец, администратор, мастер и специалист — развивается весь бизнес.",
  },
];

const TIMELINE = [
  { year: "2008", text: "Начало практической работы в индустрии красоты и обучения специалистов." },
  { year: "2022", text: "Запуск первых программ по коммуникации и развитию салонов." },
  { year: "2024", text: "Создание первых аналитических и интеллектуальных инструментов для бизнеса." },
  { year: "2026", text: "Запуск платформы Промт Диалог — единой экосистемы для роста салонов красоты через команду, аналитику и современные технологии." },
];

export default function OProekte() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>О проекте — команда и философия Промт Диалог</title>
        <meta name="description" content="Промт Диалог — платформа, созданная практиками индустрии красоты. Узнайте о нашей команде, истории и принципах работы." />
        <meta name="keywords" content="о проекте Промт Диалог, команда платформы, история создания, философия развития салона" />
        <link rel="canonical" href="https://promtdialog.ru/o-proekte" />
        <meta property="og:title" content="О проекте Промт Диалог — платформа роста салона красоты" />
        <meta property="og:description" content="Создана практиками индустрии: опыт, алгоритмы и ИИ для реального роста вашего салона." />
        <meta property="og:url" content="https://promtdialog.ru/o-proekte" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "Платформа роста салона красоты, созданная практиками индустрии. Объединяет опыт, алгоритмы и искусственный интеллект.",
          "foundingDate": "2023",
          "knowsAbout": ["Управление салоном красоты", "Маркетинг для салона", "Обучение персонала", "Искусственный интеллект в бьюти-индустрии"]
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

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="oproekte-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>О проекте</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              17 лет в индустрии — и один честный инструмент
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              Создан практиками индустрии красоты — чтобы салоны возвращали клиентов и загружали мастеров системно, а не на удачу.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0", fontWeight: 500, letterSpacing: "0.5px" }}>
              Опыт · Практика · Результат
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="oproekte-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/16edf254-fb50-4c63-acd4-3698e0ff2eb7.png"
                alt="О проекте Промт Диалог — команда профессионалов индустрии красоты"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ ПОЯВИЛСЯ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="why-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Суть</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              За 17 лет работы в индустрии красоты мы увидели одну закономерность
            </h2>
            <p style={{ fontSize: 16, color: GRAY, margin: "0 0 20px", lineHeight: 1.8, fontWeight: 300 }}>
              Большинство салонов теряют прибыль не потому, что плохо делают свою работу. И не потому, что у них слабые специалисты.
            </p>
            <p style={{ fontSize: 18, color: DARK, margin: "0 0 28px", lineHeight: 1.7, fontWeight: 500 }}>
              Проблемы возникают там, где прерывается диалог.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {WHY_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: GRAY, fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, color: GRAY, margin: "0 0 16px", lineHeight: 1.8, fontWeight: 300 }}>
              В результате салон теряет доверие, а вместе с ним — постоянных клиентов и прибыль.
            </p>
            <p style={{ fontSize: 16, color: DARK, margin: 0, lineHeight: 1.8, fontWeight: 400 }}>
              Именно поэтому появился Промт Диалог.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 15, color: GRAY, margin: "0 0 28px", lineHeight: 1.8, fontWeight: 300 }}>
              Мы создаём платформу, которая помогает владельцам и их командам выстраивать сильную систему коммуникации, принимать решения на основе данных и развивать бизнес без лишней сложности.
            </p>
            <div style={{ padding: "32px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 }}>Что такое «диалог»</div>
              <p style={{ fontSize: 15, color: GRAY, margin: "0 0 16px", lineHeight: 1.8, fontWeight: 300 }}>
                Слово «диалог» происходит от греческого <em>dialogos</em> — разговор двоих.
              </p>
              <p style={{ fontSize: 15, color: GRAY, margin: "0 0 20px", lineHeight: 1.8, fontWeight: 300 }}>
                Для салона красоты диалог начинается задолго до визита клиента и продолжается после процедуры. Это:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {DIALOG_POINTS.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#334155", fontWeight: 300 }}>{p}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                Каждая такая точка контакта формирует доверие. А доверие становится основой долгосрочных отношений с клиентом и устойчивого роста бизнеса.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ОПЫТ + АЛГОРИТМЫ + ИИ ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Основа платформы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Опыт, алгоритмы и искусственный интеллект
            </h2>
            <p style={{ fontSize: 17, color: GRAY, margin: "0 0 12px", fontWeight: 300, maxWidth: 560 }}>
              Промт Диалог — это не просто набор ИИ-инструментов.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", marginTop: 60 }} className="pillars-grid">
            {PILLARS.map((p, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 36px" }}>
                <div style={{ width: 52, height: 52, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <Icon name={p.icon} size={24} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, margin: "0 0 12px" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: "32px 40px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 4, textAlign: "left" }}>
            <p style={{ fontSize: 16, color: GRAY, margin: "0 0 8px", lineHeight: 1.7, fontWeight: 300 }}>
              Мы не заменяем эксперта искусственным интеллектом.
            </p>
            <p style={{ fontSize: 17, color: DARK, margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
              Мы усиливаем опыт и системное мышление современными технологиями.
            </p>
          </div>
        </div>
      </section>

      {/* ── НАШ ПОДХОД ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 72, maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Принципы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Наш подход
            </h2>
          </div>
          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 32px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
              >
                <div style={{ width: 48, height: 48, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={v.icon} size={22} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, margin: "0 0 10px", lineHeight: 1.3 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ИСТОРИЯ ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Хронология</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              История проекта
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 1, background: "#E2E8F0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 40, paddingBottom: i < TIMELINE.length - 1 ? 48 : 0 }}>
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 2, background: i === TIMELINE.length - 1 ? TEAL : "#fff", border: `1px solid ${i === TIMELINE.length - 1 ? TEAL : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: i === TIMELINE.length - 1 ? DARK : TEAL, letterSpacing: "0.5px" }}>{item.year}</span>
                    </div>
                  </div>
                  <div style={{ paddingTop: 8, paddingBottom: i < TIMELINE.length - 1 ? 0 : 0 }}>
                    <p style={{ fontSize: 16, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ВО ЧТО МЫ ВЕРИМ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Философия</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 32px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Во что мы верим
          </h2>
          <p style={{ fontSize: 18, color: GRAY, margin: "0 0 20px", lineHeight: 1.8, fontWeight: 300 }}>
            Технологии не должны усложнять работу.
          </p>
          <p style={{ fontSize: 16, color: GRAY, margin: "0 0 20px", lineHeight: 1.8, fontWeight: 300 }}>
            Они должны помогать владельцу видеть бизнес яснее, сотрудникам — работать увереннее, а клиентам — чувствовать внимание и заботу.
          </p>
          <p style={{ fontSize: 17, color: DARK, margin: 0, lineHeight: 1.8, fontWeight: 500 }}>
            Именно для этого создан Промт Диалог.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Присоединяйтесь к платформе
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 44px", fontWeight: 300, position: "relative", maxWidth: 580 }}>
            Создайте профиль своего салона и получите доступ к инструментам, которые помогают развивать команду, улучшать сервис и находить новые точки роста бизнеса.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .oproekte-hero-grid { grid-template-columns: 1fr !important; }
          .oproekte-hero-img { margin-top: 32px; }
        }
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}