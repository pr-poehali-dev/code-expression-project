import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const FOR_WHOM = [
  { icon: "Building2", title: "Владелец салона красоты", desc: "Хочешь расти быстрее конкурентов, но не знаешь, за что взяться в первую очередь — платформа даёт чёткий ориентир." },
  { icon: "Scissors", title: "Специалист / мастер", desc: "Хочешь больше клиентов и дохода — получи инструменты личного роста, маркетинга и обучения." },
  { icon: "ClipboardList", title: "Управляющий салона", desc: "Не хочешь терять сильных людей — используй систему для удержания команды и прозрачного контроля результата." },
];

export default function IndexHero() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>ИИ-платформа для салона красоты</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              ИИ-агенты для развития вашего бизнеса
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              Диагностика, маркетинг, обучение команды и аналитика — всё в одной платформе. Работают под задачи вашего салона каждый день.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0 0 40px", fontWeight: 500, letterSpacing: "0.5px" }}>
              Больше клиентов · Выше чек · Сильнее команда
            </p>

            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <Icon name="Zap" size={16} />
              Попробовать бесплатно
            </Link>

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
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/17441cfe-b66d-4a86-ad10-5a1fca3bfed4.png"
                alt="Промт Диалог — ИИ-инструменты для роста салона красоты"
                fetchpriority="high"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
              <div className="hero-badge" style={{
                position: "absolute", bottom: 16, right: 16, zIndex: 3,
                background: "rgba(8,14,28,0.75)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(45,212,191,0.25)", borderRadius: 4,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="TrendingUp" size={15} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Рост выручки салона</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>через обучение, маркетинг и ИИ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО ── */}
      <section style={{ background: "#F8FAFC", padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="value-grid">
          {[
            { icon: "Target", title: "Работает под ваш бизнес", desc: "Не для всех подряд — ИИ-агенты анализируют именно ваши данные, команду и клиентов, а не абстрактный салон." },
            { icon: "Layers", title: "Весь цикл роста в одном месте", desc: "От анализа клиентов и команды — до маркетинга и обучения. Не нужно собирать инструменты по разным сервисам." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "36px 32px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(45,212,191,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={item.icon} size={22} style={{ color: TEAL }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. ДЛЯ КОГО ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для кого</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Для кого эта платформа?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {FOR_WHOM.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(45,212,191,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={24} style={{ color: TEAL }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}