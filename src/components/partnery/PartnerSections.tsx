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
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const HOW_STEPS = [
  { num: "01", title: "Регистрируетесь как партнёр", desc: "Получаете личный кабинет и уникальный промокод, который даёт скидку на подписку платформы Dok Диалог для салона." },
  { num: "02", title: "Рекомендуете платформу салонам", desc: "Рассказываете владельцам салонов и студий, как онлайн-обучение мастеров повышает качество услуг и доход бизнеса." },
  { num: "03", title: "Салон вводит ваш промокод", desc: "При оформлении подписки на любой тариф Dok Диалог салон вводит ваш промокод и получает скидку на обучение специалистов." },
  { num: "04", title: "Вы получаете 10% комиссии", desc: "С каждой оплаты, совершённой по вашему промокоду, на ваш счёт начисляется 10% комиссионных. Ежемесячно, автоматически." },
];

const BENEFITS = [
  { icon: "💰", title: "Пассивный доход", desc: "Комиссия начисляется ежемесячно, пока салон остаётся подписчиком. Рекомендовали один раз — получаете регулярно." },
  { icon: "🎯", title: "Промокод со скидкой", desc: "Ваш промокод даёт салону реальную выгоду — это облегчает разговор и повышает конверсию в подписку." },
  { icon: "📊", title: "Прозрачная аналитика", desc: "В личном кабинете видите все активации промокода, начисленные комиссии и историю выплат в режиме реального времени." },
  { icon: "🤝", title: "Поддержка партнёров", desc: "Персональный менеджер, обучающие материалы и готовые скрипты для переговоров с владельцами салонов." },
  { icon: "⚡", title: "Быстрый старт", desc: "Регистрация занимает 5 минут. Промокод активен сразу — можно начинать рекомендовать в тот же день." },
  { icon: "🔄", title: "Без ограничений", desc: "Количество привлечённых салонов не ограничено. Чем больше активных салонов — тем выше ежемесячный доход." },
];

const TARIFFS = [
  { label: "Базовый", price: 150000 },
  { label: "Расширенный", price: 250000 },
  { label: "Полный", price: 400000 },
];

function Calculator() {
  const [salons, setSalons] = useState(5);
  const [tariffIdx, setTariffIdx] = useState(1);

  const commission = salons * TARIFFS[tariffIdx].price * 0.1;

  return (
    <div style={{ background: "#fff", borderRadius: 28, padding: "clamp(32px, 5vw, 56px)", boxShadow: "0 8px 48px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "start" }}>
        {/* Left */}
        <div>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
            Калькулятор дохода
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.2 }}>
            Сколько вы<br />можете заработать?
          </h2>
          <p style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.7, marginBottom: 0 }}>
            Комиссия выплачивается ежемесячно за каждый активный салон, оформивший подписку по вашему промокоду.
          </p>
          <p style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
            Один привлечённый салон с тарифом «Расширенный» приносит вам <strong>25 000 ₽</strong>. Десять салонов — уже <strong>250 000 ₽</strong>, без дополнительных усилий.
          </p>
        </div>

        {/* Right */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 12 }}>
              Количество привлечённых салонов: <span style={{ color: ACCENT }}>{salons}</span>
            </label>
            <input
              type="range" min={1} max={50} value={salons}
              onChange={e => setSalons(Number(e.target.value))}
              style={{ width: "100%", accentColor: ACCENT, cursor: "pointer", height: 4 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginTop: 4 }}>
              <span>1 салон</span>
              <span>50 салонов</span>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 12 }}>
              Средний тариф салона
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TARIFFS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTariffIdx(i)}
                  style={{
                    padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                    background: tariffIdx === i ? ACCENT : "#f0f0ee",
                    color: tariffIdx === i ? "#fff" : "#3a3a3a",
                    border: "none",
                  }}
                >
                  {t.label}<br />
                  <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>{t.price.toLocaleString("ru")} ₽</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: `hsla(185, 85%, 32%, 0.06)`, borderRadius: 16, padding: "24px 28px" }}>
            <div style={{ fontSize: 13, color: "#5a5a5a", marginBottom: 6 }}>Ваша комиссия</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, color: ACCENT, lineHeight: 1, marginBottom: 6 }}>
              {commission.toLocaleString("ru")} ₽
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {salons} {salons === 1 ? "салон" : salons < 5 ? "салона" : "салонов"} × {TARIFFS[tariffIdx].price.toLocaleString("ru")} ₽ × 10%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerSections() {
  return (
    <>
      {/* Как это работает */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 28, padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px)" }}>
            <FadeIn>
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>
                  Как это работает
                </div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Четыре простых шага
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
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{step.title}</div>
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
                Преимущества
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Почему это выгодно
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: "#5a5a5a", lineHeight: 1.65 }}>{b.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Калькулятор */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <Calculator />
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: ACCENT, borderRadius: 28, padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>
                  Станьте партнёром<br />Dok Диалог
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.6 }}>
                  Оставьте заявку — мы свяжемся с вами, расскажем об условиях программы и выдадим ваш уникальный промокод.
                </p>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Бесплатное подключение", "Промокод с первого дня", "Поддержка персонального менеджера", "Выплаты без задержек"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>✓</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href="#partner-form"
                style={{ display: "inline-block", background: "#fff", color: ACCENT, padding: "16px 36px", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: `0 8px 32px ${ACCENT_SHADOW}`, whiteSpace: "nowrap", transition: "transform 0.2s ease" }}
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
