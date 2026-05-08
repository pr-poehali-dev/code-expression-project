import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./CpShared";

const QUIZ_URL = "https://functions.poehali.dev/ce81ec2c-593c-47ad-84fc-73713cb74197";

// ─── Типы ────────────────────────────────────────────────────────────────────

type QuizStep = "intro" | "contacts" | "questions" | "result";

interface Answers {
  q1?: string;
  q2?: string;
  q3?: string[];
  q4?: string;
  q5?: string[];
  q6?: string[];
  q7?: string;
  q8?: string;
}

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  url: string;
  buy_url: string | null;
  price: string;
  category: string;
  format: string;
}

interface QuizResult {
  category: string;
  explanation: string;
  courses: RecommendedCourse[];
}

// ─── Данные вопросов ──────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "q1",
    title: "Сколько вам лет?",
    multi: false,
    options: [
      { value: "u25", label: "До 25" },
      { value: "25_35", label: "25–35" },
      { value: "35_45", label: "35–45" },
      { value: "45plus", label: "45+" },
    ],
  },
  {
    id: "q2",
    title: "Есть ли у вас опыт в массаже или работе с телом?",
    multi: false,
    options: [
      { value: "no_exp", label: "Нет, я новичок" },
      { value: "little_exp", label: "Небольшой опыт" },
      { value: "masseur", label: "Работаю массажистом" },
      { value: "trainer", label: "Работаю тренером" },
      { value: "other_specialist", label: "Работаю с клиентами в другой сфере" },
    ],
  },
  {
    id: "q3",
    title: "Какая ваша главная цель?",
    multi: true,
    hint: "Можно выбрать несколько",
    options: [
      { value: "for_self", label: "Помогать себе и семье" },
      { value: "pain_relief", label: "Избавиться от напряжения и боли" },
      { value: "new_career", label: "Освоить новую профессию" },
      { value: "upgrade", label: "Повысить квалификацию" },
      { value: "earn_more", label: "Больше зарабатывать" },
      { value: "work_deeper", label: "Работать глубже и профессиональнее" },
      { value: "new_techniques", label: "Добавить новые техники в работу" },
    ],
  },
  {
    id: "q4",
    title: "Хотите ли вы в будущем зарабатывать на этих навыках?",
    multi: false,
    options: [
      { value: "no_earn", label: "Нет, только для себя" },
      { value: "maybe_earn", label: "Возможно в будущем" },
      { value: "extra_income", label: "Да, хочу дополнительный доход" },
      { value: "new_profession", label: "Да, хочу новую профессию" },
    ],
  },
  {
    id: "q5",
    title: "Что вам ближе?",
    multi: true,
    hint: "Можно выбрать несколько",
    options: [
      { value: "simple_techniques", label: "Простые техники для жизни" },
      { value: "body_restoration", label: "Работа с телом и восстановлением" },
      { value: "diagnostics", label: "Диагностика напряжения и перекосов" },
      { value: "deep_muscles", label: "Глубокая работа с мышцами и движением" },
      { value: "client_practice", label: "Практика с клиентами" },
    ],
  },
  {
    id: "q6",
    title: "С какими проблемами сталкиваетесь чаще всего?",
    multi: true,
    hint: "Можно выбрать несколько",
    options: [
      { value: "neck_pain", label: "Боль в шее" },
      { value: "shoulder_tension", label: "Напряжение в плечах" },
      { value: "lower_back", label: "Боль в пояснице" },
      { value: "back_stiffness", label: "Скованность в спине" },
      { value: "fatigue", label: "Быстрая усталость тела" },
      { value: "stress", label: "Стресс и зажимы" },
      { value: "body_understanding", label: "Хочу лучше понимать тело" },
    ],
  },
  {
    id: "q7",
    title: "Какой формат вам подходит?",
    multi: false,
    options: [
      { value: "online_only", label: "Только онлайн" },
      { value: "online_practice", label: "Онлайн + практика" },
      { value: "live_moscow", label: "Живой интенсив в Москве" },
      { value: "both", label: "Подойдут оба варианта" },
    ],
  },
  {
    id: "q8",
    title: "Насколько быстро хотите начать обучение?",
    multi: false,
    options: [
      { value: "now", label: "Прямо сейчас" },
      { value: "month", label: "В течение месяца" },
      { value: "exploring", label: "Пока просто изучаю варианты" },
    ],
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  A: "Восстановление для себя и близких",
  B: "Профессиональный рост для массажистов",
  C: "Восстановление в работе тренера",
  D: "Новая профессия и заработок",
};

// ─── Стили ────────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8e8e4",
  borderRadius: 20,
  padding: "40px 36px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
  maxWidth: 640,
  margin: "0 auto",
  boxSizing: "border-box",
  width: "100%",
};

