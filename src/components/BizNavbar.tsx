import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const NAV_LINKS = [
  { label: "Возможности", href: "/vozmozhnosti" },
  { label: "Для кого", href: "/dlya-kogo" },
  { label: "Прокачка навыков", href: "/akademiya" },
  { label: "Тарифы", href: "/tseny" },
  { label: "Аудит салона", href: "/diagnostika" },

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
      background: scrolled ? "rgba(8,14,28,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(45,212,191,0.12)" : "1px solid transparent",
      transition: "all 0.4s ease",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 76, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo variant="light" size="md" />
        </Link>

        <nav className="biz-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link key={l.label} to={l.href} style={{
                fontSize: 14, fontWeight: 400, textDecoration: "none",
                color: active ? "#2DD4BF" : "rgba(255,255,255,0.65)",
                padding: "8px 16px", letterSpacing: "0.2px",
                transition: "color 0.25s",
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="biz-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/cabinet" style={{
            fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.7)",
            textDecoration: "none", letterSpacing: "0.2px", transition: "color 0.25s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#fff"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"}
          >
            Войти
          </Link>
          <Link to="/cabinet" style={{
            fontSize: 14, fontWeight: 500, color: "#0F172A",
            textDecoration: "none", padding: "11px 26px", borderRadius: 2,
            background: "linear-gradient(135deg, #2DD4BF, #14B8A6)",
            letterSpacing: "0.3px", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(45,212,191,0.35)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            Начать бесплатно
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="biz-burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <Icon name={menuOpen ? "X" : "Menu"} size={26} style={{ color: "#fff" }} />
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(8,14,28,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(45,212,191,0.12)", padding: "20px 32px 28px" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.href} style={{
              display: "block", padding: "14px 0", fontSize: 16, fontWeight: 400,
              color: location.pathname === l.href ? "#2DD4BF" : "rgba(255,255,255,0.8)",
              textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/cabinet" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 15, fontWeight: 400, textDecoration: "none" }}>
              Войти
            </Link>
            <Link to="/cabinet" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Начать бесплатно
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .biz-desktop-nav { display: none !important; }
          .biz-burger { display: block !important; }
        }
      `}</style>
    </header>
  );
}