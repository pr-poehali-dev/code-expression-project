import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";
const BG = "#f8f8f6";
const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/2ff0365b-3212-4e6c-bfed-e4c48f27a852.jpg";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [salon, setSalon] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
    transition: "border-color 0.2s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phone,
          message: `Заявка на диагностику салона\nСалон: ${salon || "не указан"}\nТелефон: ${phone}`,
        }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="CheckCircle" size={28} style={{ color: ACCENT }} />
        </div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Заявка принята!</div>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>Мы свяжемся с вами в течение рабочего дня и согласуем дату диагностики (понедельник).</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" required style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Название салона</label>
        <input value={salon} onChange={e => setSalon(e.target.value)} placeholder="Салон красоты «Лотос»" style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e" }}>{error}</p>}
      <button type="submit"
        style={{ background: ACCENT, color: "#fff", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background = ACCENT; el.style.transform = "translateY(0)"; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; }}
      >
        {loading ? "Отправляем..." : "Заказать диагностику →"}
      </button>
    </form>
  );
}

const WHAT_INCLUDES = [
  { icon: "BarChart2", title: "Сводная таблица потерь", desc: "Считаем в рублях: сколько салон теряет на каждой услуге, каждом мастере и каждом временном слоте. Не предположения — конкретные цифры." },
  { icon: "Users", title: "Оценка компетенций мастеров", desc: "Смотрим на уровень техники, тайминг процедур, взаимодействие с клиентом и потенциал каждого специалиста." },
  { icon: "Clock", title: "Анализ тайминга и загрузки", desc: "Где простои? Где мастер тратит лишнее время? Как оптимизировать расписание без потери качества." },
  { icon: "Tag", title: "Ценообразование", desc: "Соответствует ли прайс уровню услуги и рынку? Где салон недооценивает себя и теряет на этом деньги." },
  { icon: "TrendingUp", title: "Прогноз и варианты роста", desc: "Конкретные сценарии: что изменить, чтобы получить +20%, +40%, +60% к выручке от массажных услуг." },
  { icon: "Shield", title: "Гарантия качества", desc: "Мы гарантируем точность диагностики. Если отчёт не даст понимания потенциала — вернём деньги." },
];

const WHY_ITEMS = [
  "Узнаете реальную картину до любых вложений",
  "Поймёте, сколько теряете прямо сейчас",
  "Получите готовые сценарии роста с цифрами",
  "Диагностика не мешает работе салона",
  "Всего 3–4 часа — и у вас полная ясность",
  "Результат гарантирован или возврат денег",
];

