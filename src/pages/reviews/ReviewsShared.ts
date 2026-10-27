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

export const VIDEO_SECTIONS: VideoSection[] = [
  {
    title: "Прохождение онлайн-курса",
    subtitle: "Специалисты о результатах после прохождения курса «Промт Диалог»",
    href: "/tseny",
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
    href: "/tseny",
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
