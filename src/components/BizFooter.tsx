const ACCENT = "hsl(185, 85%, 32%)";

export default function BizFooter() {
  return (
    <footer style={{ borderTop: "1px solid #e8e8e4", background: "#fff", fontFamily: "Golos Text, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
          Biz<span style={{ color: ACCENT }}>Tools</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#999" }}>© 2026 BizTools. Все права защищены.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Условия", "Политика", "Контакты"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#888", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#888"}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
