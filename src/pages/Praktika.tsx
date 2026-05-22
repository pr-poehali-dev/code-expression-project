import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

const GOLD = "#c9a96e";
const GOLD_LIGHT = "rgba(201,169,110,0.12)";
const DARK = "#0f1419";
const DARK2 = "#161d24";
const DARK3 = "#1e2730";
const TEXT = "#e8e8e8";
const TEXT_SUB = "rgba(232,232,232,0.55)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, up = true, style = {} }: { children: React.ReactNode; delay?: number; up?: boolean; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : up ? "translateY(32px)" : "translateY(0)",
      transition: `opacity 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function GoldLine() {
  return <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)`, borderRadius: 2, marginBottom: 20 }} />;
}

function ApplicationForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
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
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Заявка на тариф «Практика» 90 900 ₽. Контакт: ${contact}` }) });
      if (res.ok) setSent(true); else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: GOLD_LIGHT, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.75 }}>Свяжемся с вами в течение рабочего дня и обсудим доступ к программе.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
    background: "rgba(255,255,255,0.05)", color: "#fff",
    transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[{ l: "Имя", v: name, s: setName, p: "Ваше имя" }, { l: "Телефон или Telegram", v: contact, s: setContact, p: "+7 или @username" }].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SUB, marginBottom: 6, letterSpacing: "0.06em" }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}80`)}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>
      ))}
      <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: GOLD }} />
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: GOLD }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: GOLD }} target="_blank">офертой</a></span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ff6b6b" }}>{error}</p>}
      <button type="submit"
        style={{ background: GOLD, color: DARK, padding: "15px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.25s", fontFamily: "Montserrat, sans-serif", letterSpacing: "0.04em" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Получить доступ"}</button>
    </form>
  );
}

const PAINS = [
  "Много знаний — мало клиентов",
  "Страх называть цену",
  "Работа на грани выживания",
  "Хаос в практике, нет системы",
  "Эмоциональное выгорание",
  "Страх работать с обеспеченными людьми",
  "Тревога и неуверенность в себе",
  "Зависимость от каждого клиента",
  "Отсутствие внутренней опоры",
];

const CHANGES = [
  {
    icon: "🧠",
    title: "Мышление",
    items: ["Появляется уверенность", "Исчезает хаос", "Формируется профессиональная позиция"],
  },
  {
    icon: "💰",
    title: "Доход",
    items: ["Повышение стоимости услуг", "Более платёжеспособные клиенты", "Стабильность практики"],
  },
  {
    icon: "⭐",
    title: "Репутация",
    items: ["Клиент начинает доверять", "Появляются рекомендации", "Специалист воспринимается серьёзно"],
  },
  {
    icon: "🌿",
    title: "Состояние",
    items: ["Меньше тревоги", "Больше спокойствия", "Ощущение контроля над практикой"],
  },
  {
    icon: "🤝",
    title: "Работа с клиентом",
    items: ["Понимание глубинных причин", "Системная диагностика", "Уверенное ведение сессии"],
  },
];

const MODULES = [
  { n: "01", title: "Мышление специалиста", text: "Профессиональная позиция, внутренняя опора, уверенность в себе и своей работе." },
  { n: "02", title: "Работа с внутренними ограничениями", text: "Страх денег, синдром самозванца, зависимость от оценки клиента." },
  { n: "03", title: "Привлечение клиентов", text: "Как формировать поток, личный бренд, доверие и упаковка специалиста." },
  { n: "04", title: "Позиционирование", text: "Кто вы как специалист, чем отличаетесь, как это транслировать клиенту." },
  { n: "05", title: "Ценообразование", text: "Как формировать стоимость, повышать чек и перестать работать «за дёшево»." },
  { n: "06", title: "Работа с премиальными клиентами", text: "Коммуникация, статус, подача, уверенное ведение диалога." },
  { n: "07", title: "Диагностика состояния клиента", text: "Анализ, понимание причин, системная работа с человеком." },
  { n: "08", title: "Техники сопровождения", text: "Инструменты стабилизации, снижения стресса, работы с напряжением." },
  { n: "09", title: "Практика и разборы", text: "Применение системы на реальных ситуациях, разборы кейсов." },
];

const FOR_WHOM = [
  "Телесные специалисты",
  "Массажисты",
  "Практики по работе со стрессом",
  "Специалисты по состояниям",
  "Начинающие специалисты",
  "Те, кто хочет выйти в частную практику",
];

