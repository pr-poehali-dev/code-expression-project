import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";

interface Zone {
  id: number;
  slug: string;
  name: string;
}

interface Technique {
  id: number;
  title: string;
  description: string;
  video_url: string;
}

interface ZoneDetail {
  zone: Zone & { description: string; diagnosis: string; video_url: string };
  techniques: Technique[];
}

// SVG-карта тела — интерактивные зоны
const BODY_ZONES_SVG: { slug: string; label: string; cx: number; cy: number; w: number; h: number }[] = [
  { slug: "head", label: "Голова", cx: 120, cy: 30, w: 44, h: 44 },
  { slug: "neck", label: "Шея", cx: 120, cy: 72, w: 24, h: 22 },
  { slug: "shoulders", label: "Плечи", cx: 120, cy: 95, w: 90, h: 20 },
  { slug: "chest", label: "Грудь", cx: 120, cy: 118, w: 60, h: 28 },
  { slug: "upper-back", label: "В.спина", cx: 120, cy: 118, w: 60, h: 28 },
  { slug: "abdomen", label: "Живот", cx: 120, cy: 150, w: 54, h: 26 },
  { slug: "lower-back", label: "Поясница", cx: 120, cy: 150, w: 54, h: 26 },
  { slug: "hips", label: "Бёдра", cx: 120, cy: 182, w: 58, h: 22 },
  { slug: "glutes", label: "Ягодицы", cx: 120, cy: 182, w: 58, h: 22 },
  { slug: "upper-arm-left", label: "Плечо Л", cx: 66, cy: 120, w: 22, h: 38 },
  { slug: "upper-arm-right", label: "Плечо П", cx: 174, cy: 120, w: 22, h: 38 },
  { slug: "forearm-left", label: "Предпл.Л", cx: 58, cy: 158, w: 18, h: 34 },
  { slug: "forearm-right", label: "Предпл.П", cx: 182, cy: 158, w: 18, h: 34 },
  { slug: "thigh-left", label: "Бедро Л", cx: 102, cy: 215, w: 26, h: 42 },
  { slug: "thigh-right", label: "Бедро П", cx: 138, cy: 215, w: 26, h: 42 },
  { slug: "knee-left", label: "Колено Л", cx: 100, cy: 258, w: 22, h: 20 },
  { slug: "knee-right", label: "Колено П", cx: 140, cy: 258, w: 22, h: 20 },
  { slug: "shin-left", label: "Голень Л", cx: 99, cy: 286, w: 20, h: 38 },
  { slug: "shin-right", label: "Голень П", cx: 141, cy: 286, w: 20, h: 38 },
  { slug: "foot", label: "Стопы", cx: 120, cy: 332, w: 52, h: 18 },
];

function getKinescopeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

