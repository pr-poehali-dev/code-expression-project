import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { Link } from "react-router-dom";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const PACKAGES = [
  {
    code: "start",
    name: "Старт",
    price: 990,
    energy: 150,
    color: "#64748B",
    desc: "Попробуйте платформу",
    features: ["150 ⚡ энергий", "Все инструменты", "Техподдержка"],
    popular: false,
  },
  {
    code: "business",
    name: "Бизнес",
    price: 2990,
    energy: 550,
    color: TEAL,
    desc: "Для активного использования",
    features: ["550 ⚡ энергий", "Все инструменты", "Приоритетная поддержка", "Экономия 15%"],
    popular: true,
  },
  {
    code: "growth",
    name: "Рост",
    price: 4990,
    energy: 1200,
    color: "#8B5CF6",
    desc: "Для всей команды",
    features: ["1200 ⚡ энергий", "Все инструменты", "Приоритетная поддержка", "Экономия 33%"],
    popular: false,
  },
  {
    code: "premium",
    name: "Премиум",
    price: 9990,
    energy: 3000,
    color: "#F59E0B",
    desc: "Максимальная мощность",
    features: ["3000 ⚡ энергий", "Все инструменты", "VIP-поддержка", "Экономия 50%", "Личный менеджер"],
    popular: false,
  },
];

const FAQ = [
  { q: "Что такое энергия ⚡?", a: "Энергия — это внутренняя валюта платформы. Каждый ИИ-инструмент тратит определённое количество энергий. Чем мощнее инструмент, тем больше расход." },
  { q: "Можно ли попробовать бесплатно?", a: "Да! При создании первого профиля салона вы получаете 100 ⚡ в подарок. Этого достаточно для знакомства с платформой." },
  { q: "Не использованные энергии сгорают?", a: "Нет. Купленные энергии хранятся на балансе вашего салона без ограничения срока." },
  { q: "Можно добавить несколько сотрудников?", a: "Да, вы можете пригласить команду в кабинет. Все используют общий баланс энергий салона." },
];

export default function Tseny() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${DARK}, #1E293B)`, padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px" }}>
            Простые тарифы
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", margin: "0 0 16px", lineHeight: 1.6 }}>
            Платите только за то, что используете. Никаких скрытых платежей.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 100, padding: "8px 18px" }}>
            <span style={{ fontSize: 18 }}>🎁</span>
            <span style={{ fontSize: 14, color: TEAL, fontWeight: 600 }}>100 ⚡ бесплатно при регистрации</span>
          </div>
        </div>
      </section>

      {/* Energy explainer */}
      <section style={{ background: "#F8FAFC", padding: "56px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px", border: "1.5px solid #E2E8F0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="energy-grid">
            <div style={{ textAlign: "center", padding: "16px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>Что такое энергия</h3>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6 }}>Внутренняя валюта платформы. Тратится при использовании ИИ-инструментов.</p>
            </div>
            <div style={{ textAlign: "center", padding: "16px", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }} className="energy-middle">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔋</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>Не сгорает</h3>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6 }}>Купленные энергии хранятся без ограничения срока. Используйте когда удобно.</p>
            </div>
            <div style={{ textAlign: "center", padding: "16px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px" }}>Для всей команды</h3>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6 }}>Один баланс на весь салон. Все сотрудники используют общий запас.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: "56px 24px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: DARK, margin: "0 0 12px" }}>Выберите пакет</h2>
            <p style={{ fontSize: 17, color: GRAY, margin: 0 }}>Оплата через ЮKassa — будет доступна в ближайшее время</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.code} style={{
                border: pkg.popular ? `2px solid ${TEAL}` : "1.5px solid #E2E8F0",
                borderRadius: 20, overflow: "hidden",
                boxShadow: pkg.popular ? "0 12px 40px rgba(20,184,166,0.2)" : "none",
                position: "relative",
              }}>
                {pkg.popular && (
                  <div style={{ background: TEAL, color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 700, padding: "7px", letterSpacing: "0.5px" }}>
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div style={{ padding: "28px 24px" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: DARK, margin: "0 0 6px" }}>{pkg.name}</h3>
                  <p style={{ fontSize: 13, color: GRAY, margin: "0 0 20px" }}>{pkg.desc}</p>

                  <div style={{ margin: "0 0 8px" }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: pkg.color }}>{pkg.price.toLocaleString()} ₽</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                    <span style={{ fontSize: 22 }}>⚡</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: pkg.color }}>{pkg.energy.toLocaleString()}</span>
                    <span style={{ fontSize: 14, color: GRAY }}>энергий</span>
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, marginBottom: 24 }}>
                    {pkg.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${pkg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: pkg.color, fontWeight: 700, flexShrink: 0 }}>✓</div>
                        <span style={{ fontSize: 13, color: "#334155" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button disabled style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: pkg.popular ? `linear-gradient(135deg,${TEAL},#0D9488)` : "#F1F5F9", color: pkg.popular ? "#fff" : GRAY, fontSize: 14, fontWeight: 700, cursor: "not-allowed", fontFamily: "Inter, sans-serif", opacity: 0.75 }}>
                    Скоро
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F8FAFC", padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: DARK, textAlign: "center", margin: "0 0 48px" }}>Частые вопросы</h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "24px", marginBottom: 12, border: "1.5px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: "0 0 10px" }}>{item.q}</h3>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0D9488,#14B8A6)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 16px" }}>
            Начните бесплатно
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", margin: "0 0 32px" }}>
            Создайте профиль салона и получите 100 ⚡ в подарок прямо сейчас
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "15px 40px", borderRadius: 12, background: "#fff", color: "#0D9488", fontSize: 16, fontWeight: 800, textDecoration: "none" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 640px) {
          .energy-grid { grid-template-columns: 1fr !important; }
          .energy-middle { border-left: none !important; border-right: none !important; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; }
        }
      `}</style>
    </div>
  );
}
