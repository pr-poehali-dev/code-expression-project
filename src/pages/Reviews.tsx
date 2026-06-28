import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { ACCENT, ACCENT_DARK, DARK, VIDEO_SECTIONS, TEXT_SECTIONS } from "./reviews/ReviewsShared";
import { SectionHeader, TextReviewCard } from "./reviews/ReviewsComponents";
import ReviewsVideoSection from "./reviews/ReviewsVideoSection";

export default function Reviews() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
      <Helmet>
        <title>Истории специалистов — Промт Диалог</title>
        <meta name="description" content="Истории специалистов и команд, которые изменили подход к практике: мышление, стоимость, работа с клиентом, внедрение в салоне." />
        <meta property="og:title" content="Истории специалистов — Промт Диалог" />
      </Helmet>

      <BizNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "6px 18px", marginBottom: 24 }}>
            <Icon name="Star" size={14} style={{ color: ACCENT, fill: ACCENT }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, letterSpacing: "0.5px" }}>Истории специалистов и команд</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#fff", margin: "0 0 20px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
            Истории тех, кто изменил<br />подход к практике
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Специалисты и команды, которые перешли от потоковой работы к более глубокому и ценному формату
          </p>
          {/* Статистика */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }} className="rev-stats">
            {[
              { value: "200+", label: "Специалистов" },
              { value: "4.9", label: "Средняя оценка" },
              { value: "12", label: "Видеоотзывов" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px,4vw,38px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Видеоотзывы */}
      <ReviewsVideoSection sections={VIDEO_SECTIONS} />

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "64px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Текстовые отзывы */}
      <section style={{ padding: "64px 0 100px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Star" size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            </div>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Отзывы по тарифам</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {TEXT_SECTIONS.map((section) => (
              <div key={section.title}>
                <SectionHeader title={section.title} subtitle={section.subtitle} href={section.href} badge={section.badge} linkText={section.linkText} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="rev-text-grid">
                  {section.reviews.map((r) => (
                    <TextReviewCard key={r.name} r={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 100px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.15)",
            borderRadius: 24, padding: "48px 40px", textAlign: "center",
          }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
              Хотите такой же результат?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: 1.7, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Начните с бесплатного доступа и посмотрите, подходит ли вам этот подход
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 2,
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                color: DARK, fontSize: 15, fontWeight: 600, textDecoration: "none",
                letterSpacing: "0.3px", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(45,212,191,0.35)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                Начать бесплатно
              </Link>
              <Link to="/tarify" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 400, textDecoration: "none",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(45,212,191,0.4)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.18)"; el.style.color = "rgba(255,255,255,0.8)"; }}
              >
                Посмотреть тарифы
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .rev-video-desktop { display: block; }
        .rev-video-mob { display: none; }
        @media (max-width: 640px) {
          .rev-video-desktop { display: none; }
          .rev-video-mob { display: block; }
          .rev-video-wrap { flex-direction: column !important; min-height: unset !important; }
          .rev-text-grid { grid-template-columns: 1fr !important; }
          .rev-stats { gap: 28px !important; }
        }
        @media (min-width: 641px) and (max-width: 860px) {
          .rev-video-wrap { min-height: 340px !important; }
          .rev-video-sidebar { width: 200px !important; }
        }
      `}</style>

      <BizFooter />
    </div>
  );
}