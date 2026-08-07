import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const HERO_POINTS = [
  { icon: "Users", text: "Кому написать, чтобы вернуть клиентов" },
  { icon: "CalendarCheck", text: "Чем заполнить свободные окна" },
  { icon: "TrendingUp", text: "Где вы теряете деньги" },
  { icon: "ListChecks", text: "Что сделать сегодня, а не «когда-нибудь»" },
];

const ALREADY_HAVE = [
  "Клиенты, которые давно не возвращались",
  "Свободные окна в расписании",
  "Услуги, о которых мало кто знает",
  "Опыт и реальные результаты",
];

const AUDIENCE = [
  {
    icon: "User",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "Специалистам",
    title: "Для частных мастеров",
    desc: "Массажисты, остеопаты, косметологи, бьюти-мастера и специалисты процедур.",
    fit: ["Работы много, а доход не растёт", "Расписание то пустое, то битком", "Поднять чек страшно — вдруг уйдут"],
    get: ["Цель, разложенную на понятные шаги", "План на день, неделю и месяц", "Готовые сообщения и скрипты"],
  },
  {
    icon: "Building2",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tag: "Салонам",
    title: "Для салонов и wellness-проектов",
    desc: "Салоны красоты, SPA, клиники эстетики и команды специалистов.",
    fit: ["Обращения есть, а выручки нет", "Слабые места в чеке и загрузке", "Реклама без чёткого расчёта"],
    get: ["Диагностику точек роста по выручке", "Сценарии для команды и админов", "Общий баланс энергий на всех"],
  },
];

export default function IndexHero() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }}>AI-навигатор «ПоДелам»</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              Рост дохода салона красоты и мастеров
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 28px", fontWeight: 300, maxWidth: 520 }}>
              «ПоДелам» анализирует доход, чек, базу клиентов, загрузку —  показывает, действия на результат:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
              {HERO_POINTS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={p.icon} size={13} style={{ color: TEAL }} />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>{p.text}</span>
                </div>
              ))}
            </div>

            <a href="#demo-form" onClick={e => { e.preventDefault(); document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" }); }} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s", cursor: "pointer",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <Icon name="Compass" size={16} />
              Получить план роста
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Без оплаты · 100 энергий начисляются автоматически</div>

            <div style={{ display: "flex", gap: 36, marginTop: 48, flexWrap: "wrap" }}>
              {[["200+", "салонов"], ["20+", "инструментов"], ["4.9", "средняя оценка"]].map(([v, l], i) => (
                <div key={i}>
                  <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.5px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/17441cfe-b66d-4a86-ad10-5a1fca3bfed4.png"
                alt="Промт Диалог — ИИ-навигатор дохода «ПоДелам»"
                fetchpriority="high"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
              <div className="hero-badge" style={{
                position: "absolute", bottom: 16, right: 16, zIndex: 3,
                background: "rgba(8,14,28,0.75)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(45,212,191,0.25)", borderRadius: 4,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Compass" size={15} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Рост дохода по плану</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>через ИИ-навигатор «ПоДелам»</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Проблема</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Прибыль рядом — не настроен маркетинг
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="value-grid">
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "32px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 18 }}>У вас уже есть всё для роста</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ALREADY_HAVE.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Icon name="CheckCircle2" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: DARK, borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Но нет ответа на вопрос</div>
                <div style={{ fontFamily: SERIF, fontSize: 20, color: TEAL, lineHeight: 1.4, fontStyle: "italic" }}>
                  «Что сделать сегодня, чтобы завтра стало больше денег?»
                </div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: 20, fontWeight: 300 }}>
                Без ответа — хаотичные посты, скидки вместо ценности и реклама без расчёта. «ПоДелам» меняет хаос на систему.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ДЛЯ КОГО ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для кого</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Для кого?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="value-grid">
            {AUDIENCE.map((a, i) => (
              <div key={i} style={{ border: `1.5px solid ${a.border}`, borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: a.bg, border: `1px solid ${a.border}`, borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
                    <Icon name={a.icon} size={14} style={{ color: a.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: a.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{a.tag}</span>
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: DARK, lineHeight: 1.3, marginBottom: 8 }}>{a.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{a.desc}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Знакомо?</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {a.fit.map((t, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <Icon name="ArrowRight" size={13} style={{ color: a.color, flexShrink: 0, marginTop: 3 }} />
                        <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${a.border}`, paddingTop: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Что получите</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {a.get.map((t, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <Icon name="CheckCircle2" size={13} style={{ color: a.color, flexShrink: 0, marginTop: 3 }} />
                        <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}