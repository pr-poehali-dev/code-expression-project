// Отслеживание: открывал ли пользователь план «ПоДелам» сегодня.
// Используется для точки-индикатора в меню и баннера-напоминания при входе.

const KEY = "podelam_last_seen_date";
export const PODELAM_SEEN_EVENT = "podelam-seen";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPodelamSeenToday(): boolean {
  return localStorage.getItem(KEY) === todayStr();
}

export function markPodelamSeen(): void {
  localStorage.setItem(KEY, todayStr());
  window.dispatchEvent(new Event(PODELAM_SEEN_EVENT));
}