import {
  SalonIndexKey, SalonScores, SalonAnswers, SalonNumericAnswers,
  SalonQuestion, SALON_MAX, SALON_TYPES, SalonType,
} from "./salon.types";

// ─── Подсчёт сырых баллов ────────────────────────────────────────────────────

export function calcSalonRawScores(
  questions: SalonQuestion[],
  answers: SalonAnswers
): SalonScores {
  const raw: SalonScores = {
    IVK: 0, IPP: 0, ISC: 0, IZ: 0,
    IEA: 0, IPU: 0, ILK: 0, IPS: 0,
  };
  questions.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const opt = q.options[optIdx];
    if (!opt) return;
    (Object.keys(opt.scores) as SalonIndexKey[]).forEach(key => {
      raw[key] = (raw[key] || 0) + (opt.scores[key] || 0);
      // Собираем числовые подсказки
    });
  });
  return raw;
}

// ─── Нормализация 0–100% ──────────────────────────────────────────────────────

export function normalizeSalonScores(raw: SalonScores): SalonScores {
  const result = {} as SalonScores;
  (Object.keys(raw) as SalonIndexKey[]).forEach(key => {
    const max = SALON_MAX[key];
    result[key] = max > 0 ? Math.round((raw[key] / max) * 100) : 0;
  });
  return result;
}

// ─── Индекс потери прибыли (инвертированный) ─────────────────────────────────
// IPP_loss = насколько ПЛОХО: 100 - ((IVK + ISC + IPU) / 3)

export function calcIPPLoss(n: SalonScores): number {
  return Math.max(0, Math.round(100 - ((n.IVK + n.ISC + n.IPU) / 3)));
}

// ─── Главный индекс IPS ───────────────────────────────────────────────────────

export function calcIPS(n: SalonScores): number {
  const ipp = calcIPPLoss(n);
  const raw = (n.IVK + n.ISC + n.IEA + n.ILK + n.IZ + n.IPU - ipp) / 6;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ─── Уровень салона ───────────────────────────────────────────────────────────

export function getSalonLevel(ips: number): { label: string; color: string } {
  if (ips < 30) return { label: "Салон теряет прибыль",        color: "#ef4444" };
  if (ips < 50) return { label: "Нестабильная система",         color: "#f97316" };
  if (ips < 70) return { label: "Рабочая модель",               color: "#eab308" };
  if (ips < 85) return { label: "Системный салон",              color: "#22c55e" };
  return         { label: "Высокоприбыльная модель",           color: "#14b8a6" };
}

// ─── Определение типа ────────────────────────────────────────────────────────

export function getSalonType(n: SalonScores, ips: number): SalonType {
  if (n.IVK <= 30)                          return SALON_TYPES[0]; // Утечка клиентов
  if (n.ISC <= 30 && n.IPU <= 40)           return SALON_TYPES[1]; // Низкий чек
  if (n.IEA <= 40 && n.IPU <= 40)           return SALON_TYPES[2]; // Слабые продажи
  if (n.IZ <= 40 || n.IPS <= 40)            return SALON_TYPES[3]; // Хаос
  if (ips >= 50)                             return SALON_TYPES[4]; // Потенциал ×2
  // fallback
  const scores = [
    { idx: n.IVK, type: SALON_TYPES[0] },
    { idx: n.ISC, type: SALON_TYPES[1] },
    { idx: n.IEA, type: SALON_TYPES[2] },
  ];
  scores.sort((a, b) => a.idx - b.idx);
  return scores[0].type;
}

// ─── Получение числовых данных из ответов ─────────────────────────────────────

export function extractNumericHints(
  questions: SalonQuestion[],
  answers: SalonAnswers
): Partial<Record<string, number>> {
  const hints: Partial<Record<string, number>> = {};
  questions.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const opt = q.options[optIdx];
    if (!opt?.numericHint) return;
    Object.assign(hints, opt.numericHint);
  });
  return hints;
}

// ─── Расчёт скрытых денег ─────────────────────────────────────────────────────

export interface HiddenMoney {
  currentMonthlyRevenue: number;
  lossFromNonReturn: number;
  potentialFromUpsell: number;
  potentialFromReturnImprovement: number;
  totalPotential: number;
  currentReturnRate: number;
  targetReturnRate: number;
  currentUpsellRate: number;
  targetUpsellRate: number;
}

