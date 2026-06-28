import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const ADVANTAGES = [
  {
    num: "01",
    icon: "LayoutDashboard",
    color: TEAL,
    bg: "rgba(45,212,191,0.08)",
    border: "rgba(45,212,191,0.2)",
    title: "Всё в одном решении — без лишних сервисов",
    lead: "Оперативная диагностика, обучение, маркетинг и командная работа — всё в одной платформе",
    desc: "Не нужно прыгать между чатами, курсами и Excel. Всё, что нужно для роста бизнеса — здесь.",
  },
  {
    num: "02",
    icon: "Bot",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    title: "ИИ-агенты работают по вашей ситуации, а не по шаблону",
    lead: "Каждый инструмент — от анализа клиентов до генерации постов — настраивается под специфику вашего салона",
    desc: "Не теряете время и деньги на «общие советы», экономите месяцы экспериментов.",
  },
  {
    num: "03",
    icon: "TrendingUp",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "Измеримый результат — ROI на первом месте",
    lead: "Каждый инструмент заточен под рост дохода, снижение оттока клиентов и повышение среднего чека",
    desc: "Всегда понятно, где вырастили прибыль, где сэкономили, что изменилось в цифрах.",
  },
  {
    num: "04",
    icon: "Zap",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    title: "Вовлечённость персонала на новом уровне",
    lead: "Система внутренней валюты «Энергия» — инструмент мотивации и прозрачного контроля",
    desc: "Мастера сами вовлекаются в развитие, а управляющий получает прозрачную аналитику по каждому сотруднику и всей команде.",
  },
  {
    num: "05",
    icon: "Rocket",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    title: "Быстрый старт и поддержка от практиков",
    lead: "Не нужно учиться месяцами: зарегистрировались, получили энергию и начали работать",
    desc: "Если что-то не ясно — команда поддержки и личные разборы от экспертов всегда на связи. Мы сами выросли из реального бизнеса, не теоретики.",
  },
];

const RESULTS = [
  { icon: "Building2", color: TEAL, metric: "+38%", label: "к обороту за 4 месяца", sub: "Салон из Москвы" },
  { icon: "User", color: "#7c3aed", metric: "+13", label: "новых записей в первый месяц", sub: "Массажист-частник" },
  { icon: "Users", color: "#059669", metric: "×2", label: "снижение оттока сотрудников", sub: "Салон на 4 мастера" },
];

const FAQ = [
  { q: "Подойдёт ли платформа, если мы только открылись?", a: "Да. Для новых салонов особенно ценна диагностика клиентов, генерация маркетинговых материалов и готовые скрипты — это сокращает путь к первым постоянным клиентам." },
  { q: "Есть ли успехи у салонов из маленьких городов?", a: "Инструменты работают вне зависимости от региона. Маркетинг, скрипты, обучение персонала — всё адаптируется под аудиторию вашего города." },
  { q: "Как быстро увидим эффект?", a: "Первые рекомендации и конкретные инструменты получаете в первый же день. Практические результаты — рост чека и возврат клиентов — клиенты фиксируют в первый месяц." },
];

