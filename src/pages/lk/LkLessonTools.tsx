import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAcademyTypes";
import { getToolBySlug } from "./toolsCatalog";

interface Props {
  tools: string[];
  onNavigate: (tab: string) => void;
}

const CAT_COLORS = {
  tools: { bg: "hsl(185,85%,96%)", border: "hsl(185,85%,78%)", badge: "hsl(185,85%,32%)", badgeBg: "hsl(185,85%,92%)" },
  ai:    { bg: "hsl(280,60%,97%)", border: "hsl(280,60%,80%)", badge: "hsl(280,60%,48%)", badgeBg: "hsl(280,60%,93%)" },
};

export default function LkLessonTools({ tools, onNavigate }: Props) {
  if (!tools || tools.length === 0) return null;

  const resolved = tools.map(s => getToolBySlug(s)).filter(Boolean) as ReturnType<typeof getToolBySlug>[];
  if (resolved.length === 0) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 20, borderRadius: 2, background: ACCENT }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Инструменты к уроку
        </span>
        <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500 }}>— попробуй прямо сейчас</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {resolved.map(tool => {
          const c = CAT_COLORS[tool!.category];
          return (
            <div
              key={tool!.slug}
              style={{
                background: c.bg,
                border: `1.5px solid ${c.border}`,
                borderRadius: 14,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "#fff",
                  border: `1.5px solid ${c.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name={tool!.icon} size={18} style={{ color: c.badge }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{tool!.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: c.badgeBg, color: c.badge, whiteSpace: "nowrap",
                    }}>
                      {tool!.category === "ai" ? "ИИ" : "Инструмент"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.5 }}>{tool!.description}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate(tool!.tab)}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 9, border: "none",
                  background: c.badge, color: "#fff",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <Icon name="ExternalLink" size={12} />
                Открыть инструмент
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
