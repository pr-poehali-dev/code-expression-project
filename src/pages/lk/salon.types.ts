// ─── Цветовая схема ───────────────────────────────────────────────────────────

export const SALON_ACCENT       = "hsl(335,80%,50%)";   // Малиновый/розовый
export const SALON_ACCENT_LIGHT = "hsl(335,80%,97%)";
export const SALON_ACCENT_DARK  = "hsl(335,80%,38%)";

// ─── Индексы ──────────────────────────────────────────────────────────────────

export type SalonIndexKey =
  | "IVK"   // Индекс возврата клиентов
  | "IPP"   // Индекс потери прибыли (чем выше — тем хуже, инвертируем)
  | "ISC"   // Индекс среднего чека
  | "IZ"    // Индекс загрузки
  | "IEA"   // Индекс эффективности администраторов
  | "IPU"   // Индекс продаж услуг
  | "ILK"   // Индекс лояльности клиентов
  | "IPS";  // Индекс прибыльности (из вопросов о финансах)

export type SalonScores = Record<SalonIndexKey, number>;

// ─── Нецифровые данные (доп. вопросы для расчёта скрытых денег) ──────────────

export interface SalonNumericData {
  monthlyClients: number;     // Q1 — кол-во новых клиентов
  avgCheck: number;           // введённый средний чек (₽)
  returnRate: number;         // Q3 — % возврата (raw выбор: 10/30/50/70)
  upsellRate: number;         // Q6 — % допродаж (raw: 3/10/20/35)
}

// ─── Вопрос / вариант ────────────────────────────────────────────────────────

export interface SalonOption {
  text: string;
  scores: Partial<SalonScores>;
  numericHint?: Partial<SalonNumericData>; // для расчётов
}

export interface SalonQuestion {
  id: number;
  block: number;
  blockTitle: string;
  text: string;
  options: SalonOption[];
  isNumeric?: boolean; // вопрос с вводом числа
  numericKey?: keyof SalonNumericData;
  numericLabel?: string;
  numericSuffix?: string;
}

export type SalonAnswers = Record<number, number>; // questionId → optionIndex
export type SalonNumericAnswers = Partial<SalonNumericData>;

// ─── Вопросы ──────────────────────────────────────────────────────────────────

