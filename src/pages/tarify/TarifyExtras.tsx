import { ACCENT } from "./constants";
import { FAQ } from "./constants";
import { ConsultForm, FadeIn, FaqItem } from "./TarifyForms";

interface TarifyModalProps {
  modalOpen: boolean;
  modalPlan: string;
  onClose: () => void;
}

export function TarifyModal({ modalOpen, modalPlan, onClose }: TarifyModalProps) {
  if (!modalOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: "40px 36px",
          maxWidth: 480, width: "100%", position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: "#999", lineHeight: 1, padding: 4,
          }}
        >✕</button>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 8 }}>
            Оставить заявку
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            {modalPlan ? `Тариф «${modalPlan}»` : "Получить предложение"}
          </h2>
        </div>
        <ConsultForm initialPlan={modalPlan} />
      </div>
    </div>
  );
}

export function TarifyPrivatePractice() {
  return (
    <section style={{ paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="tarify-split-grid">
            <div className="tarify-split-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
                Частная практика
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.2 }}>
                Работаете<br />на себя?
              </h2>
              <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 16 }}>
                Платформа Dok Диалог создана для мастеров салонов и студий системы МассоПро. Но если вы ведёте <strong>частную практику</strong> и хотите профессионально расти — мы готовы рассмотреть вашу заявку.
              </p>
              <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 0 }}>
                Доступ к платформе предоставляется при <strong>наличии активной подписки</strong> на один из тарифов. Оставьте заявку — мы проконсультируем и поможем выбрать оптимальный план.
              </p>
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Онлайн-обучение в любое удобное время", "Актуальные техники и протоколы", "Поддержка профессионального сообщества"].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: ACCENT, fontWeight: 700, fontSize: 15 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#3a3a3a" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="tarify-split-col" style={{ background: "#f8f8f6", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Оставить заявку</div>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>Заполните форму, и мы свяжемся с вами для консультации. Доступ предоставляется при покупке любого тарифа.</p>
              <ConsultForm />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function TarifyFaq() {
  return (
    <section style={{ paddingBottom: 100 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>
              Вопросы и ответы
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
              Частые вопросы
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ.map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <FaqItem q={item.q} a={item.a} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
