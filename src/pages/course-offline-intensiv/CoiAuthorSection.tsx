const ACCENT = "hsl(185, 85%, 32%)";
const BG = "#f8f8f6";

export default function CoiAuthorSection() {
  return (
    <section style={{ padding: "80px 0 0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          background: "#fff",
          border: "1px solid #e8e8e4",
          borderRadius: 24,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }} className="coi-author-grid">
          <div style={{ position: "relative", minHeight: 380 }}>
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png"
              alt="Сергей Водопьянов"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 380 }}
            />
          </div>
          <div style={{ padding: "40px 44px" }} className="coi-author-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              Автор курса
            </div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>
              Сергей Водопьянов
            </h3>
            <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px" }}>
              Остеопат · 17 лет опыта ·{" "}
              <a href="https://assotsiatsiya-osteopatov.ru/user/svodopianoff/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>Член Российской остеопатической ассоциации</a>
            </p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
              За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[
                { value: "17", label: "лет практики" },
                { value: "3000+", label: "консультаций" },
                { value: "Автор", label: "курсов Dok Диалог" },
                { value: "РОА", label: "сертификат" },
              ].map(({ value, label }) => (
                <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
              <a href="https://massopro.ru/catalog/1" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>MassoPRO</div>
              </a>
              <a href="https://yandex.com/maps/org/osteopat_plyus/99582120415/reviews/?indoorLevel=1&ll=37.599911%2C55.781054&utm_campaign=v1&utm_medium=rating&utm_source=badge&z=17" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>Отзывы Яндекс</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .coi-author-grid { grid-template-columns: 1fr !important; }
          .coi-author-grid img { min-height: 260px !important; max-height: 300px; }
          .coi-author-pad { padding: 24px 20px !important; }
        }
      `}</style>
    </section>
  );
}