export const SALON_QUESTIONS: SalonQuestion[] = [
  // БЛОК 1: Поток клиентов
  {
    id: 1, block: 1, blockTitle: "Поток клиентов",
    text: "Сколько новых клиентов приходит в месяц?",
    options: [
      { text: "До 20",                          scores: { IZ: 0 }, numericHint: { monthlyClients: 10 } },
      { text: "20–50",                          scores: { IZ: 1 }, numericHint: { monthlyClients: 35 } },
      { text: "50–100",                         scores: { IZ: 2 }, numericHint: { monthlyClients: 75 } },
      { text: "Более 100",                      scores: { IZ: 3 }, numericHint: { monthlyClients: 120 } },
    ],
  },
  {
    id: 2, block: 1, blockTitle: "Поток клиентов",
    text: "Поток клиентов в салоне:",
    options: [
      { text: "Постоянно падает",               scores: { IZ: 0 } },
      { text: "Нестабильный",                   scores: { IZ: 1 } },
      { text: "В целом стабильный",             scores: { IZ: 2 } },
      { text: "Есть система стабильного привлечения", scores: { IZ: 3 } },
    ],
  },

  // БЛОК 2: Возврат клиентов
  {
    id: 3, block: 2, blockTitle: "Возврат клиентов",
    text: "Какой процент клиентов возвращается повторно?",
    options: [
      { text: "Менее 20%",   scores: { IVK: 0 }, numericHint: { returnRate: 10 } },
      { text: "20–40%",      scores: { IVK: 1 }, numericHint: { returnRate: 30 } },
      { text: "40–60%",      scores: { IVK: 2 }, numericHint: { returnRate: 50 } },
      { text: "Более 60%",   scores: { IVK: 3 }, numericHint: { returnRate: 70 } },
    ],
  },
  {
    id: 4, block: 2, blockTitle: "Возврат клиентов",
    text: "Есть ли система возврата клиентов?",
    options: [
      { text: "Нет",                            scores: { ILK: 0 } },
      { text: "Иногда напоминаем",              scores: { ILK: 1 } },
      { text: "Есть базовая система",           scores: { ILK: 2 } },
      { text: "Полноценная система возврата",   scores: { ILK: 3 } },
    ],
  },

  // БЛОК 3: Средний чек
  {
    id: 5, block: 3, blockTitle: "Средний чек",
    text: "Мастера предлагают дополнительные услуги?",
    options: [
      { text: "Почти никогда",                  scores: { IPU: 0 } },
      { text: "Редко",                          scores: { IPU: 1 } },
      { text: "Частично",                       scores: { IPU: 2 } },
      { text: "Регулярно",                      scores: { IPU: 3 } },
    ],
  },
  {
    id: 6, block: 3, blockTitle: "Средний чек",
    text: "Клиенты покупают дополнительные услуги?",
    options: [
      { text: "Очень редко — до 5%",            scores: { ISC: 0 }, numericHint: { upsellRate: 3 } },
      { text: "Иногда — около 10–15%",          scores: { ISC: 1 }, numericHint: { upsellRate: 10 } },
      { text: "Достаточно часто — 20–30%",      scores: { ISC: 2 }, numericHint: { upsellRate: 20 } },
      { text: "Это часть системы — более 30%",  scores: { ISC: 3 }, numericHint: { upsellRate: 35 } },
    ],
  },

  // БЛОК 4: Администраторы
  {
    id: 7, block: 4, blockTitle: "Работа администраторов",
    text: "Администраторы умеют продавать услуги?",
    options: [
      { text: "Нет",                            scores: { IEA: 0 } },
      { text: "Слабо",                          scores: { IEA: 1 } },
      { text: "Частично",                       scores: { IEA: 2 } },
      { text: "Да, по системе",                 scores: { IEA: 3 } },
    ],
  },
  {
    id: 8, block: 4, blockTitle: "Работа администраторов",
    text: "Есть ли скрипты общения с клиентами?",
    options: [
      { text: "Нет",                            scores: { IEA: 0 } },
      { text: "Частично",                       scores: { IEA: 1 } },
      { text: "Есть базовые",                   scores: { IEA: 2 } },
      { text: "Полная система коммуникации",    scores: { IEA: 3 } },
    ],
  },

  // БЛОК 5: Мастера
  {
    id: 9, block: 5, blockTitle: "Работа мастеров",
    text: "Мастера удерживают клиентов за собой?",
    options: [
      { text: "Нет",                            scores: { IVK: 0 } },
      { text: "Частично",                       scores: { IVK: 1 } },
      { text: "У большинства получается",       scores: { IVK: 2 } },
      { text: "Есть система удержания",         scores: { IVK: 3 } },
    ],
  },
  {
    id: 10, block: 5, blockTitle: "Работа мастеров",
    text: "Есть ли обучение мастеров продажам и допродажам?",
    options: [
      { text: "Нет",                            scores: { IPU: 0 } },
      { text: "Редко",                          scores: { IPU: 1 } },
      { text: "Иногда",                         scores: { IPU: 2 } },
      { text: "Регулярно",                      scores: { IPU: 3 } },
    ],
  },

  // БЛОК 6: Финансы
  {
    id: 11, block: 6, blockTitle: "Финансовая структура",
    text: "Вы знаете чистую прибыль салона?",
    options: [
      { text: "Нет",                            scores: { IPS: 0 } },
      { text: "Примерно",                       scores: { IPS: 1 } },
      { text: "Почти точно",                    scores: { IPS: 2 } },
      { text: "Полностью контролируем",         scores: { IPS: 3 } },
    ],
  },
  {
    id: 12, block: 6, blockTitle: "Финансовая структура",
    text: "Вы знаете, сколько денег теряется из-за невозврата клиентов?",
    options: [
      { text: "Нет",                            scores: { IPP: 0 } },
      { text: "Примерно",                       scores: { IPP: 1 } },
      { text: "Частично считаем",               scores: { IPP: 2 } },
      { text: "Полностью анализируем",          scores: { IPP: 3 } },
    ],
  },

  // БЛОК 7: Потенциал роста
  {
    id: 13, block: 7, blockTitle: "Потенциал роста",
    text: "Что больше всего ограничивает рост салона сейчас?",
    options: [
      { text: "Нет клиентов",                   scores: { IZ: 0 } },
      { text: "Слабые продажи",                 scores: { IPU: 1 } },
      { text: "Низкий возврат клиентов",        scores: { IVK: 1 } },
      { text: "Нет системы масштабирования",    scores: { IPS: 2 } },
    ],
  },
  {
    id: 14, block: 7, blockTitle: "Потенциал роста",
    text: "Насколько используется потенциал базы клиентов?",
    options: [
      { text: "Менее 20% — база почти не работает", scores: { ILK: 0 } },
      { text: "20–40% — периодически работаем",     scores: { ILK: 1 } },
      { text: "40–60% — регулярно коммуницируем",   scores: { ILK: 2 } },
      { text: "Более 60% — системная работа с базой", scores: { ILK: 3 } },
    ],
  },
];

// ─── Числовые уточнения (отдельный экран) ───────────────────────────────────

