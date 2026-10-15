export const ACCENT = "hsl(185,85%,32%)";
export const API_URL = "https://functions.poehali.dev/b11b2ac2-de43-4758-b3c1-f512fe449a65";

export function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

export function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.left = "-9999px";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
}

// ── Типы ──────────────────────────────────────────────────────────────────────
export interface DrrAnalysis {
  current_drr: number;
  recommended_drr_min: number;
  recommended_drr_max: number;
  drr_status: "ok" | "high" | "low";
  drr_comment: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  recommended_for: string;
  forecast: Record<string, number | boolean>;
}

export interface Recommendation {
  best_strategy: string;
  reason: string;
  action_plan: string[];
}

export interface BudgetBreakdown {
  minimum_recommended: number;
  optimal: number;
  breakdown: { item: string; percent: number; amount: number }[];
  tips: string[];
}

export interface Kpi {
  monthly_clicks_target: number;
  monthly_leads_target: number;
  monthly_clients_target: number;
  target_cpl: number;
  target_cpa: number;
  payback_months: number;
}

export interface Result {
  drr_analysis: DrrAnalysis;
  strategies: Strategy[];
  recommendation: Recommendation;
  budget_breakdown: BudgetBreakdown;
  kpi: Kpi;
  salon_name: string;
  inputs: { avg_check: number; target_clients: number; budget: number };
}

export function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? "hsl(185,85%,96%)" : "#F8FAFC", borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: accent ? ACCENT : "#0F172A" }}>{value}</div>
    </div>
  );
}
