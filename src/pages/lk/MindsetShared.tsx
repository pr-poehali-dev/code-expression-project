import Icon from "@/components/ui/icon";

export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_LIGHT = "hsl(185,85%,96%)";

// ─── BotShell ─────────────────────────────────────────────────────────────────

interface BotShellProps {
  onBack: () => void;
  progress: number;
  step: number;
  total: number;
  children: React.ReactNode;
}

export function BotShell({ onBack, progress, step, total, children }: BotShellProps) {
  return (
    <div style={{ minHeight: "100%", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#888",
          fontSize: 13, cursor: "pointer", padding: "0 0 16px",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> К инструментам
        </button>

        {step > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>
                {step >= total ? "Завершено" : `Вопрос ${step} из ${total}`}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: `linear-gradient(90deg, ${ACCENT}, hsl(185,85%,22%))`,
                borderRadius: 2, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── MiniIndexBar ─────────────────────────────────────────────────────────────

interface MiniIndexBarProps {
  label: string;
  value: number;
  color: string;
}

export function MiniIndexBar({ label, value, color }: MiniIndexBarProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "#f0f0ec", borderRadius: 2 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}
