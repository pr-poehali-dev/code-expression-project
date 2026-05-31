import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";

const ACCENT = "hsl(185, 85%, 32%)";

const vacancies = [
  {
    id: "representative",
    tag: "Удалённо · Свободный график",
    title: "Представитель проекта",
    subtitle: "по работе с салонами красоты и wellness",
    description:
      "Работа с премиальными салонами и wellness-пространствами. Первичная коммуникация, знакомство с проектом Dok Диалог, выстраивание партнёрских отношений.",
    conditions: ["Высокий процент от договоров", "Свободный график", "Из любого города"],
    badge: "Открытая вакансия",
    badgeColor: "#4a7c59",
    badgeBg: "#f0f7f3",
    href: "/job",
  },
];

export default function Vakansii() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "#faf9f6", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .vak-card {
          background: #fff;
          border: 1px solid #ede8df;
          border-radius: 24px;
          padding: 40px;
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: pointer;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .vak-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.09);
          transform: translateY(-3px);
        }
        .vak-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #c9a96e, #a8834a);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 36px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 6px 24px rgba(201,169,110,0.3);
        }
        .vak-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(201,169,110,0.45); }
        @media (max-width: 640px) {
          .vak-card { padding: 24px 20px; }
          .vak-hero-title { font-size: 32px !important; }
        }
      `}</style>

      <DokNavbar />

      {/* Герой */}
      <section style={{
        background: "linear-gradient(160deg, #f5f0e8 0%, #faf9f6 60%, #ede8df 100%)",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "6%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "4%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "#c9a96e", marginBottom: 16 }}>
            Dok Диалог · Команда
          </div>
          <div style={{ width: 48, height: 1, background: "#c9a96e", margin: "0 auto 28px" }} />
          <h1 className="vak-hero-title" style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(32px,6vw,58px)", fontWeight: 300, lineHeight: 1.15, margin: "0 0 20px", color: "#1a1a1a" }}>
            Работайте с нами
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: "#666", maxWidth: 520, margin: "0 auto" }}>
            Мы ищем людей, которые разделяют наши ценности — эстетику, уважение к клиенту и профессионализм в коммуникации.
          </p>
        </div>
      </section>

      {/* Витрина вакансий */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 24px 96px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, margin: 0, color: "#1a1a1a" }}>
            Открытые вакансии
          </h2>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#aaa", fontWeight: 300 }}>
            {vacancies.length} {vacancies.length === 1 ? "вакансия" : "вакансии"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {vacancies.map(v => (
            <a key={v.id} href={v.href} className="vak-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: "#999" }}>
                      {v.tag}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 500, margin: "0 0 4px", color: "#1a1a1a", lineHeight: 1.2 }}>
                    {v.title}
                  </h3>
                  <div style={{ fontFamily: "'Cormorant', serif", fontSize: 18, fontWeight: 300, color: "#888", fontStyle: "italic" }}>
                    {v.subtitle}
                  </div>
                </div>
                <span style={{
                  flexShrink: 0,
                  display: "inline-block",
                  background: v.badgeBg,
                  color: v.badgeColor,
                  border: `1px solid ${v.badgeColor}40`,
                  borderRadius: 50,
                  padding: "5px 14px",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'Montserrat',sans-serif",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}>
                  {v.badge}
                </span>
              </div>

              <div style={{ width: 40, height: 1, background: "#e0d8cc", marginBottom: 20 }} />

              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 300, color: "#666", lineHeight: 1.7, margin: "0 0 24px" }}>
                {v.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {v.conditions.map(c => (
                  <span key={c} style={{
                    background: "#f5f0e8",
                    borderRadius: 50,
                    padding: "6px 14px",
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "#a8834a",
                  }}>
                    {c}
                  </span>
                ))}
              </div>

              <span className="vak-btn">
                Подробнее →
              </span>
            </a>
          ))}
        </div>

        {/* Блок «нет подходящей» */}
        <div style={{
          marginTop: 48,
          padding: "32px 36px",
          borderRadius: 20,
          background: "#1a1a1a",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 400, color: "#c9a96e", marginBottom: 10 }}>
            Не нашли подходящую вакансию?
          </div>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 20px" }}>
            Напишите нам — мы всегда рады познакомиться с людьми, разделяющими наши ценности.
          </p>
          <a href="/kontakty" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#c9a96e", textDecoration: "none", border: "1px solid rgba(201,169,110,0.4)", borderRadius: 50, padding: "10px 24px", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,169,110,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            Написать нам
          </a>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}