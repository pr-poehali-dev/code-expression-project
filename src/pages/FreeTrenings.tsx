import { Helmet } from "@/lib/helmet";
import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "#2DD4BF";
const DARK = "#080E1C";
const TEAL = "#2DD4BF";
const SERIF = "'Cormorant Garamond', Georgia, serif";

const FREE_COURSES = [
  {
    id: 16,
    title: "Психология общения с клиентом",
    category: "Для мастеров и специалистов",
    cover_url: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/16/training-image (1).png",
  },
  {
    id: 17,
    title: "Построение частной практики и личного бренда мастера",
    category: "Для мастеров",
    cover_url: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/17/training-image (14).png",
  },
  {
    id: 19,
    title: "Актуальные техники самопрезентации",
    category: "Для мастеров",
    cover_url: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/19/training-image (25).png",
  },
];

const BENEFITS = [
  { icon: "MessageCircle", text: "Готовые фразы и алгоритмы для ежедневных ситуаций" },
  { icon: "TrendingUp", text: "Рост повторных записей и среднего чека" },
  { icon: "ShieldCheck", text: "Уверенность в разговоре с клиентом" },
  { icon: "Users", text: "Умение решать конфликты без стресса" },
  { icon: "ClipboardList", text: "Чек-листы для применения прямо сейчас" },
  { icon: "Globe", text: "Доступ к закрытому сообществу специалистов" },
  { icon: "Wrench", text: "Бесплатные онлайн-инструменты для практики" },
  { icon: "CalendarCheck", text: "Доступ к офлайн встречам и живым разборам" },
];

const STEPS = [
  { num: "1", title: "Зарегистрируйтесь", desc: "Создайте бесплатный аккаунт на платформе" },
  { num: "2", title: "Откройте «Академию»", desc: "Раздел «Академия» в личном кабинете" },
  { num: "3", title: "Выберите курс", desc: "Выберите тренинг и начните просмотр" },
];

const REVIEWS = [
  {
    name: "Ирина М.",
    role: "Мастер маникюра, 7 лет опыта",
    text: "После курса по психологии общения клиенты стали возвращаться чаще. Научилась мягко предлагать дополнительные услуги без ощущения, что навязываю.",
  },
  {
    name: "Алексей К.",
    role: "Массажист, частная практика",
    text: "Курс по личному бренду помог систематизировать соцсети. За месяц пришло 4 новых клиента только через Instagram. Инструменты реально рабочие.",
  },
  {
    name: "Наталья В.",
    role: "Администратор SPA-салона",
    text: "Самопрезентация изменила то, как я разговариваю с гостями с первой минуты. Руководитель заметила, что возросло количество доп-записей.",
  },
];

