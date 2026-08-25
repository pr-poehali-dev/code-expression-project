import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const COLS = [
  {
    title: "Платформа",
    links: [
      { label: "Возможности", href: "/vozmozhnosti" },
      { label: "Для кого", href: "/dlya-kogo" },
      { label: "Для школ", href: "/dlya-shkol" },
      { label: "Тарифы", href: "/tseny" },
      { label: "Академия", href: "/akademiya" },
      { label: "Аудит салона", href: "/diagnostika" },
      { label: "Полезная лента", href: "/blog" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О проекте", href: "/o-proekte" },
      { label: "Почему мы", href: "/preimushchestva" },
      { label: "Кейсы", href: "/keysy" },
      { label: "Контакты", href: "/kontakty" },
    ],
  },
  {
    title: "Правовое",
    links: [
      { label: "Конфиденциальность", href: "/privacy" },
      { label: "Договор оферты", href: "/offer" },
    ],
  },
];

export default function BizFooter() {
  return (
    <footer style={{ background: "#080E1C", fontFamily: "Inter, sans-serif", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 64 }} className="footer-grid">
          <div>
            <div style={{ marginBottom: 22 }}>
              <BrandLogo variant="light" size="md" />
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, margin: "0 0 28px", maxWidth: 300, fontWeight: 300 }}>
              Платформа роста салона через коммуникацию, персонал, обучение и искусственный интеллект.
            </p>
            <Link to="/cabinet" style={{
              display: "inline-block", padding: "12px 28px", borderRadius: 2,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.3px",
            }}>
              Начать бесплатно
            </Link>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20 }}>{col.title}</div>
              {col.links.map(l => (
                <Link key={l.label} to={l.href} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.52)", textDecoration: "none", marginBottom: 13, transition: "color 0.25s", fontWeight: 300 }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#2DD4BF"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.52)"}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>© 2026 Промт Диалог. Все права защищены.</p>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>ИП Водопьянов С. Г. · ОГРНИП 321508100047334</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}