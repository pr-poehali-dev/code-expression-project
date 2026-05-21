import { FinanceData, Expenses, CurrentModel, EnergyData, MoneyMindset, LifeItem, FinanceGoals } from "./finance.types";

// ── Этап 1: Желаемая жизнь ────────────────────────────────────────────────────

/** Желаемый уровень жизни — сумма всех желаний */
export function calcJLJ(items: LifeItem[]): number {
  return items.reduce((s, i) => s + (i.amount || 0), 0);
}

/** Индекс эмоциональной значимости */
export function calcIEZ(items: LifeItem[]): number {
  const total = items.reduce((s, i) => s + (i.amount || 0) * (i.importance || 1), 0);
  const maxPossible = items.reduce((s, i) => s + (i.amount || 0) * 5, 0);
  return maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
}

// ── Этап 2: Финансовые цели ───────────────────────────────────────────────────

/** Индекс финансовой ясности (0–100) */
export function calcIFJ(goals: FinanceGoals): number {
  let score = 0;
  if (goals.desiredIncome > 0) score += 40;
  if (goals.savings > 0) score += 20;
  if (goals.goalDescription.trim().length > 5) score += 20;
  if (goals.goalMonths > 0) score += 20;
  return score;
}

// ── Этап 3: Текущая модель ────────────────────────────────────────────────────

/** Доход в час */
export function calcDH(m: CurrentModel): number {
  const hoursPerMonth = m.hoursPerWeek * 4.3;
  return hoursPerMonth > 0 ? Math.round(m.currentIncome / hoursPerMonth) : 0;
}

/** Коэффициент загрузки (0–1) */
export function calcKZ(m: CurrentModel): number {
  const hoursPerMonth = m.hoursPerWeek * 4.3;
  return Math.min(1, Math.round((hoursPerMonth / 160) * 100) / 100);
}

// ── Этап 4: Расходы ───────────────────────────────────────────────────────────

/** Общие расходы */
export function calcOR(e: Expenses): number {
  return Object.values(e).reduce((s, v) => s + (v || 0), 0);
}

/** Чистая прибыль */
export function calcCP(income: number, e: Expenses): number {
  return income - calcOR(e);
}

/** Индекс финансовой устойчивости (0–100) */
export function calcIFU(income: number, e: Expenses): number {
  const or = calcOR(e);
  if (or === 0) return 100;
  const cp = income - or;
  const ratio = cp / or;
  // ratio: -1 (кризис) → 0 (ноль) → 1+ (устойчивость)
  const normalized = Math.max(0, Math.min(1, (ratio + 0.5) / 1.5));
  return Math.round(normalized * 100);
}

// ── Этап 5: Энергия ───────────────────────────────────────────────────────────

/** Индекс перегрузки (0–100, где 100 = максимальная перегрузка) */
export function calcIPN(en: EnergyData): number {
  const overload = en.tiredness + en.emotionalLoad + en.physicalLoad; // 3-15
  const energy = en.desireToWorkMore; // 1-5
  const raw = (overload / 15) / (energy / 5);
  return Math.min(100, Math.round(raw * 100));
}

// ── Этап 6: Потолок модели ────────────────────────────────────────────────────

/** Максимально возможный доход при текущей модели */
export function calcMPD(m: CurrentModel): number {
  if (m.sessionDurationHours <= 0) return 0;
  const hoursPerMonth = m.hoursPerWeek * 4.3;
  const maxClients = Math.floor(hoursPerMonth / m.sessionDurationHours);
  return maxClients * m.avgCheck;
}

/** Максимальное число клиентов в текущей модели */
export function calcMaxClients(m: CurrentModel): number {
  if (m.sessionDurationHours <= 0) return 0;
  const hoursPerMonth = m.hoursPerWeek * 4.3;
  return Math.floor(hoursPerMonth / m.sessionDurationHours);
}

// ── Этап 7: Финансовый разрыв ─────────────────────────────────────────────────

/** Финансовый разрыв */
export function calcFR(desiredIncome: number, currentIncome: number): number {
  return Math.max(0, desiredIncome - currentIncome);
}

/** Нужный средний чек при текущих клиентах */
export function calcNSC(desiredIncome: number, clients: number): number {
  return clients > 0 ? Math.round(desiredIncome / clients) : 0;
}

