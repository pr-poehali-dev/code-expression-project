import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiKarShared";

const ITEMS = [
  {
    icon: "Rocket",
    title: "Войти в профессию быстро",
    text: "Вам не нужны годы обучения, чтобы начать. За один день интенсива вы получите концентрат практики и понимания, который станет вашей рабочей базой.",
  },
  {
    icon: "Brain",
    title: "Понимание, а не просто движения",
    text: "Мы учим не набору приёмов, а логике работы с телом. Когда вы понимаете, почему и что делаете — вы можете адаптироваться к любому запросу клиента.",
  },
  {
    icon: "ShieldCheck",
    title: "Безопасно под наблюдением тренера",
    text: "Тренер видит каждого участника вживую и корректирует технику в моменте. Вы уйдёте уверенными, что делаете всё правильно.",
  },
  {
    icon: "Gift",
    title: "Онлайн-курсы для продолжения пути",
    text: "После интенсива у вас будет доступ ко всем онлайн-курсам — чтобы продолжать развиваться, закреплять техники и двигаться вперёд в своём темпе.",
  },
];

export default function CoiKarPhilosophySection() {
  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${ACCENT}12`, borderRadius: 20, padding: "5px 16px", marginBottom: 16 }}>
            <Icon name="Lightbulb" size={13} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 0.5 }}>ПОЧЕМУ ОБУЧЕНИЕ УДОБНО</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.2 }}>
            Один день — и у вас есть база,<br />
            с которой можно начинать
          </h2>
          <p style={{ fontSize: 15.5, color: "#666", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            Не просто набор движений, а понимание логики работы с телом. Это то, что отличает специалиста от человека с набором техник.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }} className="philosophy-grid">
          {ITEMS.map((item) => (
            <div key={item.title} style={{ background: "#f8f8f6", border: "1px solid #e8e8e4", borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={item.icon} size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5, color: "#1a1a1a", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="philosophy-cta" style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185, 85%, 22%) 100%)`,
          borderRadius: 22, padding: "32px 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap", position: "relative", overflow: "hidden",
          boxShadow: `0 8px 40px ${ACCENT}40`,
        }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 12 }}>
              Вы уйдёте с пониманием, как начать<br />развиваться в этой сфере
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              Рабочие техники, уверенность в первых шагах и все онлайн-курсы в подарок — чтобы продолжать путь в профессии.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {["7 онлайн-курсов в подарок", "Старт с нуля", "Востребованная профессия"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.13)", borderRadius: 20, padding: "4px 12px" }}>
                  <Icon name="Check" size={11} style={{ color: "#fff" }} />
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="#pay" className="philosophy-cta-btn" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#fff", color: ACCENT, fontWeight: 700, fontSize: 14.5, borderRadius: 14,
            padding: "14px 28px", textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", flexShrink: 0, position: "relative",
            transition: "opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.9"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
          >
            Занять место на интенсиве
            <Icon name="ArrowRight" size={15} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .philosophy-grid { grid-template-columns: 1fr !important; }
          .philosophy-cta { padding: 24px 22px !important; border-radius: 18px !important; flex-direction: column !important; align-items: flex-start !important; }
          .philosophy-cta-btn { width: 100% !important; box-sizing: border-box !important; }
        }
        @media (max-width: 480px) {
          .philosophy-cta { padding: 20px 18px !important; }
        }
      `}</style>
    </section>
  );
}
