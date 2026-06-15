import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const STATS = [
  { value: "200+", label: "салонов на платформе" },
  { value: "20+", label: "инструментов" },
  { value: "40+", label: "программ обучения" },
  { value: "4.9", label: "средняя оценка" },
];

const CASES = [
  {
    result: "+22%",
    metric: "к повторной записи",
    title: "Салон красоты «Виктория»",
    location: "Москва",
    role: "Администратор",
    desc: "Внедрили скрипты повторной записи и алгоритм возврата клиентов. За два месяца возвращаемость выросла с 41% до 63%.",
    tools: ["Скрипты общения", "Повторная запись"],
  },
  {
    result: "+35%",
    metric: "к личному доходу",
    title: "Специалист по телу Ольга К.",
    location: "Санкт-Петербург",
    role: "Специалист",
    desc: "Начала вести социальные сети с генератором контента. Четыре Reels принесли 18 новых клиентов на курс.",
    tools: ["Генератор постов", "Идеи для Reels"],
  },
  {
    result: "+18%",
    metric: "к продажам услуг",
    title: "Студия nail & brow «Линия»",
    location: "Казань",
    role: "Администратор",
    desc: "После обучения скриптам допродаж средний чек вырос с 2800 до 3300 рублей. Решающим стал правильный момент предложения.",
    tools: ["Скрипты общения", "Работа с возражениями"],
  },
];

export default function Keysy() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Кейсы и результаты салонов — истории успеха | Про Диалог</title>
        <meta name="description" content="Реальные истории салонов красоты, которые выросли с платформой Про Диалог. Цифры, результаты, опыт владельцев и мастеров." />
        <meta name="keywords" content="кейсы салонов красоты, результаты роста салона, истории успеха, платформа для салона отзывы" />
        <link rel="canonical" href="https://promtdialog.ru/keysy" />
        <meta property="og:title" content="Кейсы — реальные результаты салонов с Про Диалог" />
        <meta property="og:description" content="200+ салонов уже растут с платформой. Читайте истории успеха и реальные цифры." />
        <meta property="og:url" content="https://promtdialog.ru/keysy" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
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
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Кейсы</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
            Результаты наших клиентов
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0", fontWeight: 300, maxWidth: 620 }}>
            Истории салонов и специалистов, которые уже используют Про Диалог в ежедневной работе.
          </p>
        </div>
      </section>

      {/* ── СТАТИСТИКА ── */}
      <section style={{ background: DARK, padding: "0 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{ background: DARK, padding: "56px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(40px,5vw,56px)", fontWeight: 600, color: "#fff", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 12, letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── КЕЙСЫ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 72, maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Истории</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Истории успеха
            </h2>
          </div>

          <div className="cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {CASES.map((c, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 36px", display: "flex", flexDirection: "column", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
              >
                <Icon name="Quote" size={24} style={{ color: TEAL, marginBottom: 24 }} />
                <div style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 600, color: TEAL, lineHeight: 1 }}>{c.result}</div>
                <div style={{ fontSize: 14, color: GRAY, marginTop: 6, marginBottom: 28, fontWeight: 300 }}>{c.metric}</div>

                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 28px", fontWeight: 300, flex: 1 }}>{c.desc}</p>

                <div style={{ paddingTop: 24, borderTop: "1px solid #EAEEF3" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: GRAY, marginTop: 4, marginBottom: 18 }}>{c.location} · {c.role}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {c.tools.map((t, ti) => (
                      <span key={ti} style={{ fontSize: 12, fontWeight: 400, color: DARK, border: "1px solid #EAEEF3", borderRadius: 2, padding: "5px 12px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Ваш результат — следующий
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Начните со 100 энергий в подарок и проверьте платформу на своём салоне.
          </p>
          <Link to="/cabinet" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 44px", borderRadius: 2,
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, letterSpacing: "0.3px",
            textDecoration: "none", position: "relative", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            Попробовать бесплатно <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 880px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .cases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}