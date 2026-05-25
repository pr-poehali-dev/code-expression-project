import { useEffect, useRef, useState } from "react";

export const BLUE = "#4a9ebb";
export const BLUE_LIGHT = "rgba(74,158,187,0.10)";
export const BLUE_BORDER = "rgba(74,158,187,0.22)";
export const DARK = "#090e14";
export const DARK2 = "#0f1720";
export const DARK3 = "#141f2b";
export const DARK4 = "#1a2535";
export const TEXT = "#e4eaf0";
export const TEXT_SUB = "rgba(228,234,240,0.52)";
export const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

export function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

export function BlueLine() {
  return <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${BLUE}, transparent)`, borderRadius: 2, marginBottom: 20 }} />;
}

export function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

export const PAINS = [
  "Страх высоких цен и отказов",
  "Тревога перед обеспеченным клиентом",
  "Зависимость от чужого мнения",
  "Внутреннее напряжение в работе",
  "Эмоциональная нестабильность",
  "Неуверенность в своей ценности",
  "Страх продавать и называть цену",
  "Ощущение «я недостаточно хорош»",
];

export const RESULTS = [
  { icon: "Target",     title: "Уверенность", items: ["Спокойствие", "Внутренняя опора", "Устойчивость"] },
  { icon: "Settings2",  title: "Практика",    items: ["Системная работа", "Структура", "Профессиональное мышление"] },
  { icon: "Gem",        title: "Доход",        items: ["Повышение чека", "Платёжеспособные клиенты", "Стабильность"] },
  { icon: "Star",       title: "Репутация",    items: ["Доверие", "Рекомендации", "Ощущение профессионализма"] },
  { icon: "Wind",       title: "Состояние",    items: ["Меньше тревоги", "Меньше хаоса", "Контроль над практикой"] },
];

export const TOOLS = [
  {
    n: "01",
    title: "Интерактивная карта тела",
    sub: "Нажмите — получите сценарий работы",
    text: "Специалист нажимает на зону напряжения и получает возможные причины, эмоциональные связи, техники, видео и сценарий работы. Появляется уверенность — специалист больше не теряется.",
    effect: "Клиент чувствует глубину подхода и профессионализм",
  },
  {
    n: "02",
    title: "ИИ-анализатор клиента",
    sub: "Система строит план работы",
    text: "Анализирует симптомы, состояние и поведение клиента. Выдаёт гипотезы, план работы, техники и стратегию сопровождения. Специалист перестаёт работать хаотично.",
    effect: "Глубже работа → выше ценность → выше стоимость услуг",
  },
  {
    n: "03",
    title: "Конструктор техник",
    sub: "Персональный протокол за минуты",
    text: "Помогает быстро собирать персональные протоколы, упражнения и стабилизационные схемы. Специалист экономит время и работает структурно.",
    effect: "Клиент ощущает системность и уверенность специалиста",
  },
  {
    n: "04",
    title: "Диагностический калькулятор",
    sub: "Измеряет состояние клиента",
    text: "Оценивает стресс, выгорание, уровень перегрузки, тревогу и состояние нервной системы. Специалист работает точнее и отслеживает прогресс.",
    effect: "Повышает доверие и удержание клиентов",
  },
  {
    n: "05",
    title: "Симулятор диалогов",
    sub: "ИИ играет роль сложного клиента",
    text: "ИИ имитирует обеспеченного, тревожного или сопротивляющегося клиента. Специалист учится уверенно говорить, держать позицию и спокойно продавать.",
    effect: "Исчезает страх общения с дорогой аудиторией",
  },
];

export const MEETINGS_WORK = [
  "Мышление и самооценка",
  "Страх денег и продаж",
  "Внутреннее напряжение",
  "Позиционирование",
  "Уверенность в работе",
  "Эмоциональная устойчивость",
];

export const AFTER_MEETINGS = [
  "Спокойнее говорит о деньгах",
  "Перестаёт оправдываться",
  "Увереннее ведёт клиента",
  "Чувствует внутренний статус",
  "Начинает иначе воспринимать себя",
];