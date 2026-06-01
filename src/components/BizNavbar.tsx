import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Возможности", href: "/vozmozhnosti" },
  { label: "Для кого", href: "/dlya-kogo" },
  { label: "Академия", href: "/akademiya" },
  { label: "Тарифы", href: "/tseny" },
  { label: "Кейсы", href: "/keysy" },
  { label: "О проекте", href: "/o-proekte" },
];

export default function BizNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(15,23,42,0.97)" : "rgba(15,23,42,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      transition: "all 0.3s ease",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #14B8A6, #0D9488)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
            boxShadow: "0 4px 12px rgba(20,184,166,0.4)",
          }}>П</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.1 }}>Про Диалог</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", lineHeight: 1 }}>Платформа роста</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="biz-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link key={l.label} to={l.href} style={{
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                color: active ? "#14B8A6" : "rgba(255,255,255,0.7)",
                padding: "7px 14px", borderRadius: 8,
                background: active ? "rgba(20,184,166,0.12)" : "transparent",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; } }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="biz-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/cabinet" style={{
            fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)",
            textDecoration: "none", padding: "8px 16px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.35)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
          >
            Войти
          </Link>
          <Link to="/cabinet" style={{
            fontSize: 14, fontWeight: 600, color: "#fff",
            textDecoration: "none", padding: "9px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #14B8A6, #0D9488)",
            boxShadow: "0 4px 14px rgba(20,184,166,0.4)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(20,184,166,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 14px rgba(20,184,166,0.4)"; }}
          >
            Попробовать
          </Link>
        </div>

        {/* Burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="biz-burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}>
          <div style={{ width: 22, height: 2, background: "#fff", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "#fff", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
          <div style={{ width: 22, height: 2, background: "#fff", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px 24px" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.href} style={{
              display: "block", padding: "13px 0", fontSize: 16, fontWeight: 500,
              color: location.pathname === l.href ? "#14B8A6" : "rgba(255,255,255,0.8)",
              textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/cabinet" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
              Войти
            </Link>
            <Link to="/cabinet" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 10, background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Попробовать бесплатно
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .biz-desktop-nav { display: none !important; }
          .biz-burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
