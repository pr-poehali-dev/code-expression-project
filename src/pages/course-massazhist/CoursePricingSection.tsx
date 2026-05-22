import Icon from "@/components/ui/icon";
import { ACCENT, FAQS, AccordionItem, BtnPrimary, BtnSecondary, h2style } from "./CourseShared";

const mobileStyles = `
  .pricing-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  @media (max-width: 600px) {
    .pricing-btns { flex-direction: column; width: 100%; }
    .pricing-btns a { width: 100%; text-align: center; box-sizing: border-box; }
  }
`;

export default function CoursePricingSection() {
  return (
    <>
      <style>{mobileStyles}</style>
      {/* ── 8. СТОИМОСТЬ ───────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 24,
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }} className="course-price-pad">
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Стоимость курса</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>19 900 ₽</div>
            <div style={{ color: "#999", fontSize: 14, margin: "8px 0 32px" }}>или рассрочка от 1 658 ₽/мес</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["Полная оплата", "Рассрочка на 12 мес", "Рассрочка на 24 мес"].map((o) => (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
                  <Icon name="Check" size={14} style={{ color: ACCENT }} />
                  {o}
                </div>
              ))}
            </div>
            <div className="pricing-btns">
              <BtnPrimary>Купить курс</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. ГАРАНТИИ ────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="course-3col">
            {[
              { icon: "ShieldCheck", title: "Подходит для новичков", text: "Курс создан специально для тех, кто начинает с нуля" },
              { icon: "Route", title: "Пошаговое обучение", text: "Никакой теории без практики — каждый шаг закрепляется заданием" },
              { icon: "HeartHandshake", title: "Поддержка на старте", text: "Вы не остаётесь один на один с вопросами — поддержка включена" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name={icon} size={24} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ─────────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8e4", padding: "8px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>
                <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.65 }}>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. ФИНАЛЬНЫЙ CTA ──────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
            Начните зарабатывать на массаже уже в ближайший месяц
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Присоединяйтесь к студентам, которые уже изменили свою жизнь
          </p>
          <div className="pricing-btns">
            <BtnPrimary style={{ padding: "16px 40px", fontSize: 16 }}>Купить курс — 19 900 ₽</BtnPrimary>
            <BtnSecondary style={{ padding: "15px 40px", fontSize: 16 }}>Рассрочка</BtnSecondary>
          </div>
        </div>
      </section>
    </>
  );
}