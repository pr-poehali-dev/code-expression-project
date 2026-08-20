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

const ROLES = [
  {
    id: "owner",
    icon: "Crown",
    title: "Владельцу салона",
    subtitle: "Управление бизнесом на основе данных, а не интуиции",
    pain: "Много работы, но прибыль не растёт. Непонятно, где теряются деньги и что мешает масштабироваться.",
    tools: [
      { icon: "ClipboardList", name: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки на основе данных салона." },
      { icon: "UserSearch", name: "Анализ персонала", desc: "Объективная картина: кто действительно приносит прибыль." },
      { icon: "ScanLine", name: "Диагностика салона", desc: "Полный аудит всех направлений бизнеса." },
      { icon: "BarChart3", name: "Финансовые расчёты", desc: "Точки безубыточности и прогнозы выручки." },
    ],
  },
  {
    id: "admin",
    icon: "Briefcase",
    title: "Администратору",
    subtitle: "Больше продаж без давления и скриптов в голове",
    pain: "Клиенты уходят без повторной записи. Сложно мягко предложить услугу или отработать возражение.",
    tools: [
      { icon: "MessagesSquare", name: "Скрипты общения", desc: "Готовые сценарии на любую ситуацию." },
      { icon: "ShieldCheck", name: "Работа с возражениями", desc: "Выверенные ответы на «дорого» и «подумаю»." },
      { icon: "RotateCcw", name: "Повторная запись", desc: "Алгоритм возврата клиента после визита." },
      { icon: "Star", name: "Ответы на отзывы", desc: "Профессиональная репутация в сети." },
    ],
  },
  {
    id: "master",
    icon: "Scissors",
    title: "Мастеру",
    subtitle: "Рост личного дохода и базы постоянных клиентов",
    pain: "Клиенты не возвращаются именно к вам. Социальные сети молчат, потому что неясно, о чём писать.",
    tools: [
      { icon: "PenLine", name: "Генератор постов", desc: "Контент о себе и своей работе за пару минут." },
      { icon: "Video", name: "Идеи для Reels", desc: "Сценарии коротких видео под вашу аудиторию." },
      { icon: "FileText", name: "Шпаргалки мастера", desc: "Памятки по техникам и продуктам." },
      { icon: "MessagesSquare", name: "Скрипты допродаж", desc: "Корректное предложение домашнего ухода." },
    ],
  },
  {
    id: "specialist",
    icon: "HandHeart",
    title: "Специалисту по телу",
    subtitle: "Работа глубже — с контекстом каждого клиента",
    pain: "Каждый клиент уникален, но держать всё в голове невозможно. Хочется давать персональный результат.",
    tools: [
      { icon: "Stethoscope", name: "Диагностика клиента", desc: "Структурированный опрос и анализ состояния." },
      { icon: "HeartPulse", name: "Программы восстановления", desc: "Индивидуальный план работы на полный курс." },
      { icon: "FileText", name: "Шпаргалки специалиста", desc: "Противопоказания и рабочие протоколы." },
      { icon: "PenLine", name: "Контент о практике", desc: "Посты для личного профессионального бренда." },
    ],
  },
];

export default function DlyaKogo() {
  const [activeId, setActiveId] = useState("owner");
  const active = ROLES.find(r => r.id === activeId)!;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Для кого платформа — владельцы, администраторы, мастера | Промт Диалог</title>
        <meta name="description" content="Промт Диалог помогает владельцам салонов, администраторам и мастерам: инструменты под каждую роль. Маркетинг, управление, скрипты продаж и обучение." />
        <meta name="keywords" content="платформа для владельца салона, инструменты для администратора, обучение мастеров, управление салоном красоты" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-kogo" />
        <meta property="og:title" content="Для кого Промт Диалог — инструменты под каждую роль в салоне" />
        <meta property="og:description" content="Владельцы, администраторы, мастера — у каждого свои инструменты для роста и развития." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-kogo" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="dlya-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Для кого</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Инструменты под каждую роль в вашем салоне
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              Каждый получает именно то, что нужно для роста его результата.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0", fontWeight: 500, letterSpacing: "0.5px" }}>
              Владелец · Администратор · Мастер · Специалист по телу
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="dlya-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/5ffa6a5a-2302-4912-b402-5b27c2920f6c.png"
                alt="Для кого Промт Диалог — владельцы, администраторы и мастера салона красоты"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ИНТЕРАКТИВНЫЙ БЛОК ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Tabs */}
          <div className="roles-tabs" style={{ display: "flex", gap: 12, marginBottom: 56, flexWrap: "wrap", justifyContent: "center" }}>
            {ROLES.map(r => {
              const isActive = activeId === r.id;
              return (
                <button key={r.id} onClick={() => setActiveId(r.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "13px 24px",
                    borderRadius: 2, border: "1px solid", cursor: "pointer",
                    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: "0.3px",
                    transition: "all 0.3s",
                    borderColor: isActive ? TEAL : "#E2E8F0",
                    background: isActive ? "rgba(45,212,191,0.08)" : "#fff",
                    color: isActive ? DARK : GRAY,
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; }}
                >
                  <Icon name={r.icon} size={18} style={{ color: TEAL }} />
                  {r.title}
                </button>
              );
            })}
          </div>

          {/* Active role content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }} className="role-grid">
            {/* Left: description */}
            <div style={{ background: "#fff", padding: "48px 44px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                <Icon name={active.icon} size={30} style={{ color: TEAL }} />
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.5vw,40px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{active.title}</h2>
              <p style={{ fontSize: 16, fontWeight: 400, color: TEAL, margin: "0 0 28px", lineHeight: 1.5 }}>{active.subtitle}</p>
              <div style={{ borderLeft: `1px solid ${TEAL}`, paddingLeft: 20 }}>
                <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.7, fontWeight: 300 }}>{active.pain}</p>
              </div>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10, marginTop: 36, padding: "15px 32px", borderRadius: 2,
                background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                Попробовать <Icon name="ArrowRight" size={16} />
              </Link>
            </div>

            {/* Right: tools */}
            <div style={{ background: "#fff", padding: "48px 44px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 28 }}>Инструменты для этой роли</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {active.tools.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "20px 0", borderTop: i === 0 ? "none" : "1px solid #EAEEF3" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 2, border: "1px solid #EAEEF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={t.icon} size={22} style={{ color: TEAL }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: DARK, marginBottom: 4 }}>{t.name}</div>
                      <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Получите план роста дохода бесплатно
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Создайте профиль салона и получите доступ ко всем инструментам платформы. Без карты и обязательств.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Создать профиль
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .dlya-hero-grid { grid-template-columns: 1fr !important; }
          .dlya-hero-img { margin-top: 32px; }
          .role-grid { grid-template-columns: 1fr !important; }
          .roles-tabs { justify-content: flex-start !important; }
        }
      `}</style>
    </div>
  );
}