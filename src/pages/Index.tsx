import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";

const TEAL = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";

const RESULTS = [
  { icon: "📈", title: "Рост клиентов", desc: "Возвращаемость клиентов через правильную коммуникацию и ИИ-скрипты" },
  { icon: "💰", title: "Рост среднего чека", desc: "Инструменты допродаж и работы с возражениями для администраторов и мастеров" },
  { icon: "👥", title: "Сильная команда", desc: "Анализ персонала, обучение и контроль эффективности каждого сотрудника" },
  { icon: "📊", title: "Контроль бизнеса", desc: "Цифровой разбор и аналитика — понимайте, где теряете деньги" },
];

const TOOLS = [
  { icon: "🧑‍💼", title: "Анализ персонала", desc: "Узнайте, кто приносит прибыль, а кто создаёт потери.", tag: "Управление" },
  { icon: "📋", title: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки за 15 минут.", tag: "Аналитика" },
  { icon: "✍️", title: "Генератор постов", desc: "Пост с текстом и идеей изображения за 2 минуты.", tag: "Маркетинг" },
  { icon: "💬", title: "Скрипты общения", desc: "Готовые сценарии для сотрудников на любую ситуацию.", tag: "Продажи" },
  { icon: "🔍", title: "Диагностика клиента", desc: "Для специалистов по телу — опрос и программа работы.", tag: "Специалисты" },
  { icon: "📣", title: "Ответы на отзывы", desc: "ИИ формирует профессиональные ответы на любой отзыв.", tag: "Репутация" },
];

const PROBLEMS = [
  "Салон теряет клиентов, которые не возвращаются",
  "Сотрудники не умеют продавать и работать с возражениями",
  "Нет времени на маркетинг — соцсети молчат неделями",
  "Непонятно, где именно теряются деньги",
];

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1E293B 60%, #0F2D2A 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 68, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>Платформа роста салона</span>
            </div>

            <h1 style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-1px" }}>
              Про Диалог
            </h1>
            <p style={{ fontSize: "clamp(18px,2.5vw,22px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: "0 0 16px", fontWeight: 400 }}>
              Цифровой помощник для владельца салона и его команды
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
              {["ИИ-инструменты", "Аналитика бизнеса", "Рост клиентов", "Обучение персонала", "Управление командой"].map(t => (
                <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px" }}>
                  ✅ {t}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                padding: "15px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                background: "linear-gradient(135deg,#14B8A6,#0D9488)", color: "#fff",
                textDecoration: "none", boxShadow: "0 8px 28px rgba(20,184,166,0.45)",
              }}>
                Попробовать бесплатно
              </Link>
              <Link to="/vozmozhnosti" style={{
                padding: "15px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600,
                border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff",
                textDecoration: "none",
              }}>
                Смотреть возможности →
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
            <div style={{
              width: "100%", maxWidth: 480, aspectRatio: "16/10",
              background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.15)",
              borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}>
              <div style={{ fontSize: 36 }}>🖥️</div>
              <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Скриншот кабинета</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Размер: 960 × 600 px</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ПРОБЛЕМЫ ── */}
      <section style={{ background: "#F8FAFC", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Узнаёте свой салон?
            </h2>
            <p style={{ fontSize: 18, color: GRAY, margin: 0 }}>Про Диалог помогает решить эти задачи</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "flex-start", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(20,184,166,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>❗</div>
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.6, fontWeight: 500 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── РЕЗУЛЬТАТЫ ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Результаты</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
              Что получает салон с Про Диалог
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 20, padding: "32px 24px", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = TEAL; el.style.boxShadow = "0 8px 32px rgba(20,184,166,0.12)"; el.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#E2E8F0"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{r.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: "0 0 10px" }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ИНСТРУМЕНТЫ ── */}
      <section style={{ background: DARK, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Инструменты</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
              Что внутри платформы
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", margin: 0 }}>20+ ИИ-инструментов для всей команды салона</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {TOOLS.map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(20,184,166,0.08)"; el.style.borderColor = "rgba(20,184,166,0.25)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ fontSize: 32 }}>{t.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: "rgba(20,184,166,0.15)", borderRadius: 6, padding: "3px 9px", border: "1px solid rgba(20,184,166,0.25)" }}>{t.tag}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link to="/vozmozhnosti" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, border: "1.5px solid rgba(20,184,166,0.4)", color: TEAL, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Все возможности платформы →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#0D9488,#14B8A6)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Начните бесплатно сегодня
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", margin: "0 0 36px" }}>
            100 энергий в подарок при создании первого салона. Без карты.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 14, background: "#fff", color: "#0D9488", fontSize: 17, fontWeight: 800, textDecoration: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            Попробовать бесплатно
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Уже используют более 200 салонов</p>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-img { display: none !important; }
        }
      `}</style>
    </div>
  );
}