export default function LkBodyMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selected, setSelected] = useState<ZoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    lkApi.bodyZones().then(setZones).finally(() => setLoading(false));
  }, []);

  const selectZone = async (slug: string) => {
    setDetailLoading(true);
    try {
      const data = await lkApi.bodyZone(slug);
      setSelected(data);
    } catch {
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const activeSlugs = new Set(zones.map(z => z.slug));

  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Шпаргалка по телу
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>
        Выбери зону на схеме или из списка — получи диагностику и техники
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }} className="body-grid">

        {/* SVG-схема тела */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
            Кликни на зону
          </div>
          {loading ? (
            <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
              <Icon name="Loader" size={24} />
            </div>
          ) : (
            <svg viewBox="0 0 240 360" style={{ width: "100%", maxWidth: 240, display: "block", margin: "0 auto" }}>
              {/* Силуэт тела */}
              <ellipse cx="120" cy="30" rx="22" ry="22" fill="#f0f0ec" stroke="#ddd" strokeWidth="1" />
              <rect x="108" y="51" width="24" height="20" rx="6" fill="#f0f0ec" stroke="#ddd" strokeWidth="1" />
              <path d="M75 72 L165 72 L170 100 L170 180 L165 210 L155 210 L150 180 L140 180 L130 270 L126 340 L114 340 L110 270 L100 180 L90 180 L85 210 L75 210 L70 180 L70 100 Z" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5" />
              <path d="M75 72 L55 76 L45 130 L45 175 L52 175 L58 130 L68 100" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5" />
              <path d="M165 72 L185 76 L195 130 L195 175 L188 175 L182 130 L172 100" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5" />
              <ellipse cx="49" cy="175" rx="9" ry="7" fill="#f0f0ec" stroke="#ddd" strokeWidth="1" />
              <ellipse cx="191" cy="175" rx="9" ry="7" fill="#f0f0ec" stroke="#ddd" strokeWidth="1" />
              <path d="M126 270 L123 320 L115 340 L110 344 L108 340 L114 320 L112 270" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5" />
              <path d="M114 270 L117 320 L125 340 L130 344 L132 340 L126 320 L128 270" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5" />

              {/* Интерактивные зоны */}
              {BODY_ZONES_SVG.map(zone => {
                const active = activeSlugs.has(zone.slug);
                const isHovered = hovered === zone.slug;
                const isSelected = selected?.zone.slug === zone.slug;
                if (!active) return null;
                return (
                  <g key={zone.slug}
                    style={{ cursor: "pointer" }}
                    onClick={() => selectZone(zone.slug)}
                    onMouseEnter={() => setHovered(zone.slug)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <ellipse
                      cx={zone.cx} cy={zone.cy}
                      rx={zone.w / 2} ry={zone.h / 2}
                      fill={isSelected ? ACCENT : isHovered ? "hsla(185,85%,32%,0.15)" : "hsla(185,85%,32%,0.08)"}
                      stroke={isSelected || isHovered ? ACCENT : "hsla(185,85%,32%,0.3)"}
                      strokeWidth={isSelected ? 2 : 1.5}
                      style={{ transition: "all 0.15s" }}
                    />
                    {(isHovered || isSelected) && (
                      <text
                        x={zone.cx} y={zone.cy + 4}
                        textAnchor="middle" fontSize="8"
                        fill={isSelected ? "#fff" : ACCENT}
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="600"
                        style={{ pointerEvents: "none" }}
                      >
                        {zone.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Список зон */}
          <div style={{ marginTop: 16, borderTop: "1px solid #f0f0ec", paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Или выбери из списка:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {zones.map(z => (
                <button
                  key={z.slug}
                  onClick={() => selectZone(z.slug)}
                  style={{
                    padding: "5px 10px", borderRadius: 20, fontSize: 12,
                    border: selected?.zone.slug === z.slug ? `1.5px solid ${ACCENT}` : "1.5px solid #e8e8e4",
                    background: selected?.zone.slug === z.slug ? "hsl(185,85%,96%)" : "#fafafa",
                    color: selected?.zone.slug === z.slug ? ACCENT : "#666",
                    cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                    fontWeight: selected?.zone.slug === z.slug ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {z.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Детали зоны */}
        <div>
          {detailLoading && (
            <div style={{ background: "#fff", borderRadius: 20, padding: 48, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!selected && !detailLoading && (
            <div style={{
              background: "#fff", borderRadius: 20, padding: "48px 32px",
              textAlign: "center", color: "#ccc",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <Icon name="MousePointerClick" size={40} style={{ marginBottom: 16, color: "#ddd" }} />
              <div style={{ fontSize: 15, color: "#bbb" }}>Выбери зону тела слева</div>
            </div>
          )}

          {selected && !detailLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Заголовок */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
                  {selected.zone.name}
                </h2>
                {selected.zone.description && (
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>
                    {selected.zone.description}
                  </p>
                )}
                {!selected.zone.description && (
                  <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic" }}>Описание ещё не добавлено</p>
                )}
              </div>

              {/* Диагностика */}
              <div style={{
                background: "#fff", borderRadius: 20, padding: "24px 28px",
                borderLeft: `4px solid ${ACCENT}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <Icon name="Search" size={18} style={{ color: ACCENT }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Диагностика</h3>
                </div>
                {selected.zone.diagnosis ? (
                  <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>
                    {selected.zone.diagnosis}
                  </p>
                ) : (
                  <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", margin: 0 }}>
                    Текст диагностики ещё не добавлен
                  </p>
                )}
                {selected.zone.video_url && (() => {
                  const kid = getKinescopeId(selected.zone.video_url);
                  return kid ? (
                    <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
                      <iframe
                        src={`https://kinescope.io/embed/${kid}`}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Техники */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Icon name="Zap" size={18} style={{ color: ACCENT }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Техники</h3>
                </div>
                {selected.techniques.length === 0 && (
                  <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", margin: 0 }}>
                    Техники ещё не добавлены
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {selected.techniques.map((tech, i) => (
                    <div key={tech.id} style={{ borderBottom: i < selected.techniques.length - 1 ? "1px solid #f0f0ec" : "none", paddingBottom: i < selected.techniques.length - 1 ? 16 : 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
                        {i + 1}. {tech.title}
                      </div>
                      {tech.description && (
                        <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7, margin: "0 0 10px", whiteSpace: "pre-line" }}>
                          {tech.description}
                        </p>
                      )}
                      {tech.video_url && (() => {
                        const kid = getKinescopeId(tech.video_url);
                        return kid ? (
                          <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
                            <iframe
                              src={`https://kinescope.io/embed/${kid}`}
                              style={{ width: "100%", height: "100%", border: "none" }}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                          </div>
                        ) : null;
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .body-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
