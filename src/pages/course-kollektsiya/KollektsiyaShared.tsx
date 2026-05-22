export const ACCENT = "hsl(185, 85%, 32%)";
export const ACCENT_DARK = "hsl(185, 85%, 26%)";
export const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
export const GOLD = "#d4a017";
export const GOLD_BG = "#fdf8ec";

export const RETAIL_PRICE = 77600;

export const BUY_URL_RETAIL = "https://school.brossok.ru/buy/82";

export const COURSES = [
  {
    id: 1,
    title: "Профессия массажист с нуля",
    subtitle: "Первый доход за 30 дней",
    price: "19 900 ₽",
    tag: "Новичкам",
    tagColor: ACCENT,
    icon: "GraduationCap",
    bullets: ["Базовые техники с нуля", "Практика с первого дня", "Без медобразования"],
    url: "/course/massazhist-s-nulya",
  },
  {
    id: 3,
    title: "Готовые протоколы массажа",
    subtitle: "Боль, стресс, зажимы",
    price: "19 900 ₽",
    tag: "Система",
    tagColor: "#7c3aed",
    icon: "BookOpen",
    bullets: ["Чёткие схемы работы", "Уверенность на сеансе", "Протоколы под любую жалобу"],
    url: "/course/gotovye-protokoly-massazha",
  },
  {
    id: 4,
    title: "Антистресс-техники массажа",
    subtitle: "Эффект сеанса ×2",
    price: "14 900 ₽",
    tag: "Апгрейд",
    tagColor: "#f59e0b",
    icon: "Zap",
    bullets: ["Техники из нейромассажа", "Клиенты рекомендуют вас", "Повышение среднего чека"],
    url: "/course/antistress-tehniki-massazha",
  },
  {
    id: 5,
    title: "Коррекция фигуры",
    subtitle: "Результаты за которые платят",
    price: "16 900 ₽",
    tag: "Высокий чек",
    tagColor: "#e11d48",
    icon: "TrendingUp",
    bullets: ["Антицеллюлитные программы", "Моделирование тела", "Клиенты платят охотно"],
    url: "/course/korrektsiya-figury",
  },
  {
    id: 6,
    title: "Висцеральный массаж с нуля",
    subtitle: "Старт без медобразования",
    price: "4 990 ₽",
    tag: "Быстрый старт",
    tagColor: "#059669",
    icon: "Heart",
    bullets: ["Безопасная техника", "Уникальная услуга", "Высокая востребованность"],
    url: "/course/visceralny-massazh-s-nulya",
  },
  {
    id: 7,
    title: "Массажист с потоком клиентов",
    subtitle: "От 0 до стабильной записи",
    price: "14 900 ₽",
    tag: "Бизнес",
    tagColor: "#0284c7",
    icon: "Users",
    bullets: ["Маркетинг и продвижение", "Личный бренд", "Стабильный поток записей"],
    url: "/course/massazhist-s-potokom-klientov",
  },
  {
    id: 202,
    title: "Фитнес для беременных",
    subtitle: "2-й триместр",
    price: "5 590 ₽",
    tag: "Специализация",
    tagColor: "#db2777",
    icon: "Baby",
    bullets: ["Уникальная целевая аудитория", "Безопасные протоколы", "Высокая лояльность клиенток"],
    url: "/course/fitnes-beremennyh",
  },
];

export const OUTCOMES = [
  { icon: "Award", title: "Профессиональный массажист", text: "С нуля до уверенного специалиста — весь путь системно и без лишних затрат" },
  { icon: "TrendingUp", title: "Растущий доход", text: "Базовые техники, апгрейд услуг, коррекция фигуры — каждый курс увеличивает ваш средний чек" },
  { icon: "Users", title: "Стабильный поток клиентов", text: "Маркетинг, личный бренд и реклама — клиенты будут сами находить вас" },
  { icon: "Layers", title: "7 специализаций", text: "Антистресс, висцеральный, коррекция, протоколы — охват разной аудитории = разные источники дохода" },
  { icon: "Clock", title: "Обучение в своём темпе", text: "Все курсы доступны сразу, без дедлайнов — учитесь тогда, когда удобно" },
  { icon: "Infinity", title: "Пожизненный доступ", text: "Все материалы, обновления и новые уроки — навсегда, не нужно платить повторно" },
];

export function BtnBuy({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
        color: "#fff", padding: "18px 48px", borderRadius: 14,
        fontSize: 17, fontWeight: 700, textDecoration: "none",
        boxShadow: `0 8px 32px ${ACCENT_SHADOW}`,
        transition: "all 0.2s", letterSpacing: 0.3,
        fontFamily: "Montserrat, sans-serif",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 14px 40px ${ACCENT_SHADOW}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px ${ACCENT_SHADOW}`; }}
    >
      {children}
    </a>
  );
}