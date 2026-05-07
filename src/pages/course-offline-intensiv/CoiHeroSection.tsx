import Icon from "@/components/ui/icon";
import { ACCENT, BG, HERO_IMG, h2style, BtnPay, BtnBook } from "./CoiShared";

export default function CoiHeroSection() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="coi-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5 }}>
                ОФЛАЙН
              </div>
              <div style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                1 ДЕНЬ
              </div>
              <div style={{ background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                ДОХОД / КЛИЕНТЫ
              </div>
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Однодневный интенсив: увеличение дохода массажиста через практику
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              За 1 день вы продиагностируете свою практику, поймёте, где теряете деньги, и освоите техники, которые увеличивают поток клиентов и доход
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "Target", text: "Диагностика практики" },
                { icon: "TrendingUp", text: "Рост дохода" },
                { icon: "Users", text: "Поток клиентов" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }} className="coi-hero-btns">
              <BtnPay style={{ padding: "16px 40px", fontSize: 16 }}>Оплатить 22 900 руб.</BtnPay>
              <BtnBook style={{ padding: "16px 28px", fontSize: 15 }}>Забронировать</BtnBook>
            </div>
            <div style={{ marginTop: 20, fontSize: 13, color: "#aaa" }}>
              Осталось <strong style={{ color: "#555" }}>7 мест</strong> · Группа до 12 человек
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Офлайн интенсив для массажистов" className="coi-hero-img" style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Узнаёте себя?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="problems-grid">
            {[
              "Клиенты есть, но доход не растёт",
              "Не понимаете, почему клиенты не возвращаются",
              "Не знаете, как поднять чек без потери записи",
              "Работаете много, а денег — как было",
              "Нет системы — живёте от записи к записи",
              "Хотите больше, но не знаете с чего начать",
            ].map((t) => (
              <div key={t} style={{
                background: "#fff", border: "1px solid #e8e8e4",
                borderRadius: 14, padding: "18px 20px",
                display: "flex", gap: 12, alignItems: "flex-start",
                fontSize: 14, color: "#444", lineHeight: 1.5,
              }}>
                <Icon name="AlertCircle" size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, background: `${ACCENT}10`, border: `1.5px solid ${ACCENT}30`, borderRadius: 16, padding: "24px 28px" }}>
            <p style={{ margin: 0, fontSize: 16, color: "#1a1a1a", lineHeight: 1.7, fontWeight: 500 }}>
              За 1 день интенсива вы разберёте свою ситуацию, найдёте точки роста и уйдёте с конкретным планом — без воды и общих фраз.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. РЕЗУЛЬТАТЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>После интенсива вы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="results-grid">
            {[
              { icon: "Search", title: "Найдёте слабые места", text: "Поймёте, где и почему теряете деньги прямо сейчас" },
              { icon: "TrendingUp", title: "Увеличите доход", text: "Получите техники, которые реально работают на рост чека" },
              { icon: "Users", title: "Выстроите поток", text: "Научитесь превращать разовых клиентов в постоянных" },
              { icon: "Target", title: "Составите план", text: "Уйдёте с конкретными шагами на ближайший месяц" },
              { icon: "PlayCircle", title: "Доступ к онлайн-урокам", text: "Получите доступ к записям техник, которые проходили на интенсиве" },
              { icon: "Star", title: "Повысите уверенность", text: "Начнёте позиционировать себя как профессионал с ценой" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 20px" }}>
                <div style={{ color: ACCENT, marginBottom: 12 }}><Icon name={icon} size={24} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#1a1a1a" }}>{title}</div>
                <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}