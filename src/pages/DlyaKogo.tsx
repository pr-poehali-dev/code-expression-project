import { useState } from "react";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const ROLES = [
  {
    id: "owner",
    icon: "👔",
    title: "Владельцу салона",
    subtitle: "Управляйте бизнесом с данными, а не интуицией",
    color: "#8B5CF6",
    pain: "Много работаете, но прибыль не растёт. Непонятно, где теряются деньги и что мешает масштабироваться.",
    tools: [
      { icon: "📋", name: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки" },
      { icon: "🧑‍💼", name: "Анализ персонала", desc: "Кто реально приносит прибыль" },
      { icon: "🔬", name: "Диагностика салона", desc: "Аудит всех направлений бизнеса" },
      { icon: "📈", name: "Финансовые расчёты", desc: "Точки безубыточности и прогнозы" },
    ],
  },
  {
    id: "admin",
    icon: "💼",
    title: "Администратору",
    subtitle: "Продавайте больше без давления и скриптов в голове",
    color: "#F59E0B",
    pain: "Клиенты уходят без повторной записи. Не знаете, как мягко предложить доп. услугу или отработать возражение.",
    tools: [
      { icon: "💬", name: "Скрипты общения", desc: "Готовые сценарии на любую ситуацию" },
      { icon: "🛡️", name: "Работа с возражениями", desc: "Ответы на «дорого» и «подумаю»" },
      { icon: "🔄", name: "Повторная запись", desc: "Алгоритм возврата клиента" },
      { icon: "⭐", name: "Ответы на отзывы", desc: "Профессиональная репутация онлайн" },
    ],
  },
  {
    id: "master",
    icon: "✂️",
    title: "Мастеру",
    subtitle: "Растите личный доход и базу постоянных клиентов",
    color: TEAL,
    pain: "Клиенты не возвращаются именно к вам. Соцсети не ведёте, потому что не знаете, о чём писать.",
    tools: [
      { icon: "✍️", name: "Генератор постов", desc: "Контент о себе и своей работе" },
      { icon: "🎬", name: "Идеи для Reels", desc: "Сценарии коротких видео" },
      { icon: "📝", name: "Шпаргалки мастера", desc: "Памятки по техникам и продуктам" },
      { icon: "💬", name: "Скрипты допродаж", desc: "Предложите уход правильно" },
    ],
  },
  {
    id: "specialist",
    icon: "🤲",
    title: "Специалисту по телу",
    subtitle: "Работайте глубже — с контекстом каждого клиента",
    color: "#EF4444",
    pain: "Каждый клиент уникален, но нет времени всё держать в голове. Хочется давать персональный результат.",
    tools: [
      { icon: "🔍", name: "Диагностика клиента", desc: "Структурированный опрос и анализ" },
      { icon: "💆", name: "Программы восстановления", desc: "Индивидуальный план на курс" },
      { icon: "📝", name: "Шпаргалки специалиста", desc: "Противопоказания, протоколы" },
      { icon: "✍️", name: "Контент о практике", desc: "Посты для личного бренда" },
    ],
  },
];

export default function DlyaKogo() {
  const [activeId, setActiveId] = useState("owner");
  const active = ROLES.find(r => r.id === activeId)!;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Для кого Про Диалог
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
            Платформа создана для каждого члена команды салона — от владельца до специалиста
          </p>
        </div>
      </section>

      {/* Role selector */}
      <section style={{ padding: "64px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setActiveId(r.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 24px",
                  borderRadius: 12, border: "2px solid", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600,
                  transition: "all 0.2s",
                  borderColor: activeId === r.id ? r.color : "#E2E8F0",
                  background: activeId === r.id ? `${r.color}15` : "#fff",
                  color: activeId === r.id ? r.color : GRAY,
                  boxShadow: activeId === r.id ? `0 4px 16px ${r.color}25` : "none",
                }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                {r.title}
              </button>
            ))}
          </div>

          {/* Active role content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }} className="role-grid">
            {/* Left: description */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "36px", border: "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>{active.icon}</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: DARK, margin: "0 0 12px" }}>{active.title}</h2>
              <p style={{ fontSize: 17, fontWeight: 600, color: active.color, margin: "0 0 16px" }}>{active.subtitle}</p>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", borderLeft: `4px solid ${active.color}` }}>
                <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{active.pain}</p>
              </div>
              <Link to="/cabinet" style={{ display: "inline-block", marginTop: 28, padding: "13px 28px", borderRadius: 10, background: active.color, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                Попробовать →
              </Link>
            </div>

            {/* Right: tools */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Инструменты для этой роли</div>
              {active.tools.map((t, i) => (
                <div key={i} style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${active.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: GRAY }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: DARK, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
            Начните с 100 ⚡ бесплатно
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 28px" }}>
            Зарегистрируйтесь, создайте профиль салона и получите подарок
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 36px", borderRadius: 12, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Создать профиль
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
