import Icon from "@/components/ui/icon";
import { DEMO_CLIENTS } from "./data";
import { TEAL, DARK, SERIF, CtaButton } from "./ui";

export default function Hero() {
  const d = DEMO_CLIENTS[0];
  return (
    <section style={{
      background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      paddingTop: 76, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "10%", right: "-8%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div className="cvl-hero" style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 32px 96px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center", position: "relative" }}>
        <div>
          <nav aria-label="Навигация" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>
            <a href="/vozmozhnosti" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Возможности</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: TEAL }}>Покажи глазами клиента</span>
          </nav>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 30 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Исследование аудитории</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(36px,5.4vw,66px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Покажи глазами клиента: <span style={{ color: TEAL }}>проверьте предложение до рекламы</span>
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.66)", lineHeight: 1.7, margin: "0 0 34px", fontWeight: 300, maxWidth: 540 }}>
            ИИ покажет услугу, цену или текст глазами трех клиентов: что привлекает, что смущает и что изменить.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }} className="cvl-hero-actions">
            <CtaButton />
            <a href="#how" className="cvl-sec" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 24px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none" }}>
              Как это работает <Icon name="ArrowDown" size={15} />
            </a>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -1, borderRadius: 22, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none" }} />
          <div style={{ position: "relative", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "22px 22px 20px", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>Услуга: «Авторский массаж тела, 60 минут, 6 000 ₽»</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "1.5px", marginBottom: 6 }}>КЛИЕНТ № {d.n}</div>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{d.title}</div>
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 999, background: d.bg, color: d.color, marginBottom: 14 }}>{d.tag}</span>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, borderLeft: `3px solid ${TEAL}`, paddingLeft: 12, marginBottom: 14 }}>«{d.thought}»</div>
            <div style={{ fontSize: 13, color: "#FBBF24", lineHeight: 1.55 }}>Сомнение: {d.doubts}</div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Клиент № 2", "Клиент № 3"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 12px" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
