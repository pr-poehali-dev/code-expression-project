import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const SEND_URL = "https://functions.poehali.dev/38e28755-ddea-4adb-86d7-96db7a0db47e";
const PRESENTATION_URL = "https://docs.google.com/presentation/d/1Kx4sdz-PN8BRnLzM_Iy6BUiQoz-Ll4sA/edit?usp=sharing&ouid=111665171855702968814&rtpof=true&sd=true";

const CHAIN = [
  { icon: "School", title: "ШКОЛА", desc: "Обучает профессии" },
  { icon: "GraduationCap", title: "ВЫПУСКНИК", desc: "Получает доступ к Промт Диалог" },
  { icon: "Compass", title: "ИИ-НАВИГАТОР", desc: "Диагностика → цели → ежедневные шаги" },
  { icon: "HelpCircle", title: "НОВАЯ ПОТРЕБНОСТЬ", desc: "Пользователю нужен следующий навык" },
  { icon: "Sparkles", title: "РЕКОМЕНДАЦИЯ", desc: "Подходящий курс школы" },
  { icon: "Trophy", title: "ШКОЛА", desc: "Получает заинтересованного пользователя" },
];

const QUESTIONS = [
  "Как найти первых клиентов?",
  "Как увеличить доход?",
  "Как продвигать себя?",
  "Как работать с повторными визитами?",
  "Как правильно общаться с клиентами?",
  "Какие навыки развивать дальше?",
  "Какое обучение выбрать следующим?",
];

const GRADUATE_GETS = [
  { icon: "Zap", title: "+200 энергии", desc: "При регистрации по промокоду школы" },
  { icon: "Stethoscope", title: "ИИ-диагностику", desc: "Определение целей и точек роста" },
  { icon: "Map", title: "Персональный маршрут", desc: "Последовательность действий для достижения цели" },
  { icon: "CalendarCheck", title: "Ежедневные шаги", desc: "Пользователь каждый день понимает, что делать дальше" },
  { icon: "Bot", title: "ИИ-инструменты", desc: "Маркетинг, клиенты, продажи, контент, лендинги и другие инструменты" },
  { icon: "BookOpen", title: "Рекомендации обучения", desc: "Подходящие курсы, когда они соответствуют текущей цели" },
];

const NAVIGATOR_STEPS = ["Позиционирование", "Предложение", "Контент", "Продвижение", "Диалог с клиентом", "Повторный визит"];

const SCHOOL_GETS = [
  { n: "01", title: "Дополнительная ценность обучения", desc: "Выпускник получает поддержку после окончания курса" },
  { n: "02", title: "Лояльность выпускников", desc: "Школа остаётся частью профессионального пути ученика" },
  { n: "03", title: "Дополнительная аудитория", desc: "Курсы школы представлены пользователям Промт Диалог" },
  { n: "04", title: "Персональные рекомендации", desc: "ИИ рекомендует обучение по текущей потребности" },
  { n: "05", title: "Статистика", desc: "Школа видит активность своих пользователей" },
  { n: "06", title: "Репутация", desc: "Рейтинг, чемпионаты и достижения выпускников" },
];

const CONNECT_STEPS = [
  "Школа становится партнёром",
  "Мы создаём карточку школы",
  "Генерируем уникальный промокод",
  "Добавляем курсы школы",
  "Школа передаёт промокод выпускникам",
  "Выпускники получают +200 энергии",
  "Начинается работа Промт Диалог",
];

const NOT_NEEDED = ["Менять учебную программу", "Устанавливать ПО", "Создавать API", "Менять сайт школы"];
const NEEDED = ["Предоставить информацию о школе", "Предоставить ссылки на курсы", "Получить промокод", "Передать его выпускникам"];

const CHAMPIONSHIPS = [
  "Лучший мастер",
  "Лучший диалог с клиентом",
  "Лучшее продвижение",
  "Лучший профессиональный кейс",
  "Лучший салон",
];

const STATS = [
  { label: "Регистрации", value: 87 },
  { label: "Прошли диагностику", value: 62 },
  { label: "Активных пользователей", value: 48 },
  { label: "Получили рекомендации", value: 19 },
  { label: "Переходы на курсы", value: 11 },
];

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%", padding: "12px 14px", borderRadius: 4,
  border: `1px solid ${focused ? TEAL : "#E2E8F0"}`,
  fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif",
  boxSizing: "border-box", color: DARK, background: "#fff",
  transition: "border-color 0.2s",
});

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
      {children}
    </div>
  );
}

