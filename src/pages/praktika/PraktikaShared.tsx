import { useEffect, useRef, useState } from "react";

export const GOLD = "#c9a96e";
export const GOLD_LIGHT = "rgba(201,169,110,0.12)";
export const DARK = "#0f1419";
export const DARK2 = "#161d24";
export const DARK3 = "#1e2730";
export const TEXT = "#e8e8e8";
export const TEXT_SUB = "rgba(232,232,232,0.55)";
export const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0, up = true, style = {} }: { children: React.ReactNode; delay?: number; up?: boolean; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : up ? "translateY(32px)" : "translateY(0)",
      transition: `opacity 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

export function GoldLine() {
  return <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)`, borderRadius: 2, marginBottom: 20 }} />;
}

export const PAINS = [
  "Много знаний — мало клиентов",
  "Страх называть цену",
  "Работа на грани выживания",
  "Хаос в практике, нет системы",
  "Эмоциональное выгорание",
  "Страх работать с обеспеченными людьми",
  "Тревога и неуверенность в себе",
  "Зависимость от каждого клиента",
  "Отсутствие внутренней опоры",
];

export const CHANGES = [
  {
    icon: "Brain",
    title: "Мышление",
    items: ["Появляется уверенность", "Исчезает хаос", "Формируется профессиональная позиция"],
  },
  {
    icon: "TrendingUp",
    title: "Доход",
    items: ["Повышение стоимости услуг", "Более платёжеспособные клиенты", "Стабильность практики"],
  },
  {
    icon: "Star",
    title: "Репутация",
    items: ["Клиент начинает доверять", "Появляются рекомендации", "Специалист воспринимается серьёзно"],
  },
  {
    icon: "Leaf",
    title: "Состояние",
    items: ["Меньше тревоги", "Больше спокойствия", "Ощущение контроля над практикой"],
  },
  {
    icon: "Handshake",
    title: "Работа с клиентом",
    items: ["Понимание глубинных причин", "Системная диагностика", "Уверенное ведение сессии"],
  },
];

export const MODULES = [
  { n: "01", title: "Мышление специалиста", text: "Профессиональная позиция, внутренняя опора, уверенность в себе и своей работе." },
  { n: "02", title: "Работа с внутренними ограничениями", text: "Страх денег, синдром самозванца, зависимость от оценки клиента." },
  { n: "03", title: "Привлечение клиентов", text: "Как формировать поток, личный бренд, доверие и упаковка специалиста." },
  { n: "04", title: "Позиционирование", text: "Кто вы как специалист, чем отличаетесь, как это транслировать клиенту." },
  { n: "05", title: "Ценообразование", text: "Как формировать стоимость, повышать чек и перестать работать «за дёшево»." },
  { n: "06", title: "Работа с премиальными клиентами", text: "Коммуникация, статус, подача, уверенное ведение диалога." },
  { n: "07", title: "Диагностика состояния клиента", text: "Анализ, понимание причин, системная работа с человеком." },
  { n: "08", title: "Техники сопровождения", text: "Инструменты стабилизации, снижения стресса, работы с напряжением." },
  { n: "09", title: "Практика и разборы", text: "Применение системы на реальных ситуациях, разборы кейсов." },
];

export const FOR_WHOM = [
  "Телесные специалисты",
  "Массажисты",
  "Практики по работе со стрессом",
  "Специалисты по состояниям",
  "Начинающие специалисты",
  "Те, кто хочет выйти в частную практику",
];