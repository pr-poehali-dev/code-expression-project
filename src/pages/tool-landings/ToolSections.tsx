import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Section, ToolConfig, TEAL, TEAL2, DARK, GRAY, SERIF } from "./types";

const eyebrowStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 };
const h2Style: React.CSSProperties = { fontFamily: SERIF, fontSize: "clamp(28px,4vw,46px)", fontWeight: 500, margin: 0, lineHeight: 1.12, letterSpacing: "-0.5px" };
const iconBox: React.CSSProperties = { width: 46, height: 46, borderRadius: 12, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const auto = (min: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(min(${min}px,100%),1fr))`, gap: 20 });

function Moments({ s, bg }: { s: Extract<Section, { type: "moments" }>; bg: string }) {
  return (
    <section style={{ background: bg, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={eyebrowStyle}>{s.eyebrow}</div>
        <h2 style={{ ...h2Style, color: DARK, marginBottom: 44, maxWidth: 720 }}>{s.title}</h2>
        <div style={auto(240)}>
          {s.items.map((it, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "26px 22px" }}>
              <div style={{ ...iconBox, marginBottom: 16 }}>
                <Icon name={it.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: "0 0 8px", lineHeight: 1.3 }}>{it.title}</h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Versus({ s, bg }: { s: Extract<Section, { type: "versus" }>; bg: string }) {
  const col = (list: string[], good: boolean) => (
    <div style={{ background: good ? DARK : "#fff", border: good ? "1px solid rgba(45,212,191,0.3)" : "1px solid #E2E8F0", borderRadius: 18, padding: "30px 28px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: good ? TEAL : "#DC2626", marginBottom: 18 }}>
        {good ? "С инструментом" : "Без инструмента"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Icon name={good ? "Check" : "X"} size={16} style={{ color: good ? TEAL : "#DC2626", flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontSize: 15, lineHeight: 1.55, color: good ? "rgba(255,255,255,0.85)" : "#475569", fontWeight: 300 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section style={{ background: bg, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ ...h2Style, color: DARK, marginBottom: 40, textAlign: "center" }}>{s.title}</h2>
        <div style={auto(300)}>
          {col(s.without, false)}
          {col(s.with, true)}
        </div>
      </div>
    </section>
  );
}

function Steps({ s, bg }: { s: Extract<Section, { type: "steps" }>; bg: string }) {
  if (s.layout === "timeline") {
    return (
      <section style={{ background: bg, padding: "96px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={eyebrowStyle}>{s.eyebrow}</div>
          <h2 style={{ ...h2Style, color: DARK, marginBottom: 48 }}>{s.title}</h2>
          <div style={{ position: "relative", paddingLeft: 36 }}>
            <div style={{ position: "absolute", left: 13, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg,#2DD4BF,rgba(45,212,191,0.1))" }} />
            {s.items.map((it, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: i < s.items.length - 1 ? 36 : 0 }}>
                <div style={{ position: "absolute", left: -36, top: 0, width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, margin: "0 0 6px" }}>{it.title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section style={{ background: DARK, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={eyebrowStyle}>{s.eyebrow}</div>
        <h2 style={{ ...h2Style, color: "#fff", marginBottom: 44, maxWidth: 720 }}>{s.title}</h2>
        <div style={auto(240)}>
          {s.items.map((it, i) => (
            <div key={i} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "26px 24px", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 12 }}>{i + 1}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{it.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento({ s, bg }: { s: Extract<Section, { type: "bento" }>; bg: string }) {
  return (
    <section style={{ background: bg, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={eyebrowStyle}>{s.eyebrow}</div>
        <h2 style={{ ...h2Style, color: DARK, marginBottom: 44, maxWidth: 720 }}>{s.title}</h2>
        <div className="tl-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }}>
          {s.items.map((it, i) => {
            const span = s.items.length % 2 === 0 && s.items.length !== 6 ? 3 : 2;
            return (
              <div key={i} style={{ gridColumn: `span ${span}`, background: i === 0 ? DARK : "#fff", border: i === 0 ? "none" : "1px solid #E2E8F0", borderRadius: 18, padding: "28px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 16, background: i === 0 ? "rgba(45,212,191,0.16)" : "rgba(45,212,191,0.12)" }}>
                  <Icon name={it.icon} fallback="Circle" size={21} style={{ color: i === 0 ? TEAL : "#0F766E" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: i === 0 ? "#fff" : DARK, margin: "0 0 8px", lineHeight: 1.3 }}>{it.title}</h3>
                <p style={{ fontSize: 14, color: i === 0 ? "rgba(255,255,255,0.68)" : "#475569", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Example({ s, bg }: { s: Extract<Section, { type: "example" }>; bg: string }) {
  return (
    <section style={{ background: bg, padding: "96px 24px" }}>
      <div className="tl-example" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={eyebrowStyle}>Пример</div>
          <h2 style={{ ...h2Style, color: DARK, marginBottom: 16, fontSize: "clamp(26px,3.4vw,40px)" }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{s.lead}</p>
        </div>
        <div style={{ background: DARK, borderRadius: 20, padding: "26px 26px 24px", boxShadow: "0 24px 60px rgba(15,23,42,0.18)" }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>{s.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {s.lines.map((l, i) => (
              <div key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, padding: "12px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, borderLeft: `2px solid ${TEAL}` }}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Strip({ s }: { s: Extract<Section, { type: "strip" }> }) {
  const n = s.items.length;
  return (
    <section style={{ background: `linear-gradient(135deg, ${DARK}, #112B3C)`, padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 640, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 style={{ ...h2Style, color: "#fff", marginBottom: 44, fontSize: "clamp(24px,3.2vw,36px)" }}>{s.title}</h2>
        <div className="tl-strip" style={{ display: "grid", gridTemplateColumns: `repeat(${n},1fr)`, gap: 16 }}>
          {s.items.map((it, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(45,212,191,0.22)", borderRadius: 16, padding: "28px 14px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.4vw,42px)", fontWeight: 600, color: TEAL, lineHeight: 1, width: it.value.length <= 2 ? 56 : "auto", height: it.value.length <= 2 ? 56 : "auto", borderRadius: "50%", background: it.value.length <= 2 ? "rgba(45,212,191,0.12)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{it.value}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.4, fontWeight: 400 }}>{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ s, bg }: { s: Extract<Section, { type: "faq" }>; bg: string }) {
  return (
    <section style={{ background: bg, padding: "96px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ ...h2Style, color: DARK, marginBottom: 32 }}>{s.title}</h2>
        <div style={{ border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
          {s.items.map((it, i) => (
            <div key={i} style={{ padding: "24px 28px", borderTop: i ? "1px solid #EAEEF3" : "none" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: DARK, margin: "0 0 8px" }}>{it.q}</h3>
              <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{it.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToolSections({ cfg }: { cfg: ToolConfig }) {
  const light = ["#F8FAFC", "#fff"];
  let n = 0;
  return (
    <>
      {cfg.sections.map((s, i) => {
        const bg = light[n++ % 2];
        switch (s.type) {
          case "moments": return <Moments key={i} s={s} bg={bg} />;
          case "versus":  return <Versus key={i} s={s} bg={bg} />;
          case "steps":   return <Steps key={i} s={s} bg={bg} />;
          case "bento":   return <Bento key={i} s={s} bg={bg} />;
          case "example": return <Example key={i} s={s} bg={bg} />;
          case "strip":   return <Strip key={i} s={s} />;
          case "faq":     return <Faq key={i} s={s} bg={bg} />;
          default:        return null;
        }
      })}
    </>
  );
}

export function ToolFinalCta({ cfg }: { cfg: ToolConfig }) {
  return (
    <section style={{ background: "#fff", padding: "96px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 20, padding: "64px 44px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,46px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.12, position: "relative" }}>{cfg.cta.title}</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", margin: "0 auto 32px", maxWidth: 520, lineHeight: 1.7, fontWeight: 300, position: "relative" }}>{cfg.cta.text}</p>
        <Link to="/cabinet" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", borderRadius: 2, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 15, fontWeight: 700, textDecoration: "none", position: "relative" }}>
          Попробовать бесплатно <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    </section>
  );
}
