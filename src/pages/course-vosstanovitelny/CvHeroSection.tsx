import Icon from "@/components/ui/icon";
import { ACCENT, BG, HERO_IMG, AUTHOR_IMG, BtnPrimary, BtnSecondary, h2style } from "./CvShared";

export default function CvHeroSection() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="cv-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: 0.5 }}>
              ДЛЯ ПРАКТИКУЮЩИХ
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Восстановительный массаж PRO: клиенты с болью, травмами и высоким чеком
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Освойте работу с болевыми состояниями и сложными случаями, чтобы увеличить стоимость своих услуг и поток клиентов
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "Activity", text: "Работа с болями и травмами" },
                { icon: "TrendingUp", text: "Увеличение среднего чека" },
                { icon: "ClipboardList", text: "Практические протоколы" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс — 39 900 ₽</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Восстановительный массаж PRO" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ЦА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Узнаёте себя?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cv-2col">
            {[
              { icon: "HelpCircle", text: "Клиенты приходят с болью, а вы не уверены, что делать" },
              { icon: "Brain", text: "Не хватает понимания причин проблемы" },
              { icon: "BadgeDollarSign", text: "Сложно повысить цену без уверенного результата" },
              { icon: "Shuffle", text: "Ощущение «делаю массаж, но без системы»" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
                fontSize: 15, color: "#333",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: "#e05050" }} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. РЕШЕНИЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "44px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} className="cv-solution-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Решение</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Этот курс даёт систему работы с телом, которая позволяет:
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="cv-2col">
              {[
                "Понимать причины болей",
                "Подбирать правильные техники",
                "Работать с разными состояниями",
                "Давать клиенту ощутимый результат",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#333" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: ACCENT, fontWeight: 700 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ЧТО ПОЛУЧИТЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Что вы получите</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cv-3col">
            {[
              { icon: "Bone", text: "Работа с позвоночником и суставами" },
              { icon: "Zap", text: "Техники для снятия болевого синдрома" },
              { icon: "Dumbbell", text: "Работа со связками и мышцами" },
              { icon: "Stethoscope", text: "Основы мануальной терапии" },
              { icon: "Circle", text: "Подход к работе с внутренними органами" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", borderRadius: 14, padding: "24px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                border: "1px solid #e8e8e4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "#333" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── АВТОР КУРСА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24,
            overflow: "hidden", display: "grid", gridTemplateColumns: "320px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }} className="cv-author-grid">
            <div style={{ position: "relative", minHeight: 380 }}>
              <img src={AUTHOR_IMG} alt="Сергей Водопьянов"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 380 }} />
            </div>
            <div style={{ padding: "40px 44px" }} className="cv-author-pad">
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Автор курса</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>Сергей Водопьянов</h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px" }}>Остеопат · 17 лет опыта · Член Российской остеопатической ассоциации</p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
                За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { value: "17", label: "лет практики" },
                  { value: "3000+", label: "консультаций" },
                  { value: "Автор", label: "курсов Dok Диалог" },
                  { value: "РОА", label: "сертификат" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
