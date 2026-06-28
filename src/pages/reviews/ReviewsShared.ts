export const ACCENT = "#2DD4BF";
export const ACCENT_DARK = "#14B8A6";
export const DARK = "#080E1C";

export interface VideoItem {
  id: string;
  name: string;
  city: string;
  experience: string;
  result: string;
}

export interface VideoSection {
  title: string;
  subtitle: string;
  href: string;
  linkText: string;
  videos: VideoItem[];
}

export interface TextReview {
  name: string;
  city: string;
  experience: string;
  photo: string;
  text: string;
}

export interface TextSection {
  badge: string;
  title: string;
  subtitle: string;
  href: string;
  linkText: string;
  reviews: TextReview[];
}

export const VIDEO_SECTIONS: VideoSection[] = [
  {
    title: "Прохождение онлайн-курса",
    subtitle: "Специалисты о результатах после прохождения курса «Промт Диалог»",
    href: "/tarify",
    linkText: "Смотреть тарифы",
    videos: [
      { id: "o4aLwoPaNMNsPmRU517kdr", name: "Марина К.", city: "Москва", experience: "Массажист, 4 года", result: "Подняла чек на 30%" },
      { id: "7on4nVofXbcgkDmWbjaZvH", name: "Ольга В.", city: "Казань", experience: "Массажист-косметолог, 2 года", result: "Запись на 3 недели вперёд" },
      { id: "jWics1Kq1BrrtcFK25Vmgu", name: "Алексей Г.", city: "Санкт-Петербург", experience: "Спортивный массажист, 6 лет", result: "+3 постоянных клиента" },
      { id: "us9ULPt46B7G77bQYwBXXt", name: "Тамара Л.", city: "Екатеринбург", experience: "Реабилитолог, 12 лет", result: "Расширила линейку услуг" },
      { id: "vk9wa3fBfxQZwMbRvN9YJG", name: "Дмитрий Н.", city: "Новосибирск", experience: "Массажист, 1,5 года", result: "Первый поток клиентов" },
      { id: "sCFSxwbdZSjobWC3KKzDmj", name: "Светлана Р.", city: "Краснодар", experience: "Массажист, 5 лет", result: "Постоянных клиентов вдвое больше" },
    ],
  },
  {
    title: "Массажист с потоком клиентов",
    subtitle: "Системный подход к привлечению клиентов и стабильному доходу с нуля",
    href: "/tarify",
    linkText: "Смотреть тарифы",
    videos: [
      { id: "9gXRTsH48ootXdfsfSxrM3", name: "Ксения М.", city: "Москва", experience: "Массажист, 2 года", result: "Запись на 3 недели вперёд" },
      { id: "ijbAj7MbdwDvX8jdx5fgiq", name: "Наталья С.", city: "Казань", experience: "Массажист, 1,5 года", result: "Поток клиентов с нуля" },
      { id: "5u8FjHNy89MCso6wue8uEq", name: "Артём В.", city: "Санкт-Петербург", experience: "Массажист, 3 года", result: "Сарафанное радио работает само" },
      { id: "eFKnFkaFhfwaMk7BZgi4zp", name: "Дмитрий К.", city: "Екатеринбург", experience: "Массажист, 4 года", result: "Стабильный доход каждый месяц" },
      { id: "6yUBNj4ToDMq7vd5e25yrh", name: "Ольга П.", city: "Новосибирск", experience: "Массажист, 2,5 года", result: "Вырос средний чек на 40%" },
      { id: "2nEvA7AUqtTnzrnwP7J4wm", name: "Игорь Л.", city: "Ростов-на-Дону", experience: "Массажист, 3 года", result: "Первые клиенты в процессе обучения" },
    ],
  },
];

