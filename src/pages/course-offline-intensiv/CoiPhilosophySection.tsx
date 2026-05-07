import Icon from "@/components/ui/icon";
import { ACCENT } from "./CoiShared";

const ITEMS = [
  {
    icon: "Eye",
    title: "Смотрим, как вы работаете",
    text: "На интенсиве тренер наблюдает за каждым участником вживую. Мы видим ошибки, которые невозможно заметить через экран — и исправляем их сразу, пока навык ещё не закрепился неправильно.",
  },
  {
    icon: "HandHeart",
    title: "Корректируем технику здесь и сейчас",
    text: "Одно дело — посмотреть видео. Другое — почувствовать правильное движение руками. Обратная связь тренера в моменте меняет качество техники за часы, а не за месяцы самостоятельной практики.",
  },
  {
    icon: "ShieldCheck",
    title: "Убеждаемся, что вы готовы",
    text: "Восстановительные техники работают на теле человека. Нам важно знать, что вы выполняете их безопасно и с результатом — для клиента и для вашей репутации. Это не формальность, это ответственность.",
  },
  {
    icon: "Gift",
    title: "Поэтому онлайн-курсы — в подарок",
    text: "Мы включаем все онлайн-курсы в стоимость интенсива, чтобы вы пришли теоретически подготовленными. Знания заранее — практика на месте. Так обучение даёт максимальный результат.",
  },
];

export default function CoiPhilosophySection() {
  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* Заголовок */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${ACCENT}12`, borderRadius: 20, padding: "5px 16px", marginBottom: 16 }}>
            <Icon name="Lightbulb" size={13} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, letterSpacing: 0.5 }}>НАША ФИЛОСОФИЯ</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.2 }}>
            Для нас важно не просто обучить,<br />
            а убедиться, что вы делаете правильно
          </h2>
          <p style={{ fontSize: 15.5, color: "#666", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            Восстановительные техники — это не просто движения. Это работа с телом человека, 
            где точность исполнения определяет результат. Именно поэтому мы приглашаем вас на живой интенсив.
          </p>
        </div>

        {/* Карточки */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }} className="philosophy-grid">
          {ITEMS.map((item) => (
            <div key={item.title} style={{ background: "#f8f8f6", border: "1px solid #e8e8e4", borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={item.icon} size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5, color: "#1a1a1a", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая плашка */}
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185, 85%, 22%) 100%)`,
          borderRadius: 22,
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 8px 40px ${ACCENT}40`,
        }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 12 }}>
              Приходите на интенсив — и забирайте<br />все онлайн-курсы бесплатно
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 500 }}>
              Мы отдаём онлайн-курсы в подарок каждому участнику интенсива — чтобы вы изучили теорию заранее и посвятили весь живой день практике под руководством тренера. Это наша инвестиция в качество вашей работы.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {["7 онлайн-курсов в подарок", "Живая обратная связь тренера", "Уверенность в каждой технике"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.13)", borderRadius: 20, padding: "4px 12px" }}>
                  <Icon name="Check" size={11} style={{ color: "#fff" }} />
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="#pay" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", color: ACCENT,
            fontWeight: 700, fontSize: 14.5, borderRadius: 14,
            padding: "14px 28px", textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", flexShrink: 0, position: "relative",
            transition: "opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.9"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
          >
            Занять место на интенсиве
            <Icon name="ArrowRight" size={15} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .philosophy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}