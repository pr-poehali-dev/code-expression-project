import { RETAIL_PRICE, BtnBuy } from "./KollektsiyaShared";

interface KollektsiyaCtaProps {
  buyUrl: string;
}

export default function KollektsiyaCta({ buyUrl }: KollektsiyaCtaProps) {
  return (
    <section style={{ padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{
          background: `linear-gradient(135deg, #0d2b2e, #0a3d40)`,
          borderRadius: 28,
          padding: "56px 48px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(ellipse at 50% 0%, hsla(185,85%,32%,0.25) 0%, transparent 60%)`,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
            <h2 style={{
              fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px", color: "#fff",
            }}>
              Полная коллекция курсов
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px" }}>
              7 курсов. Один раз — и навсегда. Весь путь от новичка до профессионала с потоком клиентов.
            </p>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {RETAIL_PRICE.toLocaleString("ru-RU")} ₽
              </div>
            </div>

            <BtnBuy href={buyUrl}>
              {`Купить за ${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`}
            </BtnBuy>

            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
              Пожизненный доступ ко всем курсам и обновлениям
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
