import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.28)";
const BG = "#f8f8f6";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

type Answer = { label: string; value: string };
type Question = { id: string; text: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    id: "role",
    text: "Кто вы?",
    answers: [
      { label: "Специалист, веду частную практику", value: "specialist" },
      { label: "Специалист, работаю в найме", value: "hired" },
      { label: "Владелец салона или wellness-пространства", value: "salon" },
      { label: "Только начинаю путь в профессии", value: "beginner" },
    ],
  },
  {
    id: "stage",
    text: "Как бы вы описали свою текущую ситуацию?",
    answers: [
      { label: "Работаю много, но доход не растёт", value: "overloaded" },
      { label: "Хочу повысить стоимость, но не знаю как", value: "price_block" },
      { label: "Нет системы — работаю хаотично", value: "no_system" },
      { label: "Хочу выйти на другой уровень клиентов", value: "level_up" },
      { label: "Хочу внедрить стандарты в команду", value: "team" },
    ],
  },
  {
    id: "goal",
    text: "Что для вас сейчас самое важное?",
    answers: [
      { label: "Разобраться в мышлении и позиции специалиста", value: "mindset" },
      { label: "Выстроить поток платёжеспособных клиентов", value: "clients" },
      { label: "Повысить чек и перестать работать «за дёшево»", value: "price" },
      { label: "Внедрить современные инструменты и технологии", value: "tools" },
      { label: "Получить личное сопровождение и разборы", value: "mentoring" },
      { label: "Обучить команду и выстроить стандарты", value: "team_training" },
    ],
  },
  {
    id: "format",
    text: "Какой формат работы вам ближе?",
    answers: [
      { label: "Хочу пройти путь самостоятельно по системе", value: "self" },
      { label: "Важно живое сопровождение и разборы", value: "live" },
      { label: "Нужен максимальный формат — всё и надолго", value: "full" },
      { label: "Сначала хочу познакомиться бесплатно", value: "free" },
    ],
  },
];

type ResultData = {
  title: string;
  text: string;
  btn: string;
  href: string;
};

function getResult(answers: Record<string, string>): ResultData {
  if (answers.role === "salon" || answers.goal === "team_training") {
    return {
      title: "Для вас — формат «Для салонов»",
      text: "Внедрение премиальных восстановительных практик: обучение команды, стандарты клиентского пути, повышение ценности услуг.",
      btn: "Перейти к формату для салонов",
      href: "/dlya-salonov",
    };
  }
  if (answers.format === "free" || answers.role === "beginner") {
    return {
      title: "Начните с бесплатного входа",
      text: "Познакомьтесь с подходом, мышлением и системой «Dok Диалог» — бесплатно, без обязательств.",
      btn: "Смотреть форматы участия",
      href: "/tarify",
    };
  }
  if (answers.format === "full" || answers.goal === "mentoring") {
    return {
      title: "Вам подходит тариф «Эксперт»",
      text: "Безлимитный доступ ко всем инструментам и обучению, 10 личных встреч — для тех, кто хочет максимального результата.",
      btn: "Смотреть форматы участия",
      href: "/tarify",
    };
  }
  if (answers.goal === "tools" || answers.format === "live") {
    return {
      title: "Вам подходит «Премиальная практика»",
      text: "Доступ ко всем инструментам, ИИ-анализатору, внутреннему чату и 5 личным встречам для выхода на новый уровень.",
      btn: "Смотреть форматы участия",
      href: "/tarify",
    };
  }
  return {
    title: "Вам подходит тариф «Практика»",
    text: "Система работы с мышлением, клиентом и ценообразованием — чтобы выйти из хаоса и выстроить устойчивую практику.",
    btn: "Смотреть форматы участия",
    href: "/tarify",
  };
}

