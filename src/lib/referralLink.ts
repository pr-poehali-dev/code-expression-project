// Хелпер для реферальной ссылки: код из URL (?ref=CODE) сохраняется в localStorage,
// чтобы пережить переход на страницу входа/регистрации и работать независимо от того,
// на какую страницу сайта попал приглашённый по ссылке.

const REF_KEY = "lk_ref_code";

export function captureRefFromUrl() {
  try {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (code && code.trim()) {
      localStorage.setItem(REF_KEY, code.trim().toUpperCase());
    }
  } catch {
    /* ignore */
  }
}

export function getStoredRefCode(): string {
  try {
    return localStorage.getItem(REF_KEY) || "";
  } catch {
    return "";
  }
}

export function clearStoredRefCode() {
  try {
    localStorage.removeItem(REF_KEY);
  } catch {
    /* ignore */
  }
}
