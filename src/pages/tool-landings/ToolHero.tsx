import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { TOOL_IMAGES } from "./toolImages";
import { ToolConfig, TEAL, TEAL2, DARK, SERIF } from "./types";

const CTA_STYLE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 2,
  background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 15, fontWeight: 700,
  textDecoration: "none", boxShadow: "0 8px 28px rgba(45,212,191,0.3)",
};

function Eyebrow({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>{text}</span>
    </div>
  );
}

function Title({ title, accent, center }: { title: string; accent: string; center?: boolean }) {
  return (
    <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,60px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.5px", textAlign: center ? "center" : "left" }}>
      {title} <span style={{ color: TEAL }}>{accent}</span>
    </h1>
  );
}

function Facts({ facts, center }: { facts: string[]; center?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: center ? "center" : "flex-start", marginTop: 32 }}>
      {facts.map(f => (
        <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "7px 14px" }}>
          <Icon name="Check" size={13} style={{ color: TEAL }} />
          {f}
        </span>
      ))}
    </div>
  );
}

function Actions({ center }: { center?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: center ? "center" : "flex-start" }}>
      <Link to="/cabinet" style={CTA_STYLE}>
        <Icon name="Zap" size={17} />
        Попробовать бесплатно
      </Link>
      <Link to="/vozmozhnosti" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none" }}>
        Все возможности
      </Link>
    </div>
  );
}

const Lead = ({ text, center }: { text: string; center?: boolean }) => (
  <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.64)", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300, maxWidth: 560, marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0, textAlign: center ? "center" : "left" }}>{text}</p>
);

export default function ToolHero({ cfg }: { cfg: ToolConfig }) {
  const { hero } = cfg;
  const img = TOOL_IMAGES[cfg.slug];
  const bg = `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`;

  if (hero.variant === "center") {
    return (
      <section style={{ background: bg, paddingTop: 76, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "88px 24px 0", textAlign: "center", position: "relative" }}>
          <Eyebrow text={hero.eyebrow} />
          <Title title={hero.title} accent={hero.accent} center />
          <Lead text={hero.lead} center />
          <Actions center />
          <Facts facts={hero.facts} center />
          {img && (
            <div style={{ marginTop: 56, borderRadius: "16px 16px 0 0", overflow: "hidden", border: "1px solid rgba(45,212,191,0.2)", borderBottom: "none", boxShadow: "0 -20px 80px rgba(45,212,191,0.08)" }}>
              <img src={img} alt={cfg.name} decoding="async" fetchPriority="high" style={{ width: "100%", aspectRatio: "21 / 9", objectFit: "cover", display: "block" }} />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: bg, paddingTop: 76, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", right: "-6%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div className="tl-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "88px 32px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center", position: "relative" }}>
        <div>
          <Eyebrow text={hero.eyebrow} />
          <Title title={hero.title} accent={hero.accent} />
          <Lead text={hero.lead} />
          <Actions />
          <Facts facts={hero.facts} />
        </div>

        {hero.variant === "mockup" && hero.mock ? (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 20, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none" }} />
            <div style={{ position: "relative", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 22px 20px", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon name={hero.mock.icon} size={17} style={{ color: TEAL }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{hero.mock.title}</span>
              </div>
              {hero.mock.rows.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, flexShrink: 0, width: 92, textTransform: "uppercase", letterSpacing: "0.6px", paddingTop: 2 }}>{r.k}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>{r.v}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Sparkles" size={14} style={{ color: TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>{hero.mock.badge}</span>
              </div>
            </div>
          </div>
        ) : (
          img && (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 20, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img src={img} alt={cfg.name} decoding="async" fetchPriority="high" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 18, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
