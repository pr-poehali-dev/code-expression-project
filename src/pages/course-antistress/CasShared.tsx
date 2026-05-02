import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const BUY_URL = "https://school.brossok.ru/buy/42";

export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/2140080c-7bbd-4e14-912f-70dc189744e8.jpg";
export const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png";

export const REVIEWS = [
  {
    name: "Виктория Л.",
    text: "После первого же применения антистресс-техник клиентка спросила: «Что вы сделали? Я чувствую себя совсем иначе!» Теперь это мой главный инструмент.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/65880344-a8ec-4179-98dd-57fd0987daea.jpg",
  },
  {
    name: "Игорь В.",
    text: "Скептически отнёсся к курсу — казалось, что это что-то эзотерическое. Оказалось, чистая физиология. Эффект виден буквально в течение сеанса.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/34f37a77-7f2a-4861-be43-5b734ab83a18.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1: Основы ВНС",
    lessons: ["Как работает вегетативная нервная система", "Почему антистресс-техники усиливают эффект массажа"],
  },
  {
    title: "Модуль 2: Простые техники",
    lessons: ["5 базовых приёмов работы с ВНС", "Демонстрация работы на практике"],
  },
  {
    title: "Модуль 3: Усиление эффекта",
    lessons: ["Комбинации техник для максимального результата", "Подстройка под тип клиента"],
  },
  {
    title: "Модуль 4: Практика",
    lessons: ["Полный антистресс-сеанс от начала до конца", "Частые ошибки и как их избежать"],
  },
];

export const FAQS = [
  {
    q: "Подходит новичкам?",
    a: "Да. Техники просты в освоении и не требуют специальной подготовки. Подойдут массажистам любого уровня.",
  },
  {
    q: "Сколько времени на освоение?",
    a: "Базовые приёмы осваиваются за 1–2 дня. Полный курс — 1–2 недели при занятиях 1 час в день.",
  },
  {
    q: "Можно ли комбинировать с другими техниками?",
    a: "Да, и именно для этого курс создан. Техники легко встраиваются в любой вид массажа и усиливают его эффект.",
  },
  {
    q: "Сразу применять на сеансе?",
    a: "Да. Уже после первого модуля можно применять базовые приёмы на клиентах и видеть результат.",
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Антистресс-техники массажа</div>
          <div style={{ color: "#999", fontSize: 13 }}>Удивите клиента уже на первом сеансе</div>
        </div>
        <div className="ctabar-btns">
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 400, color: "#aaa", textDecoration: "line-through" }}>14 900 ₽</span>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>4 470 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}