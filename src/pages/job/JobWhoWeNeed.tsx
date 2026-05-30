export default function JobWhoWeNeed() {
  return (
    <section style={{ background: "#faf9f6", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="job-tag">Портрет кандидата</div>
          <div className="job-divider" />
          <h2 className="job-h2">Кто нам <em>подойдёт</em></h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Левая карточка */}
          <div className="job-card">
            <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 20 }}>
              Нам близки девушки
            </div>
            <ul className="job-list">
              {[
                "С приятной речью и хорошими манерами",
                "Со спокойной уверенной подачей",
                "С чувством такта и умением расположить к себе",
                "С интересом к wellness, красоте и эстетике",
                "С аккуратным внешним видом и чувством стиля",
                "Умеющие выстраивать доверительный диалог",
              ].map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>

          {/* Правая карточка */}
          <div className="job-card" style={{ background: "linear-gradient(135deg, #fdf8f0, #f5ede0)" }}>
            <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 20 }}>
              Будет плюсом
            </div>
            <ul className="job-list">
              {[
                "Опыт в сфере beauty или wellness",
                "Опыт работы с клиентами в сервисе",
                "Интерес к психологии и коммуникации",
                "Любовь к Premium-сервису",
                "Умение красиво и грамотно писать",
              ].map(item => <li key={item}>{item}</li>)}
            </ul>

            <div style={{
              marginTop: 24, padding: "16px 20px", borderRadius: 12,
              background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)",
            }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 500, color: "#a8834a", lineHeight: 1.6 }}>
                Возраст: 23–40 лет. Город — любой.<br />
                Формат работы — удалённо.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 640px) { .job-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