export const TEXT_SECTIONS: TextSection[] = [
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Практика»",
    subtitle: "Системный старт: знания, техники и первые результаты в практике",
    href: "/praktika",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Анастасия К.",
        city: "Москва",
        experience: "Начинающий массажист",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c207e068-8203-4f20-a40a-53d60df722e5.jpg",
        text: "Начала с нуля, через месяц уже принимала первых клиентов. Курс очень понятный, всё по шагам. Теперь это мой основной доход.",
      },
      {
        name: "Елена М.",
        city: "Санкт-Петербург",
        experience: "Начинающий массажист",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/3618e920-2b36-438e-b312-f7f0874826c3.jpg",
        text: "Долго сомневалась — нет образования, нет опыта. Но курс реально для новичков. За 3 недели освоила технику и уже зарабатываю.",
      },
    ],
  },
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Премиальная практика»",
    subtitle: "Углублённая работа с телом, клиентом и ростом чека",
    href: "/premium",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Марина С.",
        city: "Краснодар",
        experience: "Массажист, 5 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/112b5e86-c667-4402-95cd-f9bfdc8b78fa.jpg",
        text: "После курса смогла поднять цену сеанса до 8 000–10 000 ₽. Клиенты сами рекомендуют меня другим — результат виден сразу.",
      },
      {
        name: "Алексей В.",
        city: "Новосибирск",
        experience: "Массажист, 4 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/21047f48-ac51-4882-9dc1-524a42b297d9.jpg",
        text: "Раньше боялся клиентов с травмами. Теперь это моя специализация. Запись расписана на 2 недели вперёд.",
      },
    ],
  },
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Промт Диалог — Эксперт»",
    subtitle: "Полная трансформация практики: от техник до личного бренда и масштаба",
    href: "/ekspert",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Виктория Л.",
        city: "Москва",
        experience: "Массажист, 6 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/65880344-a8ec-4179-98dd-57fd0987daea.jpg",
        text: "После первого же применения новых техник клиентка спросила: «Что вы сделали? Я чувствую себя совсем иначе!» Теперь это мой главный инструмент.",
      },
      {
        name: "Дмитрий С.",
        city: "Казань",
        experience: "Массажист, 2 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/47eae9d8-7b20-44ed-b6c8-4ae65573c872.jpg",
        text: "Думал, что это просто набор техник. Оказалось — настоящая система. Теперь у меня есть чёткий алгоритм на каждый случай и стабильная запись.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Стандарт»",
    subtitle: "Базовый инструментарий для выстраивания работы команды в салоне",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Ольга Т.",
        city: "Екатеринбург",
        experience: "Владелец салона, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c96d7f79-93a9-482f-ac37-642c699eb4d6.jpg",
        text: "Раньше каждая смена была непредсказуемой. После внедрения системы персонал работает по протоколу — клиенты довольны намного больше.",
      },
      {
        name: "Наталья К.",
        city: "Самара",
        experience: "Управляющий салоном, 4 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/5270fc42-b4e6-4984-81ad-9c36d6fc676d.jpg",
        text: "После обучения команды клиенты сразу замечают разницу и записываются повторно. Средний чек вырос без дополнительных вложений в рекламу.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Премиум салон»",
    subtitle: "Стандарты сервиса, удержание клиентов и управление командой",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Светлана Р.",
        city: "Воронеж",
        experience: "Владелец салона, 5 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/09e72c14-9676-46ea-a121-b14dd8d0f3fb.jpg",
        text: "Раньше не понимала, почему клиенты уходят. После системного обучения команды удержание выросло, а сарафанное радио заработало само.",
      },
      {
        name: "Игорь В.",
        city: "Ростов-на-Дону",
        experience: "Управляющий сетью, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/a36d13b4-6b16-4d9e-8560-4e49605cd690.jpg",
        text: "Скептически отнёсся — казалось, что всё это теория. Оказалось, что каждый инструмент реально применим. Эффект виден уже в первый месяц.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Промт Диалог Business»",
    subtitle: "Полное сопровождение: от обучения персонала до системы роста салона",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Анна В.",
        city: "Нижний Новгород",
        experience: "Владелец салона, 2 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/778f6c66-c5e7-4809-93f7-8577ff811a2c.jpg",
        text: "Боялась, что команда не примет изменения. Но всё прошло органично. Мастера сами стали работать иначе — клиенты чувствуют разницу.",
      },
      {
        name: "Роман Г.",
        city: "Уфа",
        experience: "Владелец сети, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/62e168f8-7414-4d56-a568-73b521de2781.jpg",
        text: "Результат виден уже через месяц. Персонал работает увереннее, клиенты возвращаются, выручка выросла без дополнительной рекламы.",
      },
    ],
  },
];