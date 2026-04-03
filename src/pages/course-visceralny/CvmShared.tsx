import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const BUY_URL = "https://school.brossok.ru/buy/55";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/253605ec-f2b1-4a6e-92f9-96181a4448cf.jpg";

export const REVIEWS = [
  {
    name: "Анна В.",
    text: "Боялась работать с органами — казалось, это только для врачей. После курса провела первый сеанс уже через неделю. Клиенты чувствуют результат.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d2103950-a0da-42f1-a62c-1942d76ff96b.jpg",
  },
  {
    name: "Роман Г.",
    text: "Курс очень доступный. Всё объяснено понятно, без медицинского жаргона. Техники простые, но реально работают — клиенты замечают разницу.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/51706198-ca05-4542-b459-8a934cfb8116.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1: Основы висцеральной терапии",
    lessons: ["Анатомия и принципы работы внутренних органов", "Безопасность и противопоказания"],
  },
  {
    title: "Модуль 2: Базовые техники",
    lessons: ["Простейшие приёмы висцерального массажа", "Видео-практика с пошаговым разбором"],
  },
  {
    title: "Модуль 3: Полный сеанс",
    lessons: ["Сборка протокола от начала до конца", "Частые ошибки новичков и как их избежать"],
  },
  {
    title: "Модуль 4: Практика на клиенте",
    lessons: ["Пошаговое руководство первого приёма", "Подготовка к работе с реальными клиентами"],
  },
];

export const FAQS = [
  {
    q: "Подходит ли новичкам?",
    a: "Да. Курс создан специально для начинающих без медицинского образования. Все техники объяснены доступно и пошагово.",
  },
  {
    q: "Сколько времени на освоение?",
    a: "1–2 недели при занятиях 1 час в день. Доступ к материалам бессрочный — возвращайтесь в любое время.",
  },
  {
    q: "Можно ли применять сразу?",
    a: "Да. Уже после второго модуля вы сможете применять базовые приёмы. В последнем модуле — готовый протокол для первого приёма.",
  },
  {
    q: "Что делать при сомнениях?",
    a: "В курсе подробно разобраны противопоказания и ситуации, когда нужно остановиться. Вы будете работать уверенно и безопасно.",
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
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
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
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Висцеральный массаж с нуля</div>
          <div style={{ color: "#999", fontSize: 13 }}>Безопасный старт без медобразования</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>4 990 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}
