export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
export const BG = "#f8f8f6";

export type Course = {
  id: number;
  title: string;
  description: string;
  bullets: string[];
  price: string;
  priceNote?: string;
  level: "beginner" | "practitioner" | "any";
  direction: "technique" | "income";
  tiers?: { label: string; color: string; price: string }[];
  image: string;
  detailUrl?: string;
  buyUrl?: string;
  format?: "online" | "offline";
  duration?: string;
  bookUrl?: string;
};

export type LevelFilter = "all" | "beginner" | "practitioner";
export type DirectionFilter = "all" | "technique" | "income";
export type TabType = "online" | "offline" | "point";

export const ONLINE_COURSES: Course[] = [
  {
    id: 1,
    title: "Профессия массажист с нуля: первый доход за 30 дней",
    description: "Освойте базовые техники массажа и начните зарабатывать уже в первый месяц, даже без медицинского образования.",
    bullets: [
      "Выполнять базовые техники массажа уверенно и безопасно",
      "Проводить полноценный сеанс с клиентом",
      "Находить первых клиентов и зарабатывать",
    ],
    price: "19 900 ₽",
    priceNote: "или рассрочка",
    level: "beginner",
    direction: "income",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/5330c54a-7b7f-4b4b-bb27-5dfd7e57afb8.jpg",
    detailUrl: "/course/massazhist-s-nulya",
  },
  {
    id: 2,
    title: "Восстановительный массаж PRO: клиенты с болью, травмами и высоким чеком",
    description: "Научитесь работать с болевыми состояниями, травмами и сложными случаями, за которые клиенты готовы платить больше.",
    bullets: [
      "Работать с позвоночником, суставами и мышцами",
      "Понимать причины боли и подбирать техники",
      "Повышать средний чек за счёт результата",
    ],
    price: "39 900 ₽",
    priceNote: "или рассрочка",
    level: "practitioner",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c61ffa15-f30f-41ca-9c39-e4a889f1e5b8.jpg",
    detailUrl: "/course/vosstanovitelny-massazh-pro",
    buyUrl: "https://school.brossok.ru/buy/5",
  },
  {
    id: 3,
    title: "Готовые протоколы массажа: что делать при боли, стрессе и зажимах",
    description: "Получите готовые схемы работы с клиентами под разные запросы и перестаньте гадать, какие техники применять.",
    bullets: [
      "Быстро подбирать технику под клиента",
      "Работать с болью в спине, шее и стрессом",
      "Повышать эффективность каждого сеанса",
    ],
    price: "19 900 ₽",
    level: "practitioner",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/eeeaf528-cd8c-4010-b5fb-ca19d1dc4a85.jpg",
    detailUrl: "/course/gotovye-protokoly-massazha",
    buyUrl: "https://school.brossok.ru/buy/50",
  },
  {
    id: 4,
    title: "Антистресс-техники: как за 1 сеанс усиливать эффект массажа в 2 раза",
    description: "Освойте техники работы с нервной системой и увеличьте эффективность массажа уже после первого применения.",
    bullets: [
      "Регулировать состояние клиента во время сеанса",
      "Усиливать эффект массажа через ВНС",
      "Повышать лояльность и возврат клиентов",
    ],
    price: "14 900 ₽",
    level: "any",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/7ee6581d-0eae-4377-b509-048c05c11572.jpg",
    detailUrl: "/course/antistress-tehniki-massazha",
    buyUrl: "https://school.brossok.ru/buy/42",
  },
  {
    id: 5,
    title: "Коррекция фигуры: быстрые результаты, за которые платят",
    description: "Освойте востребованные техники коррекции фигуры и начните зарабатывать на одном из самых прибыльных направлений.",
    bullets: [
      "Уменьшать объемы и работать с целлюлитом",
      "Устранять отёки и улучшать внешний вид",
      "Создавать курс процедур для клиента",
    ],
    price: "16 900 ₽",
    level: "any",
    direction: "income",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/bdd8989f-e31c-46c9-aad1-6006a7f468ec.jpg",
    detailUrl: "/course/korrektsiya-figury",
    buyUrl: "https://school.brossok.ru/buy/43",
  },
  {
    id: 6,
    title: "Висцеральный массаж с нуля: быстрый старт без медобразования",
    description: "Освойте базовые техники работы с внутренними органами и расширьте спектр своих услуг.",
    bullets: [
      "Основам висцеральной терапии",
      "Безопасной работе с внутренними органами",
      "Применению техник на практике",
    ],
    price: "4 990 ₽",
    level: "beginner",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d9819836-a0ee-4339-b6da-de14ba2dfd2b.jpg",
    detailUrl: "/course/visceralny-massazh-s-nulya",
    buyUrl: "https://school.brossok.ru/buy/55",
  },
  {
    id: 7,
    title: "Массажист с потоком клиентов: от 0 до стабильной записи",
    description: "Системный подход к привлечению клиентов и стабильному доходу — выбери свой уровень.",
    bullets: [
      "Строить поток клиентов с нуля",
      "Упаковать личный бренд и повысить чек",
      "Выйти на стабильный доход",
    ],
    price: "от 4 900 ₽",
    priceNote: "3 тарифа",
    level: "any",
    direction: "income",
    format: "online",
    tiers: [
      { label: "Старт", color: "#22c55e", price: "4 900 ₽" },
      { label: "Профи", color: "#f59e0b", price: "14 900 ₽" },
      { label: "Эксперт", color: "#ef4444", price: "34 900 ₽" },
    ],
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/ac73bf44-ff8f-4207-9d24-56da457498ea.jpg",
    detailUrl: "/course/massazhist-s-potokom-klientov",
    buyUrl: "https://school.brossok.ru/training/view/-laquo-massaghist-2-0-sozdanie-i-prodvighenie-lichnogo-brenda-raquo-",
  },
];

