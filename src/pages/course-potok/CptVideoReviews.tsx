import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./CptShared";

const VIDEOS = [
  {
    id: "9gXRTsH48ootXdfsfSxrM3",
    name: "Ксения М.",
    city: "Москва",
    experience: "Массажист, 2 года",
    result: "Запись на 3 недели вперёд",
  },
  {
    id: "ijbAj7MbdwDvX8jdx5fgiq",
    name: "Артём В.",
    city: "Санкт-Петербург",
    experience: "Массажист, 3 года",
    result: "Сарафанное радио работает само",
  },
  {
    id: "5u8FjHNy89MCso6wue8uEq",
    name: "Наталья С.",
    city: "Казань",
    experience: "Массажист, 1,5 года",
    result: "Поток клиентов с нуля",
  },
  {
    id: "eFKnFkaFhfwaMk7BZgi4zp",
    name: "Дмитрий К.",
    city: "Екатеринбург",
    experience: "Массажист, 4 года",
    result: "Стабильный доход каждый месяц",
  },
  {
    id: "6yUBNj4ToDMq7vd5e25yrh",
    name: "Ольга П.",
    city: "Новосибирск",
    experience: "Массажист, 2,5 года",
    result: "Вырос средний чек на 40%",
  },
  {
    id: "2nEvA7AUqtTnzrnwP7J4wm",
    name: "Игорь Л.",
    city: "Ростов-на-Дону",
    experience: "Массажист, 3 года",
    result: "Первые клиенты в процессе обучения",
  },
];

function PlayIcon({ color }: { color: string }) {
  return (
    <div style={{
      width: 0, height: 0,
      borderTop: "7px solid transparent",
      borderBottom: "7px solid transparent",
      borderLeft: `12px solid ${color}`,
      marginLeft: 3,
      transition: "border-color 0.2s",
    }} />
  );
}

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
        <PlayIcon color={isActive ? ACCENT : "#aaa"} />
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

function DotsNav({ active, total, onChange }: { active: number; total: number; onChange: (i: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
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
        {active + 1} / {total}
      </span>
    </div>
  );
}

export default function CptVideoReviews() {
  const [active, setActive] = useState(0);
  const current = VIDEOS[active];

  return (
    <section style={{ padding: "60px 0 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* ДЕСКТОП / ПЛАНШЕТ: боковой список + плеер */}
        <div style={{
          background: "#fff",
          border: "1px solid #e8e8e4",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          display: "flex",
          minHeight: 420,
        }} className="cpt-video-wrap">

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
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "#bbb",
              textTransform: "uppercase", letterSpacing: 0.8,
              padding: "4px 14px 10px", fontFamily: "Montserrat, sans-serif",
            }}>
              Видеоотзывы
            </div>
            {VIDEOS.map((v, i) => (
              <VideoThumb key={v.id} video={v} isActive={active === i} onClick={() => setActive(i)} />
            ))}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, position: "relative", background: "#0d0d0d", minHeight: 300 }}>
              <iframe
                key={current.id}
                src={`https://kinescope.io/embed/${current.id}`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
            <div style={{
              padding: "16px 22px", borderTop: "1px solid #f0f0ed",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
                <div style={{ fontSize: 12.5, color: "#999", marginTop: 2 }}>{current.city} · {current.experience}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${ACCENT}12`, borderRadius: 10, padding: "7px 14px" }}>
                <Icon name="TrendingUp" size={13} style={{ color: ACCENT }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{current.result}</span>
              </div>
            </div>
            <div style={{ padding: "0 22px 16px" }}>
              <DotsNav active={active} total={VIDEOS.length} onChange={setActive} />
            </div>
          </div>
        </div>

        {/* МОБИЛЬНЫЙ: плеер сверху + список снизу */}
        <div className="cpt-video-mobile">
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
            marginBottom: 16,
          }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0d0d0d" }}>
              <iframe
                key={current.id}
                src={`https://kinescope.io/embed/${current.id}`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{current.city} · {current.experience}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: `${ACCENT}12`, borderRadius: 8, padding: "5px 12px" }}>
                <Icon name="TrendingUp" size={12} style={{ color: ACCENT }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{current.result}</span>
              </div>
            </div>
            <div style={{ padding: "0 18px 14px" }}>
              <DotsNav active={active} total={VIDEOS.length} onChange={setActive} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VIDEOS.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  background: active === i ? "#fff" : "transparent",
                  border: active === i ? `2px solid ${ACCENT}` : "2px solid #e8e8e4",
                  borderRadius: 14,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.2s",
                  boxShadow: active === i ? `0 4px 14px ${ACCENT}20` : "none",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: active === i ? `${ACCENT}18` : "#f0f0ed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <PlayIcon color={active === i ? ACCENT : "#bbb"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
                  <div style={{ fontSize: 11.5, color: "#999" }}>{v.city} · {v.experience}</div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: active === i ? `${ACCENT}15` : "#f5f5f2",
                  borderRadius: 6, padding: "3px 8px", flexShrink: 0,
                }}>
                  <Icon name="TrendingUp" size={10} style={{ color: active === i ? ACCENT : "#aaa" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: active === i ? ACCENT : "#aaa", whiteSpace: "nowrap" }}>{v.result}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          .cpt-video-mobile { display: none; }
          @media (max-width: 640px) {
            .cpt-video-wrap { display: none !important; }
            .cpt-video-mobile { display: block; }
          }
          @media (min-width: 641px) and (max-width: 860px) {
            .cpt-video-wrap { min-height: 360px !important; }
            .cpt-video-wrap > div:first-child { width: 220px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}