const btn = (active?: boolean): React.CSSProperties => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "14px 20px",
  borderRadius: 12,
  border: `2px solid ${active ? ACCENT : "#e8e8e4"}`,
  background: active ? `${ACCENT}12` : "#fff",
  color: active ? ACCENT : "#1a1a1a",
  fontSize: 15,
  fontWeight: active ? 700 : 400,
  cursor: "pointer",
  transition: "all 0.18s",
  fontFamily: "inherit",
  marginBottom: 10,
});

const primaryBtn: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "14px 32px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "opacity 0.18s",
};

const outlineBtn: React.CSSProperties = {
  background: "transparent",
  color: ACCENT,
  border: `2px solid ${ACCENT}`,
  borderRadius: 12,
  padding: "13px 28px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

// ─── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#999" }}>Вопрос {step} из {total}</span>
        <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 4, background: "#f0f0ee", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${(step / total) * 100}%`,
          background: ACCENT,
          borderRadius: 4,
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Экран приветствия ────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={card} className="cq-card">
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: `${ACCENT}15`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
      }}>
        <Icon name="GraduationCap" size={32} style={{ color: ACCENT }} />
      </div>
      <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2 }}>
        Не знаете, какой курс вам подойдёт?
      </h2>
      <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 32px" }}>
        Ответьте на несколько вопросов и получите персональную подборку онлайн-курсов и интенсивов по восстановительным техникам.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        {["8 вопросов", "~3 минуты", "Результат на email"].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666" }}>
            <Icon name="Check" size={14} style={{ color: ACCENT }} />
            {t}
          </div>
        ))}
      </div>
      <button style={primaryBtn} onClick={onStart}>
        Подобрать обучение →
      </button>
    </div>
  );
}

// ─── Экран контактов ──────────────────────────────────────────────────────────

function ContactsScreen({ onNext }: { onNext: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; agree?: string }>({});
  const [agree, setAgree] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "1.5px solid #e0e0da",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.18s",
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Введите имя";
    if (!email.trim() || !email.includes("@")) e.email = "Введите корректный email";
    if (!agree) e.agree = "Необходимо принять условия";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div style={card} className="cq-card">
      <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, margin: "0 0 8px" }}>
        Шаг 1 из 2 — Контактные данные
      </h2>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>Чтобы отправить вам результаты подборки</p>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>
          Ваше имя
        </label>
        <input
          style={{ ...inputStyle, borderColor: errors.name ? "#e53e3e" : "#e0e0da" }}
          placeholder="Например, Анна"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
          onFocus={e => (e.target.style.borderColor = ACCENT)}
          onBlur={e => (e.target.style.borderColor = errors.name ? "#e53e3e" : "#e0e0da")}
        />
        {errors.name && <div style={{ fontSize: 12, color: "#e53e3e", marginTop: 4 }}>{errors.name}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          style={{ ...inputStyle, borderColor: errors.email ? "#e53e3e" : "#e0e0da" }}
          placeholder="your@email.ru"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
          onFocus={e => (e.target.style.borderColor = ACCENT)}
          onBlur={e => (e.target.style.borderColor = errors.email ? "#e53e3e" : "#e0e0da")}
        />
        {errors.email && <div style={{ fontSize: 12, color: "#e53e3e", marginTop: 4 }}>{errors.email}</div>}
      </div>
      <p style={{ fontSize: 12.5, color: "#aaa", margin: "0 0 20px" }}>
        На эту почту мы отправим ваши результаты и рекомендации по обучению.
      </p>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 6 }}>
        <div
          onClick={() => { setAgree(a => !a); setErrors(p => ({ ...p, agree: undefined })); }}
          style={{
            width: 20, height: 20, minWidth: 20, borderRadius: 5, marginTop: 1,
            border: `2px solid ${errors.agree ? "#e53e3e" : agree ? ACCENT : "#d0d0cc"}`,
            background: agree ? ACCENT : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", cursor: "pointer",
          }}
        >
          {agree && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
        </div>
        <span style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>
          Я ознакомился(-ась) и принимаю{" "}
          <a href="/privacy" target="_blank" style={{ color: ACCENT, textDecoration: "underline" }}>политику конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" target="_blank" style={{ color: ACCENT, textDecoration: "underline" }}>оферту</a>
        </span>
      </label>
      {errors.agree && <div style={{ fontSize: 12, color: "#e53e3e", marginBottom: 16 }}>{errors.agree}</div>}
      {!errors.agree && <div style={{ marginBottom: 24 }} />}

      <button style={primaryBtn} onClick={() => { if (validate()) onNext(name, email); }}>
        Продолжить →
      </button>
    </div>
  );
}

// ─── Вопросы ─────────────────────────────────────────────────────────────────

function QuestionsScreen({
  answers,
  onAnswer,
  onBack,
  currentQ,
  onFinish,
}: {
  answers: Answers;
  onAnswer: (qId: string, val: string | string[]) => void;
  onBack: () => void;
  currentQ: number;
  onFinish: () => void;
}) {
  const q = QUESTIONS[currentQ];
  const val = answers[q.id as keyof Answers];
  const selected = Array.isArray(val) ? val : val ? [val] : [];

  const toggle = (v: string) => {
    if (q.multi) {
      const arr = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v];
      onAnswer(q.id, arr);
    } else {
      onAnswer(q.id, v);
    }
  };

  const canNext = q.multi ? selected.length > 0 : selected.length > 0;
  const isLast = currentQ === QUESTIONS.length - 1;

  return (
    <div style={card} className="cq-card">
      <ProgressBar step={currentQ + 1} total={QUESTIONS.length} />

      <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>
        {q.title}
      </h2>
      {q.hint && (
        <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 18px" }}>{q.hint}</p>
      )}
      {!q.hint && <div style={{ marginBottom: 18 }} />}

      <div>
        {q.options.map(opt => (
          <button
            key={opt.value}
            style={btn(selected.includes(opt.value))}
            onClick={() => toggle(opt.value)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 20, height: 20, borderRadius: q.multi ? 6 : "50%",
                border: `2px solid ${selected.includes(opt.value) ? ACCENT : "#d0d0cc"}`,
                background: selected.includes(opt.value) ? ACCENT : "transparent",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}>
                {selected.includes(opt.value) && (
                  <Icon name="Check" size={11} style={{ color: "#fff" }} />
                )}
              </span>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }} className="cq-btn-row">
        <button style={outlineBtn} onClick={onBack}>
          ← Назад
        </button>
        {canNext && (
          <button
            style={{ ...primaryBtn, flex: 1 }}
            onClick={isLast ? onFinish : () => onAnswer("__next__", "")}
          >
            {isLast ? "Получить подборку" : "Далее →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Экран результата ──────────────────────────────────────────────────────────

const PROMO_CODE = "BROSS55";

function ResultScreen({ result, name, onRestart }: { result: QuizResult; name: string; onRestart: () => void }) {
  const catName = CATEGORY_NAMES[result.category] || "Персональная подборка";
  const hasOffline = result.courses.some(c => c.format === "offline");
  const hasOnline = result.courses.some(c => c.format === "online");
  const onlyOffline = hasOffline && !hasOnline;
  const [copied, setCopied] = useState(false);

  const copyPromo = () => {
    try {
      const el = document.createElement("textarea");
      el.value = PROMO_CODE;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(PROMO_CODE).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Заголовок */}
      <div style={{ ...card, marginBottom: 24, textAlign: "center" }} className="cq-card">
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="CheckCircle" size={34} style={{ color: ACCENT }} />
        </div>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, margin: "0 0 10px" }}>
          Вам подойдут следующие<br />программы обучения
        </h2>
        <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 13, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: 0.5, marginBottom: 16 }}>
          {catName}
        </div>

        {/* Блок "Почему вам это подходит" */}
        <div style={{ background: "#f8f8f6", borderRadius: 12, padding: "16px 20px", textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
            Почему вам это подходит
          </div>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.65, margin: 0 }}>
            {result.explanation}
          </p>
        </div>

        <p style={{ fontSize: 14, color: "#aaa", margin: "16px 0 0" }}>
          Подборка также отправлена вам на email
        </p>
      </div>

      {/* Курсы */}
      {result.courses.map((course) => {
        const isOffline = course.format === "offline";
        const fullUrl = course.url.startsWith("http") ? course.url : `https://docdialog.ru${course.url}`;
        return (
          <div key={course.id} style={{
            background: "#fff",
            border: `1.5px solid ${isOffline ? "#d97706" : "#e8e8e4"}`,
            borderRadius: 16,
            padding: "24px",
            marginBottom: 16,
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            boxSizing: "border-box",
          }} className="cq-result-course cq-card">
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: isOffline ? "#d9770615" : `${ACCENT}15`,
                  color: isOffline ? "#d97706" : ACCENT,
                  textTransform: "uppercase", letterSpacing: 0.5,
                }}>
                  {isOffline ? "Офлайн · Москва" : "Онлайн"}
                </span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px", lineHeight: 1.3 }}>
                {course.title}
              </h3>
              <p style={{ fontSize: 14, color: "#666", margin: "0 0 14px", lineHeight: 1.5 }}>
                {course.description}
              </p>
              <a href={fullUrl} style={outlineBtn} target="_blank" rel="noopener noreferrer">
                Подробнее →
              </a>
            </div>
          </div>
        );
      })}

      {/* Промокод — если есть хотя бы один онлайн-курс */}
      {hasOnline && (
        <div style={{
          background: "linear-gradient(135deg, #1a6b5a 0%, #2d8b76 100%)",
          borderRadius: 18,
          padding: "28px 28px",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
              <Icon name="Tag" size={13} style={{ color: "#fff" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</span>
            </div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.25 }}>
              Скидка 55% на все онлайн-курсы
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "0 0 20px", lineHeight: 1.6 }}>
              Специально для вас — промокод на все рекомендованные онлайн-курсы. Введите его при оформлении.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }} className="cq-promo">
              <div style={{
                background: "rgba(255,255,255,0.15)",
                border: "2px dashed rgba(255,255,255,0.4)",
                borderRadius: 12,
                padding: "12px 20px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 2, fontFamily: "monospace" }}>
                  {PROMO_CODE}
                </span>
              </div>
              <button
                onClick={copyPromo}
                style={{
                  background: "#fff",
                  color: ACCENT,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "opacity 0.18s",
                }}
              >
                <Icon name={copied ? "Check" : "Copy"} size={15} style={{ color: ACCENT }} />
                {copied ? "Скопировано!" : "Скопировать"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Сообщение про бесплатные онлайн-курсы — только если рекомендован офлайн-интенсив без онлайн */}
      {onlyOffline && (
        <div style={{
          background: "linear-gradient(135deg, #1a6b5a 0%, #2d8b76 100%)",
          borderRadius: 18, padding: "28px 28px", marginBottom: 16, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
              <Icon name="Gift" size={13} style={{ color: "#fff" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>БОНУС ДЛЯ УЧАСТНИКОВ ИНТЕНСИВА</span>
            </div>
            <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.25 }}>
              Все онлайн-курсы — бесплатно
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.7 }}>
              После оплаты интенсива вы получите доступ ко всем онлайн-курсам в подарок — чтобы повторять материал и внедрять техники в практику в своём темпе.
            </p>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          style={{ background: "transparent", border: "none", color: "#aaa", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          onClick={onRestart}
        >
          Пройти заново
        </button>
      </div>
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function CourseQuiz() {
  const [step, setStep] = useState<QuizStep>("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnswer = (qId: string, val: string | string[]) => {
    if (qId === "__next__") {
      if (currentQ < QUESTIONS.length - 1) setCurrentQ(q => q + 1);
      return;
    }
    setAnswers(prev => ({ ...prev, [qId]: val }));
    // Для одиночного выбора — автопереход
    const q = QUESTIONS[currentQ];
    if (!q.multi && qId !== "__next__") {
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) setCurrentQ(n => n + 1);
      }, 240);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${QUIZ_URL}?action=submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers }),
      });
      const data = await resp.json();
      if (data.ok) {
        setResult({ category: data.category, explanation: data.explanation, courses: data.courses });
        setStep("result");
      } else {
        setError("Произошла ошибка. Попробуйте ещё раз.");
      }
    } catch {
      setError("Нет соединения. Проверьте интернет и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromQ = () => {
    if (currentQ === 0) setStep("contacts");
    else setCurrentQ(q => q - 1);
  };

  const restart = () => {
    setStep("intro");
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setName("");
    setEmail("");
    setError("");
  };

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <style>{`
        .cq-card { padding: 40px 36px !important; }
        .cq-btn-row { flex-direction: row !important; }
        @media (max-width: 600px) {
          .cq-card { padding: 24px 18px !important; border-radius: 16px !important; }
          .cq-btn-row { flex-direction: column !important; gap: 10px !important; }
          .cq-btn-row button { width: 100% !important; justify-content: center !important; }
          .cq-result-course { flex-direction: column !important; gap: 12px !important; }
          .cq-result-course-actions { flex-direction: column !important; }
          .cq-result-course-actions a { width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
          .cq-promo { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
      {step === "intro" && (
        <IntroScreen onStart={() => setStep("contacts")} />
      )}

      {step === "contacts" && (
        <ContactsScreen
          onNext={(n, e) => { setName(n); setEmail(e); setStep("questions"); }}
        />
      )}

      {step === "questions" && (
        <>
          {loading ? (
            <div style={{ ...card, textAlign: "center", padding: "60px 36px" }} className="cq-card">
              <div style={{ width: 48, height: 48, border: `3px solid ${ACCENT}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: 16, color: "#555" }}>Подбираем курсы под ваш профиль…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <QuestionsScreen
              answers={answers}
              onAnswer={handleAnswer}
              onBack={handleBackFromQ}
              currentQ={currentQ}
              onFinish={handleFinish}
            />
          )}
          {error && (
            <p style={{ textAlign: "center", color: "#e53e3e", fontSize: 14, marginTop: 12 }}>{error}</p>
          )}
        </>
      )}

      {step === "result" && result && (
        <ResultScreen result={result} name={name} onRestart={restart} />
      )}
    </div>
  );
}