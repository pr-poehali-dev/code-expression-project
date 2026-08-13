import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";

export interface ToolLink {
  label: string;
  desc: string | null;
  icon: string | null;
  tab: string | null;
  tool: string | null;
}

// Куда сохранять "отложенный" инструмент перед переходом в кабинет — читается при монтировании
// нужной вкладки (см. LkDashboard.tsx: lk_ai_tool_pending, lk_marketing_tool_pending).
const PENDING_KEY_BY_TAB: Record<string, string> = {
  ai: "lk_ai_tool_pending",
  marketing: "lk_marketing_tool_pending",
};

export default function BlogToolLink({ toolLink, authenticated }: { toolLink: ToolLink; authenticated: boolean }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!authenticated) {
      navigate("/cabinet?tab=register");
      return;
    }
    if (toolLink.tab) {
      sessionStorage.setItem("lk_tab", toolLink.tab);
      const pendingKey = PENDING_KEY_BY_TAB[toolLink.tab];
      if (pendingKey && toolLink.tool) sessionStorage.setItem(pendingKey, toolLink.tool);
    }
    navigate("/cabinet");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left",
        padding: "20px 22px", margin: "4px 0 24px", borderRadius: 14, border: "none", cursor: "pointer",
        background: `linear-gradient(135deg, ${DARK}, #112B3C)`,
        fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 12px 28px rgba(15,23,42,0.25)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,212,191,0.25), transparent 70%)",
      }} />
      <div style={{
        flexShrink: 0, width: 46, height: 46, borderRadius: 12,
        background: "linear-gradient(135deg,#2DD4BF,#14B8A6)",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1,
      }}>
        <Icon name={toolLink.icon || "Sparkles"} fallback="Sparkles" size={22} style={{ color: DARK }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
          {authenticated ? "Инструмент из этой статьи" : "Доступно в личном кабинете"}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: toolLink.desc ? 3 : 0 }}>
          {toolLink.label}
        </div>
        {toolLink.desc && (
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", fontWeight: 300, lineHeight: 1.4 }}>
            {toolLink.desc}
          </div>
        )}
      </div>
      <Icon name="ArrowRight" size={20} style={{ color: TEAL, flexShrink: 0, position: "relative", zIndex: 1 }} />
    </button>
  );
}
