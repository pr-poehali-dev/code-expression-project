import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const BASE_PRICE_PER_ENERGY = 990 / 150;

const PACKAGES = [
  { code: "start", name: "Старт", price: 990, energy: 150, desc: "Чтобы попробовать", features: ["Все инструменты", "Техническая поддержка"], popular: false },
  { code: "business", name: "Бизнес", price: 2990, energy: 550, desc: "Для частой работы", features: ["Все инструменты", "Приоритетная поддержка"], popular: true },
  { code: "growth", name: "Рост", price: 4990, energy: 1200, desc: "Для постоянной работы", features: ["Все инструменты", "Приоритетная поддержка"], popular: false },
  { code: "premium", name: "Премиум", price: 9990, energy: 3000, desc: "Самая низкая цена энергии", features: ["Все инструменты", "VIP-поддержка", "Личный менеджер"], popular: false },
].map(p => ({
  ...p,
  perEnergy: p.price / p.energy,
  saving: Math.round((1 - p.price / p.energy / BASE_PRICE_PER_ENERGY) * 100),
}));

const MIN_REQUEST_PRICE = Math.min(...PACKAGES.map(p => p.perEnergy));
const fmtRub = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const FREE_STEPS = [
  { icon: "UserPlus", title: "Зарегистрируйтесь", desc: "Расскажите о практике или бизнесе, это займет несколько минут." },
  { icon: "Compass", title: "Пользуйтесь бесплатно", desc: "Платформа анализирует данные и каждый день предлагает шаги." },
  { icon: "Zap", title: "Подключайте инструменты", desc: "Для сообщений, постов и аналитики тратьте энергию." },
];

const EXPLAINER = [
  { icon: "Zap", title: "Что такое энергия", desc: "Внутренняя валюта платформы. Тратится только при запуске инструментов." },
  { icon: "Battery", title: "Не сгорает", desc: "Купленная энергия хранится на балансе без срока." },
  { icon: "ShieldCheck", title: "Не списывается при сбое", desc: "Если генерация оборвалась, энергия возвращается." },
];

const FAQ = [
  { q: "Нужно ли платить сразу", a: "Нет. После регистрации платформа бесплатна, шаги вы получаете сразу. Карту привязывать не нужно." },
  { q: "Что такое энергия", a: "Внутренняя валюта платформы. Чем сложнее запрос, тем больше энергии он тратит." },
  { q: "Сколько стоит один запрос", a: "Сообщение клиенту, пост и ответ на отзыв стоят 1 энергию, то есть от 3,3 ₽. Анализы и аудиты тратят несколько энергий." },
  { q: "Чем отличаются пакеты", a: "Количеством энергии и ценой одной: в «Старте» 6,6 ₽, в «Бизнесе» 5,4 ₽, в «Росте» 4,2 ₽, в «Премиуме» 3,3 ₽." },
  { q: "Нужна ли подписка", a: "Нет. Вы платите только за энергию." },
  { q: "Энергия сгорает", a: "Нет. Она хранится на балансе без срока." },
  { q: "Спишется ли энергия, если произошел сбой", a: "Нет. При сбое сервиса или обрыве связи энергия не списывается." },
];