export default function Praktika() {
  return (
    <div style={{ background: DARK, color: TEXT, fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>«Практика» — тариф №1 | Dok Диалог</title>
        <meta name="description" content="Система для специалистов по телу и состояниям, которые хотят выйти из хаоса, повысить стоимость услуг и привлекать платёжеспособных клиентов. 90 900 ₽, доступ 12 месяцев." />
        <meta property="og:title" content="«Практика» — тариф №1 | Dok Диалог" />
      </Helmet>

      <style>{`
        .pr-hero { display: grid; grid-template-columns: 1fr 420px; gap: 80px; align-items: center; }
        .pr-changes { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .pr-modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .pr-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        @media (max-width: 1100px) { .pr-changes { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) {
          .pr-hero { grid-template-columns: 1fr; gap: 48px; }
          .pr-changes { grid-template-columns: repeat(2, 1fr); }
          .pr-modules { grid-template-columns: repeat(2, 1fr); }
          .pr-price-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 560px) {
          .pr-changes { grid-template-columns: 1fr; }
          .pr-modules { grid-template-columns: 1fr; }
        }
      `}</style>

      <DokNavbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="pr-hero">
            <div>
              <FadeIn delay={0}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD_LIGHT, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Тариф №1 · 90 900 ₽</span>
                </div>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.08, color: "#fff", marginBottom: 28, letterSpacing: "-0.5px" }}>
                  Сильная практика начинается не с техник.<br />
                  <span style={{ color: GOLD }}>А с мышления специалиста.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: TEXT_SUB, marginBottom: 16, maxWidth: 520 }}>
                  Система для специалистов по телу и состояниям, которые хотят:
                </p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 40 }}>
                  {[
                    "уверенно работать с людьми",
                    "выйти из хаоса в систему",
                    "повысить стоимость услуг",
                    "привлекать платёжеспособных клиентов",
                    "стать специалистом, которого рекомендуют",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={240}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                  <a href="#application"
                    style={{ display: "inline-block", background: GOLD, color: DARK, padding: "15px 32px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.25s", letterSpacing: "0.04em" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                  >Получить доступ</a>
                  <a href="#program"
                    style={{ display: "inline-block", background: "transparent", color: TEXT, padding: "15px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: "1px solid rgba(255,255,255,0.15)" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.35)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.transform = "translateY(0)"; }}
                  >Посмотреть программу</a>
                </div>
              </FadeIn>
            </div>

            {/* Правая панель — визуал */}
            <FadeIn delay={200}>
              <div style={{ background: DARK2, borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "28px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: TEXT_SUB, letterSpacing: "0.1em", marginBottom: 14 }}>ПРОГРАММА «ПРАКТИКА»</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                    {["Мышление специалиста", "Работа с ограничениями", "Привлечение клиентов", "Ценообразование", "Работа с премиум-аудиторией"].map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD_LIGHT, border: `1px solid ${GOLD}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                        </div>
                        <span style={{ fontSize: 13, color: TEXT_SUB }}>{m}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: `${GOLD}60`, marginTop: 4 }}>+ ещё 4 модуля...</div>
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: GOLD, marginBottom: 4 }}>90 900 ₽</div>
                  <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 20 }}>Доступ 12 месяцев</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {["9 модулей", "12 месяцев доступа", "Техники и схемы"].map((f, i) => (
                      <div key={i} style={{ fontSize: 11, color: TEXT_SUB, textAlign: "center" as const }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: `${GOLD}60`, margin: "0 auto 6px" }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── БОЛЬ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 600, marginBottom: 60 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
                Почему даже сильные специалисты годами стоят на месте?
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {PAINS.map((pain, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div style={{ padding: "28px 24px", background: DARK3, borderLeft: `2px solid ${GOLD}30` }}>
                  <div style={{ width: 20, height: 1, background: `${GOLD}50`, marginBottom: 16 }} />
                  <p style={{ margin: 0, fontSize: 14, color: TEXT_SUB, lineHeight: 1.6, fontWeight: 500 }}>{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПЕРЕЛОМ ── */}
      <section style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 32 }}>
              Проблема не в техниках.<br />
              <span style={{ color: GOLD }}>Проблема в том, как специалист воспринимает себя.</span>
            </h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="pr-price-grid">
            <FadeIn delay={100}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 20 }}>Сейчас</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {["Недооценивает себя", "Боится денег", "Не умеет выстраивать ценность", "Работает без структуры", "Эмоционально зависит от клиента"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 700, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={180}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 20 }}>После</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {["Чувствует внутреннюю устойчивость", "Спокойно говорит о деньгах", "Перестаёт бояться отказов", "Понимает свою ценность", "Ведёт практику профессионально"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── ЧТО ИЗМЕНИТСЯ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 60 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                Что изменится после прохождения программы
              </h2>
            </div>
          </FadeIn>
          <div className="pr-changes">
            {CHANGES.map((c, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{ background: DARK3, borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(255,255,255,0.05)", height: "100%", boxSizing: "border-box" as const }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 16, letterSpacing: "0.04em" }}>{c.title}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {c.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${GOLD}60`, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТЕХНИКИ ── */}
      <section style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="pr-price-grid">
              <div>
                <GoldLine />
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
                  Люди платят не за хаотичные упражнения.<br />
                  <span style={{ color: GOLD }}>А за результат и профессиональное ведение.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8 }}>
                  В программе — диагностические техники, методы стабилизации, работа с напряжением и стрессом, уверенное сопровождение клиента.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {["Понимает, что делать", "Перестаёт теряться в сессии", "Работает системно", "Чувствует уверенность в практике", "Вызывает доверие клиентов"].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: DARK2, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 13, color: TEXT_SUB }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ПРЕМИАЛЬНЫЙ КЛИЕНТ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
              Премиальный клиент чувствует специалиста<br />
              <span style={{ color: GOLD }}>за первые минуты.</span>
            </h2>
            <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.85, maxWidth: 560, margin: "0 auto 48px" }}>
              Платёжеспособные люди покупают уверенность, спокойствие и ощущение профессионализма. После обучения вы перестаёте заискивать, учитесь держать позицию и спокойно говорить о стоимости.
            </p>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
            {["Перестаёт заискивать", "Держит профессиональную позицию", "Спокойно говорит о стоимости", "Воспринимает себя иначе"].map((t, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "24px 20px", background: DARK3, borderTop: `2px solid ${GOLD}30` }}>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.6 }}>{t}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОГРАММА ── */}
      <section id="program" style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 56 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                Программа курса
              </h2>
            </div>
          </FadeIn>
          <div className="pr-modules">
            {MODULES.map((m, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div style={{ padding: "28px 24px", background: DARK2, borderLeft: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: `${GOLD}40`, marginBottom: 12 }}>{m.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{m.title}</div>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT_SUB, lineHeight: 1.65 }}>{m.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ДЛЯ КОГО ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="pr-price-grid">
              <div>
                <GoldLine />
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                  Для кого эта программа
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {FOR_WHOM.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ФИНАЛ ЭМОЦИЯ ── */}
      <section style={{ padding: "96px 0 80px", textAlign: "center" as const }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
              Вы можете быть сильным специалистом<br />
              <span style={{ color: GOLD }}>и при этом жить спокойно, уверенно и достойно.</span>
            </h2>
            <p style={{ fontSize: 16, color: TEXT_SUB, lineHeight: 1.85, marginBottom: 48 }}>
              Это не просто курс. Это переход: из хаоса — в систему, из тревоги — в уверенность, из выживания — в профессиональную практику.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 540, margin: "0 auto 60px" }}>
              {[["Из хаоса", "В систему"], ["Из тревоги", "В уверенность"], ["Из выживания", "В практику"]].map(([from, to], i) => (
                <div key={i} style={{ padding: "20px 16px", background: DARK2, textAlign: "center" as const }}>
                  <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 8 }}>{from}</div>
                  <div style={{ width: 20, height: 1, background: `${GOLD}50`, margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{to}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ТАРИФ + ФОРМА ── */}
      <section id="application" style={{ padding: "80px 0 100px", background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="pr-price-grid">
            <FadeIn>
              <div>
                <GoldLine />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 16 }}>Тариф</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 42, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>«Практика»</h2>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>90 900 ₽</div>
                <div style={{ fontSize: 13, color: TEXT_SUB, marginBottom: 36 }}>Доступ 12 месяцев</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {["Все 9 модулей программы", "Диагностические техники", "Работа с мышлением и ограничениями", "Привлечение и работа с клиентами", "Ценообразование и премиум-аудитория", "Видеоуроки, материалы и схемы"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{ background: DARK3, borderRadius: 20, padding: "36px 32px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_SUB, marginBottom: 24 }}>Получить доступ к программе</div>
                <ApplicationForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
