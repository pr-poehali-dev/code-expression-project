export default function JobHero({ onApply }: { onApply: () => void }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #f5f0e8 0%, #faf9f6 50%, #ede8df 100%)",
      position: "relative", overflow: "hidden", padding: "100px 20px 60px",
    }}>
      {/* Декоративный фон */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "clamp(120px,20vw,300px)", height: "clamp(120px,20vw,300px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "3%", width: "clamp(80px,12vw,200px)", height: "clamp(80px,12vw,200px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: 760, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="job-tag">Dok Диалог · Вакансия</div>
        <div className="job-divider" />

        <h1 style={{
          fontFamily: "'Cormorant', 'Georgia', serif",
          fontSize: "clamp(30px, 6vw, 72px)", fontWeight: 300,
          lineHeight: 1.15, margin: "0 0 24px", color: "#1a1a1a",
        }}>
          Станьте представителем<br />
          <em style={{ fontStyle: "italic", color: "#c9a96e" }}>проекта Dok Диалог</em>
        </h1>

        <p className="job-p" style={{ fontSize: "clamp(14px,2vw,16px)", maxWidth: 580, margin: "0 auto 14px", color: "#666" }}>
          Работа с премиальными салонами и wellness-пространствами<br />
          в сфере красоты, тела и сервиса.
        </p>

        <p className="job-p" style={{ maxWidth: 520, margin: "0 auto 36px", color: "#888", fontSize: 14 }}>
          Мы ищем девушек, которые умеют красиво общаться, выстраивать доверие,
          достойно представлять проект и создавать приятное впечатление.
        </p>

        <button className="job-btn-gold" onClick={onApply}>
          Пройти интервью
        </button>

        <div style={{
          marginTop: 28, marginBottom: 12,
          display: "inline-block",
          background: "rgba(201,169,110,0.08)",
          border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: 12,
          padding: "14px 20px",
          maxWidth: 480,
          width: "100%",
        }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 300, color: "#a8834a", lineHeight: 1.7, margin: 0 }}>
            Мы ценим ваше и своё время — результат придёт сразу после интервью.
            Если вы подходите, менеджер свяжется с вами в ближайшее время для следующего шага.
          </p>
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: "clamp(20px,5vw,40px)", flexWrap: "wrap" }}>
          {[
            { num: "Удалённо", label: "Свободный график" },
            { num: "Премиум", label: "Ниша красоты и wellness" },
            { num: "%", label: "Высокий процент от продаж" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 600, color: "#c9a96e" }}>{item.num}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#999", marginTop: 4, fontWeight: 300, letterSpacing: "0.5px" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .job-hero-br { display: none; }
        }
      `}</style>
    </section>
  );
}