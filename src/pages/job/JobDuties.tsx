export default function JobDuties() {
  return (
    <section style={{ background: "#f0ebe2", padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="job-tag">Чем вы будете заниматься</div>
          <div className="job-divider" />
          <h2 className="job-h2">Обязанности</h2>
          <p className="job-p" style={{ maxWidth: 520, margin: "0 auto" }}>
            Это не холодные звонки и не агрессивные продажи.<br />
            Это представление премиального проекта с достоинством.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              num: "01",
              title: "Коммуникация с салонами",
              desc: "Общение с владельцами, управляющими и руководителями wellness-пространств. Первичное знакомство, установление контакта, выстраивание доверия.",
            },
            {
              num: "02",
              title: "Представление проекта",
              desc: "Рассказ о платформе Dok Диалог, её возможностях и преимуществах. Формирование интереса к сотрудничеству в спокойном, ненавязчивом стиле.",
            },
            {
              num: "03",
              title: "Развитие партнёрских отношений",
              desc: "Сопровождение первичной коммуникации, передача заявки команде. Развитие долгосрочных партнёрских связей с салонами.",
            },
          ].map(item => (
            <div key={item.num} className="job-card" style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <div style={{
                fontFamily: "'Cormorant', serif", fontSize: 36, fontWeight: 300,
                color: "#c9a96e", lineHeight: 1, flexShrink: 0, opacity: 0.6,
              }}>{item.num}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 8 }}>{item.title}</div>
                <div className="job-p" style={{ fontSize: 14 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
