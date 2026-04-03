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
    title: "Модуль 1: Основы восстановления",
    lessons: ["Причины болей и механизмы их возникновения", "Логика работы с телом: от симптома к причине"],
  },
  {
    title: "Модуль 2: Позвоночник и суставы",
    lessons: ["Диагностика состояния позвоночника", "Практические техники работы с суставами"],
  },
  {
    title: "Модуль 3: Мышцы и связки",
    lessons: ["Техники работы с мышечными зажимами", "Восстановление после нагрузок и травм"],
  },
  {
    title: "Модуль 4: Внутренние органы",
    lessons: ["Основы работы с висцеральной системой", "Безопасные техники и противопоказания"],
  },
  {
    title: "Модуль 5: Практика",
    lessons: ["Сборка полноценного восстановительного сеанса", "Частые ошибки и как их избежать"],
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Восстановительный массаж PRO</div>
          <div style={{ color: "#999", fontSize: 13 }}>Переход на новый уровень дохода</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>39 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}
