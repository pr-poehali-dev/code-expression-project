import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const IMG_URL = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/bd5d264e-4712-4e93-adfa-b10ea45948dc.jpg";

// Координаты в % от размера картинки (1280x942)
// Фигура СПЕРЕДИ: тело x≈6%–41%, голова центр ~23.5%
// Фигура СЗАДИ:   тело x≈58%–94%, голова центр ~75%
// Высота фигур: голова y≈1.5%, стопы y≈91%
const ZONES_FRONT: ZoneHotspot[] = [
  { slug: "head",            label: "Голова",           x: 20,   y: 3,    w: 8,   h: 10  },
  { slug: "neck",            label: "Шея",              x: 22,   y: 13,   w: 4,   h: 4   },
  { slug: "shoulders",       label: "Плечи",            x: 11,   y: 17,   w: 22,  h: 5   },
  { slug: "chest",           label: "Грудь",            x: 17,   y: 22,   w: 12,  h: 10  },
  { slug: "abdomen",         label: "Живот",            x: 17.5, y: 32,   w: 10,  h: 9   },
  { slug: "hips",            label: "Бёдра",            x: 16,   y: 41,   w: 13,  h: 7   },
  { slug: "upper-arm-left",  label: "Плечо (лев.)",     x: 7,    y: 18,   w: 5,   h: 13  },
  { slug: "upper-arm-right", label: "Плечо (прав.)",    x: 32,   y: 18,   w: 5,   h: 13  },
  { slug: "forearm-left",    label: "Предплечье (лев.)",x: 4,    y: 31,   w: 4.5, h: 11  },
  { slug: "forearm-right",   label: "Предплечье (пр.)", x: 35.5, y: 31,   w: 4.5, h: 11  },
  { slug: "thigh-left",      label: "Бедро (лев.)",     x: 18,   y: 48,   w: 6,   h: 14  },
  { slug: "thigh-right",     label: "Бедро (прав.)",    x: 24,   y: 48,   w: 6,   h: 14  },
  { slug: "knee-left",       label: "Колено (лев.)",    x: 18,   y: 62,   w: 5.5, h: 5   },
  { slug: "knee-right",      label: "Колено (прав.)",   x: 24,   y: 62,   w: 5.5, h: 5   },
  { slug: "shin-left",       label: "Голень (лев.)",    x: 17.5, y: 67,   w: 5,   h: 16  },
  { slug: "shin-right",      label: "Голень (прав.)",   x: 23.5, y: 67,   w: 5,   h: 16  },
  { slug: "foot",            label: "Стопы",            x: 15,   y: 91,   w: 15,  h: 6   },
];

const ZONES_BACK: ZoneHotspot[] = [
  { slug: "head",            label: "Голова",           x: 71,   y: 3,    w: 8,   h: 10  },
  { slug: "neck",            label: "Шея",              x: 73,   y: 13,   w: 4,   h: 4   },
  { slug: "shoulders",       label: "Плечи",            x: 62,   y: 17,   w: 22,  h: 5   },
  { slug: "upper-back",      label: "Верхняя спина",    x: 68,   y: 22,   w: 12,  h: 10  },
  { slug: "lower-back",      label: "Поясница",         x: 68.5, y: 32,   w: 10,  h: 8   },
  { slug: "glutes",          label: "Ягодицы",          x: 67,   y: 40,   w: 13,  h: 8   },
  { slug: "upper-arm-left",  label: "Плечо (лев.)",     x: 58,   y: 18,   w: 5,   h: 13  },
  { slug: "upper-arm-right", label: "Плечо (прав.)",    x: 83.5, y: 18,   w: 5,   h: 13  },
  { slug: "forearm-left",    label: "Предплечье (лев.)",x: 55,   y: 31,   w: 4.5, h: 11  },
  { slug: "forearm-right",   label: "Предплечье (пр.)", x: 87,   y: 31,   w: 4.5, h: 11  },
  { slug: "thigh-left",      label: "Бедро (лев.)",     x: 68,   y: 48,   w: 6,   h: 14  },
  { slug: "thigh-right",     label: "Бедро (прав.)",    x: 74,   y: 48,   w: 6,   h: 14  },
  { slug: "knee-left",       label: "Колено (лев.)",    x: 68,   y: 62,   w: 5.5, h: 5   },
  { slug: "knee-right",      label: "Колено (прав.)",   x: 74,   y: 62,   w: 5.5, h: 5   },
  { slug: "shin-left",       label: "Голень (лев.)",    x: 67.5, y: 67,   w: 5,   h: 16  },
  { slug: "shin-right",      label: "Голень (прав.)",   x: 73.5, y: 67,   w: 5,   h: 16  },
  { slug: "foot",            label: "Стопы",            x: 65,   y: 91,   w: 15,  h: 6   },
];

