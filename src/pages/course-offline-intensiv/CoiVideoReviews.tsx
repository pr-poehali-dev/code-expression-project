import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiShared";

const VIDEOS = [
  {
    id: "o4aLwoPaNMNsPmRU517kdr",
    name: "Марина К.",
    city: "Москва",
    experience: "Массажист, 4 года",
    result: "Подняла чек на 30%",
  },
  {
    id: "7on4nVofXbcgkDmWbjaZvH",
    name: "Ольга В.",
    city: "Казань",
    experience: "Массажист-косметолог, 2 года",
    result: "Запись на 3 недели вперёд",
  },
  {
    id: "jWics1Kq1BrrtcFK25Vmgu",
    name: "Алексей Г.",
    city: "Санкт-Петербург",
    experience: "Спортивный массажист, 6 лет",
    result: "+3 постоянных клиента",
  },
  {
    id: "us9ULPt46B7G77bQYwBXXt",
    name: "Тамара Л.",
    city: "Екатеринбург",
    experience: "Реабилитолог, 12 лет",
    result: "Расширила линейку услуг",
  },
  {
    id: "vk9wa3fBfxQZwMbRvN9YJG",
    name: "Дмитрий Н.",
    city: "Новосибирск",
    experience: "Массажист, 1,5 года",
    result: "Первый поток клиентов",
  },
  {
    id: "sCFSxwbdZSjobWC3KKzDmj",
    name: "Светлана Р.",
    city: "Ростов-на-Дону",
    experience: "Массажист, 3 года",
    result: "Вырос средний чек",
  },
];

function VideoThumb({ video, isActive, onClick }: { video: typeof VIDEOS[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset",
        cursor: "pointer",
        background: isActive ? "#fff" : "transparent",
        border: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "all 0.2s",
        boxShadow: isActive ? `0 4px 18px ${ACCENT}22` : "none",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: isActive ? `${ACCENT}18` : "#e8e8e4",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s",
      }}>
        <div style={{
          width: 0, height: 0,
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          borderLeft: `12px solid ${isActive ? ACCENT : "#aaa"}`,
          marginLeft: 3,
          transition: "border-color 0.2s",
        }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a", marginBottom: 2, fontFamily: "Montserrat, sans-serif" }}>{video.name}</div>
        <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{video.city} · {video.experience}</div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: isActive ? `${ACCENT}18` : "#f0f0ed",
          borderRadius: 6, padding: "2px 8px",
          transition: "background 0.2s",
        }}>
          <Icon name="TrendingUp" size={11} style={{ color: isActive ? ACCENT : "#888" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? ACCENT : "#888" }}>{video.result}</span>
        </div>
      </div>
    </button>
  );
}

export default function CoiVideoReviews() {
  const [active, setActive] = useState(0);

  const current = VIDEOS[active];

  return (
    <section style={{ padding: "60px 0 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* ДЕСКТОП: боковой список + плеер */}
        <div style={{
          background: "#fff",
          border: "1px solid #e8e8e4",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          display: "flex",
          minHeight: 420,
        }} className="coi-video-wrap">

          {/* Левый список */}
          <div style={{
            width: 260,
            flexShrink: 0,
            borderRight: "1px solid #f0f0ed",
            padding: "20px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            overflowY: "auto",
            background: "#fafaf8",
          }} className="coi-video-sidebar">
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#bbb",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              padding: "4px 14px 10px",
              fontFamily: "Montserrat, sans-serif",
            }}>
              Видеоотзывы
            </div>
            {VIDEOS.map((v, i) => (
              <VideoThumb
                key={v.id}
                video={v}
                isActive={active === i}
                onClick={() => setActive(i)}
              />
            ))}
          </div>

          {/* Правый плеер */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="coi-video-player">
            <div style={{ flex: 1, position: "relative", background: "#0d0d0d", minHeight: 300 }}>
              <iframe
                key={current.id}
                src={`https://kinescope.io/embed/${current.id}`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%", height: "100%",
                  border: "none",
                }}
              />
            </div>
            <div style={{
              padding: "16px 22px",
              borderTop: "1px solid #f0f0ed",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>
                  {current.name}
                </div>
                <div style={{ fontSize: 12.5, color: "#999", marginTop: 2 }}>
                  {current.city} · {current.experience}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: `${ACCENT}12`, borderRadius: 10, padding: "7px 14px",
              }}>
                <Icon name="TrendingUp" size={13} style={{ color: ACCENT }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{current.result}</span>
              </div>
            </div>

            {/* Навигация точками */}
            <div style={{ padding: "0 22px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              {VIDEOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    width: active === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: active === i ? ACCENT : "#ddd",
                    transition: "all 0.25s",
                  }}
                />
              ))}
              <span style={{ fontSize: 12, color: "#bbb", marginLeft: 4, fontFamily: "Montserrat, sans-serif" }}>
                {active + 1} / {VIDEOS.length}
              </span>
            </div>
          </div>
        </div>

        {/* МОБИЛЬНЫЙ: только список карточек без видео */}
        <div className="coi-video-mobile">
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#bbb",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 14,
            fontFamily: "Montserrat, sans-serif",
          }}>
            Видеоотзывы
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VIDEOS.map((v) => (
              <div
                key={v.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8e8e4",
                  borderRadius: 16,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: `${ACCENT}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 0, height: 0,
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: `11px solid ${ACCENT}`,
                    marginLeft: 3,
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 2, fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{v.city} · {v.experience}</div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: `${ACCENT}12`, borderRadius: 6, padding: "3px 9px",
                  }}>
                    <Icon name="TrendingUp" size={11} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: ACCENT }}>{v.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .coi-video-mobile { display: none; }
          @media (max-width: 640px) {
            .coi-video-wrap { display: none !important; }
            .coi-video-mobile { display: block; }
          }
          @media (min-width: 641px) and (max-width: 860px) {
            .coi-video-wrap { min-height: 360px !important; }
            .coi-video-sidebar { width: 220px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
