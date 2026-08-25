export const TEAL = "#2DD4BF";
export const DARK = "#0F172A";
export const GRAY = "#64748B";
export const SERIF = "'Cormorant Garamond', serif";
export const SEND_URL = "https://functions.poehali.dev/38e28755-ddea-4adb-86d7-96db7a0db47e";
export const PRESENTATION_URL = "https://docs.google.com/presentation/d/1Kx4sdz-PN8BRnLzM_Iy6BUiQoz-Ll4sA/edit?usp=sharing&ouid=111665171855702968814&rtpof=true&sd=true";

export const CHAIN = [
  { icon: "School", title: "ШКОЛА", desc: "Обучает профессии" },
  { icon: "GraduationCap", title: "ВЫПУСКНИК", desc: "Получает доступ к Промт Диалог" },
  { icon: "Compass", title: "ИИ-НАВИГАТОР", desc: "Диагностика → цели → ежедневные шаги" },
  { icon: "HelpCircle", title: "НОВАЯ ПОТРЕБНОСТЬ", desc: "Пользователю нужен следующий навык" },
  { icon: "Sparkles", title: "РЕКОМЕНДАЦИЯ", desc: "Подходящий курс школы" },
  { icon: "Trophy", title: "ШКОЛА", desc: "Получает заинтересованного пользователя" },
];

export const QUESTIONS = [
  "Как найти первых клиентов?",
  "Как увеличить доход?",
  "Как продвигать себя?",
  "Как работать с повторными визитами?",
  "Как правильно общаться с клиентами?",
  "Какие навыки развивать дальше?",
  "Какое обучение выбрать следующим?",
  "С чего начать работать самостоятельно?",
];

export const GRADUATE_GETS = [
  { icon: "Zap", title: "+200 энергии", desc: "При регистрации по промокоду школы" },
  { icon: "Stethoscope", title: "ИИ-диагностику", desc: "Определение целей и точек роста" },
  { icon: "Map", title: "Персональный маршрут", desc: "Последовательность действий для достижения цели" },
  { icon: "CalendarCheck", title: "Ежедневные шаги", desc: "Пользователь каждый день понимает, что делать дальше" },
  { icon: "Bot", title: "ИИ-инструменты", desc: "Маркетинг, клиенты, продажи, контент, лендинги и другие инструменты" },
  { icon: "BookOpen", title: "Рекомендации обучения", desc: "Подходящие курсы, когда они соответствуют текущей цели" },
  { icon: "Trophy", title: "Участие в чемпионатах", desc: "Возможность заявить о себе и представить школу в профессиональных конкурсах" },
  { icon: "Users", title: "Сообщество мастеров", desc: "Доступ к комьюнити специалистов индустрии для обмена опытом" },
];

export const NAVIGATOR_STEPS = ["Позиционирование", "Предложение", "Контент", "Продвижение", "Диалог с клиентом", "Повторный визит"];

export const SCHOOL_GETS = [
  { n: "01", title: "Дополнительная ценность обучения", desc: "Выпускник получает поддержку после окончания курса" },
  { n: "02", title: "Лояльность выпускников", desc: "Школа остается частью профессионального пути ученика" },
  { n: "03", title: "Дополнительная аудитория", desc: "Курсы школы представлены пользователям Промт Диалог" },
  { n: "04", title: "Персональные рекомендации", desc: "ИИ рекомендует обучение по текущей потребности" },
  { n: "05", title: "Статистика", desc: "Школа видит активность своих пользователей" },
  { n: "06", title: "Репутация", desc: "Рейтинг, чемпионаты и достижения выпускников" },
  { n: "07", title: "Без затрат на интеграцию", desc: "Подключение без доработки сайта и учебной программы школы" },
  { n: "08", title: "Растущий партнерский канал", desc: "Чем больше выпускников подключено, тем больше заявок на курсы" },
];

export const CONNECT_STEPS = [
  "Школа становится партнером",
  "Мы создаем карточку школы",
  "Генерируем уникальный промокод",
  "Добавляем курсы школы",
  "Школа передает промокод выпускникам",
  "Выпускники получают +200 энергии",
  "Начинается работа Промт Диалог",
];

export const NOT_NEEDED = ["Менять учебную программу", "Устанавливать ПО", "Создавать API", "Менять сайт школы"];
export const NEEDED = ["Предоставить информацию о школе", "Предоставить ссылки на курсы", "Получить промокод", "Передать его выпускникам"];

export const CHAMPIONSHIPS = [
  { icon: "Star", title: "Лучший мастер" },
  { icon: "MessageCircle", title: "Лучший диалог с клиентом" },
  { icon: "TrendingUp", title: "Лучшее продвижение" },
  { icon: "Briefcase", title: "Лучший профессиональный кейс" },
  { icon: "Building2", title: "Лучший салон" },
];

export const STATS = [
  { label: "Регистрации", value: 87 },
  { label: "Прошли диагностику", value: 62 },
  { label: "Активных пользователей", value: 48 },
  { label: "Получили рекомендации", value: 19 },
  { label: "Переходы на курсы", value: 11 },
];

export const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%", padding: "12px 14px", borderRadius: 4,
  border: `1px solid ${focused ? TEAL : "#E2E8F0"}`,
  fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif",
  boxSizing: "border-box", color: DARK, background: "#fff",
  transition: "border-color 0.2s",
});

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
      {children}
    </div>
  );
}