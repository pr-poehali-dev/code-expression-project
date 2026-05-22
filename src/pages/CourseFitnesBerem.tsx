import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState } from "react";

const ACCENT = "hsl(280, 60%, 45%)";
const ACCENT_DARK = "hsl(280, 60%, 38%)";
const ACCENT_SHADOW = "hsla(280, 60%, 45%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(280, 60%, 45%, 0.45)";
const BG = "#f8f8f6";
const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/0fd773ca-0152-49ae-b5a9-d70add20f7de.jpg";
const BUY_URL = "https://school.brossok.ru/buy/60";

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

function BtnPrimary({ href, children, style = {} }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const isWhite = (style as React.CSSProperties & { background?: string }).background === "#fff";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "16px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: "none", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif", ...style }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = isWhite ? "rgba(255,255,255,0.88)" : ACCENT_DARK;
        el.style.color = isWhite ? ACCENT : "#fff";
        el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`;
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = isWhite ? "#fff" : ACCENT;
        el.style.color = isWhite ? ACCENT : "#fff";
        el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`;
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 40px)",
  fontWeight: 700,
  margin: "0 0 32px",
  color: "#1a1a1a",
};

const PROGRAMS = [
  {
    label: "СТАРТ",
    freq: "2 раза в неделю",
    color: "hsl(185, 85%, 32%)",
    bg: "hsl(185, 85%, 97%)",
    desc: "Если ты только начинаешь или хочешь мягко включиться в движение. Минимальная нагрузка, максимальный комфорт.",
    icon: "Leaf",
  },
  {
    label: "ОПТИМУМ",
    freq: "3 раза в неделю",
    color: ACCENT,
    bg: "hsl(280, 60%, 97%)",
    desc: "Для стабильной нагрузки и поддержания формы. Оптимальный баланс между активностью и восстановлением.",
    icon: "Flame",
    badge: "Популярный",
  },
  {
    label: "ПОЛНЫЙ КОНТРОЛЬ",
    freq: "Вариация на 7 дней",
    color: "hsl(12, 80%, 45%)",
    bg: "hsl(12, 80%, 97%)",
    desc: "Если хочешь выстроить регулярность и чувствовать своё тело каждый день. Полное погружение в процесс.",
    icon: "Star",
  },
];

const RESULTS = [
  { icon: "Activity", text: "Снижение напряжения в спине и теле" },
  { icon: "Zap", text: "Больше энергии в течение дня" },
  { icon: "Heart", text: "Лучшее понимание своего состояния" },
  { icon: "Shield", text: "Ощущение контроля над телом" },
  { icon: "Baby", text: "Подготовка к следующему этапу беременности" },
  { icon: "Sun", text: "Спокойствие и уверенность в своих действиях" },
];

const FOR_WHOM = [
  "Ты во 2-м триместре беременности",
  "Хочешь тренироваться, но не уверена, как делать это безопасно",
  "Чувствуешь зажимы, усталость или дискомфорт в теле",
  "Хочешь поддерживать тело без риска для себя и малыша",
  "Ищешь готовую систему — без самостоятельного подбора упражнений",
  "Хочешь чувствовать тело и проживать этот период осознанно",
];

