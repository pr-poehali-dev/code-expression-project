import Icon from "@/components/ui/icon";
import { ACCENT, fmt, Result } from "./shared";

export function RecommendationCard({ result }: { result: Result }) {
  return (
    <div style={{ background: "linear-gradient(135deg,hsl(185,85%,32%),hsl(185,85%,22%))", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Icon name="Sparkles" size={18} style={{ color: "#fff" }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
          Рекомендация: {result.strategies.find(s => s.id === result.recommendation.best_strategy)?.name}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 14 }}>
        {result.recommendation.reason}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {result.recommendation.action_plan.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#fff" }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, paddingTop: 2 }}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KpiAndBreakdown({ result }: { result: Result }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, marginBottom: 16 }}>
      {/* KPI */}
      <div style={{ background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Target" size={15} style={{ color: ACCENT }} />
          Целевые KPI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Кликов в месяц", value: fmt(result.kpi.monthly_clicks_target) },
            { label: "Лидов в месяц", value: fmt(result.kpi.monthly_leads_target) },
            { label: "Клиентов в месяц", value: String(result.kpi.monthly_clients_target), accent: true },
            { label: "Макс. стоимость лида", value: `${fmt(result.kpi.target_cpl)} ₽` },
            { label: "Макс. стоимость клиента", value: `${fmt(result.kpi.target_cpa)} ₽` },
            { label: "Окупаемость", value: `${result.kpi.payback_months} мес.` },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.accent ? ACCENT : "#0F172A" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Распределение бюджета */}
      <div style={{ background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 16, padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="PieChart" size={15} style={{ color: ACCENT }} />
          Распределение бюджета
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {result.budget_breakdown.breakdown.map((b, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{b.item}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{fmt(b.amount)} ₽ · {b.percent}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${b.percent}%`, background: ACCENT, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px", background: "hsl(185,85%,96%)", borderRadius: 10, border: "1px solid hsl(185,85%,85%)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>СОВЕТЫ ПО БЮДЖЕТУ</div>
          {result.budget_breakdown.tips.map((tip, i) => (
            <div key={i} style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: i < result.budget_breakdown.tips.length - 1 ? 5 : 0 }}>
              · {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BudgetLimits({ result }: { result: Result }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
      <div style={{ background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 11, color: "hsl(40,70%,38%)", fontWeight: 700, marginBottom: 4 }}>МИНИМАЛЬНЫЙ БЮДЖЕТ</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{fmt(result.budget_breakdown.minimum_recommended)} ₽</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>для старта без слива</div>
      </div>
      <div style={{ background: "hsl(185,85%,96%)", border: "1px solid hsl(185,85%,82%)", borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, marginBottom: 4 }}>ОПТИМАЛЬНЫЙ БЮДЖЕТ</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{fmt(result.budget_breakdown.optimal)} ₽</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>для достижения цели</div>
      </div>
    </div>
  );
}