function ContactStep({ result, onDone }: { result: ResultData; onDone: () => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !agreed) { if (!agreed) setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, message: `Квиз диагностики формата. Рекомендация: ${result.title}. Контакт: ${contact}` }) });
      if (res.ok) onDone();
      else setError("Не удалось отправить.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: "0 0 8px", fontSize: 14, color: "#555", lineHeight: 1.7 }}>
        Оставьте контакт — мы пришлём подробности по рекомендованному формату.
      </p>
      {[{ l: "Имя", v: name, s: setName, p: "Ваше имя" }, { l: "Telegram или телефон", v: contact, s: setContact, p: "@username или +7..." }].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3a", marginBottom: 5 }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Montserrat" }} onFocus={e => (e.currentTarget.style.borderColor = ACCENT)} onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")} />
        </div>
      ))}
      <label style={{ display: "flex", gap: 8, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: ACCENT }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>Согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a></span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#e53e3e" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
        <button type="submit" style={{ flex: 1, background: ACCENT, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "Montserrat", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
        >{loading ? "Отправляем..." : "Получить рекомендацию"}</button>
        <button type="button" onClick={onDone} style={{ background: "transparent", color: "#999", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "Montserrat", padding: "8px" }}>Пропустить</button>
      </div>
    </form>
  );
}

type Screen = "intro" | "quiz" | "contact" | "result";

export default function QuizLanding() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const result = getResult(answers);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: value };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setScreen("contact");
    }
  };

  const progress = Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Диагностика формата участия — Dok Диалог</title>
        <meta name="description" content="Определите подходящий формат участия в системе Dok Диалог: ответьте на несколько вопросов и получите персональную рекомендацию." />
        <meta property="og:title" content="Диагностика формата участия — Dok Диалог" />
      </Helmet>

      <DokNavbar />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

          {/* INTRO */}
          {screen === "intro" && (
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 18 }}>
                Диагностика
              </div>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 700, lineHeight: 1.15, color: "#1a1a1a", marginBottom: 20 }}>
                Определить подходящий формат участия
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "#5a5a5a", marginBottom: 16 }}>
                Ответьте на 4 вопроса — мы определим, какой формат системы «Dok Диалог» соответствует вашей задаче и уровню практики.
              </p>
              <p style={{ fontSize: 14, color: "#aaa", marginBottom: 40 }}>Займёт около 1 минуты</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
                <button onClick={() => setScreen("quiz")}
                  style={{ background: ACCENT, color: "#fff", padding: "15px 36px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
                >
                  Пройти диагностику
                </button>
                <a href="/tarify"
                  style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: `1.5px solid ${ACCENT}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `hsla(185,85%,32%,0.07)`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
                >
                  Смотреть тарифы
                </a>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {screen === "quiz" && (
            <div>
              {/* Прогресс */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>Вопрос {currentQ + 1} из {QUESTIONS.length}</span>
                  <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{progress}%</span>
                </div>
                <div style={{ height: 4, background: "#e8e8e4", borderRadius: 4 }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: ACCENT, borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>

              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 28, lineHeight: 1.3 }}>
                {QUESTIONS[currentQ].text}
              </h2>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {QUESTIONS[currentQ].answers.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => handleAnswer(a.value)}
                    style={{
                      background: "#fff", border: "1.5px solid #e8e8e4", borderRadius: 14, padding: "16px 20px",
                      fontSize: 14, fontWeight: 500, color: "#1a1a1a", cursor: "pointer", textAlign: "left" as const,
                      transition: "all 0.2s", fontFamily: "Montserrat", lineHeight: 1.5,
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = ACCENT; el.style.background = `hsla(185,85%,32%,0.04)`; el.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#e8e8e4"; el.style.background = "#fff"; el.style.transform = "translateX(0)"; }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {currentQ > 0 && (
                <button onClick={() => setCurrentQ(currentQ - 1)} style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 13, fontFamily: "Montserrat" }}>
                  ← Назад
                </button>
              )}
            </div>
          )}

          {/* CONTACT */}
          {screen === "contact" && (
            <div>
              <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", marginBottom: 24, border: "1px solid #e8e8e4", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 10 }}>Ваш результат</div>
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.25 }}>{result.title}</h2>
                <p style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.75, margin: 0 }}>{result.text}</p>
              </div>
              <div style={{ background: "#f8f8f6", borderRadius: 18, padding: "28px 28px" }}>
                <ContactStep result={result} onDone={() => setScreen("result")} />
              </div>
            </div>
          )}

          {/* RESULT */}
          {screen === "result" && (
            <div style={{ textAlign: "center" as const }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: ACCENT }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>
                {result.title}
              </h2>
              <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.8, marginBottom: 36 }}>{result.text}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
                <a href={result.href}
                  style={{ display: "inline-block", background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", boxShadow: `0 4px 16px ${ACCENT_SHADOW}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT_DARK; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.transform = "translateY(0)"; }}
                >
                  {result.btn}
                </a>
                <a href="/kontakty"
                  style={{ display: "inline-block", background: "transparent", color: ACCENT, padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: `1.5px solid ${ACCENT}` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `hsla(185,85%,32%,0.07)`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.transform = "translateY(0)"; }}
                >
                  Обсудить напрямую
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <DokFooter />
    </div>
  );
}
