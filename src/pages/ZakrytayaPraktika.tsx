import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
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

function ApplicationForm() {
  const [name, setName] = useState(""); const [contact, setContact] = useState(""); const [about, setAbout] = useState(""); const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !contact.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Заявка на закрытую практику. Контакт: ${contact}. О себе: ${about}` }) });
      if (res.ok) setSent(true); else setError("Не удалось отправить.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "28px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: ACCENT }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Мы свяжемся с вами лично и обсудим формат работы.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[{ l: "Имя", v: name, s: setName, p: "Ваше имя" }, { l: "Telegram или телефон", v: contact, s: setContact, p: "@username или +7..." }].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 5 }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat" }} onFocus={e => (e.currentTarget.style.borderColor = ACCENT)} onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
        </div>
      ))}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 5 }}>Коротко о себе и своей задаче</label>
        <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Опыт, текущая ситуация, что хотите изменить" rows={4} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", resize: "none" as const, boxSizing: "border-box" as const, fontFamily: "Montserrat", lineHeight: 1.6 }} onFocus={e => (e.currentTarget.style.borderColor = ACCENT)} onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
      </div>
      <label style={{ display: "flex", gap: 8, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: ACCENT }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a></span>
      </label>
      <button type="submit" style={{ background: ACCENT, color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Обсудить закрытую практику"}</button>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#e53e3e" }}>{error}</p>}
    </form>
  );
}

export default function ZakrytayaPraktika() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Закрытая практика — Dok Диалог</title>
        <meta name="description" content="Индивидуальное сопровождение и закрытый формат работы для специалистов, которые хотят глубокой проработки профессиональной системы." />
        <meta property="og:title" content="Закрытая практика — Dok Диалог" />
      </Helmet>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 80, background: "#1a2a2a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Закрытый формат</div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: 24 }}>
              Закрытая практика
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.8, color: "#a0b8b8", marginBottom: 16, maxWidth: 620 }}>
              Индивидуальный формат работы для специалистов, которые хотят глубокой проработки своей профессиональной системы — без группового формата, с полным вниманием к вашей задаче.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: "#7a9898", maxWidth: 560 }}>
              Это не курс с программой. Это живая работа с вашей практикой, мышлением, клиентским опытом и профессиональной позицией.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { title: "Для опытных специалистов", text: "Вы уже практикуете, но чувствуете потолок, который не пробить техниками. Нужна система — мышление, позиция, ценность." },
              { title: "Для специалистов с задачей", text: "Есть конкретная цель: поднять стоимость, выстроить поток, перейти в другой формат клиентов. Работаем точечно." },
              { title: "Для тех, кто ценит глубину", text: "Групповые программы уже пройдены. Нужна индивидуальная работа с живым вниманием, без компромиссов." },
            ].map((c, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{ padding: "32px 28px", background: "#f8f8f6", borderRadius: 18 }}>
                  <div style={{ width: 32, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 18 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>{c.title}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#5a5a5a" }}>{c.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* КАК УСТРОЕНО */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Формат</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>Как устроена закрытая практика</h2>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
            {[
              { n: "01", title: "Разговор о задаче", text: "Начинаем с диагностики: что происходит в практике сейчас, что хотите изменить, какой результат важен." },
              { n: "02", title: "Индивидуальная программа", text: "Под вашу задачу — не шаблон, а конкретная логика работы: что разбираем, с чего начинаем, как движемся." },
              { n: "03", title: "Живая работа", text: "Регулярные встречи, разборы, обратная связь. Работа в темпе, который подходит именно вам." },
              { n: "04", title: "Конкретный результат", text: "Изменения в мышлении, практике, стоимости, подходе к клиенту — то, что будет работать после завершения." },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "24px 0", borderBottom: i < 3 ? "1px solid #eee" : "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, color: ACCENT, flexShrink: 0, lineHeight: 1 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{s.title}</div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#5a5a5a" }}>{s.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ЗАЯВКА */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Заявка</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Обсудить закрытую практику</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Оставьте заявку — ответим лично и обсудим, подходит ли этот формат вашей задаче.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#f8f8f6", borderRadius: 20, padding: "36px 32px" }}>
              <ApplicationForm />
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
