import func2url from "../../../backend/func2url.json";

export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";

export const PODELAM_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
// Быстрые операции (сохранить диагностику, отметить дело, статистика, доход за день) — отдельная
// функция с низким таймаутом, чтобы не тарифицироваться по цене долгих ИИ-действий из masters-accrual.
export const PODELAM_FAST_URL = (func2url as Record<string, string>)["podelam-fast"] || "";
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
  topic_options?: string[];
  why?: string;
}

// Разделы-генераторы контента, куда можно передать готовую тему через sessionStorage —
// компонент открывается на нужной вкладке и сразу подставляет тему в поле ввода.
export const TOPIC_KEY_BY_NAV: Record<string, string> = {
  "marketing:post-gen": "lk_postgen_topic_pending",
  "marketing:reel-script": "lk_reelscript_topic_pending",
};

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

export interface SalonFocusStaff {
  name: string;
  role: string;
  clients_per_month?: number | null;
  revenue?: number | null;
  avg_check?: number | null;
  return_pct?: number | null;
}

export interface PodelamData {
  has_profile: boolean;
  profile?: Profile;
  growth_points?: GrowthPoint[];
  gap_amount?: number;
  plan?: { tasks: Task[]; main_task_key: string | null; gap_amount: number; tomorrow_preview?: string; source?: string; salon_focus?: SalonFocusStaff | null } | null;
  task_log?: Record<string, { done: boolean; actual_amount: number | null }>;
  today_income?: number | null;
  today_new_clients?: number | null;
  today_returned_clients?: number | null;
  salon_profile_filled?: boolean | null;
  energy_insufficient?: boolean;
  energy_balance?: number;
  energy_needed?: number;
}

export interface PeriodStats {
  days: number;
  total_tasks: number;
  done_tasks: number;
  completion_rate: number;
  potential_total: number;
  actual_total: number;
  new_clients_total?: number;
  returned_clients_total?: number;
}

export interface StatsData {
  week: PeriodStats;
  month: PeriodStats;
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}