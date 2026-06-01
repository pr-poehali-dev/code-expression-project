import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const CASES = [
  {
    icon: "💇",
    result: "+22%",
    metric: "к повторной записи",
    title: "Салон красоты «Виктория», Москва",
    role: "Администратор",
    desc: "Внедрили скрипты повторной записи и алгоритм возврата клиентов. За 2 месяца возвращаемость выросла с 41% до 63%.",
    tools: ["Скрипты общения", "Повторная запись"],
    color: TEAL,
  },
  {
    icon: "🤲",
    result: "+35%",
    metric: "к личному доходу",
    title: "Специалист по телу Ольга К., Санкт-Петербург",
    role: "Специалист",
    desc: "Начала вести соцсети с помощью генератора постов. Записала 4 Reels — получила 18 новых клиентов на курс массажа.",
    tools: ["Генератор постов", "Идеи для Reels"],
    color: "#8B5CF6",
  },
  {
    icon: "🏠",
    result: "+18%",
    metric: "к продажам доп. услуг",
    title: "Студия nail & brow «Линия», Казань",
    role: "Администратор",
    desc: "После обучения по скриптам допродаж средний чек вырос с 2800 до 3300 ₽. Секрет — правильный момент предложения.",
    tools: ["Скрипты общения", "Работа с возражениями"],
    color: "#F59E0B",
  },
];

const STATS = [
  { value: "200+", label: "Салонов используют платформу" },
  { value: "20+", label: "ИИ-инструментов в кабинете" },
  { value: "40+", label: "Программ обучения в академии" },
  { value: "4.9★", label: "Средняя оценка от пользователей" },
];

export default function Keysy() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px" }}>
            Реальные результаты
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
            Истории салонов и специалистов, которые уже используют Про Диалог
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: TEAL, padding: "48px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: "16px" }}>
              <div style={{ fontSize: "clamp(32px,4vw,44px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cases */}
      <section style={{ padding: "80px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: DARK, textAlign: "center", margin: "0 0 48px" }}>Истории успеха</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
            {CASES.map((c, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                {/* Header */}
                <div style={{ background: `${c.color}12`, padding: "28px", borderBottom: `3px solid ${c.color}25` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 40 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: c.color, lineHeight: 1 }}>{c.result}</div>
                      <div style={{ fontSize: 13, color: GRAY, fontWeight: 500 }}>{c.metric}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Роль: {c.role}</div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px 28px" }}>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>{c.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.tools.map((t, ti) => (
                      <span key={ti} style={{ fontSize: 12, fontWeight: 600, color: c.color, background: `${c.color}12`, borderRadius: 6, padding: "4px 10px", border: `1px solid ${c.color}25` }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for more cases */}
      <section style={{ padding: "0 24px 80px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ width: "100%", height: 200, borderRadius: 20, border: "2px dashed #CBD5E1", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 36 }}>📸</div>
            <div style={{ fontWeight: 600, color: "#94A3B8", fontSize: 15 }}>Видео-отзывы клиентов</div>
            <div style={{ fontSize: 13, color: "#CBD5E1" }}>Рекомендуемый размер: 1100 × 200 px</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: DARK, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
            Ваш результат следующий
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>
            Начните с бесплатных 100 ⚡ и проверьте платформу на своём салоне
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 36px", borderRadius: 12, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />
    </div>
  );
}
