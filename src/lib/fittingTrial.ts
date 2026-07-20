// Общий хелпер для сценария "Попробовать примерку с лендинга → регистрация мастера → мгновенный результат".
// Данные хранятся в localStorage, чтобы пережить переход по ссылке подтверждения email (может открыться в новой вкладке).

const TRIAL_KEY = "lk_fitting_trial";
const PHOTO_KEY = "lk_fitting_photo";
const SCENARIO_KEY = "lk_fitting_scenario";
const WISHES_KEY = "lk_fitting_wishes";

export interface FittingTrialData {
  photo: string | null;
  scenario: string | null;
  wishes: string;
}

export function setFittingTrial(data: { photo: string; scenario: string; wishes?: string }) {
  try {
    localStorage.setItem(TRIAL_KEY, "1");
    localStorage.setItem(PHOTO_KEY, data.photo);
    localStorage.setItem(SCENARIO_KEY, data.scenario);
    localStorage.setItem(WISHES_KEY, data.wishes || "");
  } catch {
    /* ignore */
  }
}

export function isFittingTrial(): boolean {
  try {
    return localStorage.getItem(TRIAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function getFittingTrialData(): FittingTrialData {
  try {
    return {
      photo: localStorage.getItem(PHOTO_KEY),
      scenario: localStorage.getItem(SCENARIO_KEY),
      wishes: localStorage.getItem(WISHES_KEY) || "",
    };
  } catch {
    return { photo: null, scenario: null, wishes: "" };
  }
}

// Очищает только фото/сценарий (после того как форма в кабинете их подхватила) — флаг триала оставляем,
// чтобы раздел "Примерочная" продолжал быть открыт этому пользователю (бесплатная попытка всё равно
// ограничена бэкендом до 1 раза, дальше как у всех — через оплату).
export function clearFittingTrialPhoto() {
  try {
    localStorage.removeItem(PHOTO_KEY);
    localStorage.removeItem(SCENARIO_KEY);
    localStorage.removeItem(WISHES_KEY);
  } catch {
    /* ignore */
  }
}
