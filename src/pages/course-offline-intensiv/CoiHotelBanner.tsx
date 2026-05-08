import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiShared";

export default function CoiHotelBanner() {
  return (
    <section style={{ background: "#f8f8f6", padding: "0 0 56px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div
          className="coi-inogorod-card"
          style={{
            background: "#fff",
            border: `1.5px solid rgba(0,166,153,0.18)`,
            borderRadius: 20,
            padding: "36px 40px",
            display: "flex",
            gap: 32,
            alignItems: "flex-start",
            boxShadow: "0 4px 24px rgba(0,166,153,0.07)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* декоративный акцент */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: 6,
            height: "100%",
            background: `linear-gradient(180deg, ${ACCENT}, hsl(185,85%,22%))`,
            borderRadius: "20px 0 0 20px",
          }} />

          {/* иконка */}
          <div style={{
            flexShrink: 0,
            width: 60,
            height: 60,
            borderRadius: 16,
            background: "hsl(185,85%,95%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 6,
          }}>
            <Icon name="Hotel" size={28} style={{ color: ACCENT }} />
          </div>

          {/* текст */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "hsl(185,85%,95%)",
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 12,
            }}>
              <Icon name="MapPin" size={12} style={{ color: ACCENT }} />
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: ACCENT,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}>
                ДЛЯ ИНОГОРОДНИХ УЧАСТНИКОВ
              </span>
            </div>

            <h3 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(20px, 2.5vw, 26px)",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 10px",
              lineHeight: 1.25,
            }}>
              Бронирование отеля со скидкой 10%
            </h3>

            <p style={{
              fontSize: 14.5,
              color: "#555",
              lineHeight: 1.75,
              margin: "0 0 18px",
            }}>
              Если вы едете из другого города — мы поможем с размещением.
              По вашему запросу забронируем отель рядом с местом проведения
              интенсива со специальной скидкой 10%.
            </p>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { icon: "Navigation", text: "Рядом с местом проведения" },
                { icon: "Tag", text: "Скидка 10% для участников" },
                { icon: "Phone", text: "Организуем по запросу" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name={icon} size={15} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: "#444", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}