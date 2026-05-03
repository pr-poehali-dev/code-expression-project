import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const BUY_URL = "https://school.brossok.ru/buy/5";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/31ba4247-0ef8-483d-b086-1ae129072ef5.jpg";
export const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png";

export const REVIEWS = [
  {
    name: "Марина С.",
    text: "После курса смогла поднять цену сеанса с 2 000 до 3 500 ₽. Клиенты сами рекомендуют меня другим — результат виден сразу.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/112b5e86-c667-4402-95cd-f9bfdc8b78fa.jpg",
  },
  {
    name: "Алексей В.",
    text: "Раньше боялся клиентов с травмами. Теперь это моя специализация. Запись расписана на 2 недели вперёд.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/21047f48-ac51-4882-9dc1-524a42b297d9.jpg",
  },
];

export const MODULES = [
  {
    title: "Мануальная терапия позвоночника",
    lessons: [
      "Общие вопросы мануальной терапии позвоночника",
      "Технические приёмы мануальной терапии",
      "Анатомо-физиологические особенности и биодинамика позвоночника",
      "Особенности грудного отдела позвоночника",
      "Анатомо-физиологические особенности поясничного отдела",
      "Анатомо-физиологические особенности крестцового отдела",
      "Анатомо-физиологические особенности копчика",
      "Мануальная терапия суставов верхних конечностей",
      "Терапия суставов нижних конечностей",
      "Постизометрическая релаксация (ПИР) мышц",
      "Мануальная терапия височно-челюстного сустава и мышц лица",
      "Особенности применения мануальной терапии",
    ],
  },
  {
    title: "Мануальная терапия внутренних органов",
    lessons: [
      "Общие вопросы мануальной терапии внутренних органов",
      "Физиология полости живота и таза",
      "Нарушение висцеральной подвижности",
      "Техника приёмов",
      "Принципы лечения и диагностики",
      "Мануальная терапия желудка",
      "Терапия тонкого кишечника",
      "Терапия толстого кишечника",
      "Мануальная терапия печени",
      "Мануальная терапия желчного пузыря",
      "Мануальная терапия поджелудочной железы",
      "Мануальная терапия почек",
      "Мануальная терапия мочевого пузыря",
      "Мануальная терапия женской половой сферы",
      "Внутривлагалищные гинекологические манипуляции",
      "Мануальная терапия органов грудной клетки",
    ],
  },
  {
    title: "Практика в учебном кабинете",
    lessons: ["Мастермайнды — живая практика после онлайн-курса"],
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
    title: "Бонус: остеопатические техники (видеоуроки)",
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
    title: "Бонус: регуляция вегетативной нервной системы",
    lessons: [
      "Цель и план",
      "Представьте внутренний оркестр",
      "Симпатика и парасимпатика",
      "Где живёт гипертонус?",
      "Тепло, холод, отёки",
      "Нейрогенное воспаление",
      "Напряжение за гранью мышц",
      "Стресс",
      "Как ваши руки говорят с автономным дирижёром",
      "Работа с клиентом",
      "Практика. 1 этап",
      "Практика. 2 этап",
    ],
  },
];

export const FAQS = [
  {
    q: "Подойдёт ли курс без медицинского образования?",
    a: "Да. Курс объясняет анатомию и физиологию в доступной форме. Специального медицинского образования не требуется.",
  },
  {
    q: "Насколько сложные техники?",
    a: "Техники разобраны пошагово, с демонстрацией. Курс рассчитан на практикующих массажистов, поэтому базовые навыки уже должны быть.",
  },
  {
    q: "Сколько времени занимает обучение?",
    a: "В среднем 4–6 недель при обучении 1–2 часа в день. Доступ к материалам бессрочный.",
  },
  {
    q: "Можно ли применять сразу?",
    a: "Да. После каждого модуля есть практические задания, которые можно применять на клиентах уже в процессе обучения.",
  },
];

export const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

export function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: h ? ACCENT_DARK : ACCENT, color: "#fff",
        borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`, transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)", ...style,
      }}
    >{children}</a>
  );
}

export function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: "transparent", color: h ? ACCENT_DARK : ACCENT,
        border: `2px solid ${ACCENT}`, borderRadius: 12, padding: "13px 32px",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s", ...style,
      }}
    >{children}</a>
  );
}

export function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", padding: "18px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 15,
        fontWeight: 600, color: "#1a1a1a", textAlign: "left", gap: 12,
      }}>
        {title}
        <span style={{ color: ACCENT, flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)", fontSize: 22, lineHeight: 1 }}>+</span>
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Восстановительный массаж PRO</div>
          <div style={{ color: "#999", fontSize: 13 }}>Переход на новый уровень дохода</div>
        </div>
        <div className="ctabar-btns">
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>39 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}