export const POINT_COURSES: Course[] = [
  {
    id: 201,
    title: "«Выдохни»: как за 5–10 минут в день снять тревогу и выйти из стресса",
    description: "3 упражнения на основе физиологии ВНС — работают с первого раза. Бесплатный курс для всех, кто устал жить в режиме тревоги.",
    bullets: [
      "Снять острую тревогу за 2–3 минуты",
      "Понять, как работает ваша нервная система",
      "Засыпать без мыслей и начинать день спокойно",
    ],
    price: "Бесплатно",
    level: "any",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/ea5f9421-9087-43a3-b7f4-9bc851b3e6a5.jpg",
    detailUrl: "/course/vns-trevoga",
    buyUrl: "/course/vns-trevoga#form",
  },
  {
    id: 202,
    title: "Фитнес для беременных (2-й триместр)",
    description: "Безопасные тренировки для тела, которое меняется каждый день. 3 программы под разный ритм жизни — без перегрузок и риска.",
    bullets: [
      "Снижение напряжения в спине и теле",
      "3 программы: 2, 3 и 7 раз в неделю",
      "Без оборудования, в любое удобное время",
    ],
    price: "5 590 ₽",
    level: "any",
    direction: "technique",
    format: "online",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/0fd773ca-0152-49ae-b5a9-d70add20f7de.jpg",
    detailUrl: "/course/fitnes-beremennyh",
    buyUrl: "https://school.brossok.ru/buy/60",
  },
];

export const OFFLINE_COURSES: Course[] = [
  {
    id: 101,
    title: "Однодневный интенсив: увеличение дохода массажиста через практику",
    description: "За 1 день вы продиагностируете свою практику, поймёте, где теряете деньги, и освоите техники, которые увеличивают поток клиентов и доход.",
    bullets: [
      "Диагностировать узкие места в своей практике",
      "Освоить техники, повышающие средний чек",
      "Получить готовый план роста дохода",
    ],
    price: "от 9 900 ₽",
    level: "any",
    direction: "income",
    format: "offline",
    duration: "1 день",
    image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/1a5aac68-8ad8-45e6-bb3c-bbab1439bb75.jpg",
    detailUrl: "/course/offline-intensiv-massazh",
    bookUrl: "/course/offline-intensiv-massazh",
    buyUrl: "/course/offline-intensiv-massazh",
  },
];