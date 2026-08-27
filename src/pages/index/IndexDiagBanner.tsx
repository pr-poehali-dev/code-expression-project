import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const PINK = "hsl(335,80%,50%)";
const PINK_DARK = "hsl(335,80%,38%)";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const DIAG_POINTS = [
  { icon: "TrendingDown", text: "Где главный финансовый провал" },
  { icon: "Users", text: "Почему клиенты не возвращаются" },
  { icon: "DollarSign", text: "Расчёт скрытых денег в базе клиентов" },
  { icon: "Rocket", text: "Потенциал роста без нового трафика" },
];

export default function IndexDiagBanner() {
  return (
    <section style={{ padding: "80px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
          borderRadius: 24, padding: "56px 48px", position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40, alignItems: "center",
        }} className="diag-banner-grid">
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
              <Icon name="Sparkles" size={13} style={{ color: "#fff" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Для специалистов и команд · бесплатно</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
              Пройдите бесплатную диагностику бизнеса
            </h2>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: "0 0 28px", fontWeight: 300, maxWidth: 480 }}>
              Узнайте, где именно теряются деньги, и какие конкретные шаги приведут к вашим целям — без оплаты и без обязательств.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {DIAG_POINTS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={p.icon} size={13} style={{ color: "#fff" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>{p.text}</span>
                </div>
              ))}
            </div>
            <Link to="/diagnostika" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 36px", borderRadius: 2, fontSize: 15, fontWeight: 700,
              background: "#fff", color: PINK_DARK,
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.25)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              Пройти диагностику
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }} className="diag-banner-visual">
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 18, padding: "28px 24px", width: "100%", maxWidth: 320, backdropFilter: "blur(6px)" }}>
              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                {[["14", "вопросов"], ["~7", "минут"], ["8", "индексов"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 20 }} />
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>
                Индекс прибыльности, скрытые деньги в базе клиентов и готовый план приоритетов — сразу после диагностики.
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .diag-banner-grid { grid-template-columns: 1fr !important; padding: 40px 28px !important; }
          .diag-banner-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}