import { useEffect, useRef, useState } from "react";
import { Helmet } from "@/lib/helmet";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

function useInView(threshold = 0.12) {
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

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.42)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

function Btn({ href, children, primary = true, style = {} }: { href: string; children: React.ReactNode; primary?: boolean; style?: React.CSSProperties }) {
  const base: React.CSSProperties = primary
    ? { background: ACCENT, color: "#fff", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }
    : { background: "transparent", color: ACCENT, border: `1.5px solid ${ACCENT}` };
  return (
    <a href={href} style={{
      display: "inline-block", padding: "14px 28px", borderRadius: 12,
      fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none",
      transition: "all 0.25s ease", whiteSpace: "nowrap" as const, ...base, ...style,
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (primary) { el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; }
        else { el.style.background = `hsla(185, 85%, 32%, 0.07)`; }
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (primary) { el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; }
        else { el.style.background = "transparent"; }
        el.style.transform = "translateY(0)";
      }}
    >{children}</a>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [topic, setTopic] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message: `Тип: ${type}\nТема: ${topic}\nКонтакт: ${contact}` }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети. Проверьте подключение."); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "hsl(185, 85%, 95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: ACCENT }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.7 }}>Мы свяжемся с вами в течение рабочего дня и обсудим подходящий формат.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        { label: "Ваше имя", value: name, onChange: setName, placeholder: "Имя" },
        { label: "Телефон или Telegram", value: contact, onChange: setContact, placeholder: "+7 (___) ___-__-__ или @username" },
      ].map(f => (
        <div key={f.label}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>{f.label}</label>
          <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} required
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat, sans-serif" }}
            onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
            onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
          />
        </div>
      ))}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Вы</label>
        <select value={type} onChange={e => setType(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box" as const, fontFamily: "Montserrat, sans-serif", color: type ? "#1a1a1a" : "#999" }}>
          <option value="">Выберите</option>
          <option value="Специалист">Специалист</option>
          <option value="Представитель салона">Представитель салона</option>
        </select>
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Что хотите обсудить</label>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Опишите коротко вашу задачу или вопрос" rows={3}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", resize: "none" as const, boxSizing: "border-box" as const, fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
      <button type="submit"
        style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Обсудить участие"}</button>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
    </form>
  );
}

