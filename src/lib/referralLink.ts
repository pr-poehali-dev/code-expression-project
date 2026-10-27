// Хелпер для реферальной ссылки: код из URL (?ref=CODE) сохраняется в localStorage,
// чтобы пережить переход на страницу входа/регистрации и работать независимо от того,
// на какую страницу сайта попал приглашённый по ссылке.

import func2url from "../../backend/func2url.json";

const REF_KEY = "lk_ref_code";
const VISITOR_KEY = "ref_visitor_id";
const SENT_KEY = "ref_visit_sent";

function visitorId(): string {
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) {
    v = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9-]/g, "");
    localStorage.setItem(VISITOR_KEY, v);
  }
  return v;
}

function trackPartnerVisit(code: string) {
  if (!code.startsWith("PT-")) return;
  const url = (func2url as Record<string, string>)["partner-api"];
  if (!url || sessionStorage.getItem(SENT_KEY) === code) return;
  sessionStorage.setItem(SENT_KEY, code);
  fetch(`${url}?action=ref_visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref: code, visitor_id: visitorId() }),
    keepalive: true,
  }).catch(() => undefined);
}

export function captureRefFromUrl() {
  try {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (code && code.trim()) {
      const clean = code.trim().toUpperCase();
      localStorage.setItem(REF_KEY, clean);
      trackPartnerVisit(clean);
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
