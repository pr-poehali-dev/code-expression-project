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

      {/* Партнёрская программа — переключаемые плашки */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(280,60%,50%)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Партнёрская программа</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TOOLS_CATALOG.filter(t => t.category === "partners").map(tool => {
            const active = tools.includes(tool.slug);
            const isRegister = tool.slug === "masters-register";
            const color = isRegister ? ACCENT : "hsl(40,90%,45%)";
            const bgActive = isRegister ? "hsl(185,85%,96%)" : "hsl(40,90%,97%)";
            const borderActive = isRegister ? ACCENT : "hsl(40,90%,60%)";
            const iconBg = isRegister ? ACCENT : "hsl(40,90%,50%)";
            return (
              <div
                key={tool.slug}
                onClick={() => onToggle(tool.slug)}
                style={{
                  background: active ? bgActive : "#fafaf8",
                  border: `1.5px solid ${active ? borderActive : "#e0e0dc"}`,
                  borderRadius: 12, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? iconBg : "#e8e8e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                  <Icon name={tool.icon} size={17} style={{ color: active ? "#fff" : "#aaa" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "#1a1a1a" : "#888", marginBottom: 2 }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: active ? "#64748b" : "#bbb", lineHeight: 1.4 }}>{tool.description}</div>
                </div>
                {active && <Icon name="Check" size={15} style={{ color, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
