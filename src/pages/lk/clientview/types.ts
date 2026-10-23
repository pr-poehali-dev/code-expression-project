export type Interest = "interest" | "lack_info" | "risk";

export interface ClientCard {
  title: string;
  tagline: string;
  interest: Interest;
  thought: string;
  attracts: string[];
  doubts: string[];
  check: string;
}

export interface ViewResult {
  clients: ClientCard[];
  barriers: { title: string; text: string }[];
  variants: { label: string; title: string; text: string }[];
  reality_check: string;
  comparison: {
    summary: string;
    per_client: { title: string; shift: "better" | "same" | "worse"; text: string }[];
  } | null;
}

export interface ChatEntry {
  client_index: number;
  question: string;
  answer: string;
}

export interface ViewTest {
  id: number;
  parent_id: number | null;
  subject: string;
  goal: string;
  material: string;
  result: ViewResult;
  chat: ChatEntry[];
  reality_note: string | null;
  created_at?: string;
}

export interface HistoryItem {
  id: number;
  parent_id: number | null;
  subject: string;
  goal: string;
  material: string;
  created_at: string;
  has_result: boolean;
}

export const SUBJECTS = [
  { id: "offer", icon: "Package", title: "Услуга или предложение", hint: "Что я продаю?" },
  { id: "ad", icon: "Megaphone", title: "Реклама или пост", hint: "Что я сообщаю?" },
  { id: "price", icon: "Tag", title: "Цена и прайс", hint: "За что платит клиент?" },
  { id: "business", icon: "Store", title: "Мой бизнес целиком", hint: "Как я выгляжу на рынке?" },
] as const;

export const GOALS = [
  { id: "bookings", title: "Больше записей" },
  { id: "price_up", title: "Повышение цены" },
  { id: "launch", title: "Запуск услуги" },
  { id: "idea", title: "Проверка новой идеи" },
] as const;

export const QUESTIONS = [
  "Что вас смущает в цене?",
  "Чего вам не хватает, чтобы записаться?",
  "Что могло бы убедить вас выбрать эту услугу?",
  "Какое предложение показалось бы вам более привлекательным?",
];

export function subjectTitle(id: string) {
  return SUBJECTS.find(s => s.id === id)?.title || id;
}
export function goalTitle(id: string) {
  return GOALS.find(g => g.id === id)?.title || id;
}

export const CLIENT_VIEW_COST = 2;
