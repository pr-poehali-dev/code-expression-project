import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.42)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

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

function ApplicationForm() {
  const [name, setName] = useState(""); const [contact, setContact] = useState(""); const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !contact.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Заявка со страницы Для специалистов. Контакт: ${contact}` }) });
      if (res.ok) setSent(true); else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: ACCENT }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Мы свяжемся с вами в течение рабочего дня.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[{ label: "Имя", v: name, set: setName, ph: "Ваше имя" }, { label: "Телефон или Telegram", v: contact, set: setContact, ph: "+7 или @username" }].map(f => (
        <div key={f.label}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 5 }}>{f.label}</label>
          <input value={f.v} onChange={e => f.set(e.target.value)} placeholder={f.ph} required style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat, sans-serif" }} onFocus={e => (e.currentTarget.style.borderColor = ACCENT)} onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
        </div>
      ))}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 15, height: 15, accentColor: ACCENT, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a></span>
      </label>
      <button type="submit" style={{ background: ACCENT, color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 24px ${ACCENT_SHADOW_HOVER}`; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; el.style.boxShadow = `0 4px 16px ${ACCENT_SHADOW}`; }}
      >{loading ? "Отправляем..." : "Подать заявку на участие"}</button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#e53e3e" }}>{error}</p>}
    </form>
  );
}

export default function DlyaSpecialistov() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Для специалистов — Dok Диалог</title>
        <meta name="description" content="Система профессионального перехода для специалистов, которые хотят выйти из потока, поднять уровень практики и работать с более ценным клиентом." />
        <meta property="og:title" content="Для специалистов — Dok Диалог" />
      </Helmet>
      <style>{`
        .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .sp-changes { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sp-formats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 860px) { .sp-grid { grid-template-columns: 1fr; gap: 40px; } .sp-formats { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .sp-changes { grid-template-columns: 1fr; } }
      `}</style>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 80, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="sp-grid">
            <div>
              <FadeIn>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Для специалистов</div>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 24 }}>
                  Для специалистов,<br />которые хотят выйти<br />из потоковой практики
                </h1>
              </FadeIn>
              <FadeIn delay={100}>
                <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.8, color: "#4a4a4a", marginBottom: 32, maxWidth: 500 }}>
                  Программа помогает перестроить мышление, стоимость, границы, коммуникацию, поток клиентов и глубину работы с телом.
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <a href="#application" style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
                >Подать заявку на участие</a>
              </FadeIn>
            </div>
            <FadeIn delay={150}>
              <div style={{ background: "#f0f7f7", borderRadius: 20, padding: "40px 36px" }}>
                <p style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 24, lineHeight: 1.3 }}>
                  Это не курс по техникам
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4a4a4a", marginBottom: 20 }}>
                  Техники не делают специалиста дорогим. Клиент платит не за набор приёмов — он платит за состояние, уверенность, безопасность, ощущение, что его ведут.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#666" }}>
                  Система «Dok Диалог» меняет не только то, что вы делаете руками, но и то, как вы думаете о своей практике, своём клиенте и своей ценности.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ЧТО МЕНЯЕТСЯ */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Результат</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Что меняется в практике</h2>
            </div>
          </FadeIn>
          <div className="sp-changes">
            {[
              "Понимает свою ценность как специалиста",
              "Перестаёт зависеть от каждого клиента",
              "Выстраивает границы и правила записи",
              "Повышает стоимость без суеты и оправданий",
              "Создаёт клиентский опыт более высокого уровня",
              "Понимает, как формируется доверие до первого контакта",
              "Работает с телом глубже и безопаснее",
              "Строит практику не на перегрузе, а на системе",
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div style={{ padding: "22px 24px", background: "#fff", borderRadius: 14, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `hsla(185, 85%, 32%, 0.1)`, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#3a3a3a" }}>Специалист {item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* КОМУ ПОДХОДИТ */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="sp-grid" style={{ gap: 48 }}>
            <FadeIn>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Аудитория</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 24, lineHeight: 1.2 }}>Кому подходит</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[
                    "Практикующие специалисты с опытом от 1 года, которые чувствуют потолок",
                    "Специалисты, которые хотят поднять стоимость, но не знают как",
                    "Те, кто устал от потоковой работы и хочет глубины",
                    "Специалисты, которым важна профессиональная устойчивость",
                    "Те, кто хочет работать с клиентами более высокого уровня",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>—</span>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#4a4a4a" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Форматы участия</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 24, lineHeight: 1.2 }}>Форматы участия</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                  {[
                    { title: "Система", text: "Основная программа для специалистов: мышление, практика, клиент" },
                    { title: "Практика", text: "Углублённый формат с отработкой и разборами в малой группе" },
                    { title: "Закрытая практика", text: "Индивидуальное сопровождение и работа в закрытом формате" },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: "20px 22px", background: "#f8f8f6", borderRadius: 14, borderLeft: `3px solid ${ACCENT}` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{f.title}</div>
                      <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ЗАКРЫТАЯ ПРАКТИКА */}
      <section style={{ padding: "64px 0", background: "#1a2a2a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Закрытый формат</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>Закрытая практика</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#a0b8b8", marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
              Для специалистов, которые хотят работать в закрытом формате, с индивидуальным вниманием и глубокой проработкой профессиональной системы.
            </p>
            <a href="/zakrytaya-praktika" style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
            >Обсудить закрытую практику</a>
          </FadeIn>
        </div>
      </section>

      {/* ЗАЯВКА */}
      <section id="application" style={{ padding: "80px 0", background: "#f8f8f6" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Участие</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Подать заявку</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Оставьте заявку — мы обсудим формат участия, который соответствует вашей задаче.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
              <ApplicationForm />
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
