import { useEffect, useRef, useState } from "react";
import { Helmet } from "@/lib/helmet";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";
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

function NotifyForm() {
  const [name, setName] = useState(""); const [contact, setContact] = useState(""); const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !contact.trim() || !agreed) { if (!agreed) setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Запись на профессиональные встречи. Контакт: ${contact}` }) });
      if (res.ok) setSent(true); else setError("Не удалось отправить.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: ACCENT }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Вы в списке</div>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>Мы уведомим вас о ближайших встречах.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[{ l: "Имя", v: name, s: setName, p: "Ваше имя" }, { l: "Telegram или телефон", v: contact, s: setContact, p: "@username или +7..." }].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 4 }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat" }} onFocus={e => (e.currentTarget.style.borderColor = ACCENT)} onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
        </div>
      ))}
      <label style={{ display: "flex", gap: 8, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: ACCENT }} />
        <span style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой</a></span>
      </label>
      <button type="submit" style={{ background: ACCENT, color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat", boxShadow: `0 4px 14px ${ACCENT_SHADOW}` }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Записаться на встречи"}</button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#e53e3e" }}>{error}</p>}
    </form>
  );
}

export default function ProfessionalnyeVstrechi() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Профессиональные встречи — Dok Диалог</title>
        <meta name="description" content="Закрытые лекции, разборы и встречи для специалистов и владельцев салонов. Работа с телом, клиентом и профессиональной практикой." />
        <meta property="og:title" content="Профессиональные встречи — Dok Диалог" />
      </Helmet>
      <style>{`
        .pv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .pv-formats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 860px) { .pv-grid { grid-template-columns: 1fr; gap: 40px; } .pv-formats { grid-template-columns: 1fr; } }
      `}</style>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 80, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="pv-grid" style={{ alignItems: "start" }}>
            <div>
              <FadeIn>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Закрытые встречи</div>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 24 }}>
                  Профессиональные встречи
                </h1>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4a4a4a", marginBottom: 16 }}>
                  Закрытые лекции, разборы и встречи для специалистов и владельцев, которые хотят глубже понимать работу с телом, клиентом и практикой.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#777", marginBottom: 40 }}>
                  Это не вебинары для массовой аудитории. Каждая встреча — это живой разбор профессиональных ситуаций, вопросов и тем, которые возникают в реальной практике.
                </p>
                <a href="#notify" style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
                >Записаться на ближайшую встречу</a>
              </FadeIn>
            </div>
            <FadeIn delay={150}>
              <div style={{ background: "#f0f7f7", borderRadius: 20, padding: "36px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Формат</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[
                    { label: "Закрытая группа", text: "Небольшой состав участников — пространство для настоящего разбора" },
                    { label: "Живая тема", text: "Каждая встреча — конкретная тема из реальной практики" },
                    { label: "Разбор случаев", text: "Ситуации участников, вопросы, ответы, практические выводы" },
                    { label: "Онлайн или офлайн", text: "Формат зависит от темы и состава участников" },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>—</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{f.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ТЕМЫ */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Темы встреч</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>О чём говорим</h2>
            </div>
          </FadeIn>
          <div className="pv-formats">
            {[
              { title: "Работа с телом", text: "Нервная система, телесная реакция, состояние клиента, глубина работы — практическое понимание, а не только техника." },
              { title: "Клиентский опыт", text: "Как создаётся доверие, как выстраивается визит, что клиент запоминает и почему возвращается." },
              { title: "Мышление специалиста", text: "Профессиональная позиция, ценность, границы, уверенность и устойчивость практики." },
              { title: "Диагностика", text: "Как читать состояние клиента до и во время работы. Что видно в теле, что важно учитывать." },
              { title: "Практика владельца", text: "Для руководителей салонов и wellness-пространств: команда, стандарты, качество, клиентский путь." },
              { title: "Разборы случаев", text: "Реальные ситуации из практики — совместный анализ, профессиональная точка зрения, выводы." },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "28px 24px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 32, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 16 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{t.title}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#5a5a5a" }}>{t.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* УВЕДОМЛЕНИЕ */}
      <section id="notify" style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Участие</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Записаться на встречи</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Оставьте контакт — мы уведомим вас о ближайших встречах и пришлём подробности.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#f8f8f6", borderRadius: 20, padding: "32px 28px" }}>
              <NotifyForm />
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}