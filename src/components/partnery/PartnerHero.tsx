import { useEffect, useRef, useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

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

const STATS = [
  { value: "10%", label: "комиссии с каждой оплаты" },
  { value: "∞", label: "без лимита на количество салонов" },
  { value: "30", label: "дней до первой выплаты" },
  { value: "0 ₽", label: "вступительного взноса" },
];

export default function PartnerHero() {
  return (
    <section style={{ paddingTop: 144, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
            Партнёрская программа
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 700, lineHeight: 1.08, color: "#1a1a1a", marginBottom: 24, letterSpacing: "-0.5px", maxWidth: 800 }}>
            Рекомендуйте —<br />
            <span style={{ color: ACCENT }}>зарабатывайте</span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <div style={{ maxWidth: 600, marginBottom: 40 }}>
            <p style={{ fontSize: "clamp(15px, 2.2vw, 17px)", lineHeight: 1.75, color: "#3a3a3a", marginBottom: 14 }}>
              Рекомендуйте платформу Dok Диалог владельцам салонов и студий массажа — и получайте <strong>10% с каждой оплаты ежемесячно.</strong>
            </p>
            <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", margin: 0 }}>
              Салон вводит ваш уникальный промокод, получает скидку на обучение мастеров — и становится вашим источником постоянного пассивного дохода.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            <a
              href="#partner-form"
              style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
            >
              Стать партнёром
            </a>
            <a
              href="#cabinet"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ACCENT, fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "14px 4px", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
            >
              Войти в кабинет →
            </a>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {STATS.map((s, i) => (
            <FadeIn key={i} delay={400 + i * 80}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, color: ACCENT, lineHeight: 1, marginBottom: 8 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "#5a5a5a", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