export const SALON_NUMERIC_QUESTIONS: { key: keyof SalonNumericData; label: string; suffix: string; placeholder: string; hint: string }[] = [
  {
    key: "avgCheck",
    label: "Средний чек клиента",
    suffix: "₽",
    placeholder: "3500",
    hint: "Средняя сумма одного визита (без трат на материалы)",
  },
];

// ─── Максимальные баллы ──────────────────────────────────────────────────────

export const SALON_MAX: Record<SalonIndexKey, number> = {
  IVK: 6,   // Q3(3) + Q9(3)
  IPP: 3,   // Q12(3) — осведомлённость о потерях
  ISC: 3,   // Q6(3)
  IZ:  6,   // Q1(3) + Q2(3)
  IEA: 6,   // Q7(3) + Q8(3)
  IPU: 9,   // Q5(3) + Q10(3) + Q13(1)
  ILK: 6,   // Q4(3) + Q14(3)
  IPS: 5,   // Q11(3) + Q13(2)
};

// ─── Блочные комментарии ─────────────────────────────────────────────────────

export const SALON_BLOCK_COMMENTS: Record<number, string> = {
  1: "Поток клиентов — это «вход» в систему. Но без системы удержания даже большой поток превращается в постоянные потери.",
  2: "Возврат клиентов — главный рычаг прибыли. Удержать существующего клиента в 5 раз дешевле, чем привлечь нового.",
  3: "Средний чек растёт не от повышения цен, а от системных предложений. Клиент готов купить больше — нужно просто предложить.",
  4: "Администратор — это точка продажи №1. Слабый администратор = ежедневные потери денег.",
  5: "Мастер — самый убедительный продавец. Клиент доверяет ему. Это нужно монетизировать.",
  6: "Бизнес без цифр — это езда с закрытыми глазами. Знание точных показателей — первый шаг к управлению прибылью.",
  7: "База клиентов — это актив, который большинство салонов не использует. В ней скрыты десятки тысяч рублей ежемесячно.",
};

// ─── Типы салонов ────────────────────────────────────────────────────────────

export interface SalonType {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mainLoss: string;
  nextStep: string;
  color: string;
  emoji: string;
}

export const SALON_TYPES: SalonType[] = [
  {
    id: 1,
    title: "Салон с утечкой клиентов",
    subtitle: "Клиенты приходят, но не возвращаются",
    description: "Основная проблема — низкий возврат. Деньги тратятся на привлечение новых клиентов, которые уходят после первого визита.",
    mainLoss: "Потери от невозврата клиентов",
    nextStep: "Запустить систему возврата: автоматические напоминания, программа лояльности, звонки через 3–4 недели после визита",
    color: "#ef4444",
    emoji: "🚿",
  },
  {
    id: 2,
    title: "Низкий средний чек",
    subtitle: "Клиенты есть, но берут по минимуму",
    description: "Мастера и администраторы не предлагают дополнительные услуги. Деньги лежат прямо в кресле — нужно только предложить.",
    mainLoss: "Упущенная выручка от допродаж",
    nextStep: "Внедрить протоколы допродаж, обучить мастеров предлагать следующую услугу прямо на визите",
    color: "#f97316",
    emoji: "💸",
  },
  {
    id: 3,
    title: "Слабые продажи",
    subtitle: "Команда не умеет продавать",
    description: "Администраторы и мастера не обучены продажам. Клиент не покупает больше не потому что не хочет — просто не предлагают правильно.",
    mainLoss: "Потери из-за неэффективной команды",
    nextStep: "Скрипты для администраторов, тренинги для мастеров, система мотивации на допродажи",
    color: "#eab308",
    emoji: "📉",
  },
  {
    id: 4,
    title: "Хаотичная система",
    subtitle: "Всё работает, но непредсказуемо",
    description: "Нет системности: сегодня хорошо, завтра плохо. Бизнес зависит от случайных факторов, а не от выстроенных процессов.",
    mainLoss: "Нестабильная прибыль из-за отсутствия процессов",
    nextStep: "Выстроить базовые бизнес-процессы: CRM, систему коммуникации, финансовый учёт",
    color: "#8b5cf6",
    emoji: "🌪️",
  },
  {
    id: 5,
    title: "Потенциал ×2 без нового трафика",
    subtitle: "Есть база — нужна система",
    description: "Фундамент построен. При правильной работе с существующей базой и допродажах прибыль может вырасти в 2 раза без привлечения новых клиентов.",
    mainLoss: "Недоиспользованный потенциал базы",
    nextStep: "Реактивация базы, программы лояльности, работа с возвратом и средним чеком",
    color: "#22c55e",
    emoji: "🚀",
  },
];
