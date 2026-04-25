import { useState } from "react";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, Course } from "./CpShared";

export function CourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #e8e8e4",
        overflow: "hidden",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        boxShadow: hovered ? "0 20px 56px rgba(0,0,0,0.13)" : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{ width: "100%", height: 190, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={course.image}
          alt={course.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>
      <div style={{ padding: "24px 24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, margin: "0 0 12px", color: "#1a1a1a" }}>
          {course.title}
        </h3>

        <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, margin: "0 0 18px" }}>
          {course.description}
        </p>

        {/* Bullets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Чему научитесь
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {course.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#444", lineHeight: 1.4 }}>
                <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Tiers (for course 7) */}
        {course.tiers && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {course.tiers.map((t) => (
              <div key={t.label} style={{
                flex: 1, minWidth: 70,
                border: `1.5px solid ${t.color}22`,
                borderRadius: 10,
                padding: "8px 10px",
                background: `${t.color}08`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.color, marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{t.price}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "auto" }}>
          {/* Price */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{course.price}</span>
            {course.priceNote && (
              <span style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>{course.priceNote}</span>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: `1.5px solid ${ACCENT}`, background: "transparent",
                color: ACCENT, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.18s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${ACCENT}12`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              onClick={() => { if (course.detailUrl) window.location.href = course.detailUrl; }}
            >
              Подробнее
            </button>
            <a
              href={course.buyUrl ?? "https://school.brossok.ru/buy/15"}
              target={course.price === "Бесплатно" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "none", background: ACCENT,
                color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                boxShadow: `0 4px 14px ${ACCENT_SHADOW}`, transition: "all 0.18s",
                textDecoration: "none", textAlign: "center", display: "block",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = ACCENT_DARK; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ACCENT; }}
            >
              {course.price === "Бесплатно" ? "Получить" : "Купить"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfflineCourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: `2px solid ${hovered ? ACCENT : "#e8e8e4"}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered ? `0 20px 56px ${ACCENT_SHADOW}` : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        gridColumn: "1 / -1",
        maxWidth: 680,
      }}
    >
      <style>{`
        .offline-img { height: 260px; }
        .offline-body { padding: 28px 28px 24px; }
        @media (max-width: 480px) {
          .offline-img { height: 200px; }
          .offline-body { padding: 20px 16px 20px; }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column" }} className="offline-card-inner">
        <div className="offline-img" style={{ width: "100%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
            <span style={{
              background: "#1a1a1a", color: "#fff",
              fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: 0.5,
            }}>ОФЛАЙН</span>
            {course.duration && (
              <span style={{ background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>
                {course.duration}
              </span>
            )}
          </div>
        </div>

        <div className="offline-body" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, margin: "0 0 12px", color: "#1a1a1a", fontFamily: "Cormorant, serif" }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.65, margin: "0 0 20px" }}>
            {course.description}
          </p>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Что получите
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {course.bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#444", lineHeight: 1.4 }}>
                  <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>{course.price}</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={course.detailUrl ?? "#"}
                style={{
                  flex: 1, minWidth: 120,
                  padding: "13px 20px", borderRadius: 11,
                  border: `1.5px solid ${ACCENT}`, background: "transparent",
                  color: ACCENT, fontSize: 14, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.18s",
                  fontFamily: "Montserrat, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textAlign: "center", boxSizing: "border-box",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${ACCENT}12`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                Подробнее
              </a>
              <a
                href={course.detailUrl ?? "#"}
                style={{
                  flex: 1, minWidth: 120,
                  padding: "13px 20px", borderRadius: 11,
                  border: "none", background: ACCENT,
                  color: "#fff", fontSize: 14, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.18s",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: `0 4px 14px ${ACCENT_SHADOW}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textAlign: "center", boxSizing: "border-box",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = ACCENT_DARK; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ACCENT; }}
              >
                Забронировать
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}