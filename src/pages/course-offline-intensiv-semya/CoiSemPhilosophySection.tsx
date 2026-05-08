import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiSemShared";

const ITEMS = [
  {
    icon: "Heart",
    title: "Заботиться о близких — это навык",
    text: "Умение помочь родному человеку снять напряжение в спине или шее — это не магия. Это конкретные техники, которым можно научиться за один день.",
  },
  {
    icon: "ShieldCheck",
    title: "Безопасно и без медицины",
    text: "Все техники мягкие и безопасные. Тренер следит за правильностью выполнения каждого участника вживую — так вы будете уверены, что делаете всё правильно.",
  },
  {
    icon: "HandHeart",
    title: "Практика, а не теория",
    text: "Интенсив построен так, чтобы вы ушли с реальными умениями, а не просто знаниями. Весь день — работа в парах под руководством тренера.",
  },
  {
    icon: "Gift",
    title: "Онлайн-курсы в подарок",
    text: "Все онлайн-курсы в стоимость интенсива — чтобы пересматривать техники и спокойно закреплять навыки в удобное время.",
  },
];

export default function CoiSemPhilosophySection() {
  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${ACCENT}12`, borderRadius: 20, padding: "5px 16px", marginBottom: 16 }}>
            <Icon name="Lightbulb" size={13} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 0.5 }}>ПОЧЕМУ ЛЮДЯМ ТАК НРАВИТСЯ</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.2 }}>
            Уже после обучения вы сможете<br />
            реально помогать своим близким
          </h2>
          <p style={{ fontSize: 15.5, color: "#666", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            Помочь после тяжёлого дня, снять напряжение в шее, облегчить ощущение «забитой» спины — и всё это без необходимости становиться врачом.
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
          borderRadius: 22,
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 8px 40px ${ACCENT}40`,
        }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 12 }}>
              Навыки, которые остаются с вами<br />на всю жизнь
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              Вы начнёте лучше чувствовать своё тело, понимать причины напряжения и сможете помогать себе и близким восстанавливаться быстрее и легче.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {["7 онлайн-курсов в подарок", "Живая обратная связь тренера", "Без медобразования"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.13)", borderRadius: 20, padding: "4px 12px" }}>
                  <Icon name="Check" size={11} style={{ color: "#fff" }} />
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="#pay" className="philosophy-cta-btn" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#fff", color: ACCENT,
            fontWeight: 700, fontSize: 14.5, borderRadius: 14,
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