const FAQS = [
  {
    q: "Можно ли заниматься без опыта тренировок?",
    a: "Да. Все программы адаптированы под разный уровень подготовки. Программа «Старт» специально создана для тех, кто раньше не тренировался или давно не занимался.",
  },
  {
    q: "Нужно ли специальное оборудование?",
    a: "Нет. Все упражнения выполняются с собственным весом. Понадобится только коврик и удобная одежда.",
  },
  {
    q: "Безопасно ли это для ребёнка?",
    a: "Программы разработаны специально под 2-й триместр с учётом всех физиологических изменений. Нагрузки подобраны так, чтобы не создавать риска — ни для мамы, ни для малыша.",
  },
  {
    q: "Как долго длится каждая тренировка?",
    a: "От 20 до 40 минут в зависимости от выбранной программы. Ничего лишнего — только то, что действительно нужно твоему телу сейчас.",
  },
  {
    q: "Можно ли начать в любой момент?",
    a: "Да. Доступ к курсу открывается сразу после оплаты. Начинай в удобное для тебя время.",
  },
];

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: "clamp(14px, 1.5vw, 15px)", fontWeight: 600, color: "#1a1a1a", textAlign: "left", gap: 16 }}>
        <span>{title}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: ACCENT, flexShrink: 0 }} />
      </button>
      {open && <div style={{ paddingBottom: 20, fontSize: "clamp(13px, 1.4vw, 14px)", color: "#555", lineHeight: 1.8 }}>{children}</div>}
    </div>
  );
}

