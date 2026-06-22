import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAcademyTypes";
import { getToolBySlug } from "./toolsCatalog";

interface Props {
  tools: string[];
  onNavigate: (tab: string) => void;
  previewMode?: boolean;
}

const CAT_COLORS: Record<string, { bg: string; border: string; badge: string; badgeBg: string }> = {
  tools:    { bg: "hsl(185,85%,96%)", border: "hsl(185,85%,78%)", badge: "hsl(185,85%,32%)", badgeBg: "hsl(185,85%,92%)" },
  ai:       { bg: "hsl(280,60%,97%)", border: "hsl(280,60%,80%)", badge: "hsl(280,60%,48%)", badgeBg: "hsl(280,60%,93%)" },
  marketing:{ bg: "hsl(25,90%,97%)",  border: "hsl(25,90%,78%)",  badge: "hsl(25,90%,45%)",  badgeBg: "hsl(25,90%,92%)"  },
  partners: { bg: "hsl(40,90%,97%)",  border: "hsl(40,90%,78%)",  badge: "hsl(40,90%,40%)",  badgeBg: "hsl(40,90%,92%)"  },
};
const CAT_LABEL: Record<string, string> = { tools: "Инструмент", ai: "ИИ", marketing: "Маркетинг", partners: "Партнёрство" };

export default function LkLessonTools({ tools, onNavigate, previewMode }: Props) {
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
        <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500 }}>
          {previewMode ? "— предпросмотр" : "— попробуй прямо сейчас"}
        </span>
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
                      {CAT_LABEL[tool!.category] ?? "Инструмент"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.5 }}>{tool!.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (previewMode) return;
                  if (tool!.url) { window.open(tool!.url, "_blank", "noopener,noreferrer"); }
                  else { onNavigate(tool!.tab); }
                }}
                disabled={previewMode}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 9, border: "none",
                  background: previewMode ? "#e8e8e4" : c.badge,
                  color: previewMode ? "#aaa" : "#fff",
                  fontSize: 12, fontWeight: 700,
                  cursor: previewMode ? "default" : "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <Icon name={previewMode ? "Eye" : "ExternalLink"} size={12} />
                {previewMode ? "Недоступно в предпросмотре" : tool!.category === "partners" ? "Узнать подробнее" : "Открыть инструмент"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}