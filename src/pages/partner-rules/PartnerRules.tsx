import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { INTRO, SECTIONS, RULES_UPDATED } from "./rulesData";

const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const TEAL = "#2DD4BF";

const card: React.CSSProperties = { background: "#fff", borderRadius: 4, padding: "28px 32px", marginBottom: 12, border: "1px solid #E2E8F0" };

export default function PartnerRules() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Правила партнёрской программы — Промт Диалог</title>
        <meta name="description" content="Правила партнёрской программы «Промт Диалог»: как работают рекомендации услуг партнёров, модерация, встречные обязательства, данные пользователей и ответственность." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/partner/rules" />
        <meta property="og:title" content="Правила партнёрской программы — Промт Диалог" />
        <meta property="og:url" content="https://promtdialog.ru/partner/rules" />
        <meta property="og:type" content="article" />
      </Helmet>
      <BizNavbar />

      <section style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2D2A 100%)", padding: "120px 32px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Партнёрская программа</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Правила партнёрской программы
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", fontWeight: 300, lineHeight: 1.6 }}>
            Рекомендации вместо рекламы: ваша услуга предлагается тем, кому она действительно помогает. Последнее обновление: {RULES_UPDATED}.
          </p>
          <Link to="/partner" style={{ display: "inline-flex", padding: "14px 28px", background: `linear-gradient(135deg,${TEAL},#14B8A6)`, color: DARK, fontWeight: 700, fontSize: 15, textDecoration: "none", borderRadius: 2 }}>
            Стать партнёром
          </Link>
        </div>
      </section>

      <section style={{ padding: "72px 32px 96px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ ...card, marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 15, color: GRAY, lineHeight: 1.8, fontWeight: 300 }}>{INTRO}</p>
          </div>

          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 14 }}>Коротко о главном</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Участие бесплатное. Платных размещений и рекламных показов нет.",
                "Вы описываете услугу, а текст рекомендации пишет ИИ под ситуацию конкретного пользователя.",
                "Предложение показывается только после модерации и только если действительно решает задачу человека.",
                "Раз в 14 дней вы публикуете материал о «Промт Диалог» на своей площадке и подтверждаете это в кабинете.",
                "Данные пользователей и результаты диагностик вам не передаются.",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>
                  <span style={{ color: TEAL, fontWeight: 700 }}>✓</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 12 }}>Содержание</div>
            <div style={{ display: "grid", gap: 6 }}>
              {SECTIONS.map(s => <a key={s.id} href={`#${s.id}`} style={{ fontSize: 14, color: "#0F766E", textDecoration: "none" }}>{s.title}</a>)}
            </div>
          </div>

          {SECTIONS.map(section => (
            <div key={section.id} id={section.id} style={{ ...card, scrollMarginTop: 90 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, margin: "0 0 20px", letterSpacing: "-0.2px" }}>{section.title}</h2>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ marginBottom: ii < section.items.length - 1 ? 16 : 0, paddingBottom: ii < section.items.length - 1 ? 16 : 0, borderBottom: ii < section.items.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, flexShrink: 0, minWidth: 40, marginTop: 1 }}>{item.num}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, color: GRAY, lineHeight: 1.8, fontWeight: 300 }}>{item.text}</p>
                      {item.list && (
                        <ul style={{ margin: "10px 0 0", paddingLeft: 20 }}>
                          {item.list.map((li, i) => <li key={i} style={{ fontSize: 14, color: GRAY, lineHeight: 1.8, fontWeight: 300, marginBottom: 4 }}>{li}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 32, fontSize: 14 }}>
            <Link to="/offer" style={{ color: "#0F766E", textDecoration: "none", fontWeight: 500 }}>Публичная оферта</Link>
            <Link to="/privacy" style={{ color: "#0F766E", textDecoration: "none", fontWeight: 500 }}>Политика конфиденциальности</Link>
            <Link to="/" style={{ color: "#0F766E", textDecoration: "none", fontWeight: 500 }}>← На главную</Link>
          </div>
        </div>
      </section>
      <BizFooter />
    </div>
  );
}
