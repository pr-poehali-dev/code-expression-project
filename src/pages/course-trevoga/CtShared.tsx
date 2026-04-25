import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/725fb9f8-31a0-4896-9d9f-94e192d9d21d.jpg";
export const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/7cedf2c0-f95b-4849-92be-6fb3944e25d1.jpg";

export const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

const ACCESS_URL = "#";

export function BtnPrimary({ children, style, href }: { children: React.ReactNode; style?: React.CSSProperties; href?: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href ?? ACCESS_URL}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block",
        textDecoration: "none",
        background: h ? ACCENT_DARK : ACCENT,
        color: "#fff",
        borderRadius: 12,
        padding: "16px 36px",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`,
        transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >{children}</a>
  );
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "18px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#1a1a1a",
          textAlign: "left",
          gap: 16,
        }}
      >
        {title}
        <span style={{ fontSize: 20, color: ACCENT, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ paddingBottom: 18, fontSize: 14, color: "#555", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}