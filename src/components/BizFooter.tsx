import { Link } from "react-router-dom";

const COLS = [
  {
    title: "Платформа",
    links: [
      { label: "Возможности", href: "/vozmozhnosti" },
      { label: "Для кого", href: "/dlya-kogo" },
      { label: "Тарифы", href: "/tseny" },
      { label: "Академия", href: "/akademiya" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О проекте", href: "/o-proekte" },
      { label: "Кейсы", href: "/keysy" },
      { label: "Контакты", href: "/kontakty" },
    ],
  },
  {
    title: "Правовое",
    links: [
      { label: "Политика конфиденциальности", href: "/privacy" },
      { label: "Договор оферты", href: "/offer" },
    ],
  },
];

export default function BizFooter() {
  return (
    <footer style={{ background: "#0F172A", fontFamily: "Inter, sans-serif", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 32px" }}>

        {/* Top */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#14B8A6,#0D9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>П</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Про Диалог</div>
            </Link>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 280 }}>
              Платформа роста салона через коммуникацию, персонал, обучение и искусственный интеллект.
            </p>
            <a href="/cabinet" style={{
              display: "inline-block", padding: "10px 22px", borderRadius: 8,
              background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(20,184,166,0.35)",
            }}>
              Попробовать бесплатно
            </a>
          </div>

          {/* Nav cols */}
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <Link key={l.label} to={l.href} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#14B8A6"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)"}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>© 2026 Про Диалог. Все права защищены.</p>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.2)" }}>ИП · ИНН · ОГРНИП</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
