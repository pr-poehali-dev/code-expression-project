import {
  ProfileIndexKey, ProfileScores, ProfileAnswers, ProfileQuestion,
  PROFILE_MAX, PROFILE_TYPES, ProfileType,
} from "./profile.types";

// ─── Подсчёт сырых баллов по ответам ─────────────────────────────────────────

export function calcRawScores(questions: ProfileQuestion[], answers: ProfileAnswers): ProfileScores {
  const raw: ProfileScores = {
    IFZ: 0, IDT: 0, IN: 0, IFD: 0,
    IDM: 0, IDR: 0, IIT: 0, IDS: 0,
  };
  questions.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const opt = q.options[optIdx];
    if (!opt) return;
    (Object.keys(opt.scores) as ProfileIndexKey[]).forEach(key => {
      raw[key] = (raw[key] || 0) + (opt.scores[key] || 0);
    });
  });
  return raw;
}

// ─── Нормализация в 0–100% ────────────────────────────────────────────────────

export function normalizeScores(raw: ProfileScores): ProfileScores {
  const result = {} as ProfileScores;
  (Object.keys(raw) as ProfileIndexKey[]).forEach(key => {
    const max = PROFILE_MAX[key];
    result[key] = max > 0 ? Math.round((raw[key] / max) * 100) : 0;
  });
  return result;
}

// ─── Индекс финансовой устойчивости (IFU) — производный ──────────────────────

export function calcIFU(n: ProfileScores): number {
  return Math.round((n.IFD + n.IN + (100 - n.IDT)) / 3);
}

// ─── Главный индекс IFL ───────────────────────────────────────────────────────

export function calcIFL(n: ProfileScores): number {
  const ifu = calcIFU(n);
  const raw = (n.IFZ + ifu + n.IDR + n.IDS - n.IDM - n.IIT) / 4;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ─── Уровень по IFL ───────────────────────────────────────────────────────────

export function getIFLLevel(ifl: number): { label: string; color: string } {
  if (ifl < 30)  return { label: "Финансовое выживание",       color: "#ef4444" };
  if (ifl < 50)  return { label: "Нестабильность",             color: "#f97316" };
  if (ifl < 70)  return { label: "Базовая зрелость",           color: "#eab308" };
  if (ifl < 85)  return { label: "Финансовая устойчивость",    color: "#22c55e" };
  return         { label: "Системное финансовое мышление",    color: "#14b8a6" };
}

// ─── Определение типа профиля ─────────────────────────────────────────────────

export function getProfileType(n: ProfileScores, ifl: number): ProfileType {
  // Приоритет: по доминирующему индексу
  if (n.IDT >= 70)               return PROFILE_TYPES[0]; // Финансовая тревожность
  if (n.IIT >= 60)               return PROFILE_TYPES[1]; // Импульсивный расход
  if (n.IDM >= 60)               return PROFILE_TYPES[2]; // Денежный потолок
  if (ifl >= 50 && ifl < 70)    return PROFILE_TYPES[3]; // Потенциал выше текущего
  if (ifl >= 70)                 return PROFILE_TYPES[4]; // Финансово зрелый
  // fallback по балансу
  if (n.IDT > n.IDM && n.IDT > n.IIT) return PROFILE_TYPES[0];
  if (n.IIT > n.IDM)                  return PROFILE_TYPES[1];
  return PROFILE_TYPES[2];
}

// ─── Слабые зоны ──────────────────────────────────────────────────────────────

export interface WeakZone {
  index: ProfileIndexKey;
  label: string;
  value: number;
  description: string;
  tip: string;
}

const ZONE_META: Record<ProfileIndexKey, { label: string; description: string; tip: string; isNegative: boolean }> = {
  IFZ: { label: "Финансовая зрелость", description: "Осознанность финансовых решений", tip: "Изучайте финансовую грамотность и ставьте конкретные цели", isNegative: false },
  IDT: { label: "Денежная тревожность", description: "Стресс и страх вокруг денег", tip: "Практикуйте финансовый дневник и создайте резервный фонд", isNegative: true },
  IN:  { label: "Накопления", description: "Способность откладывать системно", tip: "Начните с 5% дохода — переведите это в автоматический режим", isNegative: false },
  IFD: { label: "Финансовая дисциплина", description: "Контроль и планирование расходов", tip: "Введите бюджет и фиксируйте все траты хотя бы 30 дней", isNegative: false },
  IDM: { label: "Дефицитное мышление", description: "Ограничивающие убеждения о деньгах", tip: "Работайте с убеждениями: пишите аффирмации и отслеживайте мысли о деньгах", isNegative: true },
  IDR: { label: "Денежная реализация", description: "Вера в рост дохода и возможности", tip: "Изучайте истории роста других — расширяйте горизонт возможного", isNegative: false },
  IIT: { label: "Импульсивные траты", description: "Эмоциональные покупки без плана", tip: "Правило 72 часов: любая покупка >3000₽ — ждать трое суток", isNegative: true },
  IDS: { label: "Денежная самооценка", description: "Уверенность в собственной стоимости", tip: "Фиксируйте свои результаты и ценность — делайте это регулярно", isNegative: false },
};

export function getWeakZones(n: ProfileScores): WeakZone[] {
  const zones: WeakZone[] = [];
  (Object.keys(n) as ProfileIndexKey[]).forEach(key => {
    const meta = ZONE_META[key];
    const isWeak = meta.isNegative ? n[key] >= 60 : n[key] <= 35;
    if (isWeak) {
      zones.push({ index: key, label: meta.label, value: n[key], description: meta.description, tip: meta.tip });
    }
  });
  // Сортируем: для негативных — по убыванию значения, для позитивных — по возрастанию
  return zones.sort((a, b) => {
    const aMeta = ZONE_META[a.index];
    const bMeta = ZONE_META[b.index];
    const aScore = aMeta.isNegative ? a.value : 100 - a.value;
    const bScore = bMeta.isNegative ? b.value : 100 - b.value;
    return bScore - aScore;
  }).slice(0, 4);
}

// ─── Radar chart данные ───────────────────────────────────────────────────────

export interface RadarPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export function getRadarData(n: ProfileScores, ifu: number): RadarPoint[] {
  return [
    { subject: "Зрелость",      value: n.IFZ,  fullMark: 100 },
    { subject: "Тревога",        value: 100 - n.IDT, fullMark: 100 },
    { subject: "Дисциплина",     value: n.IFD,  fullMark: 100 },
    { subject: "Накопления",     value: n.IN,   fullMark: 100 },
    { subject: "Импульсив.",     value: 100 - n.IIT, fullMark: 100 },
    { subject: "Устойчивость",   value: ifu,    fullMark: 100 },
    { subject: "Реализация",     value: n.IDR,  fullMark: 100 },
  ];
}

// ─── Полный расчёт ────────────────────────────────────────────────────────────

export interface ProfileCalcResult {
  raw: ProfileScores;
  norm: ProfileScores;
  ifu: number;
  ifl: number;
  level: { label: string; color: string };
  type: ProfileType;
  weakZones: WeakZone[];
  radarData: RadarPoint[];
}

export function calcProfile(questions: ProfileQuestion[], answers: ProfileAnswers): ProfileCalcResult {
  const raw  = calcRawScores(questions, answers);
  const norm = normalizeScores(raw);
  const ifu  = calcIFU(norm);
  const ifl  = calcIFL(norm);
  return {
    raw,
    norm,
    ifu,
    ifl,
    level:     getIFLLevel(ifl),
    type:      getProfileType(norm, ifl),
    weakZones: getWeakZones(norm),
    radarData: getRadarData(norm, ifu),
  };
}
