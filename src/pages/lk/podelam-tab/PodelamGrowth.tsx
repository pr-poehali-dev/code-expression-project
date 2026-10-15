import Icon from "@/components/ui/icon";
import { ACCENT, fmt, GrowthPoint } from "../podelamShared";

export function PodelamGrowthPoints({ growth_points }: { growth_points: GrowthPoint[] }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Где лежат деньги</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {growth_points.map(p => (
          <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid #F1F5F9" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>{p.action}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "hsl(145,60%,35%)", whiteSpace: "nowrap" }}>+{fmt(p.potential)} ₽</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#B0B8C1", marginTop: 12, lineHeight: 1.5 }}>
        Расчёт ориентировочный и основан на ваших данных. Реальный результат зависит от спроса, цены, качества услуг и выполнения действий.
      </div>
    </div>
  );
}

export function PodelamTomorrowPreview({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "hsl(185,85%,96%)", borderRadius: 14, padding: "16px 20px", marginTop: 20 }}>
      <Icon name="Sunrise" size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Завтра новые шаги</div>
        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}
