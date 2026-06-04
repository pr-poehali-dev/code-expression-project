import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const ACCENT = "hsl(185,85%,32%)";
const API_URL = "https://functions.poehali.dev/b11b2ac2-de43-4758-b3c1-f512fe449a65";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.left = "-9999px";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
}

// ── Типы ──────────────────────────────────────────────────────────────────────
interface DrrAnalysis {
  current_drr: number;
  recommended_drr_min: number;
  recommended_drr_max: number;
  drr_status: "ok" | "high" | "low";
  drr_comment: string;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  recommended_for: string;
  forecast: Record<string, number | boolean>;
}

interface Recommendation {
  best_strategy: string;
  reason: string;
  action_plan: string[];
}

interface BudgetBreakdown {
  minimum_recommended: number;
  optimal: number;
  breakdown: { item: string; percent: number; amount: number }[];
  tips: string[];
}

interface Kpi {
  monthly_clicks_target: number;
  monthly_leads_target: number;
  monthly_clients_target: number;
  target_cpl: number;
  target_cpa: number;
  payback_months: number;
}

interface Result {
  drr_analysis: DrrAnalysis;
  strategies: Strategy[];
  recommendation: Recommendation;
  budget_breakdown: BudgetBreakdown;
  kpi: Kpi;
  salon_name: string;
  inputs: { avg_check: number; target_clients: number; budget: number };
}

// ── Компоненты ────────────────────────────────────────────────────────────────

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

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? "hsl(185,85%,96%)" : "#F8FAFC", borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: accent ? ACCENT : "#0F172A" }}>{value}</div>
    </div>
  );
}

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

  const inputStyle = (val: string): React.CSSProperties => ({
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${val ? ACCENT : "#E8ECF0"}`,
    fontSize: 14, outline: "none", fontFamily: "Montserrat,sans-serif",
    color: "#0F172A", background: "#fff", boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  });

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Медиаплан · 1 ⚡
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Медиаплан для Яндекс.Директ
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6, maxWidth: 540 }}>
          Введите три параметра — ИИ рассчитает ДРР, сравнит стратегии рекламы, даст рекомендацию и прогноз по бюджету на основе реальных показателей beauty-ниши.
        </p>
      </div>

      {/* Форма ввода */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8ECF0", padding: "24px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Settings2" size={15} style={{ color: ACCENT }} />
          Параметры медиаплана
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Средний чек клиента, ₽
            </label>
            <input
              type="number" min="500" max="100000"
              value={avgCheck}
              onChange={e => setAvgCheck(e.target.value)}
              placeholder="Например: 3500"
              style={inputStyle(avgCheck)}
            />
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Средняя сумма одного визита</div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Цель: новых клиентов/мес
            </label>
            <input
              type="number" min="1" max="500"
              value={targetClients}
              onChange={e => setTargetClients(e.target.value)}
              placeholder="Например: 20"
              style={inputStyle(targetClients)}
            />
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Сколько хотите привлекать в месяц</div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Бюджет на рекламу, ₽/мес
            </label>
            <input
              type="number" min="5000" max="5000000"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              placeholder="Например: 30000"
              style={inputStyle(budget)}
            />
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Планируемые расходы на Директ</div>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="AlertCircle" size={14} />
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading || !avgCheck || !targetClients || !budget}
          style={{ display: "flex", alignItems: "center", gap: 8, background: loading || !avgCheck || !targetClients || !budget ? "#E8ECF0" : ACCENT, color: loading || !avgCheck || !targetClients || !budget ? "#94A3B8" : "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: loading || !avgCheck || !targetClients || !budget ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", transition: "background 0.15s" }}
        >
          {loading
            ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} /> Считаю медиаплан...</>
            : <><Icon name="Calculator" size={16} /> Рассчитать медиаплан — 1 ⚡</>
          }
        </button>
      </div>

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

          {/* Стратегии */}
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

          {/* Рекомендация */}
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

          {/* KPI + Распределение бюджета */}
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

          {/* Минимальный и оптимальный бюджет */}
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
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}