export default function DiagnostikaSalona() {
  return (
    <div style={{ background: BG, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Диагностика массажного направления салона — Dok Диалог</title>
        <meta name="description" content="Платная диагностика массажных услуг салона: узнайте, сколько недополучает ваш салон. Сводная таблица потерь, прогноз роста. 30 000 ₽, 3–4 часа, без остановки работы." />
      </Helmet>
      <style>{`
        .ds-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
        .ds-what-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
        .ds-order-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .ds-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 960px) {
          .ds-hero-grid { grid-template-columns: 1fr; }
          .ds-hero-img { order: -1; max-height: 380px; overflow: hidden; }
          .ds-what-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 680px) {
          .ds-what-grid { grid-template-columns: 1fr; }
          .ds-order-grid { grid-template-columns: 1fr; }
          .ds-why-grid { grid-template-columns: 1fr; }
          .ds-order-col { padding: 32px 24px !important; }
        }
      `}</style>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 72, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <div className="ds-hero-grid">
            <div>
              <FadeIn>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 20, background: `${ACCENT}12`, borderRadius: 100, padding: "5px 14px" }}>
                  <Icon name="Search" size={12} style={{ color: ACCENT }} />
                  Платная услуга · 30 000 ₽
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 24, letterSpacing: "-0.5px" }}>
                  Узнайте, сколько<br />
                  <span style={{ color: ACCENT }}>теряет ваш салон<br />на массаже</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.8, color: "#4a4a4a", marginBottom: 28 }}>
                  Большинство владельцев салонов чувствуют, что массаж мог бы приносить больше. Но не знают — сколько именно и почему. Мы проведём диагностику и дадим конкретный ответ с цифрами — ещё до того, как вы примете любое решение.
                </p>
              </FadeIn>
              <FadeIn delay={250}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
                  {[
                    { icon: "Clock", text: "3–4 часа" },
                    { icon: "Building2", text: "Без остановки работы" },
                    { icon: "Calendar", text: "Только по понедельникам" },
                  ].map((tag, i) => (
                    <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: BG, border: "1px solid #e0e0dc", borderRadius: 100, padding: "7px 14px", fontSize: 13, color: "#555", fontWeight: 500 }}>
                      <Icon name={tag.icon} size={13} style={{ color: ACCENT }} />
                      {tag.text}
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <a href="#order"
                    style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "16px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                  >
                    Заказать диагностику
                  </a>
                  <a href="tel:+79029007474"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: ACCENT, padding: "16px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", border: `1.5px solid ${ACCENT}` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${ACCENT}08`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
                  >
                    <Icon name="Phone" size={15} />
                    Позвонить
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Photo */}
            <FadeIn delay={150}>
              <div className="ds-hero-img" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.13)", aspectRatio: "4/5", position: "relative" }}>
                <img src={HERO_IMG} alt="Диагностика массажного салона" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: "rgba(255,255,255,0.93)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="BarChart2" size={18} style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Точность оценки — 90%</div>
                      <div style={{ fontSize: 11, color: "#888" }}>по уникальной методике Dok Диалог</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
                Зачем это нужно владельцу салона?
              </h2>
              <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "#777", margin: 0, lineHeight: 1.7, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                Большинство решений в бизнесе принимаются вслепую. Диагностика даёт вам карту — прежде чем вы вложите деньги и время.
              </p>
            </div>
          </FadeIn>
          <div className="ds-why-grid">
            {WHY_ITEMS.map((text, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #e8e8e4" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="Check" size={13} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#333", lineHeight: 1.65, fontWeight: 500 }}>{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT INCLUDES */}
      <section style={{ background: "#fff", padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Что входит в диагностику</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Уникальный формат — понимание на 90%
              </h2>
            </div>
          </FadeIn>
          <div className="ds-what-grid">
            {WHAT_INCLUDES.map((item, i) => (
              <FadeIn key={i} delay={i * 70} style={{ height: "100%" }}>
                <div style={{ height: "100%", borderRadius: 18, padding: "28px 24px", border: "1px solid #e8e8e4", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={item.icon} size={22} style={{ color: ACCENT }} />
                  </div>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#666", lineHeight: 1.75, margin: 0, flex: 1 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE PREVIEW */}
      <section style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
                Что вы получите на руки
              </h2>
              <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "#777", lineHeight: 1.7, margin: 0 }}>
                После диагностики вы получите структурированный отчёт с таблицей и прогнозом
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e4", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: ACCENT, padding: "14px 24px", gap: 8 }}>
                {["Зона анализа", "Текущий доход", "Потенциал", "Разница / мес"].map((col, i) => (
                  <div key={i} style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em" }}>{col}</div>
                ))}
              </div>
              {/* Table rows */}
              {[
                ["Компетенции мастеров", "оценивается", "рассчитывается", "считаем за вас"],
                ["Тайминг процедур", "оценивается", "рассчитывается", "считаем за вас"],
                ["Ценообразование", "оценивается", "рассчитывается", "считаем за вас"],
                ["Загрузка расписания", "оценивается", "рассчитывается", "считаем за вас"],
                ["Допродажи и повторы", "оценивается", "рассчитывается", "считаем за вас"],
              ].map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "14px 24px", gap: 8, borderBottom: i < 4 ? "1px solid #f0f0ec" : "none", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{row[0]}</div>
                  {row.slice(1).map((cell, j) => (
                    <div key={j} style={{ fontSize: 13, color: j === 2 ? ACCENT : "#888", fontStyle: j === 2 ? "normal" : "italic", fontWeight: j === 2 ? 600 : 400 }}>{cell}</div>
                  ))}
                </div>
              ))}
              <div style={{ padding: "16px 24px", background: `${ACCENT}08`, borderTop: `2px solid ${ACCENT}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="Info" size={16} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                    Реальные цифры появятся в вашем отчёте — мы заполним каждую строку по вашему салону
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRICE + GUARANTEE */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ds-why-grid">
            <FadeIn>
              <div style={{ background: `linear-gradient(135deg, hsl(185,85%,10%) 0%, hsl(185,70%,20%) 100%)`, borderRadius: 20, padding: "clamp(28px, 4vw, 40px)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Стоимость</div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(42px, 6vw, 64px)", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 8 }}>30 000 ₽</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 20px" }}>Разовая оплата. Выезд специалиста в ваш салон. Диагностика проходит только по понедельникам.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["3–4 часа без остановки работы", "Подробный отчёт с таблицей", "Прогноз и варианты роста"].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="Check" size={13} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div style={{ background: BG, borderRadius: 20, padding: "clamp(28px, 4vw, 40px)", border: "1px solid #e8e8e4", height: "100%", boxSizing: "border-box" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name="ShieldCheck" size={24} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Гарантия качества</div>
                <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#555", lineHeight: 1.8, margin: 0 }}>
                  Мы гарантируем качество выполнения диагностики. Если отчёт не даст вам чёткого понимания потенциала вашего салона — мы вернём деньги в полном объёме. Без вопросов.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }} className="ds-order-grid">
              {/* Left — info */}
              <div className="ds-order-col" style={{ padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 52px)", background: ACCENT, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
                  Готовы узнать правду о своём салоне?
                </div>
                <p style={{ fontSize: "clamp(14px, 1.6vw, 15px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: 32 }}>
                  Оставьте заявку — мы согласуем ближайший доступный понедельник и расскажем, как подготовиться.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <a href="tel:+79029007474"
                    style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="Phone" size={18} style={{ color: "#fff" }} />
                    </div>
                    +7 (902) 900-74-74
                  </a>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                    <Icon name="Calendar" size={16} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                    Диагностика проводится только по понедельникам
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                    <Icon name="Clock" size={16} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                    Ответим в течение рабочего дня
                  </div>
                </div>
              </div>
              {/* Right — form */}
              <div className="ds-order-col" style={{ padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 52px)" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Заказать диагностику</div>
                <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.55 }}>Заполните форму — мы свяжемся и согласуем дату</p>
                <OrderForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
