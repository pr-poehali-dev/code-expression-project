import { useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";

const NAV_LINKS = [
  { label: "Платформа", href: "#platform", active: true },
  { label: "Тарифы", href: "#pricing" },
  { label: "Партнёрам", href: "#partners" },
  { label: "Блог", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
];

export default function BizNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(248,248,246,0.96)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e8e8e4",
      fontFamily: "Golos Text, sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
          Biz<span style={{ color: ACCENT }}>Tools</span>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="biz-desktop-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              color: l.active ? ACCENT : "#444",
              borderBottom: l.active ? `2px solid ${ACCENT}` : "2px solid transparent",
              paddingBottom: 2, transition: "color 0.2s",
            }}
              onMouseEnter={e => { if (!l.active) (e.currentTarget as HTMLAnchorElement).style.color = ACCENT; }}
              onMouseLeave={e => { if (!l.active) (e.currentTarget as HTMLAnchorElement).style.color = "#444"; }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contact"
          style={{ background: ACCENT, color: "#fff", padding: "9px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
        >
          Войти
        </a>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="biz-burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <div style={{ width: 22, height: 2, background: "#333", marginBottom: 5, transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "#333", marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 22, height: 2, background: "#333", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid #e8e8e4", background: "#f8f8f6", padding: "16px 24px 24px" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "10px 0", fontSize: 15, fontWeight: 500,
              color: l.active ? ACCENT : "#333", textDecoration: "none", borderBottom: "1px solid #eee",
            }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .biz-desktop-nav { display: none !important; }
          .biz-burger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
