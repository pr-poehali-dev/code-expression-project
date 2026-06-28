import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const DIRECTIONS = [
  {
    icon: "Users",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    tag: "Развитие",
    title: "Развитие салона и команды",
    items: [
      { icon: "Search", text: "ИИ-диагностика клиентов и персонала — выявляем, почему уходят люди и где слабые точки" },
      { icon: "Brain", text: "Глубокий анализ мышления и барьеров роста — на конкретных примерах вашего бизнеса" },
      { icon: "BarChart3", text: "Финансовый профиль и рекомендации — что делать, чтобы расти в 2–3 раза быстрее" },
    ],
  },
  {
    icon: "GraduationCap",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "Обучение",
    title: "Тренинги и профессиональное развитие",
    items: [
      { icon: "Presentation", text: "Онлайн и офлайн тренинги для персонала — сценарии продаж, сервис, коммуникация под вашу специфику" },
      { icon: "FileText", text: "Готовые скрипты, сценарии Reels, ответы на отзывы — индивидуальные разборы и инструкции" },
      { icon: "Bot", text: "Автоматизированное обучение и контроль выполнения через ИИ-агентов" },
    ],
  },
  {
    icon: "Megaphone",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tag: "Маркетинг",
    title: "Маркетинговые инструменты",
    items: [
      { icon: "PenLine", text: "Генератор продающих объявлений и постов — быстро, просто, под вашу аудиторию" },
      { icon: "Globe", text: "Портрет целевой аудитории, подбор офферов, создание лендингов — за 1–2 дня до первых заявок" },
      { icon: "Map", text: "Медиаплан и цепочка маркетинга — от идеи до расписанной стратегии продвижения, без потерь на тестах" },
    ],
  },
];

const WHY_US = [
  { icon: "TrendingUp", text: "+30% к среднему чеку, сокращение оттока клиентов в 2 раза, рост команды без текучки — реальные кейсы клиентов платформы" },
  { icon: "Bot", text: "ИИ-агенты считают под вашу специфику, а не по шаблону — каждый вывод и совет персонализирован" },
  { icon: "LayoutDashboard", text: "Вся команда в одной системе: прозрачная аналитика и контроль результата без ручной отчётности" },
];

export default function IndexPlatform() {
  return (
    <>
      {/* ── 4. ТРИ НАПРАВЛЕНИЯ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Платформа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Три направления для вашего роста
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {DIRECTIONS.map((dir, i) => (
              <div key={i} style={{ background: "#fff", border: `1.5px solid ${dir.border}`, borderRadius: 20, padding: "40px 40px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 48, alignItems: "start" }} className="dir-grid">
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dir.bg, border: `1px solid ${dir.border}`, borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
                    <Icon name={dir.icon} size={14} style={{ color: dir.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: dir.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{dir.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 600, color: DARK, margin: 0, lineHeight: 1.2 }}>{dir.title}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {dir.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: dir.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Icon name={item.icon} size={15} style={{ color: dir.color }} />
                      </div>
                      <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ПОЧЕМУ ВЫБИРАЮТ НАС ── */}
      <section style={{ padding: "120px 32px", background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результаты</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Почему выбирают нас?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {WHY_US.map((item, i) => (
              <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(255,255,255,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={20} style={{ color: TEAL }} />
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
