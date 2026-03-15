import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/1497cb0f-9443-4357-bd10-0eed4cebff43.jpg";

const NAV_LINKS = [
  { label: "Платформа", active: true },
  { label: "Тарифы" },
  { label: "Партнёрам" },
  { label: "Блог" },
  { label: "Контакты" },
];

const ADVANTAGES = [
  {
    icon: "Zap",
    title: "Скорость запуска",
    desc: "Внедрите инструменты в бизнес за 1 день без найма разработчиков и долгих настроек.",
  },
  {
    icon: "BarChart2",
    title: "Аналитика в реальном времени",
    desc: "Следите за ключевыми показателями бизнеса в едином дашборде — без Excel и ручной сводки.",
  },
  {
    icon: "Users",
    title: "Командная работа",
    desc: "Управляйте сотрудниками, задачами и доступами из одной точки. Всё под контролем.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f5f4f0] font-body text-[#1a1a1a]">

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-[#f5f4f0]/95 backdrop-blur border-b border-[#e0ddd5]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display text-xl font-semibold tracking-tight">
            Biz<span className="text-[hsl(var(--primary))]">Tools</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#444]">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href="#"
                className={
                  l.active
                    ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] pb-0.5"
                    : "hover:text-[hsl(var(--primary))] transition-colors"
                }
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button className="bg-[hsl(var(--primary))] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Войти
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--primary))] mb-4">
            B2B платформа
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.1] mb-6">
            Biz{" "}
            <em className="not-italic text-[hsl(var(--primary))] font-bold">
              Tools
            </em>
          </h1>
          <p className="text-base font-semibold text-[#1a1a1a] mb-3">
            <strong>Профессиональная платформа</strong> для{" "}
            <strong>предпринимателей</strong> и команд.
          </p>
          <p className="text-sm text-[#555] leading-relaxed mb-3">
            Объединяем автоматизацию, аналитику и управление командой — всё, что
            нужно для роста бизнеса в одном месте.
          </p>
          <p className="text-sm text-[#555] leading-relaxed mb-8">
            Доступ получают компании и индивидуальные предприниматели,
            подключённые к экосистеме BizTools.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <button className="bg-[hsl(var(--primary))] text-white font-semibold text-sm px-7 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Смотреть тарифы
            </button>
            <button className="border border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-teal-50 transition-colors">
              Узнать больше
            </button>
          </div>
          <p className="text-xs text-[#999] mt-3">
            Доступ предоставляется бизнесам и частным предпринимателям
          </p>
        </div>

        <div
          className="animate-slide-in-right relative"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
            <img
              src={HERO_IMAGE}
              alt="B2B инструменты для бизнеса"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-5 py-3 shadow-lg border border-[#e8e5dc] flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="text-xs text-[#888]">Рост выручки</p>
              <p className="text-sm font-bold text-[hsl(var(--primary))]">
                +34% за квартал
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="bg-white border-y border-[#e0ddd5]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--primary))] mb-3 text-center">
            Преимущества
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-14 leading-tight">
            Почему выбирают{" "}
            <em className="not-italic text-[hsl(var(--primary))]">BizTools</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ADVANTAGES.map((a, i) => (
              <div
                key={a.title}
                className="bg-[#f5f4f0] rounded-2xl p-7 hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
                  <Icon name={a.icon} size={22} className="text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-[#1a1a1a]">
                  {a.title}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[hsl(var(--primary))] mb-3">
              О платформе
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Всё для{" "}
              <em className="not-italic text-[hsl(var(--primary))]">роста</em>{" "}
              вашего бизнеса
            </h2>
            <p className="text-sm text-[#555] leading-relaxed mb-4">
              BizTools — это экосистема B2B инструментов, созданная специально
              для предпринимателей, которые хотят управлять бизнесом системно: с
              данными, автоматизацией и командой.
            </p>
            <p className="text-sm text-[#555] leading-relaxed mb-8">
              Мы объединяем CRM, финансовую аналитику, управление задачами и
              базу знаний — в одном рабочем пространстве без лишних интеграций.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Единый дашборд для всех метрик",
                "Автоматические отчёты и уведомления",
                "Ролевой доступ для команды",
                "Интеграция с банками и 1С",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#444]">
                  <span className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={12} className="text-[hsl(var(--primary))]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="bg-[hsl(var(--primary))] text-white font-semibold text-sm px-7 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Начать бесплатно
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "500+", label: "Компаний используют" },
              { num: "3.4×", label: "Рост производительности" },
              { num: "24/7", label: "Поддержка и мониторинг" },
              { num: "14 дн", label: "Бесплатный пробный период" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#e0ddd5] rounded-2xl p-6 text-center"
              >
                <p className="font-display text-4xl font-bold text-[hsl(var(--primary))] mb-1">
                  {stat.num}
                </p>
                <p className="text-xs text-[#777] leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e0ddd5] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#888]">
          <div className="font-display text-lg font-semibold text-[#1a1a1a]">
            Biz<span className="text-[hsl(var(--primary))]">Tools</span>
          </div>
          <p>© 2026 BizTools. Все права защищены.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">Условия</a>
            <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">Политика</a>
            <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
