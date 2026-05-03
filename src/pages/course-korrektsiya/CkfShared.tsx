import { useState } from "react";
import DiscountTimer from "@/components/ui/DiscountTimer";
import { useDiscountTimer } from "@/hooks/useDiscountTimer";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const BUY_URL = "https://school.brossok.ru/buy/43";
export const BUY_URL_DISCOUNT = "https://school.brossok.ru/buy/76";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/48178e7f-9d80-4fe1-8203-784003be647f.jpg";
export const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png";

export const REVIEWS = [
  {
    name: "Наталья К.",
    text: "После первого же сеанса по новым протоколам клиентка заметила разницу и сразу записалась на курс процедур. Теперь это моё главное направление.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/112518bb-004d-4e73-9db4-b2736ba4d343.jpg",
  },
  {
    name: "Светлана Р.",
    text: "Раньше не знала, как брать за работу с фигурой дорого — казалось, нет достаточного результата. После курса стала брать в 2 раза больше и получила стабильную запись.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c8c5855a-5d6a-44bf-b945-53801faf181c.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1: Основы коррекции фигуры",
    lessons: ["Структура тела и жировой ткани", "Основные принципы уменьшения объёмов"],
  },
  {
    title: "Модуль 2: Сухие техники",
    lessons: ["Протоколы уменьшения объёмов", "Работа с целлюлитом и отёками"],
  },
  {
    title: "Модуль 3: Комплекс процедур",
    lessons: ["Полный сеанс коррекции от начала до конца", "Частые ошибки и как их избежать"],
  },
  {
    title: "Модуль 4: Индивидуальный подход",
    lessons: ["Подбор связок техник под тип клиента", "Адаптация протокола по запросу"],
  },
];

export const FAQS = [
  {
    q: "Подходит ли новичкам?",
    a: "Да. Все техники объяснены пошагово и не требуют предварительного опыта в коррекции фигуры.",
  },
  {
    q: "Сколько времени занимает обучение?",
    a: "В среднем 2–3 недели при занятиях 1–2 часа в день. Доступ к материалам бессрочный.",
  },
  {
    q: "Можно ли комбинировать с другими техниками?",
    a: "Да. Техники коррекции фигуры легко встраиваются в существующую практику и усиливают её эффект.",
  },
  {
    q: "Какие результаты гарантированы?",
    a: "При правильном применении протоколов клиенты видят визуальный результат уже после первого сеанса — уменьшение отёков и улучшение контуров.",
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
  const { isActive } = useDiscountTimer();
  return (
    <a href={isActive ? BUY_URL_DISCOUNT : BUY_URL} target="_blank" rel="noopener noreferrer"
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
  const { isActive } = useDiscountTimer();
  return (
    <a href={isActive ? BUY_URL_DISCOUNT : BUY_URL} target="_blank" rel="noopener noreferrer"
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
  const { isActive } = useDiscountTimer();
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Коррекция фигуры</div>
          <div style={{ color: "#999", fontSize: 13 }}>Видимый результат с первого сеанса</div>
        </div>
        <div className="ctabar-btns">
          {isActive ? (
            <DiscountTimer oldPrice="16 900 ₽" newPrice="5 070 ₽" accent={ACCENT} size="sm" />
          ) : (
            <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>16 900 ₽</span>
          )}
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}