export default function JobWhyUs({ onApply }: { onApply: () => void }) {
  return (
    <section style={{ background: "#f0ebe2", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div className="job-tag">Наши ценности</div>
        <div className="job-divider" />
        <h2 className="job-h2">Почему вам <em>понравится</em><br className="job-why-br" /> работать с нами</h2>

        <div className="job-why-grid">
          {[
            {
              title: "Атмосфера",
              items: ["Премиальная ниша", "Спокойный стиль коммуникации", "Интересная и развитая аудитория"],
            },
            {
              title: "Возможности",
              items: ["Высокий доход без потолка", "Свободный график", "Развитие навыков общения", "Окружение сильных специалистов"],
            },
            {
              title: "Свобода",
              items: ["Без жёсткого контроля", "Без офисной рутины", "Без навязчивых продаж"],
            },
          ].map(item => (
            <div key={item.title} className="job-card" style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #ede8df" }}>
                {item.title}
              </div>
              <ul className="job-list">
                {item.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <p className="job-p" style={{ maxWidth: 520, margin: "0 auto 40px", color: "#555", fontStyle: "italic", fontSize: 16 }}>
          Если вы узнали себя в этом описании —<br />
          мы рады познакомиться с вами.
        </p>

        <button className="job-btn-gold" onClick={onApply}>
          Подать заявку и пройти интервью
        </button>
      </div>

      <style>{`
        .job-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 48px 0;
        }
        @media (max-width: 700px) {
          .job-why-grid { grid-template-columns: 1fr; gap: 16px; margin: 32px 0; }
          .job-why-br { display: none; }
        }
      `}</style>
    </section>
  );
}