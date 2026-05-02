import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const BUY_URL = "https://school.brossok.ru/buy/50";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/aa3d4e14-5971-4c16-9a36-374f1b9e9b68.jpg";
export const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png";

export const REVIEWS = [
  {
    name: "Ольга Т.",
    text: "Раньше каждый сеанс был стрессом — не знала, что делать дальше. Теперь работаю по протоколу, уверенно и быстро. Клиенты довольны намного больше.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/efe7662b-d610-49cd-908c-2a2357fd7512.jpg",
  },
  {
    name: "Дмитрий С.",
    text: "Купил курс скептически — думал, что это просто набор техник. Оказалось, что это именно система. Теперь у меня есть чёткий алгоритм на каждый случай.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/47eae9d8-7b20-44ed-b6c8-4ae65573c872.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1: Логика протоколов",
    lessons: ["Как строится грамотный сеанс", "Основные принципы системной работы"],
  },
  {
    title: "Модуль 2: Работа с болью в спине",
    lessons: ["Готовый протокол работы", "Практика и разбор случаев"],
  },
  {
    title: "Модуль 3: Работа с шеей и зажимами",
    lessons: ["Пошаговый протокол", "Частые ошибки и как их избежать"],
  },
  {
    title: "Модуль 4: Антистресс-протокол",
    lessons: ["Работа с нервным напряжением", "Техники глубокого расслабления"],
  },
  {
    title: "Модуль 5: Универсальные схемы",
    lessons: ["Быстрые решения под разные запросы", "Адаптация протокола под клиента"],
  },
];

export const FAQS = [
  {
    q: "Подойдёт ли курс новичку?",
    a: "Да. Курс рассчитан на тех, у кого уже есть базовые навыки массажа. Новичкам лучше начать с курса «Профессия массажист с нуля».",
  },
  {
    q: "Можно ли применять сразу?",
    a: "Да. Протоколы составлены так, чтобы их можно было применять на клиентах уже после первого модуля.",
  },
  {
    q: "Сколько времени нужно на обучение?",
    a: "В среднем 2–3 недели при занятиях 1–2 часа в день. Доступ к материалам бессрочный.",
  },
  {
    q: "Подходит ли для разных клиентов?",
    a: "Да. Курс даёт универсальные схемы, которые легко адаптируются под разные запросы и типы клиентов.",
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Готовые протоколы массажа</div>
          <div style={{ color: "#999", fontSize: 13 }}>Работайте уверенно с первого сеанса</div>
        </div>
        <div className="ctabar-btns">
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 400, color: "#aaa", textDecoration: "line-through" }}>19 900 ₽</span>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>5 970 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}