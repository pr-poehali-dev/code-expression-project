import { useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";

function getTelegramLink(): string | null {
  const path = window.location.pathname;
  if (path.startsWith("/dlya-salonov") || path.startsWith("/diagnostika-salona")) {
    return "https://t.me/dokdialog";
  }
  if (
    path.startsWith("/dlya-specialistov") ||
    path.startsWith("/praktika") ||
    path.startsWith("/premium") ||
    path.startsWith("/ekspert") ||
    path.startsWith("/free") ||
    path.startsWith("/zakrytaya-praktika") ||
    path.startsWith("/professionalnye-vstrechi") ||
    path.startsWith("/catalog") ||
    path.startsWith("/tarify")
  ) {
    return "https://t.me/docdialog";
  }
  return null;
}

const NAV_LINKS = [
  { label: "О системе", href: "/o-sisteme" },
  { label: "Для специалистов", href: "/dlya-specialistov" },
  { label: "Для салонов", href: "/dlya-salonov" },
  { label: "Встречи", href: "/professionalnye-vstrechi" },
  { label: "Закрытая практика", href: "/zakrytaya-praktika" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Контакты", href: "/kontakty" },
  { label: "Демо", href: "/demo" },
];

function isActive(href: string) {
  const path = window.location.pathname;
  return path === href;
}

export default function DokNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const tgLink = getTelegramLink();

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(248,248,246,0.97)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid #e8e8e4",
      fontFamily: "Montserrat, sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>Dok</span>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: ACCENT }}> Диалог</span>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }} className="dok-desktop-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              color: isActive(l.href) ? ACCENT : "#444",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { if (!isActive(l.href)) (e.currentTarget as HTMLAnchorElement).style.color = ACCENT; }}
              onMouseLeave={e => { if (!isActive(l.href)) (e.currentTarget as HTMLAnchorElement).style.color = "#444"; }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }} className="dok-desktop-right">
          {tgLink && (
            <a href={tgLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, background: "transparent", border: "1.5px solid #e0e0e0", color: "#666", textDecoration: "none", transition: "all 0.2s", fontSize: 16 }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = ACCENT; el.style.color = ACCENT; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#e0e0e0"; el.style.color = "#666"; }}
              title="Telegram"
            >
              ✈
            </a>
          )}
          <a href="/cabinet"
            style={{ background: ACCENT, color: "#fff", padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 16px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
          >
            Личный кабинет
          </a>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="dok-burger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, flexDirection: "column" }}>
          <div style={{ width: 22, height: 2, background: "#333", marginBottom: 5, transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "#333", marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
          <div style={{ width: 22, height: 2, background: "#333", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid #e8e8e4", background: "#f8f8f6", padding: "16px 24px 24px" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "12px 0", fontSize: 15, fontWeight: 500,
              color: isActive(l.href) ? ACCENT : "#333", textDecoration: "none", borderBottom: "1px solid #eee",
            }}>
              {l.label}
            </a>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            {tgLink && (
              <a href={tgLink} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, border: "1.5px solid #e0e0e0", color: "#666", textDecoration: "none", fontSize: 14 }}>
                Telegram
              </a>
            )}
            <a href="/cabinet"
              style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: ACCENT, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Личный кабинет
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .dok-desktop-nav { display: none !important; }
          .dok-desktop-right { display: none !important; }
          .dok-burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}