import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { FAQ } from "./data";
import { TEAL, DARK, GRAY, SERIF, Eyebrow, H2, CtaButton, wrap } from "./ui";

export function Faq() {
  return (
    <section style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={{ ...wrap, maxWidth: 860 }}>
        <Eyebrow light>Вопросы и ответы</Eyebrow>
        <H2>Частые вопросы</H2>
        <div style={{ marginTop: 36, display: "grid", gap: 12 }}>
          {FAQ.map(f => (
            <details key={f.q} className="cvl-faq" style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: "0 20px", background: "#fff" }}>
              <summary style={{ cursor: "pointer", listStyle: "none", padding: "18px 0", fontSize: 16, fontWeight: 600, color: DARK, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                <span>{f.q}</span>
                <Icon name="Plus" size={18} style={{ color: "#0E9F8F", flexShrink: 0 }} />
              </summary>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, margin: "0 0 18px", fontWeight: 300 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section style={{ background: DARK, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 640, height: 360, background: "radial-gradient(ellipse,rgba(45,212,191,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ ...wrap, position: "relative", maxWidth: 760, textAlign: "center" }}>
        <Eyebrow>Узнайте, что думают клиенты</Eyebrow>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,58px)", fontWeight: 500, color: "#fff", margin: "0 0 18px", lineHeight: 1.08 }}>
          Проверьте предложение раньше, чем потратите бюджет
        </h2>
        <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 300 }}>
          Вставьте текст услуги, прайса или рекламы и получите взгляд трёх клиентов со стороны.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }} className="cvl-hero-actions">
          <CtaButton big />
          <Link to="/vozmozhnosti" className="cvl-sec" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 28px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none" }}>
            <Icon name="ArrowLeft" size={15} style={{ color: TEAL }} /> Ко всем возможностям
          </Link>
        </div>
      </div>
    </section>
  );
}
