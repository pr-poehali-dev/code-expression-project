// ── Этап 1: Желаемая жизнь ────────────────────────────────────────────────────
export interface LifeItem {
  label: string;
  amount: number;    // руб/месяц
  importance: number; // 1-5
}

export const LIFE_ITEMS_DEFAULT: Omit<LifeItem, "amount" | "importance">[] = [
  { label: "Жильё (аренда/ипотека)" },
  { label: "Путешествия" },
  { label: "Отдых и развлечения" },
  { label: "Обучение и развитие" },
  { label: "Здоровье и спорт" },
  { label: "Комфорт и покупки" },
  { label: "Накопления" },
  { label: "Инвестиции" },
];

// ── Этап 2: Финансовые цели ───────────────────────────────────────────────────
export interface FinanceGoals {
  desiredIncome: number;    // желаемый доход/мес
  savings: number;          // желаемые накопления/мес
  goalDescription: string;  // финансовая цель (текст)
  goalMonths: number;        // срок в месяцах
}

// ── Этап 3: Текущая модель ────────────────────────────────────────────────────
export interface CurrentModel {
  currentIncome: number;       // текущий доход/мес
  avgCheck: number;            // средний чек
  clientsPerMonth: number;     // клиентов в месяц
  hoursPerWeek: number;        // часов работы в неделю
  workDaysPerMonth: number;    // рабочих дней в месяц
  sessionDurationHours: number; // средняя длительность сессии, часов
}

// ── Этап 4: Расходы ───────────────────────────────────────────────────────────
export interface Expenses {
  rent: number;
  materials: number;
  taxes: number;
  education: number;
  marketing: number;
  personal: number;
  loans: number;
  other: number;
}

// ── Этап 5: Энергия и нагрузка ────────────────────────────────────────────────
export interface EnergyData {
  tiredness: number;       // усталость 1-5
  emotionalLoad: number;   // эмоц. нагрузка 1-5
  physicalLoad: number;    // физ. нагрузка 1-5
  desireToWorkMore: number; // желание работать больше 1-5
}

// ── Этап 8: Денежное мышление ─────────────────────────────────────────────────
export interface MoneyMindset {
  fearRaisePrice: boolean;
  feelUnworthy: boolean;
  fearLoseClients: boolean;
  hardToTalkMoney: boolean;
  incomeCapInHead: boolean;
}

// ── Полный объект данных ──────────────────────────────────────────────────────
export interface FinanceData {
  lifeItems: LifeItem[];
  goals: FinanceGoals;
  currentModel: CurrentModel;
  expenses: Expenses;
  energy: EnergyData;
  mindset: MoneyMindset;
}

export type FinanceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const FINANCE_ACCENT = "hsl(145,60%,40%)";
export const FINANCE_ACCENT_LIGHT = "hsl(145,60%,95%)";
export const FINANCE_ACCENT_DARK = "hsl(145,60%,28%)";
