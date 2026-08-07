// Хелпер для сценария "Заполнили диагностику на главной → регистрация → результат в кабинете уже готов".
// Данные хранятся в localStorage, чтобы пережить переход по ссылке подтверждения email.

const TRIAL_KEY = "lk_podelam_trial";
const DATA_KEY = "lk_podelam_trial_data";

export interface PodelamTrialProfile {
  niche: string;
  avg_check: number;
  current_revenue: number;
  target_revenue: number;
  clients_per_month: number;
  base_size: number;
  repeat_rate: number;
  free_slots_per_week: number;
  has_addon_services: boolean;
  lead_source: string;
}

export function setPodelamTrial(data: PodelamTrialProfile) {
  try {
    localStorage.setItem(TRIAL_KEY, "1");
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function isPodelamTrial(): boolean {
  try {
    return localStorage.getItem(TRIAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function getPodelamTrialData(): PodelamTrialProfile | null {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as PodelamTrialProfile) : null;
  } catch {
    return null;
  }
}

export function clearPodelamTrial() {
  try {
    localStorage.removeItem(TRIAL_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    /* ignore */
  }
}
