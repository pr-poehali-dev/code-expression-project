import Icon from "@/components/ui/icon";
import { useDiscountTimer } from "@/hooks/useDiscountTimer";

const ACCENT = "hsl(185, 85%, 32%)";
const GOLD = "#d4a017";

const RETAIL_PRICE = 77600;
const DISCOUNT_PRICE = 23280;

const COURSES_IN_COLLECTION = [
  { color: ACCENT, label: "Профессия массажист с нуля" },
  { color: "#7c3aed", label: "Готовые протоколы массажа" },
  { color: "#f59e0b", label: "Антистресс-техники" },
  { color: "#e11d48", label: "Коррекция фигуры" },
  { color: "#059669", label: "Висцеральный массаж" },
  { color: "#0284c7", label: "Массажист с потоком клиентов" },
  { color: "#db2777", label: "Фитнес для беременных" },
];

export default function CpCollectionCard() {
  const { isActive, formatted } = useDiscountTimer();
  const currentPrice = isActive ? DISCOUNT_PRICE : RETAIL_PRICE;
  const oldPrice = isActive ? RETAIL_PRICE : null;

  return (
    <div style={{
      gridColumn: "1 / -1",
      background: `linear-gradient(135deg, #0d2b2e 0%, #0a3d40 55%, #0d2b2e 100%)`,
      borderRadius: 24,
      padding: "40px 40px",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 8px 48px rgba(13,43,46,0.35)",
    }}
      onClick={() => window.location.href = "/course/kollektsiya"}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 64px rgba(13,43,46,0.45)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 48px rgba(13,43,46,0.35)"; }}
    >
      <style>{`.koll-card-inner { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center; }
        @media (max-width: 800px) { .koll-card-inner { grid-template-columns: 1fr !important; } }`}
      </style>

      {/* Фоновые блики */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse at 15% 50%, hsla(185,85%,32%,0.2) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, hsla(185,85%,50%,0.08) 0%, transparent 45%)`,
      }} />

      <div className="koll-card-inner" style={{ position: "relative" }}>
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: `linear-gradient(135deg, ${GOLD}28, ${GOLD}14)`,
            border: `1px solid ${GOLD}50`,
            color: GOLD, fontSize: 11, fontWeight: 700,
            padding: "5px 14px", borderRadius: 20, marginBottom: 18,
            letterSpacing: 0.8,
          }}>
            <Icon name="Crown" size={12} />
            ПОЛНАЯ КОЛЛЕКЦИЯ · 7 КУРСОВ
          </div>

          <h3 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(24px, 2.8vw, 36px)",
            fontWeight: 700, lineHeight: 1.15,
            margin: "0 0 10px", color: "#fff",
          }}>
            Все курсы в одном комплекте
          </h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 24px", lineHeight: 1.6, maxWidth: 500 }}>
            От базовых техник до маркетинга и потока клиентов — полный путь от новичка до востребованного специалиста
          </p>

          {/* Курсы */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {COURSES_IN_COLLECTION.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${c.color}40`,
                borderRadius: 20,
                padding: "4px 12px",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* CTA кнопка */}
          <a
            href="/course/kollektsiya"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, hsl(185,85%,38%), hsl(185,85%,28%))`,
              color: "#fff", padding: "13px 28px", borderRadius: 12,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: `0 4px 20px hsla(185,85%,32%,0.45)`,
              transition: "all 0.18s",
              fontFamily: "Montserrat, sans-serif",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            Подробнее о коллекции
            <Icon name="ArrowRight" size={15} />
          </a>
        </div>

        {/* RIGHT — цены */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          padding: "28px 28px",
          minWidth: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
            {isActive ? "Акционная цена" : "Стоимость"}
          </div>

          {oldPrice && (
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>
              {oldPrice.toLocaleString("ru-RU")} ₽
            </div>
          )}

          <div style={{
            fontFamily: "Cormorant, serif",
            fontSize: 40, fontWeight: 700,
            color: isActive ? "hsl(185,85%,60%)" : "#fff",
            lineHeight: 1,
          }}>
            {currentPrice.toLocaleString("ru-RU")} ₽
          </div>

          {isActive && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#e53935",
              borderRadius: 8, padding: "5px 12px",
              fontSize: 12, color: "#fff", fontWeight: 700,
              letterSpacing: 0.3,
            }}>
              ⏱ Скидка 70% ещё {formatted}
            </div>
          )}

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
            Вместо 97 080 ₽<br />при покупке по отдельности
          </div>

          <a
            href="/course/kollektsiya"
            onClick={e => e.stopPropagation()}
            style={{
              display: "block", width: "100%", textAlign: "center",
              background: isActive ? "#e53935" : `hsl(185,85%,38%)`,
              color: "#fff", borderRadius: 10,
              padding: "11px 16px", fontSize: 13, fontWeight: 700,
              textDecoration: "none", transition: "opacity 0.18s",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            {isActive ? "Купить со скидкой 70%" : "Купить коллекцию"}
          </a>
        </div>
      </div>
    </div>
  );
}
