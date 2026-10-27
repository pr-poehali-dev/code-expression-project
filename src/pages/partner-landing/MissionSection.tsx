const TEAL = "#2DD4BF";
const SERIF = "'Cormorant Garamond', serif";
const darkBg = "radial-gradient(120% 100% at 15% 0%, #12304A 0%, #0B1B33 55%, #060F20 100%)";

const p: React.CSSProperties = { fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.8, fontWeight: 300, margin: "0 0 18px" };
const strong: React.CSSProperties = { color: "#fff", fontWeight: 600 };

export default function MissionSection() {
  return (
    <section style={{ background: darkBg, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -160, right: -120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ maxWidth: 820, margin: "0 0 40px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Ради чего мы это делаем</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,52px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.12, letterSpacing: "-0.5px" }}>
            Наша цель — чтобы полезные решения находили тех, кому они нужны
          </h2>
        </div>
        <div style={{ maxWidth: 720 }}>
          <p style={p}>Предприниматели и специалисты часто не видят следующий шаг или не знают, кто поможет с конкретной задачей. «Промт Диалог» сокращает путь от задачи до решения: ИИ предлагает услуги партнеров там, где они подходят.</p>
          <p style={{ ...p, margin: 0 }}><span style={strong}>Поэтому нам нужны партнеры с опытом: преподаватели, консультанты, специалисты.</span> Результатов мы не обещаем и строим систему на взаимной пользе и прозрачности.</p>
        </div>
      </div>
    </section>
  );
}
