import { useState } from "react";
import Icon from "@/components/ui/icon";
import { TEAL2, DARK, GRAY, SERIF, FAQ, CtaButton } from "./shared";

export default function DlyaPsihologovFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── БЕСПЛАТНЫЙ СТАРТ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Начните бесплатно
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, fontWeight: 300, marginBottom: 12 }}>
            Регистрация и первоначальная диагностика доступны бесплатно. Вы можете:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", maxWidth: 380, margin: "0 auto 36px" }}>
            {["Создать профиль", "Пройти диагностику", "Получить анализ", "Получить первые персональные шаги", "Попробовать инструменты в рамках бесплатного лимита"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="Check" size={16} style={{ color: TEAL2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: DARK }}>{t}</span>
              </div>
            ))}
          </div>
          <CtaButton big />
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ── */}
      <section style={{
        padding: "100px 32px",
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
            Узнайте, что сейчас мешает вашей практике расти
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", fontWeight: 300, lineHeight: 1.7 }}>
            Пройдите бесплатную диагностику и получите персональный первый шаг.
          </p>
          <CtaButton big />
          <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Регистрация бесплатна.</div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 32px 140px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>FAQ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Частые вопросы
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: GRAY, flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
