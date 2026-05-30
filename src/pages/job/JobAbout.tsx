export default function JobAbout() {
  return (
    <section style={{ background: "#1a1a1a", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div className="job-tag" style={{ color: "#c9a96e" }}>О проекте</div>
        <div className="job-divider" />
        <h2 className="job-h2" style={{ color: "#fff" }}>Что такое <em>Dok Диалог</em></h2>

        <p className="job-p" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 640, margin: "0 auto 48px" }}>
          Dok Диалог — образовательная и технологическая платформа для специалистов по телу,
          салонов и wellness-пространств. Мы обучаем премиальному сервису, системной диагностике
          и коммуникации с платёжеспособной аудиторией.
        </p>

        <div className="job-about-grid">
          {[
            { icon: "✦", title: "Коммуникация", desc: "Как выстраивать доверие и долгосрочные отношения с клиентом" },
            { icon: "✦", title: "Диагностика", desc: "Системный подход к работе с телом и состоянием клиента" },
            { icon: "✦", title: "Премиальный сервис", desc: "Стандарты работы на уровне luxury wellness" },
            { icon: "✦", title: "Аудитория", desc: "Инструменты для привлечения платёжеспособных клиентов" },
          ].map(item => (
            <div key={item.title} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.2)",
              borderRadius: 16, padding: "28px 24px", textAlign: "left",
            }}>
              <div style={{ color: "#c9a96e", fontSize: 18, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .job-about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .job-about-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
        }
        @media (max-width: 400px) {
          .job-about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
