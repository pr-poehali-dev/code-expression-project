import Icon from "@/components/ui/icon";
import { ACCENT, fmt, Metric, Result, Strategy } from "./shared";

function DrrBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    ok:   { label: "✓ В норме",    color: "hsl(145,60%,35%)", bg: "hsl(145,55%,93%)" },
    high: { label: "↑ Высокий",   color: "hsl(0,70%,45%)",   bg: "hsl(0,80%,95%)"   },
    low:  { label: "↓ Низкий",    color: "hsl(40,70%,38%)",  bg: "hsl(40,90%,93%)"  },
  };
  const s = map[status] || map.ok;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, borderRadius: 6, padding: "3px 9px" }}>
      {s.label}
    </span>
  );
}

function StrategyCard({ strategy, isRecommended, onSelect, selected }: {
  strategy: Strategy;
  isRecommended: boolean;
  onSelect: () => void;
  selected: boolean;
}) {
  const f = strategy.forecast;

  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${selected ? ACCENT : isRecommended ? "hsl(145,60%,70%)" : "#E8ECF0"}`,
        borderRadius: 16, padding: "18px 20px", cursor: "pointer", background: "#fff",
        position: "relative", transition: "all 0.15s",
        boxShadow: selected ? `0 0 0 3px hsla(185,85%,32%,0.12)` : "none",
      }}
    >
      {isRecommended && (
        <div style={{ position: "absolute", top: -1, right: 16, background: "hsl(145,60%,38%)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px", letterSpacing: 0.5 }}>
          РЕКОМЕНДУЕМ
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: selected ? ACCENT : "hsl(185,85%,94%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
          <Icon name={strategy.id === "cpc" ? "MousePointerClick" : strategy.id === "cpa" ? "Target" : "TrendingUp"} size={18} style={{ color: selected ? "#fff" : ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{strategy.name}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, marginBottom: 12 }}>{strategy.description}</div>

      {/* Прогноз */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {strategy.id === "cpc" && <>
          <Metric label="Кликов/мес" value={fmt(f.clicks as number)} />
          <Metric label="Лидов/мес" value={fmt(f.leads as number)} />
          <Metric label="Клиентов/мес" value={fmt(f.clients as number)} accent />
          <Metric label="Стоимость лида" value={`${fmt(f.cpl as number)} ₽`} />
        </>}
        {strategy.id === "cpa" && <>
          <Metric label="Ставка за конверс." value={`${fmt(f.target_cpa as number)} ₽`} />
          <Metric label="Конверсий/мес" value={fmt(f.conversions as number)} />
          <Metric label="Клиентов/мес" value={fmt(f.clients as number)} accent />
          <Metric label="Стоимость лида" value={`${fmt(f.cpl as number)} ₽`} />
        </>}
        {strategy.id === "drr" && <>
          <Metric label="Цель ДРР" value={`${f.drr_target}%`} />
          <Metric label="Нужна выручка" value={`${fmt(f.revenue_needed as number)} ₽`} />
          <Metric label="Клиентов нужно" value={fmt(f.clients_needed as number)} accent />
          <Metric label="Реализуемость" value={(f.viable as boolean) ? "✓ Да" : "✗ Риск"} />
        </>}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {strategy.pros.map((p, i) => (
          <span key={i} style={{ fontSize: 10, color: "hsl(145,60%,35%)", background: "hsl(145,55%,93%)", borderRadius: 5, padding: "2px 7px" }}>+ {p}</span>
        ))}
        {strategy.cons.map((c, i) => (
          <span key={i} style={{ fontSize: 10, color: "hsl(0,60%,40%)", background: "hsl(0,80%,96%)", borderRadius: 5, padding: "2px 7px" }}>− {c}</span>
        ))}
      </div>
    </div>
  );
}

export function DrrAnalysisCard({ result }: { result: Result }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(185,85%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Percent" size={18} style={{ color: ACCENT }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Анализ ДРР</div>
        </div>
        <DrrBadge status={result.drr_analysis.drr_status} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 12 }}>
        <Metric label="Ваш ДРР" value={`${result.drr_analysis.current_drr}%`} accent />
        <Metric label="Норма для beauty" value={`${result.drr_analysis.recommended_drr_min}–${result.drr_analysis.recommended_drr_max}%`} />
        <Metric label="Чек клиента" value={`${fmt(result.inputs.avg_check)} ₽`} />
        <Metric label="Цель клиентов" value={`${result.inputs.target_clients}/мес`} />
      </div>
      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10 }}>
        {result.drr_analysis.drr_comment}
      </div>
    </div>
  );
}

export function StrategiesList({ result, selectedStrategy, setSelectedStrategy }: {
  result: Result;
  selectedStrategy: string | null;
  setSelectedStrategy: (id: string) => void;
}) {
  return (
    <>
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="Layers" size={14} style={{ color: ACCENT }} />
        Выберите стратегию — нажмите на карточку
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, marginBottom: 20 }}>
        {result.strategies.map(s => (
          <StrategyCard
            key={s.id}
            strategy={s}
            isRecommended={s.id === result.recommendation.best_strategy}
            selected={selectedStrategy === s.id}
            onSelect={() => setSelectedStrategy(s.id)}
          />
        ))}
      </div>
    </>
  );
}
