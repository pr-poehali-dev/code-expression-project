import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const SECTIONS = [
  {
    tag: "Маркетинг",
    icon: "📣",
    title: "ИИ для маркетинга",
    desc: "Контент, который привлекает клиентов — без копирайтера и дизайнера",
    color: "#8B5CF6",
    tools: [
      { icon: "✍️", name: "Генератор постов", desc: "Текст для Instagram, ВКонтакте и Telegram с хэштегами за 2 минуты" },
      { icon: "🎬", name: "Идеи для Reels", desc: "Сценарий короткого видео под вашу целевую аудиторию" },
      { icon: "🖼️", name: "Идеи изображений", desc: "Готовый бриф для дизайнера или Midjourney" },
      { icon: "⭐", name: "Ответы на отзывы", desc: "Профессиональные ответы на позитивные и негативные отзывы" },
    ],
  },
  {
    tag: "Управление",
    icon: "📊",
    title: "ИИ для управления",
    desc: "Аналитика и инсайты, которые помогают принимать правильные решения",
    color: "#F59E0B",
    tools: [
      { icon: "🧑‍💼", name: "Анализ персонала", desc: "Кто приносит прибыль, кто создаёт потери — честная картина по каждому" },
      { icon: "📋", name: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки на основе данных вашего салона" },
      { icon: "🔬", name: "Диагностика салона", desc: "Полный аудит: маркетинг, сервис, финансы, команда" },
    ],
  },
  {
    tag: "Продажи",
    icon: "💬",
    title: "ИИ для продаж",
    desc: "Готовые инструменты для увеличения среднего чека и возвращаемости",
    color: "#EF4444",
    tools: [
      { icon: "💬", name: "Скрипты общения", desc: "Сценарии для администраторов на любую ситуацию: запись, допродажа, конфликт" },
      { icon: "🛡️", name: "Работа с возражениями", desc: "Готовые ответы на «дорого», «подумаю», «не сейчас»" },
      { icon: "🔄", name: "Повторная запись", desc: "Алгоритм возврата клиента через 2–4 недели после визита" },
    ],
  },
  {
    tag: "Специалисты",
    icon: "🔍",
    title: "ИИ для специалистов",
    desc: "Инструменты, которые повышают качество работы и доверие клиентов",
    color: TEAL,
    tools: [
      { icon: "🔍", name: "Диагностика клиента", desc: "Структурированный опрос и анализ для специалистов по телу" },
      { icon: "📝", name: "Шпаргалки мастера", desc: "Краткие памятки по техникам, противопоказаниям, продуктам" },
      { icon: "💆", name: "Программы восстановления", desc: "Индивидуальный план работы с клиентом на курс" },
    ],
  },
];

export default function Vozmozhnosti() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>20+ инструментов</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Возможности платформы
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", margin: "0 0 36px", lineHeight: 1.6 }}>
            Всё необходимое для роста салона в одном кабинете — маркетинг, управление, продажи и развитие команды
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 24px rgba(20,184,166,0.4)" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map((s, si) => (
        <section key={si} style={{ padding: "72px 24px", background: si % 2 === 0 ? "#fff" : "#F8FAFC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 40, flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{s.tag}</div>
                <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: DARK, margin: "0 0 8px", letterSpacing: "-0.3px" }}>{s.title}</h2>
                <p style={{ fontSize: 16, color: GRAY, margin: 0 }}>{s.desc}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
              {s.tools.map((t, ti) => (
                <div key={ti} style={{
                  background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 16, padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = s.color; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 24px ${s.color}20`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#E2E8F0"; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{t.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>{t.name}</h3>
                  <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: DARK, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>Готовы начать?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>Создайте профиль салона и получите 100 ⚡ в подарок</p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 36px", borderRadius: 12, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />
    </div>
  );
}
