const ACCENT = "hsl(185, 85%, 32%)";

export default function DokFooter() {
  return (
    <footer style={{ borderTop: "1px solid #e8e8e4", background: "#fff", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>Dok</span>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT }}> Диалог</span>
        </a>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#aaa" }}>Платформа</p>
            {["О нас", "Тарифы", "Блог"].map(l => (
              <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 6, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#666"}
              >{l}</a>
            ))}
          </div>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#aaa" }}>Правовые</p>
            {["Политика конфиденциальности", "Оферта"].map(l => (
              <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 6, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#666"}
              >{l}</a>
            ))}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>© 2025 Dok Диалог. Все права защищены.</p>
      </div>
    </footer>
  );
}