export default function JobHero({ onApply }: { onApply: () => void }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #f5f0e8 0%, #faf9f6 50%, #ede8df 100%)",
      position: "relative", overflow: "hidden", padding: "120px 24px 60px",
    }}>
      {/* Декоративный фон */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "3%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "30%", left: "8%", width: 1, height: 180, background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)" }} />
        <div style={{ position: "absolute", top: "20%", right: "12%", width: 1, height: 120, background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.2), transparent)" }} />
      </div>

      <div style={{ maxWidth: 760, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="job-tag">Dok Диалог · Вакансия</div>
        <div className="job-divider" />

        <h1 style={{
          fontFamily: "'Cormorant', 'Georgia', serif",
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300,
          lineHeight: 1.1, margin: "0 0 28px", color: "#1a1a1a",
        }}>
          Станьте представителем<br />
          <em style={{ fontStyle: "italic", color: "#c9a96e" }}>проекта Dok Диалог</em>
        </h1>

        <p className="job-p" style={{ fontSize: 16, maxWidth: 580, margin: "0 auto 16px", color: "#666" }}>
          Работа с премиальными салонами и wellness-пространствами<br />
          в сфере красоты, тела и сервиса.
        </p>

        <p className="job-p" style={{ maxWidth: 520, margin: "0 auto 40px", color: "#888" }}>
          Мы ищем девушек, которые умеют красиво общаться, выстраивать доверие,
          достойно представлять проект и создавать приятное впечатление.
        </p>

        <button className="job-btn-gold" onClick={onApply}>
          Пройти тест
        </button>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            { num: "Удалённо", label: "Свободный график" },
            { num: "Премиум", label: "Ниша красоты и wellness" },
            { num: "%", label: "Высокий процент от продаж" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 600, color: "#c9a96e" }}>{item.num}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#999", marginTop: 4, fontWeight: 300, letterSpacing: "0.5px" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}