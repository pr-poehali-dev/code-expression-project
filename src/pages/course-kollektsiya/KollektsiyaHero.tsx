import Icon from "@/components/ui/icon";
import DiscountTimer from "@/components/ui/DiscountTimer";
import { ACCENT, GOLD, RETAIL_PRICE, DISCOUNT_PRICE, BtnBuy } from "./KollektsiyaShared";

interface KollektsiyaHeroProps {
  isActive: boolean;
  buyUrl: string;
  currentPrice: number;
}

export default function KollektsiyaHero({ isActive, buyUrl, currentPrice }: KollektsiyaHeroProps) {
  return (
    <section style={{
      background: `linear-gradient(135deg, #0d2b2e 0%, #0a3d40 50%, #0d2b2e 100%)`,
      padding: "100px 0 90px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, hsla(185,85%,32%,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsla(185,85%,50%,0.1) 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div className="koll-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", marginBottom: 28, width: "fit-content" }}>
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`,
              border: `1px solid ${GOLD}44`,
              color: GOLD, fontSize: 12, fontWeight: 700,
              padding: "6px 16px", borderRadius: 20, marginBottom: 20,
              letterSpacing: 0.8,
            }}>
              <Icon name="Crown" size={13} />
              ПОЛНАЯ КОЛЛЕКЦИЯ · 7 КУРСОВ
            </div>

            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.12,
              margin: "0 0 20px",
              color: "#fff",
            }}>
              Всё для роста<br />
              <span style={{ color: `hsl(185, 85%, 55%)` }}>в одном комплекте</span>
            </h1>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
              7 курсов от базовых техник до маркетинга и привлечения клиентов. Полный путь от новичка до востребованного специалиста с очередью.
            </p>

            <div style={{ marginBottom: 32 }}>
              {isActive ? (
                <div>
                  <DiscountTimer
                    oldPrice={`${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`}
                    newPrice={`${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`}
                    accent="hsl(185, 85%, 55%)"
                    size="lg"
                  />
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                    Розничная стоимость 7 курсов по отдельности — 97 080 ₽
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", marginBottom: 4 }}>
                    97 080 ₽ (при покупке каждого курса отдельно)
                  </div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                    {RETAIL_PRICE.toLocaleString("ru-RU")} ₽
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>уже со скидкой 20% за опт</div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <BtnBuy href={buyUrl}>
                {isActive
                  ? `Купить коллекцию — ${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`
                  : `Купить коллекцию — ${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`
                }
              </BtnBuy>
            </div>
          </div>

          {/* Right side — course stack visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { color: ACCENT, label: "Профессия массажист с нуля", price: "19 900 ₽" },
              { color: "#7c3aed", label: "Готовые протоколы массажа", price: "19 900 ₽" },
              { color: "#f59e0b", label: "Антистресс-техники", price: "14 900 ₽" },
              { color: "#e11d48", label: "Коррекция фигуры", price: "16 900 ₽" },
              { color: "#059669", label: "Висцеральный массаж", price: "4 990 ₽" },
              { color: "#0284c7", label: "Массажист с потоком клиентов", price: "14 900 ₽" },
              { color: "#db2777", label: "Фитнес для беременных", price: "5 590 ₽" },
            ].map((c, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderLeft: `3px solid ${c.color}`,
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{c.label}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "line-through", flexShrink: 0 }}>{c.price}</span>
              </div>
            ))}
            <div style={{
              background: `linear-gradient(135deg, ${ACCENT}33, ${ACCENT}11)`,
              border: `1px solid ${ACCENT}55`,
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>Итого в коллекции</span>
              <span style={{ fontSize: 16, color: `hsl(185,85%,55%)`, fontWeight: 700 }}>
                {currentPrice.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}