export default function CourseFitnesBerem() {
  const buyUrl = BUY_URL;
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Фитнес для беременных (2-й триместр) — Безопасные тренировки | Dok Диалог</title>
        <meta name="description" content="Онлайн-курс: безопасные тренировки для беременных во 2-м триместре. 3 программы по частоте занятий. Автор — Сергей Водопьянов. 5 590 ₽." />
      </Helmet>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 90, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(20px, 4vw, 40px) 20px 0" }}>
          <a href="/catalog/private?tab=point" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, textDecoration: "none", marginBottom: 24 }}
            onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={e => (e.currentTarget.style.color = "#999")}
          >
            <Icon name="ArrowLeft" size={14} />
            Назад к каталогу
          </a>
        </div>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px 0" }}>
          <div className="cfb-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 5vw, 64px)", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}14`, color: ACCENT, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                <Icon name="Baby" size={14} />
                Точечный курс · 2-й триместр
              </div>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(34px, 5.5vw, 58px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px", color: "#1a1a1a" }}>
                Фитнес для беременных
              </h1>
              <p style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 600, color: "#333", margin: "0 0 14px", lineHeight: 1.4 }}>
                Безопасные тренировки для тела, которое меняется каждый день
              </p>
              <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.8, margin: "0 0 28px" }}>
                Готовые программы на 2-й триместр — без перегрузок, без риска, с фокусом на твоё состояние и самочувствие. Просто открываешь и делаешь.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {["Онлайн", "2-й триместр", "3 программы", "Без оборудования"].map(tag => (
                  <span key={tag} style={{ padding: "5px 12px", borderRadius: 8, background: BG, border: "1px solid #e0e0dc", fontSize: 13, color: "#555", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <BtnPrimary href={buyUrl} style={{ fontSize: "clamp(14px, 1.6vw, 16px)", padding: "clamp(14px, 2vw, 16px) clamp(28px, 4vw, 40px)" }}>
                  Купить курс — 5 590 ₽ →
                </BtnPrimary>
              </div>
            </div>
            <div className="cfb-hero-img" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }}>
              <img src={HERO_IMG} alt="Фитнес для беременных 2-й триместр" style={{ width: "100%", height: "clamp(300px, 42vw, 520px)", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          {/* Stats */}
          <div className="cfb-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e8e8e4", marginTop: 48 }}>
            {[
              { num: "2-й", label: "триместр" },
              { num: "3", label: "программы на выбор" },
              { num: "5 590 ₽", label: "полный доступ" },
              { num: "7+", label: "тренировок в неделю" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "clamp(16px, 2vw, 28px) clamp(12px, 2vw, 24px)", borderRight: i < 3 ? "1px solid #e8e8e4" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "clamp(11px, 1.2vw, 13px)", color: "#888", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Если ты во 2-м триместре и не понимаешь, как правильно тренироваться — это нормально</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.6vw, 16px)", color: "#666", margin: "-16px auto 36px", maxWidth: 620, lineHeight: 1.75 }}>
              В этот период тело уже изменилось, и главный вопрос: что можно делать, а что уже небезопасно?
            </p>
          </FadeIn>
          <div className="cfb-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              "Появляется нагрузка на спину и поясницу",
              "Меняется центр тяжести — координация другая",
              "Снижается уровень энергии",
              "Могут появляться зажимы и дискомфорт",
              "Случайные тренировки из интернета не учитывают твоё состояние",
              "Полное отсутствие движения усиливает напряжение",
            ].map((text, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="AlertCircle" size={13} style={{ color: "#e05050" }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.65 }}>{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", color: "#333", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                Этот курс — понятная система тренировок для 2-го триместра.<br />
                <span style={{ color: ACCENT }}>Без перегрузок. Без риска. Просто открываешь и делаешь.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PROGRAMS */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Выбери программу под свой ритм жизни</h2>
            <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", margin: "-16px auto 40px", maxWidth: 560, lineHeight: 1.7 }}>
              Все три программы включены в курс. Ты сама решаешь, какой ритм подходит тебе прямо сейчас.
            </p>
          </FadeIn>
          <div className="cfb-prog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PROGRAMS.map((p, i) => (
              <FadeIn key={i} delay={i * 80} style={{ height: "100%" }}>
                <div style={{ height: "100%", borderRadius: 20, overflow: "hidden", border: "1px solid #e8e8e4", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", position: "relative", boxSizing: "border-box" }}>
                  {p.badge && (
                    <div style={{ position: "absolute", top: 16, right: 16, background: p.color, color: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{p.badge}</div>
                  )}
                  <div style={{ background: p.bg, padding: "28px 24px 22px" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                      <Icon name={p.icon} size={22} style={{ color: p.color }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: p.color, marginBottom: 5 }}>{p.label}</div>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#1a1a1a" }}>{p.freq}</div>
                  </div>
                  <div style={{ padding: "20px 24px", flex: 1 }}>
                    <p style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: "#555", lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Что ты получишь в результате</h2>
          </FadeIn>
          <div className="cfb-results-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {RESULTS.map((r, i) => (
              <FadeIn key={i} delay={i * 60} style={{ height: "100%" }}>
                <div style={{ height: "100%", display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8e8e4", boxSizing: "border-box" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={r.icon} size={18} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#333", lineHeight: 1.6, fontWeight: 500, paddingTop: 2 }}>{r.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Кому подойдёт этот курс</h2>
          </FadeIn>
          <div className="cfb-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {FOR_WHOM.map((text, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: BG, borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="Check" size={13} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.65 }}>{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(32px, 5vw, 52px)", border: "1px solid #e8e8e4", boxShadow: "0 4px 32px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Icon name="Lightbulb" size={28} style={{ color: ACCENT }} />
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px" }}>Почему это работает</h2>
              <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "#555", lineHeight: 1.85, margin: "0 0 24px" }}>
                Программы уже адаптированы под особенности 2-го триместра. Тебе не нужно искать упражнения, сомневаться — можно или нельзя, и составлять план самой.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                {["Не нужно искать упражнения", "Не нужно сомневаться", "Не нужно составлять план"].map((t, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: BG, border: "1px solid #e0e0dc", borderRadius: 100, padding: "7px 16px", fontSize: 13, color: "#555", fontWeight: 500 }}>
                    <Icon name="Check" size={12} style={{ color: ACCENT }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AUTHOR + DEMONSTRATOR */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Кто создал этот курс</h2>
          </FadeIn>

          {/* Author card */}
          <FadeIn delay={100}>
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", background: BG, borderRadius: 20, padding: "clamp(24px, 4vw, 40px)", border: "1px solid #e8e8e4", marginBottom: 20 }} className="cfb-author">
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/8cd8e2aa-0e99-4ff1-ae38-06afef26f470.png"
                alt="Сергей Водопьянов"
                style={{ width: 110, height: 110, borderRadius: 16, objectFit: "cover", objectPosition: "top center", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Автор курса · Руководитель Dok Диалог</div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Сергей Водопьянов</div>
                <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "#555", lineHeight: 1.8, margin: "0 0 16px" }}>
                  Остеопат с 17-летним опытом, член Российской остеопатической ассоциации. Руководитель образовательной платформы Dok Диалог. Работает с беременными женщинами, помогая им безопасно поддерживать тело в каждом триместре — с опорой на физиологию, а не на общие рекомендации.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {["17 лет опыта", "3000+ консультаций", "Член РОА", "Руководитель Dok Диалог"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: `${ACCENT}10`, borderRadius: 100, padding: "4px 12px" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Demonstrator card */}
          <FadeIn delay={180}>
            <div style={{ background: `linear-gradient(135deg, hsl(280,60%,12%) 0%, hsl(280,50%,22%) 100%)`, borderRadius: 20, padding: "clamp(24px, 4vw, 40px)", display: "flex", gap: 28, alignItems: "flex-start" }} className="cfb-author">
              <div style={{ width: 110, height: 110, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="Star" size={44} style={{ color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "4px 12px" }}>
                  <Icon name="Video" size={11} style={{ color: "rgba(255,255,255,0.5)" }} />
                  Демонстратор упражнений
                </div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                  Мастер спорта по гимнастике
                </div>
                <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: "0 0 16px" }}>
                  Все упражнения в курсе показывает профессиональная спортсменка — мастер спорта по гимнастике, которая сама находилась во 2-м триместре беременности в момент съёмки. Это не постановочное видео — это реальное тело в реальном состоянии, выполняющее каждое движение так, как его стоит делать именно сейчас.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {["2-й триместр во время съёмки", "Мастер спорта по гимнастике", "Реальные тренировки на видео"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px", background: `linear-gradient(135deg, hsl(280, 60%, 12%) 0%, hsl(280, 50%, 22%) 100%)` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon name="Baby" size={30} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4.5vw, 44px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Начни с безопасного движения
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(255,255,255,0.75)", margin: "0 0 12px", lineHeight: 1.75 }}>
            Твоё тело сейчас проходит важный этап. И правильная нагрузка — это не про «спорт», а про состояние, в котором ты проживаешь этот период.
          </p>
          <p style={{ fontSize: "clamp(22px, 3vw, 28px)", fontFamily: "Cormorant, serif", fontWeight: 700, color: "#fff", margin: "0 0 28px" }}>
            Полный доступ — 5 590 ₽
          </p>
          <BtnPrimary href={buyUrl} style={{ background: "#fff", color: ACCENT, fontSize: "clamp(14px, 1.6vw, 16px)", padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px)" }}>
            Купить курс →
          </BtnPrimary>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ ...h2style, textAlign: "center" }}>Частые вопросы</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "0 clamp(16px, 4vw, 32px)", border: "1px solid #e8e8e4" }}>
              {FAQS.map((f, i) => (
                <AccordionItem key={i} title={f.q}>{f.a}</AccordionItem>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .cfb-hero-grid { grid-template-columns: 1fr !important; }
          .cfb-hero-img { order: -1; }
          .cfb-hero-img img { height: 280px !important; }
          .cfb-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .cfb-prog-grid { grid-template-columns: 1fr !important; }
          .cfb-author { flex-direction: column !important; align-items: flex-start !important; }
          .cfb-proof-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cfb-pain-grid { grid-template-columns: 1fr !important; }
          .cfb-results-grid { grid-template-columns: 1fr !important; }
          .cfb-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .cfb-hero-grid { gap: 24px !important; }
          .cfb-author { gap: 16px !important; }
        }
        @media (max-width: 420px) {
          .cfb-stats { grid-template-columns: 1fr 1fr !important; font-size: 12px; }
          .cfb-author img { width: 80px !important; height: 80px !important; }
        }
      `}</style>

      <DokFooter />
    </div>
  );
}