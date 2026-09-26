import { TEAL, DARK, SERIF, CtaButton } from "./shared";

export default function DlyaPsihologovHero() {
  return (
    <section style={{
      background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      paddingTop: 76, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "90px 32px 100px", width: "100%", display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 56, alignItems: "center", position: "relative" }} className="psy-hero-grid">
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Для психологов</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.8vw,58px)", fontWeight: 500, color: "#fff", lineHeight: 1.12, margin: "0 0 26px", letterSpacing: "-0.5px" }}>
            Вы хороший психолог. Но знаете ли вы, что мешает вашей практике расти?
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 520 }}>
            Промт Диалог анализирует вашу практику, цели и текущие показатели и показывает, на что стоит обратить внимание и что сделать следующим шагом.
          </p>

          <CtaButton big />

          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>Без оплаты. Регистрация займёт несколько минут.</span>
            <span style={{ fontSize: 13, color: TEAL, fontWeight: 400 }}>После диагностики вы получите персональный анализ и первые шаги развития.</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }} className="psy-hero-img">
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d62e4008-3488-4fef-bf8a-fdc8e48692e0.jpg"
              alt="Промт Диалог для психологов — диагностика и развитие частной практики"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
