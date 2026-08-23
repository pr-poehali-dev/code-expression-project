import { ACCENT, actionBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { TOOLS_CATALOG } from "./toolsCatalog";

interface Props {
  tools: string[];
  savingTools: boolean;
  onToggle: (slug: string) => void;
  onSave: () => void;
}

export default function LkAdminLessonToolsPanel({ tools, savingTools, onToggle, onSave }: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="Layers" size={15} style={{ color: ACCENT }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Инструменты к уроку</div>
        <div style={{ fontSize: 11, color: "#aaa", marginLeft: 2 }}>Отображаются в конце урока — ученик сразу может попробовать</div>
      </div>

      {["tools", "ai", "marketing"].map(cat => {
        const catTools = TOOLS_CATALOG.filter(t => t.category === cat);
        const catLabel = cat === "ai" ? "ИИ-инструменты" : cat === "marketing" ? "Маркетинг" : "Инструменты роста";
        const catColor = cat === "ai" ? "hsl(280,60%,50%)" : cat === "marketing" ? "hsl(25,90%,45%)" : ACCENT;
        const catBg    = cat === "ai" ? "hsl(280,60%,97%)" : cat === "marketing" ? "hsl(25,90%,97%)" : "hsl(185,85%,96%)";
        return (
          <div key={cat}>
            <div style={{ fontSize: 11, fontWeight: 700, color: catColor, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{catLabel}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {catTools.map(tool => {
                const active = tools.includes(tool.slug);
                return (
                  <button
                    key={tool.slug}
                    onClick={() => onToggle(tool.slug)}
                    title={tool.description}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      fontFamily: "Montserrat, sans-serif",
                      border: `1.5px solid ${active ? catColor : "#e0e0dc"}`,
                      background: active ? catBg : "#fafaf8",
                      color: active ? catColor : "#888",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon name={tool.icon} size={13} />
                    {tool.name}
                    {tool.audience && (
                      <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 500 }}>· {tool.audience}</span>
                    )}
                    {active && <Icon name="Check" size={11} />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={onSave}
        disabled={savingTools}
        style={{ ...actionBtn(ACCENT), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
      >
        <Icon name="Save" size={13} />
        {savingTools ? "Сохраняем..." : `Сохранить инструменты (${tools.length})`}
      </button>
    </div>
  );
}