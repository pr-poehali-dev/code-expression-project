import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/7cedf2c0-f95b-4849-92be-6fb3944e25d1.jpg";

export const REVIEWS = [
  {
    name: "Анастасия К.",
    text: "Начала с нуля, через месяц уже принимала первых клиентов. Курс очень понятный, всё по шагам. Теперь это мой основной доход.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c207e068-8203-4f20-a40a-53d60df722e5.jpg",
  },
  {
    name: "Елена М.",
    text: "Долго сомневалась — нет образования, нет опыта. Но курс реально для новичков. За 3 недели освоила технику и уже зарабатываю.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/3618e920-2b36-438e-b312-f7f0874826c3.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1. Введение в анатомию и физиологию",
    lessons: [
      "Кодекс массажиста",
      "Основные термины и определения",
      "Плоскость, ось, направление тела",
      "Уровни организации тела: клетки, ткани, системы",
      "Взаимосвязь между дисфункциями органов и ОДА",
      "Основы биомеханики: сила, равновесие",
    ],
  },
  {
    title: "Модуль 2. Опорно-двигательная система",
    lessons: [
      "Структура и функции костей",
      "Основные группы мышц и связки",
    ],
  },
  {
    title: "Модуль 3. Нервная система",
    lessons: [
      "Центральная и периферическая нервная система",
      "Вегетативная нервная система: симпатическая и парасимпатическая",
    ],
  },
  {
    title: "Модуль 4. Сердечно-сосудистая и лимфатическая системы",
    lessons: [
      "Кровеносная система: сердце, сосуды",
      "Лимфатическая система: сосуды и узлы",
    ],
  },
  {
    title: "Модуль 5. Внутренние органы и связь с ОДА",
    lessons: [
      "Органы грудной клетки и брюшной полости",
      "Органы малого таза",
    ],
  },
  {
    title: "Модуль 6. Фасции и соединительная ткань",
    lessons: [
      "Структура фасций",
      "Миофасциальные цепи",
      "Дисфункции фасций",
      "Техники работы с фасциями",
    ],
  },
  {
    title: "Модуль 7. Интеграция знаний в практике массажа",
    lessons: [
      "Анализ клинических случаев",
      "Техники коррекции дисфункций",
    ],
  },
  {
    title: "Модуль 8. Психосоматика и массаж",
    lessons: [
      "Влияние эмоционального состояния на физическое здоровье",
      "Психосоматические расстройства и их связь с массажем",
      "Техники работы с эмоциональными блоками",
    ],
  },
  {
    title: "Модуль 9. Этические и правовые аспекты",
    lessons: [
      "Профессиональная этика массажиста",
      "Правовые аспекты практики массажа",
      "Взаимодействие с клиентами: доверие и безопасность",
    ],
  },
  {
    title: "Итоговая проверка",
    lessons: ["Итоговая работа"],
  },
  {
    title: "Видеоуроки: диагностика и регуляция",
    lessons: [
      "Первый приём. Диагностика — осмотр пациента",
      "Запуск большеберцовой и малоберцовой костей",
      "Заземление опорно-двигательного аппарата",
      "Регулирование и подъём диафрагмы",
      "Подъём внутренних органов (висцероптоз)",
      "Освобождение лёгких: восстановление дыхательного объёма",
      "Выравнивание грудной клетки",
      "Запуск гипоталамуса",
      "Теменная зона: ключ к гармонии и восстановлению",
      "Воздействие на височно-нижнечелюстной сустав",
      "Освобождение лобных долей",
      "Сила затылочной части",
      "Мягкие техники коррекции шейных позвонков",
      "Атлант: основы здоровья и поддержки жизни",
      "Снимаем блок плечевого пояса",
      "Разгоняем лимфу",
      "Регуляция эмоционально-психологического состояния",
      "Запуск парасимпатической системы",
      "Второй день приёма. Пальпация позвоночника",
      "Поясничный отдел: восстановление и коррекция",
      "Правка крестцового отдела позвоночника",
      "Правка позвонков",
      "Запуск кишечника",
      "Работа с остистыми лопаток",
      "Манипуляции на верхнем грудном отделе",
      "Воздействие на сколиоз",
      "Регуляция движений рёбер",
      "Запуск ОДА",
    ],
  },
  {
    title: "Видеоуроки: работа с мышцами",
    lessons: [
      "Восстановление функций большой грудной мышцы",
      "Восстановление функции широчайшей мышцы",
      "Восстановление среднего пучка дельтовидной мышцы",
      "Восстановление надостной и подостной мышц",
      "Восстановление функций поднимателей лопаток",
      "Восстановление функции малой грудной мышцы",
      "Подлопаточная мышца",
      "Классическая скрутка",
      "Классическая скрутка 2",
      "Мягкая толчковая коррекция ГОП",
      "Коррекция позвонков поясничного отдела (устранение компрессии)",
      "Воздействие на группы мышц малого таза",
      "Воздействие на подвздошно-поясничную мышцу и переднюю линию бедра",
      "Воздействие на сгибатели и разгибатели голени",
      "Воздействие на сгибатели и разгибатели стоп",
      "Восстановление функции мышц-ротаторов ног",
      "Основы медицинского массажа: введение",
      "Анатомия и физиология (медицинский массаж)",
      "Техники медицинского массажа",
      "Программы медицинского массажа",
      "Практические занятия",
    ],
  },
  {
    title: "Заболевания",
    lessons: [
      "Диагноз позвоночника",
      "Заболевания мышц",
      "Заболевания суставов",
      "Общие заболевания: термины и клинические проявления",
    ],
  },
  {
    title: "Бонусные модули",
    lessons: [
      "Коррекция фигуры: диагностика и техники",
      "Привлекаем клиентов бесплатно через купонаторы",
      "Выбор платформы: Biglion и Groupon",
      "Создание привлекательного предложения",
      "Техническая настройка купона",
      "Продвижение купона за пределами платформы",
      "Конвертация клиентов из купонаторов в постоянных",
      "Анализ эффективности и корректировка стратегии",
      "Кейсы и разбор ошибок",
      "Как увеличить прибыль в 3 раза",
      "Этика и долгосрочная репутация",
      "Практика в учебном кабинете: мастермайнды",
    ],
  },
];

