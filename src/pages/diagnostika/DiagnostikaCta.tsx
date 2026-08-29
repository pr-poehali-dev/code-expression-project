import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const STEPS = [
  { num: "01", title: "Регистрация",     desc: "Аккаунт за 1 минуту. Без карты.",                                                          icon: "UserPlus"   },
  { num: "02", title: "Поставьте цель",  desc: "Название дела, показатели и цель по доходу — займёт 3 минуты.",                             icon: "Target"     },
  { num: "03", title: "Пройдите диагностику", desc: "8–12 вопросов о вашей практике или бизнесе — ИИ построит карту точек роста.",          icon: "PlayCircle" },
  { num: "04", title: "Получайте план каждый день", desc: "Не разовый отчёт — ИИ ежедневно подсказывает следующий шаг к цели.",             icon: "RefreshCw"  },
];

export default function DiagnostikaCta() {
  return (
    <>
      {/* ── КАК НАЧАТЬ ──────────────────────────────────────────────────────── */}
      <section id="how" style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>Четыре шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От регистрации до результата
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={24} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.steps-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:480px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ПЛАН БЕСПЛАТНО ──────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "48px 40px", display: "flex", alignItems: "center", gap: 40, position: "relative", overflow: "hidden" }} className="gift-block">
            <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: `radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)`, pointerEvents: "none" }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 32px rgba(45,212,191,0.3)" }}>
              <Icon name="Gift" size={36} style={{ color: DARK }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 8 }}>Без оплаты</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Подключить AI-навигатор — бесплатно</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
                Пройдите диагностику и получите первый план роста дохода без оплаты — дальше ИИ продолжит вести ваш бизнес или практику к цели каждый день. Инструменты платформы (сообщения клиентам, контент, скрипты) доступны через баланс энергии.
              </p>
            </div>
            <Link to="/cabinet?tab=register" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 15, fontWeight: 700,
              textDecoration: "none", flexShrink: 0,
              boxShadow: "0 8px 24px rgba(45,212,191,0.3)",
              whiteSpace: "nowrap" as const,
            }}>
              Получить план бесплатно <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
        <style>{`@media(max-width:800px){.gift-block{flex-direction:column!important;padding:32px 24px!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: `radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Бесплатно · Без карты</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.08 }}>
              Поставьте цель —<br />получите навигатор к ней
            </h2>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300 }}>
              Зарегистрируйтесь, заполните профиль и цель — через 10 минут получите диагностику и первый план. Дальше ИИ каждый день будет подсказывать следующий шаг к результату.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 40 }}>
              <Link to="/cabinet?tab=register" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 17, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              }}>
                <Icon name="Zap" size={20} />
                Начать бесплатную диагностику
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const }}>
              {[["Бесплатно","навсегда"],["Каждый день","новый шаг от ИИ"],["10 минут","до первого плана"]].map(([v, l], i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
