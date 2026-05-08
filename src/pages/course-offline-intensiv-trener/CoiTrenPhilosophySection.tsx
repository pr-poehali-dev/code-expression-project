import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiTrenShared";

const ITEMS = [
  {
    icon: "Dumbbell",
    title: "Тренировка + восстановление = результат",
    text: "Когда тело зажато и перегружено — прогресс замедляется. Человек быстрее устаёт, чувствует дискомфорт и теряет мотивацию. Восстановительные техники помогают убрать барьеры, которые мешают прогрессу.",
  },
  {
    icon: "Eye",
    title: "Видеть тело, а не только движение",
    text: "На интенсиве тренер научится читать тело — понимать, где есть напряжение и как оно влияет на движение. Это меняет качество работы с любым клиентом.",
  },
  {
    icon: "HandHeart",
    title: "Практика под наблюдением",
    text: "Восстановительные техники важно делать правильно. Тренер видит каждого участника вживую и корректирует технику в моменте — это невозможно получить онлайн.",
  },
  {
    icon: "Gift",
    title: "Онлайн-курсы в подарок",
    text: "Все онлайн-курсы в стоимость интенсива — чтобы пересматривать техники и внедрять методики в работу шаг за шагом.",
  },
];

export default function CoiTrenPhilosophySection() {
  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${ACCENT}12`, borderRadius: 20, padding: "5px 16px", marginBottom: 16 }}>
            <Icon name="Lightbulb" size={13} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 0.5 }}>ПОЧЕМУ ЭТО ВАЖНО</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.2 }}>
            Сегодня востребованы специалисты,<br />
            которые умеют не только тренировать
          </h2>
          <p style={{ fontSize: 15.5, color: "#666", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            Восстановление — это часть результата. Тренер, который понимает тело глубже, даёт клиентам совершенно другой уровень работы.
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
              Вы получите практические инструменты,<br />которые можно использовать сразу
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              В работе с клиентами, спортсменами и людьми, которые просто хотят двигаться без боли и ограничений. И всё это — в один день.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {["7 онлайн-курсов в подарок", "Живая обратная связь тренера", "Уверенность в каждой технике"].map(t => (
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