export default function Preimushchestva() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Почему Промт Диалог — преимущества платформы для салона красоты</title>
        <meta name="description" content="5 ключевых преимуществ платформы Промт Диалог: ИИ-агенты под вашу ситуацию, измеримый ROI, вовлечённость команды и быстрый старт." />
        <meta name="keywords" content="преимущества платформы, почему Промт Диалог, ИИ для салона, рост выручки салона" />
        <link rel="canonical" href="https://promtdialog.ru/preimushchestva" />
        <meta property="og:title" content="Почему Промт Диалог — 5 преимуществ платформы" />
        <meta property="og:url" content="https://promtdialog.ru/preimushchestva" />
        <meta property="og:type" content="website" />
      </Helmet>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 70% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        padding: "160px 32px 100px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="preim-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Почему мы</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5.5vw,72px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              Результат, который превосходит ожидания
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              5 ключевых преимуществ платформы
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: 0, fontWeight: 500, letterSpacing: "0.5px" }}>
              Точность · Скорость · Результат · Поддержка · Надёжность
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="preim-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/84bf3f01-1a22-4e09-bcc8-01ea46cd70a5.png"
                alt="Почему с нами растут быстрее — 5 преимуществ платформы"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 ПРЕИМУЩЕСТВ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {ADVANTAGES.map((adv, i) => (
            <div key={i} style={{
              border: `1.5px solid ${adv.border}`,
              borderRadius: 20,
              padding: "44px 48px",
              background: adv.bg,
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: 36,
              alignItems: "start",
            }} className="adv-card">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fff", border: `1.5px solid ${adv.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${adv.color}18` }}>
                  <Icon name={adv.icon} size={24} style={{ color: adv.color }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: adv.color, lineHeight: 1, opacity: 0.5 }}>{adv.num}</div>
              </div>
              <div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 600, color: DARK, margin: "0 0 12px", lineHeight: 1.2 }}>
                  {adv.title}
                </h2>
                <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: "#334155", lineHeight: 1.6 }}>{adv.lead}</p>
                <p style={{ margin: 0, fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ЦИТАТА ОСНОВАТЕЛЯ ── */}
      <section style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 20, padding: "52px 56px", background: "#fff", position: "relative" }} className="quote-card">
            <div style={{ position: "absolute", top: 32, left: 48, fontFamily: SERIF, fontSize: 120, color: "#E2E8F0", lineHeight: 0.8, userSelect: "none" }}>"</div>
            <blockquote style={{ margin: 0, position: "relative" }}>
              <p style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.2vw,26px)", color: DARK, lineHeight: 1.6, margin: "0 0 32px", fontWeight: 500 }}>
                Я запускал и продавал бизнесы в этой индустрии. Меня всегда удивляло, что 90% сервисов — это либо «общие курсы», либо неудобные CRM. Мы сделали практичный инструмент, который реально работает на ROI, а не на «красивую теорию».
              </p>
              <footer style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `rgba(45,212,191,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="User" size={22} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Сергей Водопьянов</div>
                  <div style={{ fontSize: 13, color: GRAY, marginTop: 2 }}>Основатель Промт Диалог</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Цифры</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Примеры реальных результатов
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginBottom: 48 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Icon name={r.icon} size={26} style={{ color: r.color }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 700, color: r.color, lineHeight: 1, marginBottom: 8 }}>{r.metric}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 6, lineHeight: 1.4 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{r.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: "32px", background: "rgba(45,212,191,0.06)", borderRadius: 16, border: "1px solid rgba(45,212,191,0.2)" }}>
            <p style={{ margin: 0, fontSize: 16, color: "#334155", lineHeight: 1.7, fontWeight: 400 }}>
              <strong style={{ color: DARK }}>Промт Диалог — не про обучение ради обучения.</strong> Это инструмент, который в течение месяца меняет ключевые цифры вашего бизнеса. Всё остальное — детали.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>FAQ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Частые вопросы
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: GRAY, flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "100px 32px",
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
            Готовы вырасти быстрее конкурентов?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", fontWeight: 300, lineHeight: 1.7 }}>
            Оставьте заявку — покажем, как за неделю изменить показатели вашего бизнеса.
          </p>
          <Link
            to="/cabinet"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 48px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <Icon name="Zap" size={16} />
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />
      <style>{`
        @media (max-width: 768px) {
          .preim-hero-grid { grid-template-columns: 1fr !important; }
          .preim-hero-img { margin-top: 32px; }
          .adv-card { grid-template-columns: 1fr !important; gap: 20px !important; padding: 28px 24px !important; }
          .quote-card { padding: 36px 28px !important; }
        }
      `}</style>
    </div>
  );
}