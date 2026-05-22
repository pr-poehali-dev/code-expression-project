import { useEffect, useRef, useState } from "react";

export const PEARL = "#d4cfc8";
export const PEARL_LIGHT = "rgba(212,207,200,0.08)";
export const PEARL_BORDER = "rgba(212,207,200,0.18)";
export const DARK = "#07090c";
export const DARK2 = "#0c1018";
export const DARK3 = "#111620";
export const DARK4 = "#161d28";
export const TEXT = "#dde2e8";
export const TEXT_SUB = "rgba(221,226,232,0.50)";
export const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

export function useInView(threshold = 0.07) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
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
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 1s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 1s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

export function PearlLine() {
  return <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${PEARL}, transparent)`, borderRadius: 2, marginBottom: 20 }} />;
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

export const PAINS = [
  "Боятся повышать стоимость",
  "Эмоционально зависят от клиента",
  "Не чувствуют устойчивости",
  "Быстро выгорают",
  "Работают без системы",
  "Не умеют удерживать дорогих клиентов",
  "Ощущают внутренний страх и хаос",
  "Не чувствуют себя «достаточно хорошими»",
];

export const MEETINGS_TOPICS = [
  "Работа с мышлением и самооценкой",
  "Страх денег и внутренних ограничений",
  "Внутренняя ценность специалиста",
  "Уверенность в работе и коммуникации",
  "Эмоциональная устойчивость",
  "Самопрезентация и позиционирование",
  "Разборы практики",
  "Стратегия роста",
];

export const AFTER_MEETINGS = [
  "Начинает иначе воспринимать себя",
  "Спокойнее работает с деньгами",
  "Увереннее общается с клиентами",
  "Чувствует внутреннюю устойчивость",
  "Перестаёт эмоционально зависеть от клиентов",
];

export const TOOLS = [
  {
    n: "01",
    title: "ИИ-анализатор клиента",
    sub: "Строит стратегию работы",
    text: "Анализирует состояние клиента, симптомы, эмоциональный фон и стрессовые паттерны. Формирует гипотезы, стратегии, техники и план сопровождения.",
    effect: "Уверенность перед сложными случаями — глубже работа, выше ценность",
  },
  {
    n: "02",
    title: "Интерактивная карта тела",
    sub: "Взаимосвязи и логика работы",
    text: "Позволяет быстро находить взаимосвязи, понимать причины напряжения и выстраивать логику работы с клиентом. Клиент чувствует структуру и профессионализм.",
    effect: "Ощущение контроля, уверенность, системное мышление",
  },
  {
    n: "03",
    title: "ИИ-конструктор техник",
    sub: "Персональные протоколы",
    text: "Создаёт персональные схемы работы, техники, последовательности и протоколы сопровождения. Специалист быстрее работает и меньше теряется.",
    effect: "Профессиональная опора — меньше сомнений, больше результата",
  },
  {
    n: "04",
    title: "Диагностический калькулятор",
    sub: "Аналитика состояния клиента",
    text: "Оценивает стресс, выгорание, перегрузку и уровень восстановления. Специалист работает точнее и отслеживает динамику изменений.",
    effect: "Профессиональная аналитика повышает доверие и удержание",
  },
  {
    n: "05",
    title: "Симулятор премиальных клиентов",
    sub: "ИИ моделирует сложные диалоги",
    text: "ИИ играет роль обеспеченного, сложного или эмоционально давящего клиента. Специалист тренирует спокойствие, удержание позиции и уверенную коммуникацию.",
    effect: "Исчезает страх — появляется навык работы с дорогой аудиторией",
  },
];

export const RESULTS = [
  { icon: "🧠", title: "Мышление", items: ["Внутренняя устойчивость", "Уверенность", "Спокойствие"] },
  { icon: "⚙️", title: "Практика", items: ["Системная работа", "Высокий уровень сопровождения", "Профессиональная глубина"] },
  { icon: "💎", title: "Финансы", items: ["Повышение чека", "Стабильность", "Платёжеспособная аудитория"] },
  { icon: "⭐", title: "Репутация", items: ["Доверие", "Рекомендации", "Сильное позиционирование"] },
  { icon: "🌊", title: "Состояние", items: ["Меньше тревоги", "Больше контроля", "Внутренняя свобода"] },
];
