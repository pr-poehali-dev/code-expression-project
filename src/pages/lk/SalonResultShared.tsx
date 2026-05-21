import { SALON_ACCENT, SALON_ACCENT_LIGHT, SALON_ACCENT_DARK } from "./salon.types";
import { SalonWeakZone } from "./salon.logic";

export const G  = SALON_ACCENT;
export const GL = SALON_ACCENT_LIGHT;
export const GD = SALON_ACCENT_DARK;

// ─── IndexBar ────────────────────────────────────────────────────────────────

export function IndexBar({ label, value, prev }: { label: string; value: number; prev?: number }) {
  const color = value >= 70 ? "#22c55e" : value >= 45 ? "#eab308" : "#ef4444";
  const delta = prev !== undefined ? value - prev : null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {delta !== null && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
              background: delta > 0 ? "#22c55e18" : delta < 0 ? "#ef444418" : "#f0f0ec",
              color: delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#aaa",
            }}>
              {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "—"}
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
        </div>
      </div>
      <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, position: "relative" }}>
        {prev !== undefined && (
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: `${prev}%`, height: "100%",
            background: "#d1d5db", borderRadius: 3,
          }} />
        )}
        <div style={{
          position: "absolute", left: 0, top: 0,
          width: `${value}%`, height: "100%",
          background: color, borderRadius: 3, transition: "width 0.8s ease",
        }} />
      </div>
      {prev !== undefined && (
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>
          Было: {prev}%
        </div>
      )}
    </div>
  );
}

// ─── WeakZoneCard ─────────────────────────────────────────────────────────────

export function WeakZoneCard({ zone }: { zone: SalonWeakZone }) {
  const impactColor = zone.impact === "high" ? "#ef4444" : zone.impact === "medium" ? "#f97316" : "#eab308";
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", borderLeft: `3px solid ${impactColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{zone.label}</div>
          <div style={{ fontSize: 11, color: impactColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {zone.impact === "high" ? "Критично" : zone.impact === "medium" ? "Важно" : "Требует внимания"}
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: impactColor, marginLeft: 12 }}>{zone.value}%</div>
      </div>
      <div style={{ fontSize: 12, color: "#555", background: "#f9f9f7", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}>
        💡 {zone.tip}
      </div>
    </div>
  );
}
