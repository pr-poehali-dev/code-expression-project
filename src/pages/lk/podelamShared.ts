import func2url from "../../../backend/func2url.json";

export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";

export const PODELAM_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
export function sid() { return localStorage.getItem("lk_session") || ""; }

export interface GrowthPoint {
  key: string;
  title: string;
  action: string;
  potential: number;
  count: number;
}

export interface Task {
  key: string;
  title: string;
  action_text: string;
  button: string;
  nav: string;
  minutes: number;
  potential: number;
}

export interface Profile {
  niche: string;
  avg_check: number;
  current_revenue: number;
  target_revenue: number;
  clients_per_month: number;
  base_size: number;
  repeat_rate: number;
  free_slots_per_week: number;
  has_addon_services: boolean;
  addon_services_text?: string;
  lead_source: string;
}

export interface PodelamData {
  has_profile: boolean;
  profile?: Profile;
  growth_points?: GrowthPoint[];
  gap_amount?: number;
  plan?: { tasks: Task[]; main_task_key: string | null; gap_amount: number; tomorrow_preview?: string; source?: string };
  task_log?: Record<string, { done: boolean; actual_amount: number | null }>;
  today_income?: number | null;
}

export interface PeriodStats {
  days: number;
  total_tasks: number;
  done_tasks: number;
  completion_rate: number;
  potential_total: number;
  actual_total: number;
}

export interface StatsData {
  week: PeriodStats;
  month: PeriodStats;
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}