import { useEffect, useRef, useState } from "react";

// ── Палитра: тёмный тил + мягкий туман ──────────────────────────────────────
export const DARK  = "#07090c";
export const DARK2 = "#0b0f14";
export const DARK3 = "#0f1520";
export const DARK4 = "#141c28";

export const TEAL       = "hsl(185, 80%, 52%)";   // акцент
export const TEAL_DARK  = "hsl(185, 80%, 40%)";
export const TEAL_GLASS = "rgba(0,198,188,0.07)";
export const TEAL_BORD  = "rgba(0,198,188,0.18)";

export const TEXT     = "#dde6ee";
export const TEXT_SUB = "rgba(210,225,235,0.50)";

export const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

// ── Анимация появления ───────────────────────────────────────────────────────
export function useInView(threshold = 0.07) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

export function TealLine() {
  return <div style={{ width: 36, height: 2, background: `linear-gradient(90deg, ${TEAL}, transparent)`, borderRadius: 2, marginBottom: 20 }} />;
}

// ── Данные ───────────────────────────────────────────────────────────────────

export const PAIN_ITEMS = [
  "Много знаний — мало денег",
  "Страх повышать стоимость",
  "Хаос в практике",
  "Постоянная тревога",
  "Эмоциональная нестабильность",
  "Страх продаж",
  "Отсутствие системы",
  "Выгорание",
  "Зависимость от настроения клиентов",
];

export const INSIGHTS = [
  "Почему хорошие специалисты мало зарабатывают",
  "Почему клиент чувствует внутреннее состояние специалиста",
  "Как формируется доверие — и почему оно не про техники",
  "Почему хаос разрушает практику изнутри",
  "Как мышление напрямую влияет на доход",
  "Почему уверенность важнее количества техник",
];

export const VIDEO_BLOCKS = [
  {
    n: "01",
    title: "Почему специалисты не растут",
    desc: "Внутренние ограничения, страх денег, хаос и эмоциональная нестабильность — разбираем корень проблемы.",
  },
  {
    n: "02",
    title: "Как думает специалист нового поколения",
    desc: "Уверенность, системность, спокойствие, профессиональная позиция — новая модель мышления.",
  },
  {
    n: "03",
    title: "Работа с платёжеспособной аудиторией",
    desc: "Как богатые люди считывают специалиста. Почему важна внутренняя устойчивость. Ошибки коммуникации.",
  },
  {
    n: "04",
    title: "Разборы реальных ситуаций",
    desc: "Примеры из практики, ошибки специалистов, рост практики, изменения состояния.",
  },
  {
    n: "05",
    title: "Демонстрация платформы",
    desc: "ИИ-инструменты, диагностика, карта тела, аналитические системы, сопровождение клиента.",
  },
];

export const PLATFORM_TOOLS = [
  { label: "Интерактивная карта тела", desc: "Визуальные взаимосвязи и логика работы" },
  { label: "ИИ-анализатор клиента",    desc: "Симптомы, стресс, стратегия работы" },
  { label: "Диагностические системы",  desc: "Оценка состояния и динамика изменений" },
  { label: "Конструктор техник",        desc: "Персональные протоколы и последовательности" },
];

export const AFTER_FREE = [
  { area: "Мышление",  items: ["Появляется ясность", "Понимание своих ограничений", "Ощущение ценности себя"] },
  { area: "Состояние", items: ["Меньше тревоги", "Больше уверенности", "Ощущение направления"] },
  { area: "Практика",  items: ["Понимание системной работы", "Ценность клиента", "Своя роль специалиста"] },
  { area: "Финансы",   items: ["Почему сложно повышать чек", "Связь мышления и дохода"] },
];

export const TARIFS = [
  { title: "Практика",              price: "90 900 ₽",  href: "/praktika",  note: "Тариф №1" },
  { title: "Премиальная практика",  price: "290 000 ₽", href: "/premium",   note: "Тариф №2" },
  { title: "Dok Диалог Эксперт",   price: "500 000 ₽", href: "/ekspert",   note: "Тариф №3 · VIP" },
];