export default function DokDialog() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Dok Диалог — система премиальной работы с телом, клиентом и практикой специалиста</title>
        <meta name="description" content="Профессиональная система для специалистов, салонов и wellness-пространств: работа с телом, состоянием клиента, премиальной практикой, коммуникацией, доверием и внедрением восстановительных методик." />
        <meta name="keywords" content="премиальная практика специалиста, обучение телесных специалистов, восстановительные практики для салонов, система работы с клиентом, работа с телом и состоянием, повышение ценности массажных услуг" />
        <meta property="og:title" content="Dok Диалог — система премиальной работы с телом, клиентом и практикой специалиста" />
        <meta property="og:description" content="Профессиональная система для специалистов и салонов, которые хотят работать с телом, клиентом и практикой на более глубоком и премиальном уровне." />
        <meta property="og:type" content="website" />
      </Helmet>

      <style>{`
        .idx-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .idx-dirs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .idx-why { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .idx-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .idx-cta { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .idx-thesis { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 900px) {
          .idx-hero { grid-template-columns: 1fr; gap: 40px; }
          .idx-dirs { grid-template-columns: 1fr; }
          .idx-why { grid-template-columns: 1fr 1fr; }
          .idx-split { grid-template-columns: 1fr; }
          .idx-cta { grid-template-columns: 1fr; gap: 40px; }
          .idx-thesis { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .idx-why { grid-template-columns: 1fr; }
        }
      `}</style>

      <DokNavbar />

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 130, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="idx-hero">
            <div>
              <FadeIn delay={0}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 22 }}>
                  Профессиональная система
                </div>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 28, letterSpacing: "-0.5px" }}>
                  Система премиальной работы<br />с телом, клиентом<br />и{" "}<span style={{ color: ACCENT }}>практикой специалиста</span>
                </h1>
              </FadeIn>
              <FadeIn delay={180}>
                <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: 1.8, color: "#4a4a4a", marginBottom: 16, maxWidth: 520 }}>
                  Для специалистов, салонов и wellness-пространств, которые хотят перейти от потоковой работы к более глубокому, спокойному и ценному формату взаимодействия с клиентом.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#777", marginBottom: 40, maxWidth: 500 }}>
                  В основе системы — работа с телом, состоянием человека, доверием, профессиональной позицией специалиста и качеством клиентского опыта.
                </p>
              </FadeIn>
              <FadeIn delay={280}>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
                  <Btn href="/dlya-specialistov">Для специалистов</Btn>
                  <Btn href="/dlya-salonov" primary={false}>Для салонов</Btn>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={150}>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.10)", aspectRatio: "4/5" }}>
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/a4d16c3c-91c6-4145-8abc-90128f2c8225.jpg"
                  alt="Dok Диалог — профессиональная работа с телом"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── ФИЛОСОФИЯ ─── */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>Философия системы</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, marginBottom: 24 }}>
                Премиальный результат начинается не с техники, а с системы
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#4a4a4a", marginBottom: 16 }}>
                Восстановительная работа высокого уровня строится не только на наборе приёмов. Клиент чувствует состояние специалиста, качество контакта, уверенность, безопасность, темп, глубину и способность вести процесс.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "#666" }}>
                «Dok Диалог» объединяет телесную практику, мышление специалиста, коммуникацию, диагностику, работу с доверием и профессиональную систему ведения клиента.
              </p>
            </div>
          </FadeIn>
          <div className="idx-thesis">
            {[
              "Тело отражает состояние человека",
              "Специалист работает не только руками, но и вниманием",
              "Премиальный клиент выбирает уровень, а не набор техник",
              "Доверие создаётся до первого визита",
              "Практика должна быть устойчивой, а не хаотичной",
              "Глубина работы — это не длина сессии, а качество присутствия",
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "22px 24px", background: "#f8f8f6", borderRadius: 14, borderLeft: `3px solid ${ACCENT}` }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#3a3a3a", fontWeight: 500 }}>{t}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── НАПРАВЛЕНИЯ ─── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Три направления</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Направления системы Dok Диалог
              </h2>
            </div>
          </FadeIn>
          <div className="idx-dirs">
            {[
              {
                num: "01",
                title: "Для специалистов",
                text: "Переход из потоковой практики в зрелую профессиональную систему: мышление, стоимость, границы, клиентский опыт, повторные визиты и глубокая работа с телом.",
                btn: "Перейти в направление",
                href: "/dlya-specialistov",
              },
              {
                num: "02",
                title: "Для салонов",
                text: "Внедрение премиальных восстановительных практик: обучение команды, повышение ценности услуг, стандарты клиентского опыта и система удержания клиентов.",
                btn: "Обсудить внедрение",
                href: "/dlya-salonov",
              },
              {
                num: "03",
                title: "Профессиональные встречи",
                text: "Закрытые лекции, разборы и встречи для специалистов и владельцев, которые хотят глубже понимать работу с телом, клиентом и практикой.",
                btn: "Ближайшие встречи",
                href: "/professionalnye-vstrechi",
              },
            ].map((d, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", height: "100%", boxSizing: "border-box" as const, display: "flex", flexDirection: "column" as const, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: ACCENT, marginBottom: 20 }}>{d.num}</div>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.2 }}>{d.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "#5a5a5a", flex: 1, marginBottom: 28 }}>{d.text}</p>
                  <Btn href={d.href} style={{ alignSelf: "flex-start", fontSize: 13, padding: "11px 22px" }}>{d.btn}</Btn>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ПОЧЕМУ ─── */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Основа</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Система, основанная на реальной практике
              </h2>
            </div>
          </FadeIn>
          <div className="idx-why">
            {[
              { n: "17+", label: "лет практики", sub: "Работа с клиентами высокого уровня в частной и профессиональной среде" },
              { n: "—", label: "Понимание тела", sub: "Телесная реакция, нервная система, состояние — в основе каждой программы" },
              { n: "—", label: "Система для команд", sub: "Работа как с отдельными специалистами, так и с командами салонов" },
              { n: "—", label: "Глубина и безопасность", sub: "Акцент на качестве контакта, доверии и клиентском пути" },
              { n: "—", label: "Премиальный уровень", sub: "Опыт частной практики с клиентами, которые ценят уровень, а не цену" },
              { n: "—", label: "Профессиональная среда", sub: "Закрытые форматы для зрелых специалистов, которым важна глубина" },
            ].map((w, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{ padding: "28px 24px", borderRadius: 16, border: "1px solid #eee", background: "#fafafa" }}>
                  {w.n !== "—" && <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{w.n}</div>}
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{w.label}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#777" }}>{w.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ДЛЯ СПЕЦИАЛИСТОВ / ДЛЯ САЛОНОВ ─── */}
      <div className="idx-split">
        <FadeIn>
          <div style={{ padding: "72px 48px", background: "#f0f7f7" }}>
            <div style={{ maxWidth: 460, margin: "0 auto" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>Для специалистов</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 20 }}>
                Выход из потоковой практики
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4a4a4a", marginBottom: 12 }}>
                Программа помогает перестроить мышление, стоимость, границы и коммуникацию.
              </p>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: "0 0 32px" }}>
                {["Понимание своей профессиональной ценности", "Повышение стоимости без суеты", "Более глубокая работа с телом", "Клиентский опыт высокого уровня"].map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#5a5a5a", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <Btn href="/dlya-specialistov">Подать заявку на участие</Btn>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ padding: "72px 48px", background: "#1a2a2a" }}>
            <div style={{ maxWidth: 460, margin: "0 auto" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>Для салонов</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
                Внедрение премиальных практик
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#a0b8b8", marginBottom: 12 }}>
                Система помогает усилить команду, повысить ценность услуг и создать клиентский опыт, за который возвращаются.
              </p>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: "0 0 32px" }}>
                {["Обучение команды мастеров", "Стандарты клиентского пути", "Повышение ценности услуг", "Возвращаемость клиентов"].map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#8aa8a8", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <Btn href="/dlya-salonov">Обсудить внедрение</Btn>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ─── СЕРГЕЙ ─── */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="idx-cta">
            <FadeIn>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Создатель системы</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, marginBottom: 20 }}>
                  Сергей Водопьянов
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "#4a4a4a", marginBottom: 16 }}>
                  Практик, который создал «Dok Диалог» как систему глубокой работы с телом и клиентом. В основе — 17+ лет практики, работа с клиентами высокого уровня и понимание, что результат создаётся не только техникой, но и состоянием специалиста.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#666", marginBottom: 32 }}>
                  Доверие, диагностика, профессиональная система ведения клиента — не как набор инструментов, а как зрелый профессиональный подход.
                </p>
                <Btn href="/o-sisteme" primary={false}>О системе подробнее</Btn>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{ background: "#f8f8f6", borderRadius: 20, padding: "40px 36px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Выберите формат</div>
                <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 24, lineHeight: 1.2 }}>
                  Выберите формат, который соответствует вашей задаче
                </h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Я специалист", href: "/dlya-specialistov" },
                    { label: "Я представляю салон", href: "/dlya-salonov" },
                    { label: "Пройти диагностику формата", href: "/quiz" },
                  ].map((b, i) => (
                    <Btn key={i} href={b.href} primary={i === 0} style={{ textAlign: "center", fontSize: 14 }}>{b.label}</Btn>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#aaa", textAlign: "center" as const }}>или <a href="/kontakty" style={{ color: ACCENT }}>напишите напрямую</a></p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── ОТЗЫВЫ (превью) ─── */}
      <section style={{ padding: "80px 0", background: "#f8f8f6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 16 }}>Истории</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
                Истории специалистов и команд
              </h2>
              <p style={{ fontSize: 15, color: "#666", margin: 0 }}>которые изменили подход к практике</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { text: "После программы я наконец-то перестала чувствовать себя виноватой за высокую цену. Это изменение мышления, а не просто техника.", name: "Анастасия К.", role: "Специалист по телесным практикам" },
              { text: "Внедрили систему в нашем салоне — через два месяца повторные визиты выросли. Клиенты стали говорить о другом уровне ощущений.", name: "Владислав М.", role: "Владелец wellness-центра" },
              { text: "Я работаю 6 лет, но только сейчас понял, как создаётся доверие до первого визита. Это переворачивает всю логику работы.", name: "Дмитрий Н.", role: "Массажист, частная практика" },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{ background: "#fff", borderRadius: 18, padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#3a3a3a", marginBottom: 20, fontStyle: "italic" }}>«{r.text}»</p>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{r.role}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: "center" }}>
              <Btn href="/reviews" primary={false}>Все истории</Btn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── ФИНАЛЬНЫЙ CTA ─── */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>Следующий шаг</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, marginBottom: 16 }}>
              Обсудите участие или внедрение
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#5a5a5a", marginBottom: 48 }}>
              Оставьте заявку и мы обсудим формат, который соответствует вашей задаче — будь то развитие практики специалиста или внедрение системы в салоне.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#f8f8f6", borderRadius: 24, padding: "48px 40px" }}>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}