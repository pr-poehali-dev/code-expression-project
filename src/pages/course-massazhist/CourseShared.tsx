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
    title: "Модуль 1: Введение в профессию",
    lessons: ["Основы массажа и анатомия", "Подготовка рабочего места"],
  },
  {
    title: "Модуль 2: Базовые техники",
    lessons: ["Основные приёмы массажа", "Отработка техник на практике"],
  },
  {
    title: "Модуль 3: Работа с клиентом",
    lessons: ["Общение и доверие клиента", "Безопасность и противопоказания", "Структура полного сеанса"],
  },
  {
    title: "Модуль 4: Практика",
    lessons: ["Сборка полного сеанса от А до Я", "Частые ошибки и как их избежать"],
  },
  {
    title: "Модуль 5: Первые деньги",
    lessons: ["Как найти первых клиентов", "Как назначить цену и начать зарабатывать"],
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

export function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? ACCENT_DARK : ACCENT,
        color: "#fff",
        border: "none",
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
    >{children}</button>
  );
}

export function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
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
    >{children}</button>
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
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

export function CtaBar() {
  return (
    <div style={{ margin: "60px 0 0", background: "#fff", borderTop: "1px solid #e8e8e4", borderBottom: "1px solid #e8e8e4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Профессия массажист с нуля</div>
          <div style={{ color: "#999", fontSize: 13 }}>Начните уже сегодня</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>19 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}
