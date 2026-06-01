import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const CATEGORIES = [
  {
    icon: "👔",
    title: "Владельцам",
    color: "#8B5CF6",
    desc: "Управление, финансы, команда, стратегия роста",
    courses: ["Как увеличить прибыль салона", "Финансовый учёт без бухгалтера", "Построение команды мечты", "Продвижение без бюджета"],
    count: 12,
  },
  {
    icon: "💼",
    title: "Администраторам",
    color: "#F59E0B",
    desc: "Продажи, сервис, работа с клиентами и возражениями",
    courses: ["Продажи без давления", "Повторная запись на 100%", "Скрипты администратора", "Конфликтные клиенты"],
    count: 9,
  },
  {
    icon: "✂️",
    title: "Мастерам",
    color: TEAL,
    desc: "Личный бренд, допродажи, клиентский сервис",
    courses: ["Личный бренд мастера", "Как зарабатывать больше", "Instagram для мастера", "Клиентский сервис 5★"],
    count: 8,
  },
  {
    icon: "🤲",
    title: "Специалистам по телу",
    color: "#EF4444",
    desc: "Диагностика, протоколы, работа с клиентом",
    courses: ["Диагностика клиента", "Программы восстановления", "Работа с хроническими состояниями", "Клиент на курс"],
    count: 11,
  },
];

export default function Akademiya() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>40+ курсов и программ</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Академия Про Диалог
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", margin: "0 0 36px", lineHeight: 1.6 }}>
            Обучение для каждого члена команды — от владельца до специалиста. Практика, которая работает в реальном салоне.
          </p>
        </div>
      </section>

      {/* Image placeholder */}
      <section style={{ background: "#F8FAFC", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 56, paddingBottom: 40 }}>
          <div style={{ width: "100%", height: 280, borderRadius: 20, border: "2px dashed #CBD5E1", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 40 }}>🏫</div>
            <div style={{ fontWeight: 600, color: "#94A3B8", fontSize: 16 }}>Фото/видео об академии</div>
            <div style={{ fontSize: 13, color: "#CBD5E1" }}>Рекомендуемый размер: 1200 × 280 px</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "40px 24px 80px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: DARK, margin: "0 0 12px" }}>Выберите направление</h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0 }}>Обучение адаптировано под конкретную роль в салоне</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 20, overflow: "hidden", transition: "all 0.25s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = cat.color; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 12px 32px ${cat.color}20`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#E2E8F0"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                <div style={{ background: `${cat.color}12`, padding: "28px 28px 20px", borderBottom: `3px solid ${cat.color}30` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 6px" }}>{cat.title}</h3>
                  <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>{cat.desc}</p>
                </div>
                <div style={{ padding: "20px 28px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Популярные программы</div>
                  {cat.courses.map((c, ci) => (
                    <div key={ci} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: ci < cat.courses.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#334155" }}>{c}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: cat.color, fontWeight: 700 }}>{cat.count} программ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: DARK, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
            Перейти в магазин обучения
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>
            Все курсы, программы и мастер-классы на образовательной платформе
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
              Открыть магазин обучения →
            </a>
            <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Попробовать платформу
            </Link>
          </div>
        </div>
      </section>

      <BizFooter />
    </div>
  );
}
