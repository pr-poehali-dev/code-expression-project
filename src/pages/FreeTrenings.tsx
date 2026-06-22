import { Helmet } from "@/lib/helmet";
import { Link } from "react-router-dom";
import { useState } from "react";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "#2DD4BF";
const DARK = "#080E1C";
const SERIF = "'Georgia', serif";

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
];

const STEPS = [
  { num: "1", icon: "UserPlus", title: "Зарегистрируйтесь", desc: "Создайте бесплатный аккаунт на платформе" },
  { num: "2", icon: "BookOpen", title: "Откройте «Академию»", desc: "Раздел «Академия» в личном кабинете" },
  { num: "3", icon: "Play", title: "Выберите курс", desc: "Выберите тренинг и начните просмотр" },
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
  const [form, setForm] = useState({ name: "", contact: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Бесплатные онлайн-тренинги для мастеров и администраторов | Про Диалог</title>
        <meta name="description" content="Бесплатные онлайн-тренинги для мастеров, администраторов и специалистов индустрии красоты и здоровья. Практические инструменты для роста дохода и удержания клиентов." />
      </Helmet>

      <BizNavbar />

      {/* HERO */}
      <section style={{ background: DARK, minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 100, paddingBottom: 80, fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "6px 18px", marginBottom: 36 }}>
            <Icon name="GraduationCap" size={14} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>Академия Про Диалог</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 24px", fontFamily: SERIF }}>
            Бесплатные онлайн-тренинги<br />
            <span style={{ color: ACCENT }}>для мастеров и администраторов</span><br />
            индустрии красоты и здоровья
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 auto 44px", maxWidth: 640 }}>
            Овладейте практическими инструментами работы с клиентами, увеличьте доход и удержание.
          </p>
          <a href="#register" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 2, background: `linear-gradient(135deg, ${ACCENT}, #14B8A6)`, color: DARK, fontSize: 16, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px" }}>
            Получить доступ к тренингам
          </a>
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section style={{ background: "#f8fafb", padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Для кого</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: DARK, textAlign: "center", margin: "0 0 48px", fontFamily: SERIF }}>
            Кому подойдут эти тренинги
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { icon: "Scissors", label: "Массажисты и остеопаты" },
              { icon: "Sparkles", label: "Бьюти-мастера" },
              { icon: "UserCog", label: "Администраторы салонов красоты" },
              { icon: "Heart", label: "Специалисты wellness и SPA" },
            ].map(item => (
              <div key={item.label} style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: 12, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={22} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: DARK, lineHeight: 1.4 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ТРЕНИНГИ */}
      <section style={{ background: "#fff", padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Программа</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: DARK, textAlign: "center", margin: "0 0 12px", fontFamily: SERIF }}>
            Что входит в бесплатный доступ
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", margin: "0 0 48px" }}>Три практических онлайн-тренинга — доступны сразу после регистрации</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FREE_COURSES.map((course) => (
              <div key={course.id} style={{ border: "1px solid #e8ecf0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                {course.cover_url ? (
                  <img src={course.cover_url} alt="" style={{ width: "100%", objectFit: "contain", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(45,212,191,0.1), rgba(45,212,191,0.05))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="GraduationCap" size={48} style={{ color: "rgba(45,212,191,0.3)" }} />
                  </div>
                )}
                <div style={{ padding: "20px 24px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT, letterSpacing: "0.5px", textTransform: "uppercase" }}>{course.category}</span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "8px 0 0", lineHeight: 1.4 }}>{course.title}</h3>
                  <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.1)", borderRadius: 6, padding: "4px 12px" }}>
                    <Icon name="Unlock" size={13} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Бесплатно</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ВЫГОДЫ */}
      <section style={{ background: "#f8fafb", padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Результат</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: DARK, textAlign: "center", margin: "0 0 48px", fontFamily: SERIF }}>
            Что получит специалист
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.text} style={{ display: "flex", alignItems: "flex-start", gap: 16, background: "#fff", border: "1px solid #e8ecf0", borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={b.icon} size={18} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.5 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ БЕСПЛАТНО */}
      <section style={{ background: DARK, padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Почему бесплатно</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#fff", margin: "0 0 24px", fontFamily: SERIF }}>
            Мы хотим, чтобы вы убедились в пользе платформы
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0 }}>
            «Про Диалог» — платформа роста для специалистов индустрии красоты и здоровья. Мы даём бесплатный доступ к тренингам, потому что уверены: когда вы получите первые результаты, вы захотите большего. Никаких скрытых условий — только реальные инструменты.
          </p>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section style={{ background: "#fff", padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Отзывы</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: DARK, textAlign: "center", margin: "0 0 48px", fontFamily: SERIF }}>
            Результаты участников
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "#f8fafb", border: "1px solid #e8ecf0", borderRadius: 16, padding: "28px 28px" }}>
                <Icon name="Quote" size={24} style={{ color: ACCENT, marginBottom: 16 }} />
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, margin: "0 0 24px" }}>{r.text}</p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК ПОЛУЧИТЬ */}
      <section style={{ background: "#f8fafb", padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Начало</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: DARK, textAlign: "center", margin: "0 0 48px", fontFamily: SERIF }}>
            Как получить доступ
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 24, background: "#fff", border: "1px solid #e8ecf0", borderRadius: 16, padding: "24px 28px" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${ACCENT}, #14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: DARK }}>{step.num}</span>
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section id="register" style={{ background: DARK, padding: "80px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Регистрация</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: SERIF }}>
            Получите бесплатный доступ
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 40px", lineHeight: 1.6 }}>
            Оставьте имя и контакт — мы пришлём ссылку для входа
          </p>
          {sent ? (
            <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "40px 32px" }}>
              <Icon name="CheckCircle" size={40} style={{ color: ACCENT, marginBottom: 16 }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Заявка принята!</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Мы свяжемся с вами в ближайшее время.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                style={{ width: "100%", padding: "14px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <input
                type="text"
                placeholder="Email, Telegram или WhatsApp"
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                required
                style={{ width: "100%", padding: "14px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "15px", borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #14B8A6)`, color: DARK, fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Отправляем..." : "Зарегистрироваться"}
              </button>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.6 }}>
                После регистрации вы также можете войти через{" "}
                <Link to="/cabinet" style={{ color: ACCENT, textDecoration: "none" }}>личный кабинет</Link>{" "}
                и сразу перейти в Академию.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* P.S. */}
      <section style={{ background: "#f8fafb", padding: "48px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Info" size={16} style={{ color: ACCENT }} />
          </div>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: DARK }}>P.S.</strong> После прохождения бесплатных тренингов вы узнаете о других возможностях платформы: расширенных программах, инструментах для бизнеса и сообществе специалистов.
          </p>
        </div>
      </section>

      <BizFooter />
    </>
  );
}