function PartnerForm() {
  const [form, setForm] = useState({
    school_name: "", contact_name: "", position: "", phone: "",
    messenger: "", website: "", email: "", graduates_per_year: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const f = (k: string) => setFocus(p => ({ ...p, [k]: true }));
  const b = (k: string) => setFocus(p => ({ ...p, [k]: false }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.school_name.trim()) e.school_name = "Укажите название школы";
    if (!form.contact_name.trim()) e.contact_name = "Укажите ваше имя";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Некорректный email";
    if (!agreed) e.agreed = "Необходимо согласие";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true); setSubmitError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
      else setSubmitError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setSubmitError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="CheckCircle" size={26} style={{ color: TEAL }} />
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>Заявка отправлена</h3>
        <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>Мы свяжемся с вами и расскажем, как подключить школу.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Название школы *</label>
          <input value={form.school_name} onChange={set("school_name")} placeholder="Школа мастеров..."
            style={inputStyle(!!focus.school_name)} onFocus={() => f("school_name")} onBlur={() => b("school_name")} />
          {errors.school_name && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.school_name}</div>}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Ваше имя *</label>
          <input value={form.contact_name} onChange={set("contact_name")} placeholder="Иван Иванов"
            style={inputStyle(!!focus.contact_name)} onFocus={() => f("contact_name")} onBlur={() => b("contact_name")} />
          {errors.contact_name && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.contact_name}</div>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Должность</label>
          <input value={form.position} onChange={set("position")} placeholder="Директор, методист..."
            style={inputStyle(!!focus.position)} onFocus={() => f("position")} onBlur={() => b("position")} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Телефон *</label>
          <input value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__"
            style={inputStyle(!!focus.phone)} onFocus={() => f("phone")} onBlur={() => b("phone")} />
          {errors.phone && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.phone}</div>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Telegram / WhatsApp</label>
          <input value={form.messenger} onChange={set("messenger")} placeholder="@username или номер"
            style={inputStyle(!!focus.messenger)} onFocus={() => f("messenger")} onBlur={() => b("messenger")} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Сайт школы</label>
          <input value={form.website} onChange={set("website")} placeholder="school.ru"
            style={inputStyle(!!focus.website)} onFocus={() => f("website")} onBlur={() => b("website")} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Email</label>
          <input value={form.email} onChange={set("email")} placeholder="mail@example.com" type="email"
            style={inputStyle(!!focus.email)} onFocus={() => f("email")} onBlur={() => b("email")} />
          {errors.email && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.email}</div>}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Выпускников в год</label>
          <input value={form.graduates_per_year} onChange={set("graduates_per_year")} placeholder="Например: 150"
            style={inputStyle(!!focus.graduates_per_year)} onFocus={() => f("graduates_per_year")} onBlur={() => b("graduates_per_year")} />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <div onClick={() => setAgreed(!agreed)} style={{
          width: 18, height: 18, borderRadius: 2, flexShrink: 0, marginTop: 1,
          border: `1.5px solid ${agreed ? TEAL : "#CBD5E1"}`,
          background: agreed ? TEAL : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", cursor: "pointer",
        }}>
          {agreed && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
        </div>
        <span style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>
          Я согласен(а) на обработку персональных данных в соответствии с{" "}
          <a href="/privacy" style={{ color: TEAL, textDecoration: "none", fontWeight: 500 }}>политикой конфиденциальности</a>
        </span>
      </label>
      {errors.agreed && <div style={{ fontSize: 12, color: "#e55" }}>{errors.agreed}</div>}

      {submitError && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#BE123C" }}>
          <Icon name="AlertCircle" size={14} />
          {submitError}
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        padding: "15px", borderRadius: 4, border: "none",
        background: loading ? "#E2E8F0" : `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
        color: loading ? GRAY : DARK,
        fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "Inter, sans-serif", letterSpacing: "0.3px", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {loading
          ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Отправляю...</>
          : <>Стать партнёром</>
        }
      </button>
      <p style={{ fontSize: 12, color: GRAY, textAlign: "center", margin: 0, fontWeight: 300 }}>
        Мы свяжемся с вами и расскажем, как подключить школу.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

export default function DlyaShkol() {
  useEffect(() => {
    document.title = "Партнёрство для школ — Промт Диалог | ИИ для развития мастеров";
    const desc = document.querySelector("meta[name='description']");
    if (desc) desc.setAttribute("content", "Партнёрская программа Промт Диалог для школ мастеров, массажистов и специалистов индустрии красоты. ИИ-навигатор, развитие выпускников, рекомендации курсов, статистика и чемпионаты.");
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── 1. HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "66vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "0%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Партнёрство для школ</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,68px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-0.5px", maxWidth: 780 }}>
            Партнёрство для школ
          </h1>

          <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 20px" }}>
            Помогите своим выпускникам развиваться после обучения — и получайте дополнительный канал целевой аудитории для своих курсов.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 40px", fontWeight: 300 }}>
            Промт Диалог — ИИ-навигатор развития мастеров, специалистов и салонов. Выпускник получает персональный маршрут развития, ежедневные шаги, ИИ-инструменты и рекомендации обучения, когда ему действительно нужен следующий профессиональный навык.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
              color: "#0F172A", padding: "14px 32px", borderRadius: 2,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(45,212,191,0.25)",
            }}>
              Скачать презентацию
              <Icon name="Download" size={16} />
            </a>
            <a href="#partner-form" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
              padding: "14px 32px", borderRadius: 2, fontSize: 15,
              fontWeight: 500, textDecoration: "none", background: "transparent",
            }}>
              Стать партнёром
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. ВИЗУАЛЬНАЯ СХЕМА ── */}
      <section style={{ padding: "72px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }} className="chain-flow">
            {CHAIN.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6,
                  padding: "18px 28px", maxWidth: 480, width: "100%",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 4, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={20} style={{ color: TEAL }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK, letterSpacing: "0.5px" }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: GRAY }}>{c.desc}</div>
                  </div>
                </div>
                {i < CHAIN.length - 1 && (
                  <div style={{ padding: "8px 0" }}>
                    <Icon name="ChevronDown" size={20} style={{ color: "#CBD5E1" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ЧТО ПРОИСХОДИТ ПОСЛЕ ОБУЧЕНИЯ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Диплом — это только начало
          </h2>

          <p style={{ fontSize: 16, color: GRAY, marginBottom: 32 }}>После окончания обучения у выпускника появляются новые вопросы:</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 56, textAlign: "left" }}>
            {QUESTIONS.map(q => (
              <div key={q} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 4, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="HelpCircle" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#334155" }}>{q}</span>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 500, color: DARK, lineHeight: 1.4 }}>
            Школа даёт профессию.<br />
            <span style={{ color: TEAL }}>Промт Диалог помогает выпускнику реализовать её.</span>
          </div>
        </div>
      </section>

      {/* ── 4. ЧТО ПОЛУЧАЕТ ВЫПУСКНИК ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>Ценность для выпускника</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>Что получает выпускник</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {GRADUATE_GETS.map(g => (
              <div key={g.title} style={{ background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0", padding: "28px 26px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={g.icon} size={20} style={{ color: TEAL }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 8 }}>{g.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. КАК РАБОТАЕТ ИИ-НАВИГАТОР ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Не набор нейросетей, а система</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Пользователю не нужно искать нужный инструмент
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
              Например: «Хочу увеличить количество клиентов». ИИ анализирует профиль, цель, текущую ситуацию, предыдущие действия и точки роста.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "40px 36px" }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>После этого формирует маршрут</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 0 }}>
              {NAVIGATOR_STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                    {s}
                  </div>
                  {i < NAVIGATOR_STEPS.length - 1 && <Icon name="ArrowRight" size={16} style={{ color: "#CBD5E1", margin: "0 10px" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ГЛАВНЫЙ ПРОДАЮЩИЙ БЛОК ── */}
      <section style={{ padding: "96px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Главное преимущество</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.2 }}>
              Ваш курс может быть рекомендован именно тогда, когда он нужен выпускнику
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
              Промт Диалог отслеживает цели и задачи пользователя. Когда для следующего этапа развития ему требуется новый навык, система может предложить подходящий курс партнёрской школы.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "36px 40px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Цель</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>«Хочу увеличить доход»</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Текущая проблема</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>Недостаточно новых клиентов</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Следующий навык</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>Продвижение и позиционирование</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 28, paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Рекомендация</div>
                <div style={{ fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: SERIF }}>Курс вашей школы «Продвижение мастера»</div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                color: "#0F172A", padding: "13px 28px", borderRadius: 2,
                fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
              }}>
                Перейти к курсу
                <Icon name="ArrowRight" size={15} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. ЭТО НЕ ПРОСТО РЕКЛАМА ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Целевой спрос, а не размещение</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Не просто размещение. Целевой спрос
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40, textAlign: "left" }} className="compare-grid">
            <div style={{ background: "#FEF2F2", border: "1px solid #FECDD3", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon name="X" size={18} style={{ color: "#DC2626" }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: "#991B1B" }}>Обычная реклама</div>
              </div>
              <div style={{ fontSize: 14, color: "#7F1D1D", lineHeight: 1.7 }}>Курс показывают всем подряд, независимо от того, нужен ли он человеку прямо сейчас</div>
            </div>
            <div style={{ background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon name="Check" size={18} style={{ color: TEAL }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: DARK }}>Промт Диалог</div>
              </div>
              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>Курс показывают именно тогда, когда у пользователя возникла соответствующая потребность и цель</div>
            </div>
          </div>

          <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2.2vw,26px)", fontWeight: 500, color: DARK, lineHeight: 1.5, maxWidth: 680, margin: "0 auto" }}>
            Мы не хотим просто показывать ваши курсы. Мы хотим приводить к ним пользователя тогда, когда у него возникает соответствующая потребность.
          </div>
        </div>
      </section>

      {/* ── 8. ВИТРИНА ШКОЛЫ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Каталог обучения</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Ваша школа — внутри экосистемы Промт Диалог
            </h2>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {["Для мастеров", "Для массажистов", "Для администраторов", "Для владельцев"].map((cat, i) => (
                <div key={cat} style={{
                  padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                  background: i === 0 ? DARK : "#F1F5F9", color: i === 0 ? "#fff" : GRAY,
                }}>
                  {cat}
                </div>
              ))}
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "24px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 6, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={22} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 4 }}>Продвижение мастера</div>
                  <div style={{ fontSize: 13, color: GRAY, maxWidth: 400 }}>Практический курс для специалистов, которые хотят системно привлекать клиентов</div>
                </div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: `1px solid ${TEAL}`, color: TEAL,
                padding: "9px 20px", borderRadius: 2, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              }}>
                Подробнее
                <Icon name="ArrowRight" size={13} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: GRAY, marginTop: 16, marginBottom: 0, fontWeight: 300, textAlign: "center" }}>
              Кнопка ведёт на сайт вашей школы, а не на стороннюю страницу
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. СТАТИСТИКА ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Прозрачная аналитика</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Вы видите, что происходит с вашими выпускниками
            </h2>
          </div>

          <div style={{ background: DARK, borderRadius: 8, padding: "36px 32px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 28 }}>
              {["14 дней", "30 дней", "90 дней"].map((p, i) => (
                <div key={p} style={{
                  padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: i === 1 ? TEAL : "rgba(255,255,255,0.06)", color: i === 1 ? DARK : "rgba(255,255,255,0.5)",
                }}>
                  {p}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: TEAL, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. РЕЙТИНГ ШКОЛ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="Award" size={26} style={{ color: TEAL }} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
            Станьте частью рейтинга образовательных партнёров
          </h2>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {["14 дней", "30 дней", "90 дней"].map(p => (
              <div key={p} style={{ padding: "8px 20px", borderRadius: 100, fontSize: 13, fontWeight: 600, background: "#fff", border: "1px solid #E2E8F0", color: GRAY }}>{p}</div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.8, marginBottom: 28 }}>
            Показатели учитывают активность выпускников, количество пользователей, использование инструментов, участие в чемпионатах и вовлечённость.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 19, color: DARK, fontWeight: 500, lineHeight: 1.5 }}>
            Ваши выпускники становятся частью репутации школы внутри профессионального сообщества.
          </p>
        </div>
      </section>

      {/* ── 11. ЧЕМПИОНАТЫ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Соревновательный элемент</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Выпускники могут представлять вашу школу в чемпионатах
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 40 }}>
            {CHAMPIONSHIPS.map(c => (
              <div key={c} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "20px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: DARK, textAlign: "left" }}>{c}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 32px" }}>
            Победы и достижения выпускников создают дополнительную узнаваемость школы.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {["Школа", "Выпускник", "Участие", "Результат", "Рейтинг школы"].map((s, i, arr) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                  {s}
                </div>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={15} style={{ color: "#CBD5E1", margin: "0 8px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. ЧТО ПОЛУЧАЕТ ШКОЛА ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>Итог для партнёра</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>Что получает школа</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {SCHOOL_GETS.map(s => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "32px 28px" }}>
                <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. КАК ПОДКЛЮЧИТЬСЯ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Простой процесс</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Подключение занимает несколько шагов
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CONNECT_STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: "rgba(45,212,191,0.1)",
                    border: `1.5px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: TEAL, fontFamily: SERIF,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < CONNECT_STEPS.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 24, background: "#E2E8F0" }} />}
                </div>
                <div style={{ paddingTop: 8, paddingBottom: 24, fontSize: 15, color: "#334155", fontWeight: 500 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. ЧТО НУЖНО ОТ ШКОЛЫ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Никакой сложной интеграции</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От школы не требуется сложной интеграции
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="compare-grid">
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>На старте</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {NEEDED.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="Check" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "#334155" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Не требуется</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {NOT_NEEDED.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="X" size={16} style={{ color: "#CBD5E1", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: GRAY }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15. ПИЛОТ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
            <Icon name="Rocket" size={14} style={{ color: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Без рисков</span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
            Начните с пилотного запуска
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
            Не нужно сразу подключать всех выпускников. Можно начать с одного ближайшего потока и посмотреть реальные результаты.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {["1 поток", "промокод", "+200 энергии", "регистрации", "активность", "рекомендации курсов", "переходы на сайт школы"].map((s, i, arr) => (
              <div key={s} style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 100, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                  {s}
                </div>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={14} style={{ color: "#CBD5E1", margin: "0 6px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 16. ПРЕЗЕНТАЦИЯ ── */}
      <section style={{ padding: "88px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="FileText" size={26} style={{ color: TEAL }} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Хотите узнать подробнее?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>
            Мы подготовили расширенную презентацию о партнёрской программе Промт Диалог — 20 слайдов.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 36 }}>
            {["Модель партнёрства", "Возможности для школы", "Возможности для выпускников", "ИИ-рекомендации", "Статистика", "Рейтинги", "Чемпионаты", "Запуск пилота"].map(t => (
              <div key={t} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 12.5, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {t}
              </div>
            ))}
          </div>

          <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
            color: "#0F172A", padding: "16px 40px", borderRadius: 2,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 12px 32px rgba(45,212,191,0.3)",
          }}>
            Скачать презентацию
            <Icon name="Download" size={18} />
          </a>
        </div>
      </section>

      {/* ── 17. ФОРМА ── */}
      <section id="partner-form" style={{ padding: "96px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionLabel>Начнём сотрудничество</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.15 }}>
              Обсудить партнёрство
            </h2>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }} className="school-form-wrap">
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* ── 18. ФИНАЛЬНЫЙ ЭКРАН ── */}
      <section style={{ padding: "104px 32px", background: DARK, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.2vw,38px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.35 }}>
            Школа даёт профессию.<br />
            <span style={{ color: TEAL }}>Промт Диалог помогает превратить её в развитие.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Вместе мы можем дать выпускнику не только знания, но и понятный следующий шаг.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
              color: "#0F172A", padding: "14px 32px", borderRadius: 2,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              Скачать презентацию
              <Icon name="Download" size={16} />
            </a>
            <a href="#partner-form" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
              padding: "14px 32px", borderRadius: 2, fontSize: 15,
              fontWeight: 500, textDecoration: "none",
            }}>
              Стать партнёром
            </a>
          </div>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .compare-grid { grid-template-columns: 1fr !important; }
          .school-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .chain-flow > div > div { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