interface ZoneHotspot {
  slug: string;
  label: string;
  x: number; // % от ширины картинки
  y: number; // % от высоты картинки
  w: number;
  h: number;
}

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

  // Дедупликация: не показывать одну и ту же зону дважды в списке
  const allHotspots = [...ZONES_FRONT, ...ZONES_BACK];
  const seenSlugs = new Set<string>();
  const uniqueHotspots = allHotspots.filter(z => {
    if (seenSlugs.has(z.slug)) return false;
    seenSlugs.add(z.slug);
    return true;
  });

  // Порядковый номер зоны по slug (из уникального списка активных)
  const zoneNumberMap: Record<string, number> = {};
  uniqueHotspots.filter(z => activeSlugs.has(z.slug)).forEach((z, i) => {
    zoneNumberMap[z.slug] = i + 1;
  });

  const renderHotspots = (hotspots: ZoneHotspot[]) =>
    hotspots.map(zone => {
      if (!activeSlugs.has(zone.slug)) return null;
      const isHovered = hovered === zone.slug;
      const isSelected = selected?.zone.slug === zone.slug;
      const num = zoneNumberMap[zone.slug];
      return (
        <div
          key={`${zone.slug}-${zone.x}`}
          onClick={() => selectZone(zone.slug)}
          onMouseEnter={() => setHovered(zone.slug)}
          onMouseLeave={() => setHovered(null)}
          title={zone.label}
          style={{
            position: "absolute",
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.w}%`,
            height: `${zone.h}%`,
            borderRadius: 8,
            cursor: "pointer",
            background: isSelected
              ? "hsla(185,85%,32%,0.40)"
              : isHovered
              ? "hsla(185,85%,32%,0.20)"
              : "hsla(0,0%,0%,0.04)",
            border: isSelected
              ? `2px solid ${ACCENT}`
              : isHovered
              ? `2px solid hsla(185,85%,32%,0.7)`
              : "1.5px solid hsla(0,0%,0%,0.10)",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span style={{
            fontSize: "clamp(7px, 0.85vw, 10px)",
            fontWeight: 700,
            color: isSelected ? "#fff" : isHovered ? "#fff" : "rgba(0,0,0,0.45)",
            fontFamily: "Montserrat, sans-serif",
            lineHeight: 1,
            pointerEvents: "none",
            textShadow: isSelected || isHovered ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
          }}>
            {num}
          </span>
        </div>
      );
    });

  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Шпаргалка по телу
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 20px" }}>
        Кликни на зону тела — получи диагностику и техники
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, alignItems: "start" }} className="body-grid">

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
              textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <Icon name="MousePointerClick" size={40} style={{ marginBottom: 16, color: "#ddd" }} />
              <div style={{ fontSize: 15, color: "#bbb" }}>Выбери зону на схеме справа</div>
            </div>
          )}
          {selected && !detailLoading && <ZonePanel zone={selected} />}
        </div>

        {/* Карта тела */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "sticky", top: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, textAlign: "center" }}>
            Спереди &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Сзади
          </div>

          {loading ? (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
              <Icon name="Loader" size={24} />
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%" }}>
              <img
                src={IMG_URL}
                alt="Анатомия тела"
                style={{ width: "100%", display: "block", borderRadius: 12, userSelect: "none" }}
                draggable={false}
              />
              {/* Горячие зоны поверх картинки */}
              <div style={{ position: "absolute", inset: 0 }}>
                {renderHotspots(ZONES_FRONT)}
                {renderHotspots(ZONES_BACK)}
              </div>
            </div>
          )}

          {/* Список зон */}
          <div style={{ marginTop: 14, borderTop: "1px solid #f0f0ec", paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>Или выбери из списка:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {uniqueHotspots.filter(z => activeSlugs.has(z.slug)).map(z => {
                const isSelected = selected?.zone.slug === z.slug;
                const isHov = hovered === z.slug;
                const num = zoneNumberMap[z.slug];
                return (
                  <button
                    key={z.slug}
                    onClick={() => selectZone(z.slug)}
                    onMouseEnter={() => setHovered(z.slug)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11,
                      border: isSelected || isHov ? `1.5px solid ${ACCENT}` : "1.5px solid #e8e8e4",
                      background: isSelected ? ACCENT : isHov ? "hsl(185,85%,96%)" : "#fafafa",
                      color: isSelected ? "#fff" : isHov ? ACCENT : "#666",
                      cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                      fontWeight: isSelected || isHov ? 700 : 400,
                      transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      background: isSelected ? "rgba(255,255,255,0.25)" : isHov ? "hsla(185,85%,32%,0.15)" : "#eee",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700,
                      color: isSelected ? "#fff" : isHov ? ACCENT : "#999",
                    }}>
                      {num}
                    </span>
                    {z.label}
                  </button>
                );
              })}
            </div>
          </div>
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

function ZonePanel({ zone }: { zone: ZoneDetail }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
          {zone.zone.name}
        </h2>
        {zone.zone.description
          ? <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{zone.zone.description}</p>
          : <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic" }}>Описание ещё не добавлено</p>
        }
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", borderLeft: `4px solid ${ACCENT}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Icon name="Search" size={18} style={{ color: ACCENT }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Диагностика</h3>
        </div>
        {zone.zone.diagnosis
          ? <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{zone.zone.diagnosis}</p>
          : <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", margin: 0 }}>Текст диагностики ещё не добавлен</p>
        }
        {zone.zone.video_url && (() => {
          const kid = getKinescopeId(zone.zone.video_url);
          return kid ? (
            <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
              <iframe src={`https://kinescope.io/embed/${kid}`} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
            </div>
          ) : null;
        })()}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon name="Zap" size={18} style={{ color: ACCENT }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Техники</h3>
        </div>
        {zone.techniques.length === 0
          ? <p style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", margin: 0 }}>Техники ещё не добавлены</p>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {zone.techniques.map((tech, i) => (
                <div key={tech.id} style={{ borderBottom: i < zone.techniques.length - 1 ? "1px solid #f0f0ec" : "none", paddingBottom: i < zone.techniques.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{i + 1}. {tech.title}</div>
                  {tech.description && <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7, margin: "0 0 10px", whiteSpace: "pre-line" }}>{tech.description}</p>}
                  {tech.video_url && (() => {
                    const kid = getKinescopeId(tech.video_url);
                    return kid ? (
                      <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
                        <iframe src={`https://kinescope.io/embed/${kid}`} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}