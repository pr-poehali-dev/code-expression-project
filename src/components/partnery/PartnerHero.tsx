import { useEffect, useRef, useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";

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

const STATS = [
  { value: "30%", label: "Комиссия с каждого внедрения" },
  { value: "3+", label: "Формата партнёрства" },
  { value: "24/7", label: "Поддержка партнёров" },
];

export default function PartnerHero() {
  return (
    <section style={{ paddingTop: 144, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: ACCENT, marginBottom: 20,
          }}>
            Партнёрская программа
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 700, lineHeight: 1.08,
            color: "#1a1a1a", marginBottom: 24,
            letterSpacing: "-0.5px", maxWidth: 760,
          }}>
            Развивайте бизнес<br />
            <span style={{ color: ACCENT }}>вместе с МассоПро</span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p style={{
            fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.75,
            color: "#5a5a5a", maxWidth: 580, marginBottom: 56,
          }}>
            Рекомендуйте платформу Dok Диалог салонам и мастерам — получайте стабильный доход с каждого успешного внедрения системы МассоПро.
          </p>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 24,
        }}>
          {STATS.map((s, i) => (
            <FadeIn key={i} delay={300 + i * 100}>
              <div style={{
                background: "#fff", borderRadius: 20,
                padding: "32px 28px",
                boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 700, color: ACCENT, lineHeight: 1, marginBottom: 10,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
