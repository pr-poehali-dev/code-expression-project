import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { EnergyComplexityNote } from "./LkMarketingShared";
import { ACCENT, API_URL, fmt, copyToClipboard, Result } from "./budget/shared";
import BudgetForm from "./budget/BudgetForm";
import { DrrAnalysisCard, StrategiesList } from "./budget/BudgetAnalysis";
import { RecommendationCard, KpiAndBreakdown, BudgetLimits } from "./budget/BudgetPlan";

// ── Главный компонент ─────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
}

export default function LkMarketingBudget({ onBack }: Props) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";

  const salonAvgCheck = user?.salon ? 0 : 0; // берём из формы

  const [avgCheck, setAvgCheck] = useState(
    user?.salon ? "" : ""
  );
  const [targetClients, setTargetClients] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({
          avg_check: Number(avgCheck),
          target_clients: Number(targetClients),
          budget: Number(budget),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка расчёта");
      setResult(data);
      setSelectedStrategy(data.recommendation.best_strategy);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const copyPlan = () => {
    if (!result) return;
    const r = result;
    const strat = r.strategies.find(s => s.id === r.recommendation.best_strategy);
    const text = [
      `МЕДИАПЛАН ЯНДЕКС.ДИРЕКТ — ${r.salon_name}`,
      `Бюджет: ${fmt(r.inputs.budget)} ₽/мес | Чек: ${fmt(r.inputs.avg_check)} ₽ | Цель: ${r.inputs.target_clients} клиентов`,
      ``,
      `ДРР: ${r.drr_analysis.current_drr}% (${r.drr_analysis.drr_comment})`,
      ``,
      `Рекомендуемая стратегия: ${strat?.name}`,
      r.recommendation.reason,
      ``,
      `ПЛАН ДЕЙСТВИЙ:`,
      ...r.recommendation.action_plan.map((a, i) => `${i + 1}. ${a}`),
      ``,
      `KPI:`,
      `- Кликов в месяц: ${fmt(r.kpi.monthly_clicks_target)}`,
      `- Лидов в месяц: ${fmt(r.kpi.monthly_leads_target)}`,
      `- Стоимость лида (max): ${fmt(r.kpi.target_cpl)} ₽`,
      `- Стоимость клиента (max): ${fmt(r.kpi.target_cpa)} ₽`,
      `- Окупаемость: ${r.kpi.payback_months} мес.`,
      ``,
      `РАСПРЕДЕЛЕНИЕ БЮДЖЕТА:`,
      ...r.budget_breakdown.breakdown.map(b => `- ${b.item}: ${b.percent}% (${fmt(b.amount)} ₽)`),
      ``,
      `СОВЕТЫ:`,
      ...r.budget_breakdown.tips.map((t, i) => `${i + 1}. ${t}`),
    ].join("\n");
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Медиаплан
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Медиаплан контекстной рекламы
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6, maxWidth: 540 }}>
          Введите три параметра — ИИ рассчитает ДРР, сравнит стратегии рекламы, даст рекомендацию и прогноз по бюджету на основе реальных показателей beauty-ниши.
        </p>
        <EnergyComplexityNote />
      </div>

      {/* Форма ввода */}
      <BudgetForm
        avgCheck={avgCheck}
        setAvgCheck={setAvgCheck}
        targetClients={targetClients}
        setTargetClients={setTargetClients}
        budget={budget}
        setBudget={setBudget}
        loading={loading}
        error={error}
        generate={generate}
      />

      {/* Результаты */}
      {result && (
        <div>
          {/* Шапка результата */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              Медиаплан для <strong style={{ color: "#0F172A" }}>«{result.salon_name}»</strong>
              {" · "}бюджет <strong style={{ color: "#0F172A" }}>{fmt(result.inputs.budget)} ₽/мес</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyPlan} style={{ display: "flex", alignItems: "center", gap: 5, background: copied ? "hsl(145,60%,38%)" : "none", color: copied ? "#fff" : ACCENT, border: `1.5px solid ${copied ? "hsl(145,60%,38%)" : ACCENT}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name={copied ? "Check" : "Copy"} size={13} />
                {copied ? "Скопировано!" : "Скопировать план"}
              </button>
              <button onClick={() => { setResult(null); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#94A3B8", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="RefreshCw" size={13} />
                Пересчитать
              </button>
            </div>
          </div>

          {/* ДРР-анализ */}
          <DrrAnalysisCard result={result} />

          {/* Стратегии */}
          <StrategiesList result={result} selectedStrategy={selectedStrategy} setSelectedStrategy={setSelectedStrategy} />

          {/* Рекомендация */}
          <RecommendationCard result={result} />

          {/* KPI + Распределение бюджета */}
          <KpiAndBreakdown result={result} />

          {/* Минимальный и оптимальный бюджет */}
          <BudgetLimits result={result} />
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
