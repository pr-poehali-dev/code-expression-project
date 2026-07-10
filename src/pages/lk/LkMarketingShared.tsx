import Icon from "@/components/ui/icon";
import { ACCENT, BADGE_STYLES, Tool } from "./LkMarketingTypes";

export function hasCachedResult(key: string): boolean {
  try { return !!localStorage.getItem(key); } catch { return false; }
}

export function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: (id: string) => void }) {
  const badge = BADGE_STYLES[tool.badge] || BADGE_STYLES.new;
  const disabled = !tool.ready;

  return (
    <div
      onClick={() => !disabled && onOpen(tool.id)}
      style={{
        background: "#fff",
        border: `1.5px solid ${disabled ? "#E8ECF0" : "#E0EEF0"}`,
        borderRadius: 18,
        padding: "24px 22px",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.75 : 1,
        transition: "all 0.18s",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { if (!disabled) { const el = e.currentTarget; el.style.boxShadow = "0 12px 32px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-3px)"; el.style.borderColor = "hsl(185,85%,65%)"; }}}
      onMouseLeave={e => { if (!disabled) { const el = e.currentTarget; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; el.style.borderColor = "#E0EEF0"; }}}
    >
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5, textTransform: "uppercase" }}>
        {badge.label}
      </div>

      <div style={{ width: 48, height: 48, borderRadius: 14, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={tool.icon} size={22} style={{ color: tool.iconColor }} />
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6, paddingRight: 52 }}>{tool.title}</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{tool.description}</div>
        {tool.requiresPaid && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 11, fontWeight: 600, color: "hsl(40,70%,40%)", background: "hsl(40,90%,94%)", borderRadius: 20, padding: "3px 10px" }}>
            <Icon name="Lock" size={11} />
            Только на платных тарифах
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto" }}>
        {tool.ready
          ? <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: ACCENT }}>
              Открыть <Icon name="ArrowRight" size={13} />
            </div>
          : <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
              <Icon name="Clock" size={13} />
              Скоро будет доступно
            </div>
        }
      </div>
    </div>
  );
}

export function ComingSoonPlaceholder({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 28, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 16, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={tool.icon} size={32} style={{ color: tool.iconColor }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{tool.title}</div>
          <div style={{ fontSize: 14, color: "#64748B", maxWidth: 380, lineHeight: 1.6 }}>{tool.description}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "hsla(185,85%,32%,0.08)", borderRadius: 50, padding: "8px 18px" }}>
          <Icon name="Clock" size={13} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>В разработке — скоро будет доступно</span>
        </div>
      </div>
    </div>
  );
}

export function StepBlocker({ missing, onGoTo, onBack }: { missing: { toolId: string; toolTitle: string }; onGoTo: () => void; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 28, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>
      <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid hsl(40,90%,80%)", padding: "36px 32px", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "hsl(40,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="AlertCircle" size={28} style={{ color: "hsl(40,80%,45%)" }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Сначала выполните предыдущий шаг</div>
          <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>
            Этот инструмент использует результаты из <strong>«{missing.toolTitle}»</strong>. Сначала запустите его — это займёт меньше минуты.
          </div>
        </div>
        <button
          onClick={onGoTo}
          style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          Перейти к «{missing.toolTitle}»
        </button>
      </div>
    </div>
  );
}