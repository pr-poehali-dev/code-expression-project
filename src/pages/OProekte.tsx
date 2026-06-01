import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const VALUES = [
  { icon: "💬", title: "Коммуникация — основа прибыли", desc: "99% проблем салона — это проблемы в общении: с клиентами, внутри команды, в маркетинге. Мы помогаем их решить." },
  { icon: "🤝", title: "Инструменты для людей, не для IT", desc: "Никакого сложного интерфейса. Всё создано для владельцев салонов, которые не являются технарями." },
  { icon: "🎯", title: "Результат, а не технологии", desc: "Нас не интересует, впечатлит ли вас ИИ. Нас интересует, вырастет ли ваша выручка и вернутся ли клиенты." },
  { icon: "📈", title: "Рост через команду", desc: "Один сильный владелец не изменит бизнес. Когда растёт вся команда — растёт весь салон." },
];

const TIMELINE = [
  { year: "2019", text: "Начало работы в индустрии красоты — обучение специалистов и администраторов" },
  { year: "2022", text: "Первые курсы по коммуникации для владельцев салонов. 200+ выпускников" },
  { year: "2024", text: "Появление первых ИИ-инструментов для команд. Пилот с 20 салонами" },
  { year: "2025", text: "Запуск платформы Про Диалог — полноценная экосистема для роста салона" },
];

export default function OProekte() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="about-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>Наша история</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,50px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1.1 }}>
              О проекте<br />Про Диалог
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", margin: "0 0 12px", lineHeight: 1.7 }}>
              Мы создаём платформу, где технологии служат живому бизнесу — а не усложняют его.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7 }}>
              Про Диалог вырос из многолетней практики в индустрии красоты. Мы видели, как салоны теряют клиентов и деньги не из-за плохого сервиса, а из-за отсутствия правильного диалога.
            </p>
          </div>
          <div>
            <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 20, border: "2px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 40 }}>👤</div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Фото основателя</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>Рекомендуемый размер: 600 × 450 px</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why communication = profit */}
      <section style={{ background: "#F8FAFC", padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: DARK, margin: "0 0 24px" }}>
            Почему коммуникация<br />влияет на прибыль
          </h2>
          <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.8, margin: "0 0 16px" }}>
            Клиент уходит не потому, что мастер плохо работает. Он уходит потому, что никто не позвал вернуться. Потому что администратор не предложил уход. Потому что в соцсетях тихо уже месяц.
          </p>
          <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.8, margin: "0 0 16px" }}>
            Исследования показывают: 68% клиентов уходят не из-за качества услуг, а из-за ощущения безразличия. Это значит — каждый второй потерянный клиент был потерян из-за коммуникации.
          </p>
          <p style={{ fontSize: 17, color: DARK, lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
            Про Диалог — платформа, которая помогает выстроить правильный диалог на каждом этапе: с клиентом, внутри команды, в маркетинге.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: DARK, textAlign: "center", margin: "0 0 48px" }}>Наши принципы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: "#F8FAFC", borderRadius: 18, padding: "28px 24px", border: "1.5px solid #E2E8F0" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 10px" }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: DARK, padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#fff", textAlign: "center", margin: "0 0 48px" }}>История</h2>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 24, marginBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(20,184,166,0.2)", border: "2px solid rgba(20,184,166,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: TEAL }}>{t.year}</div>
                {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: "rgba(255,255,255,0.08)", marginTop: 8 }} />}
              </div>
              <div style={{ paddingTop: 12, paddingBottom: i < TIMELINE.length - 1 ? 24 : 0 }}>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7 }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0D9488,#14B8A6)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 16px" }}>
            Станьте частью Про Диалог
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", margin: "0 0 32px" }}>
            Зарегистрируйтесь и получите 100 ⚡ в подарок
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "15px 40px", borderRadius: 12, background: "#fff", color: "#0D9488", fontSize: 16, fontWeight: 800, textDecoration: "none" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