export default function FreeTrenings() {
  return (
    <>
      <Helmet>
        <title>Бесплатные онлайн-тренинги для мастеров и администраторов | Промт Диалог</title>
        <meta name="description" content="Бесплатные онлайн-тренинги для мастеров, администраторов, массажистов и специалистов бьюти и wellness. Психология общения с клиентом, личный бренд, самопрезентация. Доступны сразу после регистрации." />
        <meta name="keywords" content="бесплатные тренинги для мастеров, онлайн курсы для администраторов салона, обучение для мастеров красоты, тренинг для массажистов, психология общения с клиентом, личный бренд мастера, академия про диалог" />
        <link rel="canonical" href="https://pro-dialog.ru/free-trenings" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pro-dialog.ru/free-trenings" />
        <meta property="og:title" content="Бесплатные онлайн-тренинги для мастеров и администраторов" />
        <meta property="og:description" content="Получите бесплатный доступ к практическим тренингам по психологии общения, личному бренду и самопрезентации. Для специалистов индустрии красоты и здоровья." />
        <meta property="og:image" content="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/16/training-image (1).png" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Промт Диалог" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Бесплатные онлайн-тренинги для мастеров и администраторов" />
        <meta name="twitter:description" content="Получите бесплатный доступ к практическим тренингам по психологии общения, личному бренду и самопрезентации." />
        <meta name="twitter:image" content="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/16/training-image (1).png" />

        <meta name="robots" content="index, follow" />
      </Helmet>

      <BizNavbar />

      {/* HERO */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Академия Промт Диалог</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Бесплатные онлайн-тренинги для мастеров и администраторов
            </h1>
            <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300, maxWidth: 540 }}>
              Практические инструменты для мастеров и администраторов, которые хотят вернуть больше клиентов и заполнить расписание.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
                background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                Получить доступ к тренингам
              </Link>
              <Link to="/akademiya" style={{
                padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 400, letterSpacing: "0.3px",
                border: "1px solid rgba(255,255,255,0.22)", color: "#fff",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.22)"}
              >
                Об Академии <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{
                position: "absolute", inset: -1, borderRadius: 6,
                background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))",
                pointerEvents: "none", zIndex: 2,
              }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/1a57c9b1-8604-48c7-bec7-324dcf8d79ca.png"
                alt="Онлайн-тренинги для мастеров и администраторов — Академия Про Диалог"
                fetchPriority="high"
                decoding="async"
                style={{
                  width: "100%", height: "auto",
                  borderRadius: 4, display: "block",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                  position: "relative", zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section style={{ background: "#fff", padding: "100px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для кого</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Кому подойдут эти тренинги
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "Scissors", label: "Массажисты и остеопаты" },
              { icon: "Sparkles", label: "Бьюти-мастера" },
              { icon: "UserCog", label: "Администраторы салонов красоты" },
              { icon: "Heart", label: "Специалисты wellness и SPA" },
            ].map(item => (
              <div key={item.label} style={{ border: "1px solid #e8ecf0", borderRadius: 4, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: DARK, lineHeight: 1.4 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ТРЕНИНГИ */}
      <section style={{ background: "#f8fafb", padding: "100px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Программа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Что входит в бесплатный доступ
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0, lineHeight: 1.6 }}>Три практических онлайн-тренинга — доступны сразу после регистрации</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FREE_COURSES.map((course) => (
              <div key={course.id} style={{ border: "1px solid #e8ecf0", borderRadius: 4, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
                {course.cover_url ? (
                  <img src={course.cover_url} alt="" style={{ width: "100%", objectFit: "contain", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(45,212,191,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="GraduationCap" size={48} style={{ color: "rgba(45,212,191,0.3)" }} />
                  </div>
                )}
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT, letterSpacing: "0.5px", textTransform: "uppercase" }}>{course.category}</span>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, margin: "8px 0 0", lineHeight: 1.4, flex: 1 }}>{course.title}</h3>
                  <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.1)", borderRadius: 4, padding: "4px 12px" }}>
                    <Icon name="Unlock" size={13} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Бесплатно</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Плашка "ещё курсы" */}
            <div style={{ border: "1.5px dashed rgba(45,212,191,0.35)", borderRadius: 4, background: "rgba(45,212,191,0.04)", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "32px 28px", gap: 16, minHeight: 200 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Plus" size={22} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 6 }}>И другие бесплатные тренинги</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Полный список курсов доступен после регистрации в разделе «Академия»</div>
              </div>
              <Link to="/cabinet" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: ACCENT, textDecoration: "none" }}>
                Смотреть все <Icon name="ArrowRight" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ВЫГОДЫ */}
      <section style={{ background: "#fff", padding: "100px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результат</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Что получит специалист
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.text} style={{ display: "flex", alignItems: "flex-start", gap: 16, border: "1px solid #e8ecf0", borderRadius: 4, padding: "22px 24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={b.icon} size={18} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ БЕСПЛАТНО */}
      <section style={{ background: DARK, padding: "100px 32px", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
        {/* Затемнённое фото справа — только десктоп */}
        <div className="hero-img" style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "45%",
          backgroundImage: "url(https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/a2dc163e-4908-47e1-9533-7a5c6b724a51.png)",
          backgroundSize: "cover", backgroundPosition: "center",
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.85) 100%)",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,14,28,0.55)" }} />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Почему бесплатно</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Мы хотим, чтобы вы убедились в пользе платформы
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
              «Промт Диалог» — платформа роста для специалистов индустрии красоты и здоровья. Мы даём бесплатный доступ к тренингам, потому что уверены: когда вы получите первые результаты, вы захотите большего. Никаких скрытых условий — только реальные инструменты.
            </p>
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section style={{ background: "#f8fafb", padding: "100px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Отзывы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Результаты участников
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: 4, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
                <Icon name="Quote" size={24} style={{ color: ACCENT, marginBottom: 20 }} />
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, margin: "0 0 28px", flex: 1 }}>{r.text}</p>
                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК ПОЛУЧИТЬ */}
      <section style={{ background: "#fff", padding: "100px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Начало</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Как получить доступ
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{ border: "1px solid #e8ecf0", borderRadius: 4, padding: "32px 28px" }}>
                <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 20, opacity: 0.5 }}>{step.num}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              Зарегистрироваться и начать <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* P.S. */}
      <section style={{ background: "#f8fafb", padding: "48px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Info" size={16} style={{ color: ACCENT }} />
          </div>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, margin: 0, maxWidth: 720 }}>
            <strong style={{ color: DARK }}>P.S.</strong> После прохождения бесплатных тренингов вы узнаете о других возможностях платформы: расширенных программах, инструментах для бизнеса и сообществе специалистов.
          </p>
        </div>
      </section>

      <BizFooter />
    </>
  );
}