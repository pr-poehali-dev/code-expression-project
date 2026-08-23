export interface ToolInfo {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tab: string;
  category: "tools" | "ai" | "marketing";
  audience?: string;
  url?: string;
}

export const TOOLS_CATALOG: ToolInfo[] = [
  {
    slug: "diagnostic",
    name: "Системная диагностика клиента",
    description: "Введите жалобу — получите причины, компенсации, красные флаги и техники работы.",
    icon: "Stethoscope",
    tab: "tools",
    category: "tools",
    audience: "Специалист по телу",
  },
  {
    slug: "bodymap",
    name: "Шпаргалка по телу",
    description: "Выберите зону тела — диагностика, причины, красные флаги, техники работы.",
    icon: "BookOpen",
    tab: "tools",
    category: "tools",
    audience: "Специалист по телу",
  },
  {
    slug: "mindset-spec",
    name: "Развитие специалиста",
    description: "Выберите цель — получите конкретный план развития практики.",
    icon: "Brain",
    tab: "tools",
    category: "tools",
  },
  {
    slug: "barriers",
    name: "Внутренние барьеры специалиста",
    description: "Выявить психологические блоки, которые мешают профессиональному росту.",
    icon: "ShieldAlert",
    tab: "tools",
    category: "tools",
  },
  {
    slug: "finance",
    name: "Финансовая грамотность PRO",
    description: "Понять реальные финансовые цели и путь к их достижению.",
    icon: "TrendingUp",
    tab: "tools",
    category: "tools",
  },
  {
    slug: "image-gen",
    name: "Генерация изображений",
    description: "Создайте визуал для постов, сторис и баннеров на основе профиля салона.",
    icon: "Image",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "post-gen",
    name: "Генератор постов",
    description: "Тема → 5 заголовков → готовый текст + изображение.",
    icon: "FileText",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "client-scripts",
    name: "Скрипты общения с клиентом",
    description: "Выберите роль, опишите ситуацию — получите готовый сценарий диалога.",
    icon: "MessageSquare",
    tab: "ai",
    category: "ai",
  },
  {
    slug: "salon-audit",
    name: "Цифровой бизнес-разбор",
    description: "Анкета салона → ИИ-анализ + персональный план роста.",
    icon: "BarChart2",
    tab: "ai",
    category: "ai",
  },
  {
    slug: "reel-script",
    name: "Сценарий для рилса",
    description: "Идея → покадровый сценарий + обложка.",
    icon: "Video",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "review-reply",
    name: "Ответы на отзывы",
    description: "ИИ генерирует профессиональный ответ на любой отзыв.",
    icon: "Star",
    tab: "ai",
    category: "ai",
  },
  {
    slug: "salon-diag",
    name: "Диагностика роста салона PRO",
    description: "Найти точки потери денег и увеличить прибыль.",
    icon: "Scissors",
    tab: "ai",
    category: "ai",
  },
  {
    slug: "staff-audit",
    name: "Анализ персонала",
    description: "Финансовый анализ: кто зарабатывает, кто уводит клиентов.",
    icon: "Users",
    tab: "ai",
    category: "ai",
  },
  {
    slug: "audience",
    name: "Портрет целевой аудитории",
    description: "ИИ строит детальный портрет ЦА на основе профиля салона.",
    icon: "Target",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "offers",
    name: "Офферы под ЦА",
    description: "Генерация продающих офферов под каждый сегмент аудитории.",
    icon: "Megaphone",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "semantics",
    name: "Семантическое ядро",
    description: "Подбор ключевых слов для Яндекс.Директ на основе услуг салона.",
    icon: "Search",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "direct",
    name: "Объявления для Яндекс.Директ",
    description: "Готовые объявления по ключевым словам и офферам.",
    icon: "MousePointer",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "budget",
    name: "Медиаплан для Директа",
    description: "Расчёт бюджета и прогноз результатов рекламной кампании.",
    icon: "PieChart",
    tab: "marketing",
    category: "marketing",
  },
  {
    slug: "seo",
    name: "SEO-оптимизатор",
    description: "Анализ сайта салона: мета-теги, заголовки, структура. Конкретные правки с готовыми вариантами.",
    icon: "Globe",
    tab: "marketing:seo",
    category: "marketing",
  },
  {
    slug: "landing-builder",
    name: "Конструктор лендингов",
    description: "Расскажите о бизнесе в чате — ИИ создаст готовый лендинг для скачивания и размещения.",
    icon: "Globe",
    tab: "ai",
    category: "ai",
  },
];

export function getToolBySlug(slug: string): ToolInfo | undefined {
  return TOOLS_CATALOG.find(t => t.slug === slug);
}