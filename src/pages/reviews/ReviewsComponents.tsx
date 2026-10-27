import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, DARK, TextReview } from "./ReviewsShared";

export function PlayIcon({ color }: { color: string }) {
  return (
    <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: `12px solid ${color}`, marginLeft: 3 }} />
  );
}

export function DotsNav({ active, total, onChange }: { active: number; total: number; onChange: (i: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          all: "unset", cursor: "pointer",
          width: active === i ? 24 : 8, height: 8, borderRadius: 4,
          background: active === i ? ACCENT : "rgba(255,255,255,0.15)",
          transition: "all 0.25s",
        }} />
      ))}
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4, fontFamily: "Montserrat, sans-serif" }}>{active + 1} / {total}</span>
    </div>
  );
}

export function StarRow() {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="Star" size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
      ))}
    </div>
  );
}

export function TextReviewCard({ r }: { r: TextReview }) {
  const [open, setOpen] = useState(false);
  const isLong = r.text.length > 160;
  const display = isLong && !open ? r.text.slice(0, 160).trimEnd() + "…" : r.text;
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18, padding: "22px 20px", display: "flex", flexDirection: "column",
      boxShadow: "0 2px 20px rgba(0,0,0,0.2)", transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.25)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <img src={r.photo} alt={r.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", objectPosition: "top center", border: `2px solid rgba(45,212,191,0.3)`, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 2 }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{r.city} · {r.experience}</div>
          <StarRow />
        </div>
      </div>
      <div style={{ color: `rgba(45,212,191,0.15)`, fontSize: 44, lineHeight: 1, marginBottom: -6, fontFamily: "Georgia, serif", fontWeight: 900, userSelect: "none" }}>"</div>
      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, flex: 1 }}>
        {display}
        {isLong && (
          <button onClick={() => setOpen(!open)} style={{ all: "unset", cursor: "pointer", color: ACCENT, fontSize: 12.5, fontWeight: 600, marginLeft: 4 }}>
            {open ? "свернуть" : "читать полностью"}
          </button>
        )}
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, href, badge, linkText }: { title: string; subtitle: string; href: string; badge?: string; linkText?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {badge && (
        <span style={{
          display: "inline-block",
          background: badge.includes("САЛОН") ? "rgba(45,212,191,0.12)" : "rgba(45,212,191,0.1)",
          color: ACCENT,
          border: `1px solid rgba(45,212,191,0.25)`,
          fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
          letterSpacing: 0.8, marginBottom: 12, fontFamily: "Montserrat, sans-serif",
        }}>
          {badge}
        </span>
      )}
      <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
        {title}
      </h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 560 }}>{subtitle}</p>
        <Link to={href} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 20px", borderRadius: 2,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: DARK, fontSize: 13, fontWeight: 600, textDecoration: "none",
          fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 6px 20px rgba(45,212,191,0.35)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
        >
          {linkText || "Перейти"}
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>
    </div>
  );
}