export function calcHiddenMoney(
  questions: SalonQuestion[],
  answers: SalonAnswers,
  numericAnswers: SalonNumericAnswers
): HiddenMoney {
  const hints = extractNumericHints(questions, answers);

  const monthlyClients   = numericAnswers.monthlyClients  ?? (hints.monthlyClients as number ?? 35);
  const avgCheck         = numericAnswers.avgCheck         ?? 3500;
  const currentReturnRatePct = numericAnswers.returnRate ?? (hints.returnRate as number ?? 30);
  const currentUpsellRatePct = numericAnswers.upsellRate  ?? (hints.upsellRate  as number ?? 10);

  const currentReturnRate = currentReturnRatePct / 100;
  const currentUpsellRate = currentUpsellRatePct / 100;

  // Текущая выручка от базового потока
  const currentMonthlyRevenue = monthlyClients * avgCheck;

  // Потери от невозврата
  const targetReturnRate = Math.min(0.60, currentReturnRate + 0.25);
  const returnableLost   = monthlyClients * (targetReturnRate - currentReturnRate);
  const lossFromNonReturn = Math.round(returnableLost * avgCheck);

  // Потенциал от допродаж
  const targetUpsellRate  = Math.min(0.40, currentUpsellRate + 0.18);
  const upsellGain        = monthlyClients * avgCheck * (targetUpsellRate - currentUpsellRate) * 0.35;
  const potentialFromUpsell = Math.round(Math.max(0, upsellGain));

  // Потенциал от увеличения возврата
  const potentialFromReturnImprovement = lossFromNonReturn;

  const totalPotential = lossFromNonReturn + potentialFromUpsell;

  return {
    currentMonthlyRevenue,
    lossFromNonReturn,
    potentialFromUpsell,
    potentialFromReturnImprovement,
    totalPotential,
    currentReturnRate: currentReturnRatePct,
    targetReturnRate: Math.round(targetReturnRate * 100),
    currentUpsellRate: currentUpsellRatePct,
    targetUpsellRate: Math.round(targetUpsellRate * 100),
  };
}

// ─── Слабые зоны ─────────────────────────────────────────────────────────────

export interface SalonWeakZone {
  index: SalonIndexKey;
  label: string;
  value: number;
  tip: string;
  impact: "high" | "medium" | "low";
}

const ZONE_META: Record<SalonIndexKey, { label: string; tip: string }> = {
  IVK: { label: "Возврат клиентов",           tip: "Запустите автоматические напоминания через 3–4 недели после визита" },
  IPP: { label: "Осведомлённость о потерях",  tip: "Начните считать потери от невозврата — это первый шаг к их устранению" },
  ISC: { label: "Средний чек",                tip: "Внедрите протоколы допродаж: мастер предлагает следующую услугу в конце визита" },
  IZ:  { label: "Загрузка и поток",           tip: "Стабилизируйте поток через работу с базой — это дешевле новой рекламы" },
  IEA: { label: "Эффективность администраторов", tip: "Создайте скрипты для администраторов: приветствие, допродажа, запись на следующий визит" },
  IPU: { label: "Продажи услуг",              tip: "Обучите мастеров технике мягкой допродажи — 1 фраза увеличивает чек на 15–20%" },
  ILK: { label: "Лояльность клиентов",        tip: "Запустите программу лояльности: накопительные бонусы или клубные условия" },
  IPS: { label: "Финансовый контроль",        tip: "Начните ежемесячно считать: выручка, расходы, чистая прибыль, средний чек" },
};

export function getSalonWeakZones(n: SalonScores): SalonWeakZone[] {
  const zones: SalonWeakZone[] = [];
  (Object.keys(n) as SalonIndexKey[]).forEach(key => {
    if (key === "IPP") return; // IPP — осведомлённость, отдельная логика
    if (n[key] <= 40) {
      const meta = ZONE_META[key];
      zones.push({
        index: key,
        label: meta.label,
        value: n[key],
        tip: meta.tip,
        impact: n[key] <= 20 ? "high" : n[key] <= 35 ? "medium" : "low",
      });
    }
  });
  return zones.sort((a, b) => a.value - b.value).slice(0, 4);
}

// ─── Radar chart ──────────────────────────────────────────────────────────────

export interface SalonRadarPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export function getSalonRadarData(n: SalonScores): SalonRadarPoint[] {
  return [
    { subject: "Возврат",     value: n.IVK, fullMark: 100 },
    { subject: "Чек",         value: n.ISC, fullMark: 100 },
    { subject: "Продажи",     value: n.IPU, fullMark: 100 },
    { subject: "Загрузка",    value: n.IZ,  fullMark: 100 },
    { subject: "Лояльность",  value: n.ILK, fullMark: 100 },
    { subject: "Прибыльность",value: n.IPS, fullMark: 100 },
  ];
}

// ─── Полный расчёт ────────────────────────────────────────────────────────────

export interface SalonCalcResult {
  raw: SalonScores;
  norm: SalonScores;
  ippLoss: number;
  ips: number;
  level: { label: string; color: string };
  type: SalonType;
  weakZones: SalonWeakZone[];
  radarData: SalonRadarPoint[];
  hiddenMoney: HiddenMoney;
}

export function calcSalon(
  questions: SalonQuestion[],
  answers: SalonAnswers,
  numericAnswers: SalonNumericAnswers
): SalonCalcResult {
  const raw       = calcSalonRawScores(questions, answers);
  const norm      = normalizeSalonScores(raw);
  const ippLoss   = calcIPPLoss(norm);
  const ips       = calcIPS(norm);

  return {
    raw,
    norm,
    ippLoss,
    ips,
    level:      getSalonLevel(ips),
    type:       getSalonType(norm, ips),
    weakZones:  getSalonWeakZones(norm),
    radarData:  getSalonRadarData(norm),
    hiddenMoney: calcHiddenMoney(questions, answers, numericAnswers),
  };
}

// ─── Утилита форматирования ───────────────────────────────────────────────────

export function formatMoneySalon(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)} тыс ₽`;
  return `${n} ₽`;
}