export const FAQS = [
  {
    q: "Нужен ли медицинский диплом?",
    a: "Нет. Курс разработан специально для людей без медицинского образования. Вы получите всё необходимое для безопасной работы.",
  },
  {
    q: "Смогу ли я без опыта?",
    a: "Да. Курс начинается с самых основ — подойдёт абсолютному новичку. Всё объяснено пошагово с практическими заданиями.",
  },
  {
    q: "Сколько времени занимает обучение?",
    a: "В среднем 3–4 недели при обучении 1–2 часа в день. Доступ к материалам не ограничен по времени.",
  },
  {
    q: "Когда я смогу начать зарабатывать?",
    a: "Многие студенты принимают первых клиентов уже в процессе обучения — в конце курса есть специальный модуль по привлечению клиентов.",
  },
];

export const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

const BUY_URL = "https://school.brossok.ru/buy/15";

export function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={BUY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block",
        textDecoration: "none",
        background: h ? ACCENT_DARK : ACCENT,
        color: "#fff",
        borderRadius: 12,
        padding: "14px 32px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`,
        transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >{children}</a>
  );
}

export function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={BUY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block",
        textDecoration: "none",
        background: "transparent",
        color: h ? ACCENT_DARK : ACCENT,
        border: `2px solid ${ACCENT}`,
        borderRadius: 12,
        padding: "13px 32px",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        transition: "all 0.2s",
        ...style,
      }}
    >{children}</a>
  );
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#1a1a1a",
          textAlign: "left",
          gap: 12,
        }}
      >
        {title}
        <span style={{
          color: ACCENT,
          flexShrink: 0,
          transition: "transform 0.25s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          fontSize: 22,
          lineHeight: 1,
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 2000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

export function CtaBar() {
  return (
    <div style={{ margin: "60px 0 0", background: "#fff", borderTop: "1px solid #e8e8e4", borderBottom: "1px solid #e8e8e4" }}>
      <style>{`
        .ctabar-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; max-width: 1100px; margin: 0 auto; padding: 28px 24px; }
        .ctabar-btns { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        @media (max-width: 600px) {
          .ctabar-inner { flex-direction: column; align-items: flex-start; }
          .ctabar-btns { width: 100%; flex-direction: column; gap: 10px; }
          .ctabar-btns a { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>
      <div className="ctabar-inner">
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Профессия массажист с нуля</div>
          <div style={{ color: "#999", fontSize: 13 }}>Начните уже сегодня</div>
        </div>
        <div className="ctabar-btns">
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>19 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}