/** Нужное число клиентов при текущем чеке */
export function calcNCK(desiredIncome: number, avgCheck: number): number {
  return avgCheck > 0 ? Math.ceil(desiredIncome / avgCheck) : 0;
}

/** Нужный доход в час для достижения цели (при текущих часах) */
export function calcNDH(desiredIncome: number, m: CurrentModel): number {
  const hoursPerMonth = m.hoursPerWeek * 4.3;
  return hoursPerMonth > 0 ? Math.round(desiredIncome / hoursPerMonth) : 0;
}

// ── Этап 8: Денежное мышление ─────────────────────────────────────────────────

/** Индекс дефицитного мышления (0–100) */
export function calcIDM(mind: MoneyMindset): number {
  const count = Object.values(mind).filter(Boolean).length;
  return Math.round((count / 5) * 100);
}

// ── Главные индексы ───────────────────────────────────────────────────────────

/** Индекс финансового потенциала (0–100+) */
export function calcIFP(desiredIncome: number, mpd: number): number {
  if (mpd <= 0) return 0;
  return Math.min(100, Math.round((desiredIncome / mpd) * 100));
}

/** Индекс финансовой реализации — главный (0–100) */
export function calcIFR(
  ifj: number,
  ifu: number,
  ifp: number,
  ipn: number,
  idm: number,
): number {
  const raw = (ifj + ifu + ifp - (ipn * 0.5) - (idm * 0.5)) / 3;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ── Сводный расчёт по всем данным ────────────────────────────────────────────

export interface FinanceResult {
  jlj: number;          // желаемый уровень жизни
  iez: number;          // эмоц. значимость %
  ifj: number;          // финансовая ясность %
  dh: number;           // доход в час
  kz: number;           // коэф. загрузки
  or: number;           // общие расходы
  cp: number;           // чистая прибыль
  ifu: number;          // устойчивость %
  ipn: number;          // перегрузка %
  mpd: number;          // потолок модели
  maxClients: number;   // макс. клиентов
  fr: number;           // финансовый разрыв
  nsc: number;          // нужный чек
  nck: number;          // нужных клиентов
  ndh: number;          // нужный доход/час
  idm: number;          // дефицитное мышление %
  ifp: number;          // потенциал %
  ifr: number;          // главный индекс %
  ceilingReached: boolean; // потолок достигнут?
}

export function calcAll(data: FinanceData): FinanceResult {
  const jlj = calcJLJ(data.lifeItems);
  const iez = calcIEZ(data.lifeItems);
  const ifj = calcIFJ(data.goals);
  const dh = calcDH(data.currentModel);
  const kz = calcKZ(data.currentModel);
  const or = calcOR(data.expenses);
  const cp = calcCP(data.currentModel.currentIncome, data.expenses);
  const ifu = calcIFU(data.currentModel.currentIncome, data.expenses);
  const ipn = calcIPN(data.energy);
  const mpd = calcMPD(data.currentModel);
  const maxClients = calcMaxClients(data.currentModel);
  const fr = calcFR(data.goals.desiredIncome, data.currentModel.currentIncome);
  const nsc = calcNSC(data.goals.desiredIncome, data.currentModel.clientsPerMonth);
  const nck = calcNCK(data.goals.desiredIncome, data.currentModel.avgCheck);
  const ndh = calcNDH(data.goals.desiredIncome, data.currentModel);
  const idm = calcIDM(data.mindset);
  const ifp = calcIFP(data.goals.desiredIncome, mpd);
  const ifr = calcIFR(ifj, ifu, ifp, ipn, idm);
  const ceilingReached = mpd > 0 && data.goals.desiredIncome > mpd;

  return { jlj, iez, ifj, dh, kz, or, cp, ifu, ipn, mpd, maxClients, fr, nsc, nck, ndh, idm, ifp, ifr, ceilingReached };
}

export function getIFRLabel(ifr: number): { label: string; color: string } {
  if (ifr < 30) return { label: "Финансовый хаос",     color: "#ef4444" };
  if (ifr < 50) return { label: "Выживание",           color: "#f97316" };
  if (ifr < 70) return { label: "Стабильность",        color: "#eab308" };
  if (ifr < 85) return { label: "Финансовая зрелость", color: "#22c55e" };
  return             { label: "Системная реализация",  color: "#14b8a6" };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}
