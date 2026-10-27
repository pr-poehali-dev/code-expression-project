import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const ITEMS = [
  { icon: "Footprints", title: "Бесплатные шаги по развитию бизнеса", text: "Конкретные рекомендации, что делать дальше.", tag: "Бесплатно" },
  { icon: "Bot", title: "ИИ-агент под задачу", text: "Отвечает на вопросы и помогает с учётом запроса пользователя.", tag: "" },
  { icon: "Brain", title: "Инструменты развития компетенций", text: "Разработки на основе психологических подходов, созданные психологами «Промт Диалог».", tag: "" },
  { icon: "Megaphone", title: "Платные инструменты — по желанию", text: "Для маркетинга, продвижения услуг и профессиональной репутации.", tag: "По желанию" },
];

export default function ClientsGetSection() {
  return (
    <section style={{ background: "linear-gradient(180deg,#F0FDFA 0%,#FFFFFF 100%)", padding: "92px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 760, margin: "0 0 44px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Ценность для вашей аудитории</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.4px" }}>Что получат ваши клиенты в «Промт Диалог»?</h2>
          <p style={{ fontSize: 18, color: DARK, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>Бесплатные шаги, ИИ-агент и инструменты развития.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 18 }}>
          {ITEMS.map(it => (
            <div key={it.title} style={{ border: "1px solid #CCFBF1", borderRadius: 18, padding: "28px 24px", background: "#fff", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={it.icon} fallback="Sparkles" size={23} style={{ color: "#0F766E" }} />
                </div>
                {it.tag && <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0F766E", background: "#CCFBF1", borderRadius: 20, padding: "4px 10px" }}>{it.tag}</span>}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: DARK, lineHeight: 1.2 }}>{it.title}</div>
              <div style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{it.text}</div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 760, margin: "44px 0 0" }}>
          <p style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.6vw,27px)", color: DARK, lineHeight: 1.35, margin: 0, paddingTop: 22, borderTop: `2px solid ${TEAL}`, display: "inline-block", fontWeight: 500 }}>
            Вы делитесь полезным ресурсом с аудиторией, а ваши клиенты получают новые инструменты.
          </p>
        </div>
      </div>
    </section>
  );
}
