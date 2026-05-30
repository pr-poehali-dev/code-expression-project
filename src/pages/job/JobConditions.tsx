export default function JobConditions() {
  return (
    <section style={{ background: "#faf9f6", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="job-tag">Что мы предлагаем</div>
          <div className="job-divider" />
          <h2 className="job-h2">Условия <em>работы</em></h2>
        </div>

        <div className="job-cond-grid">
          {[
            {
              icon: "◇",
              title: "Формат",
              items: ["Удалённо, из любого города", "Свободный график", "Без офисной рутины"],
            },
            {
              icon: "◇",
              title: "Оплата",
              items: ["Договорная ставка", "Высокий процент от заключённых договоров", "Доход зависит от вашей активности и уровня коммуникации"],
            },
            {
              icon: "◇",
              title: "Доход",
              items: ["Без ограничений по заработку", "Чем больше партнёров — тем выше доход", "Активные представители зарабатывают значительно выше офисного уровня"],
            },
          ].map(item => (
            <div key={item.title} className="job-card" style={{ textAlign: "center" }}>
              <div style={{ color: "#c9a96e", fontSize: 24, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 500, color: "#1a1a1a", marginBottom: 16 }}>{item.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {item.items.map(i => (
                  <li key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 300, color: "#666", lineHeight: 1.5 }}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: "24px 28px", borderRadius: 20,
          background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(16px,3vw,22px)", fontWeight: 400, color: "#c9a96e", marginBottom: 8, fontStyle: "italic", lineHeight: 1.4 }}>
            «Средний доход активных представителей значительно выше фиксированной офисной работы»
          </div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
            DOK ДИАЛОГ
          </div>
        </div>
      </div>

      <style>{`
        .job-cond-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 700px) {
          .job-cond-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
