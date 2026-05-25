import { useEffect, useRef, useState } from "react";
import { Helmet } from "@/lib/helmet";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>{children}</div>;
}

export default function OSisteme() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>О системе — Dok Диалог</title>
        <meta name="description" content="Сергей Водопьянов — практик, создавший систему глубокой работы с телом и клиентом. 17+ лет практики, работа с клиентами высокого уровня." />
        <meta property="og:title" content="О системе Dok Диалог" />
      </Helmet>
      <style>{`
        .os-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
        .os-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 860px) { .os-grid { grid-template-columns: 1fr; gap: 40px; } .os-pillars { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .os-pillars { grid-template-columns: 1fr; } }
      `}</style>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 80, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="os-grid">
            <div>
              <FadeIn>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>О системе</div>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 24 }}>
                  Сергей Водопьянов — практик, который выстраивает систему глубокой работы с телом и клиентом
                </h1>
              </FadeIn>
              <FadeIn delay={120}>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: "#4a4a4a", marginBottom: 16 }}>
                  В основе «Dok Диалог» — 17+ лет практики, работа с клиентами высокого уровня и понимание, что результат создаётся не только техникой, но и состоянием специалиста, доверием, диагностикой и профессиональной системой.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#666" }}>
                  Сергей создал «Dok Диалог» не как курс или школу, а как систему — для специалистов и команд, которые хотят работать глубже, спокойнее и ценнее.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={180}>
              <div style={{ background: "#f0f7f7", borderRadius: 20, padding: "40px 36px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { n: "17+", l: "лет практики" }, { n: "—", l: "Работа с VIP-клиентами" },
                    { n: "—", l: "Частная практика" }, { n: "—", l: "Система для команд" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 18px" }}>
                      {s.n !== "—" && <div style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{s.n}</div>}
                      <div style={{ fontSize: 13, color: "#4a4a4a", lineHeight: 1.5 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ СОЗДАН */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>История</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 28, lineHeight: 1.2 }}>
              Почему создан «Dok Диалог»
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
              {[
                "После многих лет практики стало очевидно: большинство специалистов учатся техникам, но не учатся работать с клиентом как системой. Они умеют делать массаж, но не умеют создавать доверие, управлять состоянием, выстраивать клиентский путь.",
                "Премиальный клиент не покупает набор техник — он покупает состояние, уверенность, ощущение, что его понимают. Это невозможно без глубокой профессиональной системы.",
                "«Dok Диалог» создан для того, чтобы специалисты и команды могли перейти от потоковой работы к зрелой практике: с опорой, устойчивостью и настоящей ценностью для клиента.",
              ].map((t, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: i === 0 ? "#3a3a3a" : "#5a5a5a", margin: 0 }}>{t}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* СТОЛПЫ СИСТЕМЫ */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Основа</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Что такое премиальная работа с телом</h2>
            </div>
          </FadeIn>
          <div className="os-pillars">
            {[
              { title: "Тело и состояние", text: "Тело отражает состояние человека. Специалист работает не только с мышцами — он работает с нервной системой, дыханием, реакцией." },
              { title: "Мышление специалиста", text: "Как специалист думает о своей работе, клиенте и ценности — это транслируется в каждом движении и в каждом слове." },
              { title: "Коммуникация и доверие", text: "Доверие создаётся до первого визита. Как вы говорите, пишете, что транслируете — всё это часть профессиональной системы." },
              { title: "Диагностика", text: "Глубокое понимание состояния клиента — не симптомов, а структуры: тело, привычки, история, реакции." },
              { title: "Клиентский опыт", text: "Премиальный клиент запоминает не технику — он запоминает ощущение. Качество каждого элемента визита." },
              { title: "Профессиональная устойчивость", text: "Практика должна быть устойчивой: с правилами, границами, потоком и системой, которая работает без перегруза." },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{ padding: "28px 24px", background: "#f8f8f6", borderRadius: 16, height: "100%", boxSizing: "border-box" as const }}>
                  <div style={{ width: 36, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 18 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{p.title}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#5a5a5a" }}>{p.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", background: "#1a2a2a" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
              Система подходит специалистам и салонам
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#a0b8b8", marginBottom: 40 }}>
              Неважно, работаете ли вы в частной практике или руководите командой — система адаптируется под вашу задачу.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
              {[{ label: "Для специалистов", href: "/dlya-specialistov" }, { label: "Для салонов", href: "/dlya-salonov" }].map((b, i) => (
                <a key={i} href={b.href} style={{ display: "inline-block", background: i === 0 ? ACCENT : "transparent", color: "#fff", border: `1.5px solid ${i === 0 ? ACCENT : "rgba(255,255,255,0.3)"}`, padding: "13px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: i === 0 ? `0 4px 16px ${ACCENT_SHADOW}` : "none" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; if (i === 0) { el.style.background = ACCENT_DARK; } else { el.style.borderColor = "rgba(255,255,255,0.6)"; } el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; if (i === 0) { el.style.background = ACCENT; } else { el.style.borderColor = "rgba(255,255,255,0.3)"; } el.style.transform = "translateY(0)"; }}
                >{b.label}</a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}