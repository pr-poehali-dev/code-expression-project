import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const CATEGORIES = [
  {
    icon: "Crown",
    title: "Владельцам",
    desc: "Управление, финансы, команда и стратегия роста.",
    courses: ["Как увеличить прибыль салона", "Финансовый учёт без бухгалтера", "Построение сильной команды", "Продвижение без бюджета"],
    count: 12,
  },
  {
    icon: "Briefcase",
    title: "Администраторам",
    desc: "Продажи, сервис, работа с клиентами и возражениями.",
    courses: ["Продажи без давления", "Повторная запись", "Скрипты администратора", "Конфликтные клиенты"],
    count: 9,
  },
  {
    icon: "Scissors",
    title: "Мастерам",
    desc: "Личный бренд, доход, социальные сети и сервис.",
    courses: ["Личный бренд мастера", "Как зарабатывать больше", "Социальные сети для мастера", "Клиентский сервис"],
    count: 8,
  },
  {
    icon: "HandHeart",
    title: "Специалистам по телу",
    desc: "Диагностика, протоколы и системная работа с клиентом.",
    courses: ["Диагностика клиента", "Программы восстановления", "Работа с хроническими состояниями", "Клиент на курс"],
    count: 11,
  },
];

export default function Akademiya() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px", width: "100%", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
            <Icon name="GraduationCap" size={14} style={{ color: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>40+ курсов и программ</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
            Академия Про Диалог
          </h1>
          <p style={{ fontSize: "clamp(17px,2.2vw,21px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: "0 auto", fontWeight: 300, maxWidth: 640 }}>
            Обучение для каждого члена команды — от владельца до специалиста. Практика, которая работает в реальном салоне.
          </p>
        </div>
      </section>

      {/* ── ПЛЕЙСХОЛДЕР МЕДИА ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", boxShadow: "0 24px 64px rgba(15,23,42,0.18)" }}>
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/4a7b5d70-b350-442c-a621-708565ae81dd.jpg"
              alt="Академия Про Диалог — обучение команды салона"
              style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 50%, transparent 100%)" }} />
            <div style={{ position: "absolute", top: "50%", left: 40, transform: "translateY(-50%)", maxWidth: 440 }} className="akad-img-text">
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,34px)", fontWeight: 600, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>
                Обучение, которое работает в реальном салоне
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
                Практические программы для всей команды — от управления до личного бренда мастера.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── КАТЕГОРИИ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Направления</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Выберите направление
            </h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0, fontWeight: 300 }}>Обучение адаптировано под конкретную роль в салоне</p>
          </div>

          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} style={{ background: "#fff", display: "flex", flexDirection: "column", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
              >
                <div style={{ padding: "40px 32px 28px", borderBottom: "1px solid #EAEEF3" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon name={cat.icon} size={24} style={{ color: TEAL }} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>{cat.title}</h3>
                  <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{cat.desc}</p>
                </div>
                <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>Популярные программы</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {cat.courses.map((c, ci) => (
                      <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Icon name="Check" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5, fontWeight: 300 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #EAEEF3", display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="BookOpen" size={16} style={{ color: TEAL }} />
                    <span style={{ fontSize: 14, color: DARK, fontWeight: 500 }}>{cat.count} программ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Перейти в магазин обучения
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Все курсы, программы и мастер-классы на образовательной платформе.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <a href="#" style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 38px", borderRadius: 2,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, letterSpacing: "0.3px",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              Открыть магазин обучения <Icon name="ArrowRight" size={16} />
            </a>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", padding: "16px 38px", borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 15, fontWeight: 400, letterSpacing: "0.3px",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.22)"}
            >
              Попробовать платформу
            </Link>
          </div>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 880px) {
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}