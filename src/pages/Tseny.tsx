import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const PACKAGES = [
  {
    code: "start",
    name: "Старт",
    price: 990,
    energy: 150,
    desc: "Знакомство с платформой",
    features: ["150 энергий", "Все инструменты", "Техническая поддержка"],
    popular: false,
  },
  {
    code: "business",
    name: "Бизнес",
    price: 2990,
    energy: 550,
    desc: "Для активного использования",
    features: ["550 энергий", "Все инструменты", "Приоритетная поддержка", "Экономия 15%"],
    popular: true,
  },
  {
    code: "growth",
    name: "Рост",
    price: 4990,
    energy: 1200,
    desc: "Для всей команды салона",
    features: ["1200 энергий", "Все инструменты", "Приоритетная поддержка", "Экономия 33%"],
    popular: false,
  },
  {
    code: "premium",
    name: "Премиум",
    price: 9990,
    energy: 3000,
    desc: "Максимальная мощность",
    features: ["3000 энергий", "Все инструменты", "VIP-поддержка", "Экономия 50%", "Личный менеджер"],
    popular: false,
  },
];

const EXPLAINER = [
  { icon: "Zap", title: "Что такое энергия", desc: "Внутренняя валюта платформы. Расходуется при использовании интеллектуальных инструментов." },
  { icon: "Battery", title: "Не сгорает", desc: "Приобретённые энергии хранятся на балансе салона без ограничения срока." },
  { icon: "Users", title: "Для всей команды", desc: "Один баланс на весь салон — все сотрудники используют общий запас." },
];

const FAQ = [
  { q: "Что такое энергия", a: "Энергия — это внутренняя валюта платформы. Каждый инструмент расходует определённое количество энергий: чем сложнее задача, тем выше расход." },
  { q: "Можно ли попробовать бесплатно", a: "Да. В разделе «ПоДелам» — навигаторе дохода — можно получить план роста без оплаты, чтобы оценить платформу перед покупкой энергии." },
  { q: "Не использованные энергии сгорают", a: "Нет. Приобретённые энергии хранятся на балансе вашего салона без ограничения срока." },
  { q: "Можно добавить несколько сотрудников", a: "Да. Вы можете пригласить команду в кабинет — все используют общий баланс энергий салона." },
];

