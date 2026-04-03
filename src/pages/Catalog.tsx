import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

export default function Catalog() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}>
              Выберите формат работы
            </h1>
            <p style={{ fontSize: 18, color: "#666", margin: 0, fontWeight: 400 }}>
              Курсы и обучение для специалистов и салонов
            </p>
          </div>

          {/* Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 28,
          }} className="catalog-cards">

            {/* Card 1: Салоны */}
            <a
              href="https://school.brossok.ru/login"
              target="_blank"
              rel="noopener noreferrer"
              className="catalog-card"
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "48px 40px",
                textDecoration: "none",
                color: "#1a1a1a",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 20,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                border: "1px solid #e8e8e4",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(-4px) scale(1.02)";
                el.style.boxShadow = `0 16px 48px ${ACCENT_SHADOW}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(0) scale(1)";
                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: `${ACCENT}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="Building2" size={32} style={{ color: ACCENT }} />
              </div>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", fontFamily: "Cormorant, serif" }}>
                  Для салонов
                </h2>
                <p style={{ fontSize: 15, color: "#666", margin: "0 0 28px", lineHeight: 1.6 }}>
                  Обучение доступно для мастеров, прошедших внедрение через платформу
                </p>
              </div>
              <span style={{
                background: ACCENT, color: "#fff",
                padding: "12px 28px", borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                display: "inline-block",
                boxShadow: `0 4px 16px ${ACCENT_SHADOW}`,
                transition: "background 0.2s",
              }}>
                Войти в кабинет
              </span>
            </a>

            {/* Card 2: Частная практика */}
            <a
              href="/catalog/private"
              className="catalog-card"
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "48px 40px",
                textDecoration: "none",
                color: "#1a1a1a",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 20,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                border: "1px solid #e8e8e4",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(-4px) scale(1.02)";
                el.style.boxShadow = `0 16px 48px ${ACCENT_SHADOW}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(0) scale(1)";
                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: `${ACCENT}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="UserRound" size={32} style={{ color: ACCENT }} />
              </div>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", fontFamily: "Cormorant, serif" }}>
                  Для частной практики
                </h2>
                <p style={{ fontSize: 15, color: "#666", margin: "0 0 28px", lineHeight: 1.6 }}>
                  Курсы для мастеров, которые хотят увеличить доход и поток клиентов
                </p>
              </div>
              <span style={{
                background: ACCENT, color: "#fff",
                padding: "12px 28px", borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                display: "inline-block",
                boxShadow: `0 4px 16px ${ACCENT_SHADOW}`,
                transition: "background 0.2s",
              }}>
                Смотреть курсы
              </span>
            </a>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .catalog-cards {
            grid-template-columns: 1fr !important;
          }
          .catalog-card {
            padding: 36px 28px !important;
          }
        }
      `}</style>
      <DokFooter />
    </div>
  );
}