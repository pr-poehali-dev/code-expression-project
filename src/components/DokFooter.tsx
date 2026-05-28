const ACCENT = "hsl(185, 85%, 32%)";

function getTelegramLink(): { href: string; label: string } | null {
  const path = window.location.pathname;
  if (path.startsWith("/dlya-salonov") || path.startsWith("/diagnostika-salona")) {
    return { href: "https://t.me/dokdialog", label: "✈ Telegram для салонов" };
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
    path.startsWith("/tarify") ||
    path.startsWith("/demo")
  ) {
    return { href: "https://t.me/docdialog", label: "✈ Telegram для специалистов" };
  }
  return null;
}

export default function DokFooter() {
  const tgLink = getTelegramLink();
  return (
    <footer style={{ borderTop: "1px solid #e8e8e4", background: "#fff", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
              <span style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>Dok</span>
              <span style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: ACCENT }}> Диалог</span>
            </a>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#777", lineHeight: 1.7, maxWidth: 220 }}>
              Профессиональная система работы с телом, клиентом и практикой специалиста.
            </p>
            {tgLink && (
              <a href={tgLink.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: ACCENT, textDecoration: "none", fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >
                {tgLink.label}
              </a>
            )}
          </div>

          {/* Система */}
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#aaa" }}>Система</p>
            {[
              { label: "О системе", href: "/o-sisteme" },
              { label: "Для специалистов", href: "/dlya-specialistov" },
              { label: "Попробовать инструменты", href: "/demo" },
              { label: "Для салонов", href: "/dlya-salonov" },
              { label: "Форматы для салонов", href: "/dlya-salonov/formats" },
              { label: "Диагностика салона", href: "/diagnostika-salona" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#666"}
              >{l.label}</a>
            ))}
          </div>

          {/* Участие */}
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#aaa" }}>Участие</p>
            {[
              { label: "Профессиональные встречи", href: "/professionalnye-vstrechi" },
              { label: "Закрытая практика", href: "/zakrytaya-praktika" },
              { label: "Форматы участия", href: "/tarify" },
              { label: "Программы", href: "/catalog" },
              { label: "Отзывы", href: "/reviews" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#666"}
              >{l.label}</a>
            ))}
          </div>

          {/* Прочее */}
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#aaa" }}>Прочее</p>
            {[
              { label: "Контакты", href: "/kontakty" },
              { label: "Профессиональное сотрудничество", href: "/partnery" },
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Оферта", href: "/offer" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = ACCENT}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#666"}
              >{l.label}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>© 2025 Dok Диалог. Все права защищены.</p>
          <p style={{ margin: 0, fontSize: 12, color: "#ccc" }}>Система премиальной работы с телом, клиентом и профессиональной практикой</p>
        </div>
      </div>
    </footer>
  );
}