export default function Tseny() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Цены и тарифы — энергия для работы с платформой | Промт Диалог</title>
        <meta name="description" content="Гибкая система энергии: платите только за то, что используете. Пакеты от 500 до 5000 энергий. Получить план роста дохода — бесплатно." />
        <meta name="keywords" content="цены Промт Диалог, тарифы для салона, стоимость платформы для салона красоты" />
        <link rel="canonical" href="https://promtdialog.ru/tseny" />
        <meta property="og:title" content="Цены и тарифы Промт Диалог — платите только за результат" />
        <meta property="og:description" content="Гибкая система энергии без подписки. Получить план роста дохода — бесплатно." />
        <meta property="og:url" content="https://promtdialog.ru/tseny" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PriceSpecification",
          "name": "Тарифы Промт Диалог",
          "description": "Гибкая система энергии для платформы роста салона. Нет подписки — платите только за использование.",
          "url": "https://promtdialog.ru/tseny"
        })}</script>
      </Helmet>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="tseny-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Тарифы</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              ИИ-аутсорсинг дешевле одного сотрудника
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              Маркетолог, аналитик, тренер, методист — всё это платформа за фиксированную сумму в месяц. Платите только за то, что используете.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0 0 32px", fontWeight: 500, letterSpacing: "0.5px" }}>
              Без найма · Без абонплаты · Без переплат
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "9px 20px" }}>
              <Icon name="Gift" size={16} style={{ color: TEAL }} />
              <span style={{ fontSize: 13, color: TEAL, fontWeight: 500, letterSpacing: "0.5px" }}>Получить план роста дохода — бесплатно</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="tseny-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/7e2e1016-046a-471a-bd05-7f4f26cec768.png"
                alt="Тарифы Промт Диалог — энергия для роста салона"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ОБЪЯСНЕНИЕ ЭНЕРГИИ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="energy-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {EXPLAINER.map((e, i) => (
              <div key={i} style={{ background: "#fff", padding: "48px 40px", textAlign: "left" }}>
                <div style={{ width: 56, height: 56, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 28px" }}>
                  <Icon name={e.icon} size={24} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, margin: "0 0 12px" }}>{e.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПАКЕТЫ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 72, maxWidth: 600 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Пакеты</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Выберите пакет
            </h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0, fontWeight: 300 }}>Оплата через ЮKassa — будет доступна в ближайшее время</p>
          </div>

          {/* ── ГАРАНТИЯ РЕЗУЛЬТАТА ── */}
          <div style={{
            background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6,
            padding: "40px 44px", marginBottom: 56, position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }} className="guarantee-block">
            <div style={{ position: "absolute", right: -50, top: -50, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="ShieldCheck" size={30} style={{ color: TEAL }} />
            </div>
            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 8 }}>
                Гарантия результата
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 500, color: "#fff", margin: "0 0 10px", lineHeight: 1.25 }}>
                Выполняете план инструментами платформы — получаете результат
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 16px", lineHeight: 1.7, maxWidth: 620 }}>
                Каждый день ИИ собирает конкретные шаги под ваши цифры, а инструменты кабинета доводят их до готового действия — сообщения клиентам, офферы, контент. Купленная энергия не сгорает и остаётся на балансе сколько угодно.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 10, padding: "9px 14px" }}>
                <Icon name="ShieldOff" size={15} style={{ color: TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "#fff", fontWeight: 500 }}>Сбой сервиса или обрыв связи во время генерации — энергия не списывается</span>
              </div>
            </div>
          </div>

          <div className="pkg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.code} style={{
                border: pkg.popular ? `1px solid ${TEAL}` : "1px solid #E2E8F0",
                borderRadius: 4, overflow: "hidden", position: "relative",
                display: "flex", flexDirection: "column",
                background: pkg.popular ? "rgba(45,212,191,0.04)" : "#fff",
              }}>
                {pkg.popular && (
                  <div style={{ background: TEAL, color: DARK, textAlign: "center", fontSize: 11, fontWeight: 600, padding: "8px", letterSpacing: "1.5px" }}>
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: DARK, margin: "0 0 6px" }}>{pkg.name}</h3>
                  <p style={{ fontSize: 13, color: GRAY, margin: "0 0 28px", fontWeight: 300 }}>{pkg.desc}</p>

                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: DARK, lineHeight: 1 }}>{pkg.price.toLocaleString("ru-RU")}</span>
                    <span style={{ fontSize: 18, color: GRAY, fontWeight: 300, marginLeft: 4 }}>₽</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                    <Icon name="Zap" size={18} style={{ color: TEAL }} />
                    <span style={{ fontSize: 18, fontWeight: 500, color: DARK }}>{pkg.energy.toLocaleString("ru-RU")}</span>
                    <span style={{ fontSize: 14, color: GRAY, fontWeight: 300 }}>энергий</span>
                  </div>

                  <div style={{ borderTop: "1px solid #EAEEF3", paddingTop: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    {pkg.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Icon name="Check" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.4, fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/cabinet" style={{
                    display: "block", width: "100%", padding: "14px", borderRadius: 2, border: pkg.popular ? "none" : "1px solid #E2E8F0",
                    background: pkg.popular ? "linear-gradient(135deg,#2DD4BF,#14B8A6)" : "#F8FAFC",
                    color: pkg.popular ? DARK : GRAY, fontSize: 14, fontWeight: 500, letterSpacing: "0.3px",
                    cursor: "pointer", fontFamily: "Inter, sans-serif", textDecoration: "none",
                    textAlign: "center", boxSizing: "border-box",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.85"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; }}
                  >
                    Получить энергию в подарок
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Вопросы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Частые вопросы
            </h2>
          </div>
          <div style={{ border: "1px solid #EAEEF3" }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 36px", borderBottom: i < FAQ.length - 1 ? "1px solid #EAEEF3" : "none" }}>
                <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 12px" }}>{item.q}</h3>
                <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Начните бесплатно
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Получите план роста дохода бесплатно. Без карты и обязательств.
          </p>
          <Link to="/cabinet" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 44px", borderRadius: 2,
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, letterSpacing: "0.3px",
            textDecoration: "none", position: "relative", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            Попробовать бесплатно <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .tseny-hero-grid { grid-template-columns: 1fr !important; }
          .tseny-hero-img { margin-top: 32px; }
        }
        @media (max-width: 880px) {
          .energy-grid { grid-template-columns: 1fr !important; }
          .pkg-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 700px) {
          .guarantee-block { flex-direction: column !important; align-items: flex-start !important; padding: 32px 28px !important; }
        }
        @media (max-width: 560px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}