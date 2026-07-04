export const ACCENT = "hsl(185,85%,32%)";

export interface Tool {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badge: "new" | "soon" | "cost" | "cost3" | "cost15";
  ready: boolean;
}

export const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:    { bg: "hsl(145,60%,92%)", color: "hsl(145,60%,30%)", label: "Новое" },
  soon:   { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "Скоро" },
  cost:   { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "1 ⚡" },
  cost3:  { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "3 ⚡" },
  cost15: { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "от 105 ⚡" },
};

export const TOOLS_DIRECT: Tool[] = [
  {
    id: "audience",
    icon: "Users",
    iconColor: "hsl(220,80%,50%)",
    iconBg: "hsl(220,80%,95%)",
    title: "Портрет целевой аудитории",
    description: "ИИ анализирует ваши услуги и создаёт детальные портреты ЦА с болями, мотивацией и каналами охвата.",
    badge: "cost",
    ready: true,
  },
  {
    id: "offers",
    icon: "Gift",
    iconColor: "hsl(280,60%,52%)",
    iconBg: "hsl(280,60%,95%)",
    title: "Офферы под ЦА",
    description: "Генерирует убедительные предложения и акции под каждый сегмент вашей аудитории.",
    badge: "cost",
    ready: true,
  },
  {
    id: "semantics",
    icon: "Search",
    iconColor: "hsl(145,60%,38%)",
    iconBg: "hsl(145,60%,93%)",
    title: "Семантическое ядро",
    description: "Список поисковых запросов для Яндекс.Директ под ваши услуги — высокочастотные, средние, низкочастотные.",
    badge: "cost",
    ready: true,
  },
  {
    id: "direct",
    icon: "MousePointerClick",
    iconColor: "hsl(25,90%,50%)",
    iconBg: "hsl(25,90%,94%)",
    title: "Объявления для Яндекс.Директ",
    description: "Готовые тексты по требованиям Яндекса: заголовок 1 (≤35), заголовок 2 (≤30), текст (≤81 симв.).",
    badge: "cost",
    ready: true,
  },
  {
    id: "budget",
    icon: "Calculator",
    iconColor: "hsl(185,85%,32%)",
    iconBg: "hsl(185,85%,93%)",
    title: "Медиаплан для Директа",
    description: "ДРР, сравнение стратегий CPC/CPA/ДРР, прогноз клиентов и распределение бюджета — на основе данных вашего салона.",
    badge: "cost3",
    ready: true,
  },
];

export const TOOLS_CONTENT: Tool[] = [
  {
    id: "seo",
    icon: "Search",
    iconColor: "hsl(199,89%,40%)",
    iconBg: "hsl(199,89%,95%)",
    title: "SEO-оптимизатор",
    description: "Анализирует сайт салона: мета-теги, заголовки, текст, структуру. Выдаёт конкретные правки с готовыми вариантами.",
    badge: "new",
    ready: true,
  },
  {
    id: "post-gen",
    icon: "FileText",
    iconColor: "hsl(210,80%,50%)",
    iconBg: "hsl(210,80%,96%)",
    title: "Генератор постов",
    description: "Тема → 5 заголовков на выбор → готовый текст + картинка. Пост за 2 минуты.",
    badge: "new",
    ready: true,
  },
  {
    id: "image-gen",
    icon: "Image",
    iconColor: "hsl(40,90%,45%)",
    iconBg: "hsl(40,90%,96%)",
    title: "Генерация изображений",
    description: "Создавайте визуалы для постов, сторис и баннеров. ИИ учитывает стиль и аудиторию вашего салона.",
    badge: "new",
    ready: true,
  },
  {
    id: "reel-script",
    icon: "Video",
    iconColor: "hsl(335,80%,50%)",
    iconBg: "hsl(335,80%,97%)",
    title: "Сценарий для рилса",
    description: "Идея → покадровый сценарий + обложка. Снимаете сами по готовой инструкции.",
    badge: "new",
    ready: true,
  },
  {
    id: "video-gen",
    icon: "Clapperboard",
    iconColor: "hsl(320,85%,50%)",
    iconBg: "hsl(320,85%,97%)",
    title: "Создание видео-ролика",
    description: "ИИ генерирует короткий видеоролик по описанию — для сторис, рилс и рекламы. Доступно после пополнения баланса.",
    badge: "cost15",
    ready: true,
  },
];

export interface AudienceData {
  portraits: { archetype: string; age_range: string; occupation: string; income: string; pains: string[]; motivations: string[]; services_interest: string[]; channels: string[]; hook: string }[];
  salonName: string;
}

export interface SemanticGroups {
  groups: { group: string; service_tag: string; keywords: { query: string; frequency: string; frequency_label: string; intent: string }[] }[];
}

export const CHAIN_PREREQ: Record<string, { key: string; toolId: string; toolTitle: string }> = {
  offers:    { key: "mkt_audience_v2_",  toolId: "audience",  toolTitle: "Портрет целевой аудитории" },
  semantics: { key: "mkt_offers_v2_",   toolId: "offers",    toolTitle: "Офферы под ЦА" },
  direct:    { key: "mkt_semantics_v2_", toolId: "semantics", toolTitle: "Семантическое ядро" },
};