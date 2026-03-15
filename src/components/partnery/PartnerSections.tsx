import { useEffect, useRef, useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const PARTNER_TYPES = [
  {
    icon: "🤝",
    title: "Реферальный партнёр",
    desc: "Рекомендуете МассоПро знакомым салонам и мастерам. Получаете разовое вознаграждение за каждого привлечённого клиента, который оформил любой тариф.",
    reward: "до 30 000 ₽ за клиента",
    color: "#fff",
  },
  {
    icon: "📋",
    title: "Агент по внедрению",
    desc: "Сопровождаете клиента на этапе переговоров и подписания договора. Участвуете в презентациях и помогаете выбрать подходящий тариф.",
    reward: "до 75 000 ₽ за сделку",
    color: "#fff",
  },
  {
    icon: "🏢",
    title: "Региональный представитель",
    desc: "Развиваете партнёрскую сеть в своём регионе. Строите команду агентов, получаете комиссию с их сделок и доступ к приоритетной поддержке.",
    reward: "Индивидуальные условия",
    color: "#fff",
  },
];

const HOW_STEPS = [
  { num: "01", title: "Оставьте заявку", desc: "Заполните форму ниже — мы свяжемся в течение рабочего дня и расскажем об условиях партнёрства." },
  { num: "02", title: "Пройдите онбординг", desc: "Получите доступ к материалам, презентациям и личному куратору. Онбординг занимает 1-2 дня." },
  { num: "03", title: "Привлекайте клиентов", desc: "Используйте готовые материалы для переговоров. Мы поддерживаем вас на каждом этапе сделки." },
  { num: "04", title: "Получайте доход", desc: "Комиссия начисляется в течение 3 рабочих дней после успешного внедрения. Выплата на карту или р/с." },
];

const BENEFITS = [
  { title: "Готовые материалы", desc: "Презентации, брошюры, скрипты переговоров — всё готово к использованию." },
  { title: "Личный куратор", desc: "Персональный менеджер поможет закрыть сложные сделки и ответит на вопросы." },
  { title: "Обучение бесплатно", desc: "Доступ к обучающим материалам по продукту и техникам продаж без доп. оплаты." },
  { title: "Прозрачные выплаты", desc: "Личный кабинет партнёра с историей сделок, начислений и статусами выплат." },
  { title: "Растущая ставка", desc: "Чем больше внедрений — тем выше ваша комиссия. Нет потолка по доходу." },
  { title: "Поддержка 24/7", desc: "Чат с командой МассоПро всегда доступен для срочных вопросов." },
];

export default function PartnerSections() {
  return (
    <>
      {/* Форматы партнёрства */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
                Форматы партнёрства
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Выберите удобный формат
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PARTNER_TYPES.map((type, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{
                  background: type.color, borderRadius: 24,
                  padding: "36px 32px",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
                  display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 20 }}>{type.icon}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 2.5vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>
                    {type.title}
                  </div>
                  <p style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.7, marginBottom: 24, flex: 1 }}>{type.desc}</p>
                  <div style={{
                    display: "inline-block", background: `hsla(185, 85%, 32%, 0.08)`,
                    color: ACCENT, fontSize: 13, fontWeight: 700,
                    padding: "8px 16px", borderRadius: 100,
                  }}>
                    {type.reward}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Как стать партнёром */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 28, padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px)" }}>
            <FadeIn>
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
                  Как начать
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Четыре шага<br />до первых выплат
                </h2>
              </div>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
              {HOW_STEPS.map((step, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: ACCENT, lineHeight: 1, marginBottom: 16, opacity: 0.6 }}>
                      {step.num}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{step.title}</div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
                Почему МассоПро
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Всё для вашего успеха
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  background: "#fff", borderRadius: 20,
                  padding: "28px 28px",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                  display: "flex", gap: 16, alignItems: "flex-start",
                }}>
                  <span style={{ color: ACCENT, fontWeight: 700, fontSize: 18, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{b.title}</div>
                    <div style={{ fontSize: 13, color: "#5a5a5a", lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA баннер */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{
              background: ACCENT, borderRadius: 28,
              padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px)",
              display: "flex", flexWrap: "wrap", alignItems: "center",
              justifyContent: "space-between", gap: 32,
            }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>
                  Готовы начать зарабатывать<br />вместе с МассоПро?
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.6 }}>
                  Заполните заявку — и мы расскажем об условиях на индивидуальной консультации.
                </p>
              </div>
              <a
                href="#partner-form"
                style={{
                  display: "inline-block",
                  background: "#fff", color: ACCENT,
                  padding: "16px 36px", borderRadius: 14,
                  fontSize: 15, fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: `0 8px 32px ${ACCENT_SHADOW}`,
                  whiteSpace: "nowrap",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
              >
                Стать партнёром
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
