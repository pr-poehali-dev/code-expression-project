import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

const PROGRAMS = [
  {
    num: "01",
    title: "Для специалистов",
    sub: "Система профессионального перехода",
    text: "Переход из потоковой практики в зрелую профессиональную систему: мышление, стоимость, границы, клиентский опыт и глубокая работа с телом.",
    href: "/dlya-specialistov",
    btn: "Перейти в направление",
  },
  {
    num: "02",
    title: "Форматы участия",
    sub: "Тарифы платформы",
    text: "Бесплатный вход, «Практика», «Премиальная практика» и «Эксперт» — выберите формат, который соответствует вашей задаче и уровню.",
    href: "/tarify",
    btn: "Смотреть форматы",
  },
  {
    num: "03",
    title: "Для салонов",
    sub: "Внедрение премиальных практик",
    text: "Обучение команды, повышение ценности услуг, стандарты клиентского пути и система удержания клиентов.",
    href: "/dlya-salonov",
    btn: "Обсудить внедрение",
  },
  {
    num: "04",
    title: "Профессиональные встречи",
    sub: "Закрытые лекции и разборы",
    text: "Встречи для специалистов и владельцев, которые хотят глубже понимать работу с телом, клиентом и практикой.",
    href: "/professionalnye-vstrechi",
    btn: "Ближайшие встречи",
  },
  {
    num: "05",
    title: "Закрытая практика",
    sub: "Индивидуальный формат",
    text: "Персональная работа с вашей практикой: мышление, позиция, клиентский опыт, стоимость — без групповых компромиссов.",
    href: "/zakrytaya-praktika",
    btn: "Обсудить участие",
  },
  {
    num: "06",
    title: "Диагностика салона",
    sub: "Профессиональный аудит",
    text: "Анализ клиентского пути, компетенций мастеров, ценности услуг и потенциала роста массажного направления.",
    href: "/diagnostika-salona",
    btn: "Узнать подробнее",
  },
];

export default function Catalog() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Программы — Dok Диалог</title>
        <meta name="description" content="Программы внутри системы Dok Диалог: для специалистов, для салонов, профессиональные встречи, закрытая практика и форматы участия." />
        <meta property="og:title" content="Программы — Dok Диалог" />
      </Helmet>
      <DokNavbar />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          <div style={{ maxWidth: 680, marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>
              Направления
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 20 }}>
              Программы внутри системы Dok Диалог
            </h1>
            <p style={{ fontSize: 16, color: "#5a5a5a", lineHeight: 1.8, margin: 0 }}>
              Каждая программа — часть общей системы. Мышление специалиста, работа с телом, клиентский опыт, поток, границы и профессиональная устойчивость.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cat-grid">
            {PROGRAMS.map((p) => (
              <a
                key={p.num}
                href={p.href}
                className="cat-card"
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "32px 28px",
                  textDecoration: "none",
                  color: "#1a1a1a",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  border: "1px solid #e8e8e4",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 16px 48px ${ACCENT_SHADOW}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: ACCENT, marginBottom: 16 }}>{p.num}</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.2 }}>{p.title}</h2>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>{p.sub}</div>
                <p style={{ fontSize: 13.5, color: "#5a5a5a", lineHeight: 1.7, margin: "0 0 24px", flex: 1 }}>{p.text}</p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: ACCENT, fontSize: 13, fontWeight: 600,
                  borderTop: "1px solid #f0f0f0", paddingTop: 16,
                  transition: "gap 0.2s",
                }}>
                  {p.btn}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 72, background: "#1a2a2a", borderRadius: 24, padding: "52px 48px", display: "flex", flexWrap: "wrap" as const, gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                Не знаете, с чего начать?
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.75, maxWidth: 480 }}>
                Пройдите диагностику формата — определим направление, которое соответствует вашей задаче.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
              <a href="/quiz"
                style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
              >
                Пройти диагностику
              </a>
              <a href="/kontakty"
                style={{ display: "inline-block", background: "transparent", color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: "1.5px solid rgba(255,255,255,0.25)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.25)"; el.style.transform = "translateY(0)"; }}
              >
                Написать напрямую
              </a>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .cat-grid { grid-template-columns: 1fr !important; } .cat-card { padding: 24px 20px !important; } }
      `}</style>

      <DokFooter />
    </div>
  );
}
