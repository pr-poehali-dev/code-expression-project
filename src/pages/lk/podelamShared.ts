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
  conversion_rate?: number | null;
  about_me?: string;
  personal_goals?: string[];
  personal_goals_other?: string;
}

// ── Личные цели развития (не про деньги — про рост человека как специалиста) ──
// Используются для более точных рекомендаций курсов/тренингов/мероприятий Академии,
// а не только шагов из финансового разрыва.
export const PERSONAL_GOAL_OPTIONS: { code: string; label: string }[] = [
  { code: "new_skill",        label: "Освоить новый метод/технику" },
  { code: "certification",    label: "Получить сертификацию/диплом" },
  { code: "confidence",       label: "Увереннее вести приём/консультацию" },
  { code: "personal_brand",   label: "Развить личный бренд, стать заметнее" },
  { code: "public_speaking",  label: "Научиться выступать, вести эфиры/лекции" },
  { code: "team_growth",      label: "Вырасти в руководителя / открыть команду" },
  { code: "burnout",          label: "Справиться с выгоранием, восстановить силы" },
  { code: "networking",       label: "Найти единомышленников, сообщество" },
  { code: "work_life_balance",label: "Меньше работать, но не терять в доходе" },
  { code: "other",            label: "Другое" },
];

// ── Терминология ПоДелам по специализации ──────────────────────────────────
// Психолог/телесный психолог работают с "обращениями" и "консультациями", а не с
// "клиентами" и "визитами" — тексты формы диагностики и виджетов подстраиваются под это,
// не меняя саму механику (одни и те же поля БД, просто разные подписи и формулировки.
export type PodelamSpecialization = "psychologist" | "body_psychologist" | null | undefined;

export function isPsychSpecialization(s: PodelamSpecialization): boolean {
  return s === "psychologist" || s === "body_psychologist";
}

export interface PodelamTerms {
  nicheLabel: string;
  nichePlaceholder: string;
  clientsPerMonthLabel: string;
  clientsPerMonthPlaceholder: string;
  baseSizeLabel: string;
  baseSizePlaceholder: string;
  repeatRateLabel: string;
  repeatRatePlaceholder: string;
  freeSlotsLabel: string;
  freeSlotsPlaceholder: string;
  newClientsLabel: string;
  returnedClientsLabel: string;
  hasConversion: boolean;
  conversionLabel: string;
  conversionPlaceholder: string;
  baseWordGen: string;
  aboutMeLabel: string;
  aboutMePlaceholder: string;
}

export function getPodelamTerms(specialization?: PodelamSpecialization): PodelamTerms {
  if (isPsychSpecialization(specialization)) {
    return {
      nicheLabel: "Специализация",
      nichePlaceholder: "Например: семейный психолог, работа с тревожностью",
      clientsPerMonthLabel: "Обращений в месяц",
      clientsPerMonthPlaceholder: "20",
      baseSizeLabel: "Размер базы клиентов",
      baseSizePlaceholder: "60",
      repeatRateLabel: "% повторных консультаций",
      repeatRatePlaceholder: "35",
      freeSlotsLabel: "Свободных часов в неделю",
      freeSlotsPlaceholder: "5",
      newClientsLabel: "Новых обращений",
      returnedClientsLabel: "Повторных консультаций",
      hasConversion: true,
      conversionLabel: "% обращений, доходящих до первой консультации",
      conversionPlaceholder: "60",
      baseWordGen: "обращений",
      aboutMeLabel: "Образование и опыт",
      aboutMePlaceholder: "Например: психфак СПбГУ 2018, 5 лет практики, доп. образование по КПТ, прошла супервизию у...",
    };
  }
  return {
    nicheLabel: "Ниша / услуга",
    nichePlaceholder: "Например: массаж, маникюр, стрижки",
    clientsPerMonthLabel: "Клиентов в месяц",
    clientsPerMonthPlaceholder: "44",
    baseSizeLabel: "Размер базы клиентов",
    baseSizePlaceholder: "120",
    repeatRateLabel: "% повторных визитов",
    repeatRatePlaceholder: "35",
    freeSlotsLabel: "Свободных окон в неделю",
    freeSlotsPlaceholder: "7",
    newClientsLabel: "Новых клиентов",
    returnedClientsLabel: "Вернулось клиентов",
    hasConversion: false,
    conversionLabel: "",
    conversionPlaceholder: "",
    baseWordGen: "клиентов",
    aboutMeLabel: "Образование и опыт",
    aboutMePlaceholder: "Например: колледж по специальности, 6 лет опыта, курсы повышения квалификации по колористике...",
  };
}

export interface SalonFocusStaff {
  name: string;
  role: string;
  clients_per_month?: number | null;
  revenue?: number | null;
  avg_check?: number | null;
  return_pct?: number | null;
}

export interface GoalProgress {
  goal: string;
  days_addressed: number;
  period_days: number;
  last_addressed_date: string | null;
}

export interface PodelamData {
  has_profile: boolean;
  profile?: Profile;
  growth_points?: GrowthPoint[];
  gap_amount?: number;
  plan?: { tasks: Task[]; main_task_key: string | null; gap_amount: number; tomorrow_preview?: string; source?: string; salon_focus?: SalonFocusStaff | null; addressed_goals?: string[] } | null;
  task_log?: Record<string, { done: boolean; actual_amount: number | null }>;
  today_income?: number | null;
  today_new_clients?: number | null;
  today_returned_clients?: number | null;
  salon_profile_filled?: boolean | null;
  salon_goals?: string[] | null;
  goals_progress?: GoalProgress[] | null;
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

// ── Карта привлечения клиентов (расширение «Пульса бизнеса» в платном пакете) ──────────────
export interface AudienceSegment {
  name: string;
  role_type: "primary" | "secondary" | "potential";
  who: string;
  problem: string;
  desired_result: string;
  why_chooses: string;
  objections: string;
  where_looks: string;
  content_interest: string;
  offer: string;
  data_basis: "data" | "inference";
}

export interface TrafficChannel {
  source_name: string;
  why_fits: string;
  what_to_post: string;
  expected_result: string;
  priority: "high" | "medium" | "low";
}

export interface AudienceMap {
  segments: AudienceSegment[];
  traffic_channels: TrafficChannel[];
  own_resources_note: string | null;
  top3_channels_today: string[];
  what_not_to_do: string | null;
}

export interface PodelamAnalysis {
  pulse_score: number;
  pulse_trend: "up" | "down" | "flat";
  summary: string;
  main_problem: string | null;
  main_opportunity: string | null;
  losses_estimate: string | null;
  forecast: string | null;
  forecast_confidence: "высокий" | "средний" | "низкий" | null;
  main_action: string;
  extra_actions: string[];
  audience_map?: AudienceMap | null;
}

export interface PodelamAnalyticsResponse {
  has_package: boolean;
  has_profile?: boolean;
  pulse_score?: number;
  analysis?: PodelamAnalysis;
  computed_at?: string;
  cached?: boolean;
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}