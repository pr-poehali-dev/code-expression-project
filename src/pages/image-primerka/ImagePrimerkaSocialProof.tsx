import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const REVIEWS = [
  { name: "Алина Р.", role: "владелица салона, Екатеринбург", text: "Раньше на новых клиентах чувствовала себя как сапёр — угадала или нет. Теперь сначала показываю направление и слышу «да, точно не это» ещё до начала работы.", rating: 5 },
  { name: "Марат С.", role: "барбер, Казань", text: "На сложных стрижках теперь сначала согласовываю направление. Если клиенту не нравится — узнаю об этом сразу, а не после уже сделанной работы.", rating: 5 },
  { name: "Виктория Л.", role: "мастер по маникюру, Санкт-Петербург", text: "На дорогом дизайне ошибка обходится дорого — и себе, и клиенту. Теперь сверяем направление заранее, и обеим сторонам спокойнее.", rating: 5 },
];

export default function ImagePrimerkaSocialProof() {
  return (
    <>
      {/* ── ОТЗЫВЫ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Отзывы мастеров и салонов</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Что говорят те, кто уже пробует
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="reviews-grid">
            {REVIEWS.map(({ name, role, text, rating }, i) => (
              <div key={i} style={{ background: "#fff", padding: "30px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: rating }).map((_, si) => (
                    <Icon key={si} name="Star" size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ fontFamily: SERIF, fontSize: 16, color: DARK, lineHeight: 1.6, margin: "0 0 18px", fontStyle: "italic", flex: 1 }}>
                  «{text}»
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>{name}</div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.reviews-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: "radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Бесплатно на первый раз</span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: "0 auto 20px", lineHeight: 1.1, maxWidth: 680 }}>
            Согласуйте ожидания — не угадывайте их
          </h2>
          <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 auto 40px", fontWeight: 300, maxWidth: 560 }}>
            Прокрутите наверх, загрузите фото и попробуйте примерку прямо сейчас — первый результат бесплатно.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "17px 36px", borderRadius: 2, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 16, fontWeight: 700,
              boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              fontFamily: "Montserrat,sans-serif",
            }}>
            <Icon name="ArrowUp" size={18} />
            Попробовать примерку бесплатно
          </button>
        </div>
      </section>
    </>
  );
}
