import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const VALUES = [
  { icon: "Heart", title: "Коммуникация — основа прибыли", desc: "Большая часть проблем салона лежит в плоскости общения: с клиентами, внутри команды и в маркетинге." },
  { icon: "Users", title: "Инструменты для людей, не для IT", desc: "Никакого сложного интерфейса. Всё создано для владельцев салонов, далёких от технологий." },
  { icon: "Target", title: "Результат, а не технологии", desc: "Нас интересует не впечатление от технологий, а рост вашей выручки и возвращаемость клиентов." },
  { icon: "TrendingUp", title: "Рост через команду", desc: "Один сильный владелец не изменит бизнес. Когда растёт вся команда — растёт весь салон." },
];

const TIMELINE = [
  { year: "2019", text: "Начало работы в индустрии красоты — обучение специалистов и администраторов." },
  { year: "2022", text: "Первые курсы по коммуникации для владельцев салонов, более 200 выпускников." },
  { year: "2024", text: "Появление первых интеллектуальных инструментов, пилот с 20 салонами." },
  { year: "2025", text: "Запуск платформы Про Диалог — единая экосистема для роста салона." },
];

export default function OProekte() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 72, alignItems: "center", position: "relative" }} className="about-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Наша история</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,68px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              О проекте<br />Про Диалог
            </h1>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.7)", margin: "0 0 18px", lineHeight: 1.7, fontWeight: 300 }}>
              Про Диалог вырос из многолетней практики в индустрии красоты. Мы видели, как салоны теряют клиентов и деньги не из-за плохого сервиса, а из-за отсутствия правильного диалога.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
              Мы создаём платформу, где технологии служат живому бизнесу, а не усложняют его. Простые инструменты, понятные владельцу салона и его команде.
            </p>
          </div>
          <div className="about-hero-img" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
              <div style={{
                position: "absolute", inset: -1, borderRadius: 6,
                background: "linear-gradient(135deg, rgba(45,212,191,0.35), transparent 50%, rgba(45,212,191,0.12))",
                pointerEvents: "none", zIndex: 2,
              }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/f5d495f7-6be9-4853-b77a-1eefed414230.jpg"
                alt="Основатель Про Диалог"
                style={{
                  width: "100%", aspectRatio: "3/4", objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: 4, display: "block",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
                  position: "relative", zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── КОММУНИКАЦИЯ И ПРИБЫЛЬ ── */}
      <section style={{ background: "#F8FAFC", padding: "120px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 24 }}>Суть</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 40px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Диалог — это всегда<br />два участника
          </h2>
          <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.8, margin: "0 0 20px", fontWeight: 300 }}>
            «Диалог» в переводе с греческого — разговор двоих. Это не монолог салона о себе, а обмен: вы слышите клиента, клиент слышит вас. Основа — вопрос и ответ, внимание и отклик, из которых рождается доверие.
          </p>
          <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.8, margin: "0 0 20px", fontWeight: 300 }}>
            Салон ведёт диалог постоянно — даже в молчании. Каждое сообщение в чате, тон администратора, ответ на отзыв, пост в соцсетях — часть разговора с клиентом. От качества этого диалога зависит, вернётся человек или уйдёт без объяснений.
          </p>
          <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.8, margin: "0 0 20px", fontWeight: 300 }}>
            Клиент редко уходит из-за качества услуги. Чаще — диалог прерывается: его не позвали вернуться, не услышали сомнения, не проявили заботу. По данным исследований, 68% клиентов уходят из-за ощущения, что их не слышат.
          </p>
          <p style={{ fontSize: 18, color: DARK, lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
            «Про Диалог» помогает выстроить этот процесс осознанно и непрерывно — с клиентами, внутри команды и в маркетинге. Там, где есть диалог, появляется доверие. Где есть доверие — есть и прибыль.
          </p>
        </div>
      </section>

      {/* ── ПРИНЦИПЫ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Принципы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Наши принципы
            </h2>
          </div>
          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: "#fff", padding: "44px 32px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#fff"}
              >
                <div style={{ width: 52, height: 52, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                  <Icon name={v.icon} size={24} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 12px", lineHeight: 1.2 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТАЙМЛАЙН ── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>История</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Путь проекта
            </h2>
          </div>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 28 }}>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 2, border: `1px solid ${TEAL}`, background: "rgba(45,212,191,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: TEAL }}>{t.year}</div>
                {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.1)", marginTop: 8 }} />}
              </div>
              <div style={{ paddingTop: 18, paddingBottom: i < TIMELINE.length - 1 ? 40 : 0 }}>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Станьте частью Про Диалог
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            100 энергий в подарок при создании первого салона. Без карты и обязательств.
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
        @media (max-width: 880px) {
          .values-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .about-hero-img { display: none !important; }
        }
        @media (max-width: 560px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}