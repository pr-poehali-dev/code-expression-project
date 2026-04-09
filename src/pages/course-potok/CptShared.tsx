import { useState } from "react";

export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const BG = "#f8f8f6";
export const COURSE_URL = "https://school.brossok.ru/training/view/-laquo-massaghist-2-0-sozdanie-i-prodvighenie-lichnogo-brenda-raquo-";
export const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/217850e4-84f3-47e2-bb32-208b4fdff715.jpg";

export const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

export const REVIEWS = [
  {
    name: "Ксения М.",
    text: "До курса у меня было 3–4 клиента в месяц. Через 6 недель — стабильная запись на 3 недели вперёд. Теперь я планирую доход, а не жду «повезёт или нет».",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/86c97297-9734-4b88-a25c-081613ef18ff.jpg",
  },
  {
    name: "Артём В.",
    text: "Скептически относился к «маркетингу для массажистов». Но курс — это конкретные шаги, а не теория. Первых клиентов получил ещё в процессе обучения.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/61d79a41-ee5a-422e-b4d7-8f401bd382d4.jpg",
  },
];

export const MODULES = [
  {
    title: "Модуль 1: Система привлечения клиентов",
    lessons: ["Основные каналы для массажиста", "Реальные примеры и кейсы"],
  },
  {
    title: "Модуль 2: Система записи",
    lessons: ["Организация расписания", "Автоматизация и упрощение процесса"],
  },
  {
    title: "Модуль 3: Общение с клиентом",
    lessons: ["Готовые скрипты для переписки и звонков", "Работа с возражениями"],
  },
  {
    title: "Модуль 4: Удержание клиентов",
    lessons: ["Повторные продажи и абонементы", "Рекомендации и программы лояльности"],
  },
  {
    title: "Модуль 5: Практика",
    lessons: ["Планирование первого месяца", "Сборка системы «от 0 до стабильной записи»"],
  },
];

export const FAQS = [
  {
    q: "Сколько времени до первых клиентов?",
    a: "При активном внедрении — первые результаты уже в течение 2–4 недель. Многие студенты получают клиентов ещё в процессе обучения.",
  },
  {
    q: "Можно ли использовать другие каналы?",
    a: "Да. Курс даёт универсальную систему, которую легко адаптировать под любые каналы — соцсети, сарафанное радио, онлайн-площадки.",
  },
  {
    q: "Подойдёт новичку?",
    a: "Да, курс создан для тех, кто начинает с нуля. Пошаговая система подходит даже без опыта в продвижении.",
  },
  {
    q: "Можно ли совмещать с другими курсами?",
    a: "Да. Этот курс отлично дополняет любые технические курсы по массажу — даёт систему, чтобы навыки приносили доход.",
  },
];

export function BtnStart({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const [h, setH] = useState(false);
  return (
    <a href={COURSE_URL} target="_blank" rel="noopener noreferrer"
      className={className}
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
      <div className="cpt-ctabar">
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Массажист с потоком клиентов</div>
          <div style={{ color: "#999", fontSize: 13 }}>От 0 до стабильной записи</div>
        </div>
        <BtnStart>Начать бесплатно</BtnStart>
      </div>
    </div>
  );
}
