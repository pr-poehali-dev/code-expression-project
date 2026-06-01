import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const RESULTS = [
  { icon: "TrendingUp", title: "Рост клиентов", desc: "Возвращаемость клиентов через выстроенную коммуникацию и интеллектуальные сценарии." },
  { icon: "Wallet", title: "Рост среднего чека", desc: "Инструменты допродаж и работы с возражениями для администраторов и мастеров." },
  { icon: "Users", title: "Сильная команда", desc: "Анализ персонала, обучение и контроль эффективности каждого сотрудника." },
  { icon: "BarChart3", title: "Контроль бизнеса", desc: "Цифровой разбор и аналитика — вы точно знаете, где теряете деньги." },
];

const TOOLS = [
  { icon: "UserSearch", title: "Анализ персонала", desc: "Кто приносит прибыль, а кто создаёт потери — объективная картина по каждому.", tag: "Управление" },
  { icon: "ClipboardList", title: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки на основе данных вашего салона.", tag: "Аналитика" },
  { icon: "PenLine", title: "Генератор контента", desc: "Пост, рилс и концепция изображения — готовы за две минуты.", tag: "Маркетинг" },
  { icon: "MessagesSquare", title: "Скрипты общения", desc: "Выверенные сценарии для сотрудников на любую ситуацию.", tag: "Продажи" },
  { icon: "Stethoscope", title: "Диагностика клиента", desc: "Структурированный опрос и программа работы для специалистов по телу.", tag: "Специалисты" },
  { icon: "Star", title: "Ответы на отзывы", desc: "Безупречные ответы на отзывы любой тональности.", tag: "Репутация" },
  { icon: "ShieldOff", title: "Барьеры роста", desc: "Выявите психологические блоки, которые мешают профессиональному развитию.", tag: "Развитие" },
  { icon: "Coins", title: "Финансовое мышление", desc: "Определите уровень финансовой зрелости и получите конкретный план роста дохода.", tag: "Финансы" },
];

const PROBLEMS = [
  "Клиенты приходят однажды и не возвращаются",
  "Сотрудники не умеют предлагать и работать с возражениями",
  "На маркетинг не остаётся времени — соцсети молчат неделями",
  "Непонятно, на каком этапе теряется прибыль",
  "Команда работает, но нет ощущения роста и развития",
  "Руководитель тянет всё на себе — делегировать не получается",
];

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 72, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Платформа роста салона</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Бизнес начинается<br />с диалога
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300, maxWidth: 520 }}>
Платформа помогает салонам красоты расти через сильную команду, качественный сервис и эффективную коммуникацию с клиентами. В одном месте вы получаете обучение сотрудников, бизнес-аналитику и ИИ-инструменты для маркетинга, продаж и управления салоном.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
                background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                Попробовать бесплатно
              </Link>
              <Link to="/vozmozhnosti" style={{
                padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 400, letterSpacing: "0.3px",
                border: "1px solid rgba(255,255,255,0.22)", color: "#fff",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.22)"}
              >
                Смотреть возможности <Icon name="ArrowRight" size={16} />
              </Link>
            </div>

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
            <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
              <div style={{
                position: "absolute", inset: -1, borderRadius: 6,
                background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))",
                pointerEvents: "none", zIndex: 2,
              }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/17441cfe-b66d-4a86-ad10-5a1fca3bfed4.png"
                alt="Платформа Про Диалог — инструменты для роста салона"
                style={{
                  width: "100%", aspectRatio: "3/4", objectFit: "cover",
                  borderRadius: 4, display: "block",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                  position: "relative", zIndex: 1,
                }}
              />
              {/* floating badge */}
              <div style={{
                position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 3,
                background: "rgba(8,14,28,0.7)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(45,212,191,0.25)", borderRadius: 4,
                padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 4, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="TrendingUp" size={20} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Рост выручки салона</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>через коммуникацию и ИИ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ПРОБЛЕМЫ ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Знакомо?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Салон работает,<br />а прибыль стоит на месте
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 0, border: "1px solid #EAEEF3" }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{ padding: "36px 32px", borderRight: "1px solid #EAEEF3", borderBottom: "1px solid #EAEEF3", display: "flex", flexDirection: "column", gap: 18 }}>
                <Icon name="Minus" size={20} style={{ color: TEAL }} />
                <p style={{ margin: 0, fontSize: 16, color: "#334155", lineHeight: 1.6, fontWeight: 400 }}>{p}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 18, color: GRAY, margin: "40px 0 0", fontWeight: 300, lineHeight: 1.6, maxWidth: 620 }}>
            Про Диалог решает эти задачи системно — давая команде инструменты, аналитику и обучение в едином пространстве.
          </p>
        </div>
      </section>

      {/* ── РЕЗУЛЬТАТЫ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результат</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Что получает салон
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 32px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement; el.style.background = DARK;
                  const h3 = el.querySelector("h3") as HTMLElement; const p = el.querySelector("p") as HTMLElement;
                  if (h3) h3.style.color = "#fff"; if (p) p.style.color = "rgba(255,255,255,0.55)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement; el.style.background = "#fff";
                  const h3 = el.querySelector("h3") as HTMLElement; const p = el.querySelector("p") as HTMLElement;
                  if (h3) h3.style.color = DARK; if (p) p.style.color = GRAY;
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                  <Icon name={r.icon} size={24} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, margin: "0 0 12px", transition: "color 0.3s" }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300, transition: "color 0.3s" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ИНСТРУМЕНТЫ ── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 72, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Инструменты</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Что внутри платформы
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300 }}>Более двадцати интеллектуальных инструментов для всей команды салона</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {TOOLS.map((t, i) => (
              <div key={i} style={{ background: DARK, padding: "36px 32px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.06)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = DARK}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <Icon name={t.icon} size={26} style={{ color: TEAL }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase" }}>{t.tag}</span>
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link to="/vozmozhnosti" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 34px", borderRadius: 2, border: "1px solid rgba(45,212,191,0.4)", color: TEAL, fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.3px" }}>
              Все возможности платформы <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Начните сегодня
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            100 энергий в подарок при создании первого салона. Без карты и обязательств.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 880px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-img { display: flex !important; order: -1; }
          .hero-img img { aspect-ratio: 16/9 !important; max-height: 280px; object-fit: cover; }
        }
      `}</style>
    </div>
  );
}