export default function Tseny() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Стоимость запроса от 3,3 ₽ — бесплатный старт | Промт Диалог</title>
        <meta name="description" content="Шаги после регистрации бесплатны. Дальше платите только за энергию: запрос от 3,3 ₽, без абонентской платы." />
        <meta name="keywords" content="цены Промт Диалог, стоимость запроса, тарифы Промт Диалог, энергия Промт Диалог, платформа для специалистов, стоимость платформы для специалистов" />
        <link rel="canonical" href="https://promtdialog.ru/tseny" />
        <meta property="og:title" content="Промт Диалог — бесплатный старт и запрос от 3,3 ₽" />
        <meta property="og:description" content="Без абонентской платы: платите только за энергию. Шаги после регистрации бесплатны." />
        <meta property="og:url" content="https://promtdialog.ru/tseny" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PriceSpecification",
          "name": "Тарифы Промт Диалог",
          "description": "Бесплатный старт, запрос от 3,3 ₽, без подписки.",
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
              Бесплатный старт, дальше — только за запросы
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              После регистрации шаги бесплатны, энергию вы тратите только на нужные запросы.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: TEAL, lineHeight: 1.6, margin: "0 0 32px", fontWeight: 500, letterSpacing: "0.5px" }}>
              Без найма · Без абонплаты · Запрос от 3,3 ₽
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
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/9e10412f-36fd-4008-878d-768ef479ea03.jpg"
                alt="Специалист работает за ноутбуком — энергия для роста вашего дела"
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
          <div style={{ textAlign: "left", marginBottom: 48, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Стоимость</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Платите за запросы
            </h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.6 }}>
              Чем больше энергии берете за раз, тем дешевле каждая.
            </p>
          </div>

          <div className="price-hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 56 }}>
            <div style={{ background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "40px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14, position: "relative" }}>Минимальная стоимость запроса</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", position: "relative" }}>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>от</span>
                <span style={{ fontFamily: SERIF, fontSize: "clamp(56px,7vw,84px)", fontWeight: 600, color: "#fff", lineHeight: 1 }}>{fmtRub(MIN_REQUEST_PRICE)}</span>
                <span style={{ fontSize: 28, color: TEAL, fontWeight: 500 }}>₽</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "16px 0 0", lineHeight: 1.7, position: "relative" }}>
                за запрос: сообщение клиенту, пост, ответ на отзыв, идея для акции.
              </p>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "40px 40px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon name="Gift" size={24} style={{ color: "#0F766E" }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: DARK, margin: "0 0 12px", lineHeight: 1.2 }}>
                Начните без оплаты
              </h3>
              <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                После регистрации шаги бесплатны. Карта не нужна.
              </p>
            </div>
          </div>

          <div className="free-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 72 }}>
            {FREE_STEPS.map((f, i) => (
              <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 6, padding: "28px 26px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={f.icon} size={19} style={{ color: "#0F766E" }} />
                  </div>
                  <span style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: TEAL, lineHeight: 1 }}>{i + 1}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 640, marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Пакеты энергии</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.15 }}>
              Чем больше энергии, тем дешевле каждая
            </h2>
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
                Без потерь
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 500, color: "#fff", margin: "0 0 10px", lineHeight: 1.25 }}>
                Энергия не сгорает и не списывается при сбое
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 16px", lineHeight: 1.7, maxWidth: 620 }}>
                Купленная энергия остается на балансе без срока.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 10, padding: "9px 14px" }}>
                <Icon name="ShieldOff" size={15} style={{ color: TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "#fff", fontWeight: 500 }}>При сбое или обрыве связи энергия не списывается</span>
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
                  <p style={{ fontSize: 13, color: GRAY, margin: "0 0 24px", fontWeight: 300 }}>{pkg.desc}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Icon name="Zap" size={26} style={{ color: TEAL }} />
                    <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: DARK, lineHeight: 1 }}>{pkg.energy.toLocaleString("ru-RU")}</span>
                  </div>
                  <div style={{ fontSize: 14, color: GRAY, fontWeight: 300, marginBottom: 20 }}>энергий в пакете</div>

                  <div style={{ background: pkg.popular ? "rgba(45,212,191,0.12)" : "#F1F5F9", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>Стоимость 1 энергии</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: DARK }}>{fmtRub(pkg.perEnergy)} ₽</div>
                  </div>
                  <div style={{ minHeight: 28, marginBottom: 20 }}>
                    {pkg.saving > 0 && (
                      <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: "#0F766E", background: "rgba(45,212,191,0.14)", borderRadius: 20, padding: "4px 12px" }}>
                        Выгоднее на {pkg.saving}%
                      </span>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid #EAEEF3", paddingTop: 22, marginBottom: 28, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
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
                    Начать бесплатно
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
        <div className="tseny-cta" style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Начните бесплатно
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Без карты и обязательств.
          </p>
          <Link to="/cabinet" className="tseny-cta-btn" style={{
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
          .price-hero { grid-template-columns: 1fr !important; }
          .free-steps { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .guarantee-block { flex-direction: column !important; align-items: flex-start !important; padding: 32px 28px !important; }
        }
        @media (max-width: 560px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
          .tseny-cta { padding: 40px 24px !important; }
          .tseny-cta-btn { display: flex !important; width: 100%; box-sizing: border-box; justify-content: center; padding: 16px 20px !important; }
          .guarantee-block { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}