import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { backBtn, ACCENT } from "./LkTestsTypes";

const AI_URL = "https://functions.poehali.dev/3ce8698e-6cbe-41e1-bdc9-352867567feb";

const COLOR = "hsl(260,70%,52%)";
const COLOR_BG = "hsl(260,70%,97%)";

// ── Типы ─────────────────────────────────────────────────────────────────────

interface Category { id: number; slug: string; name: string; icon: string; color: string; sort_order: number; }
interface Problem   { id: number; category_id: number; slug: string; name: string; sort_order: number; }
interface Question  { id: number; problem_id: number; text: string; sort_order: number; }
interface Option    { id: number; question_id: number; text: string; scenario_tag: string; sort_order: number; }
interface Scenario  {
  slug: string; name: string; main_cause: string; inner_state: string;
  client_view: string; practice_impact: string; what_to_change: string;
  action_plan: string; exercise_name: string; exercise_text: string;
  track_items: string; coaching_note: string;
}

// ── Вспомогательные компоненты ────────────────────────────────────────────────

function ResultBlock({ icon, title, text, color, italic }: { icon: string; title: string; text: string; color: string; italic?: boolean }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1.5px solid #f0f0ec", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={13} style={{ color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{title}</span>
      </div>
      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0, fontStyle: italic ? "italic" : "normal" }}>{text}</p>
    </div>
  );
}

function ActionPlan({ text }: { text: string }) {
  const steps = text
    .replace(/\\n/g, "\n")
    .split(/\n/)
    .map(s => s.replace(/^[\d]+[.)]\s*/, "").trim())
    .filter(Boolean);
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1.5px solid #f0f0ec" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${COLOR}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="ListChecks" size={13} style={{ color: COLOR }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: COLOR, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Пошаговый план</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: COLOR, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 13, color: "#444", lineHeight: 1.55 }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackBlock({ text }: { text: string }) {
  const items = text.replace(/\\n/g, "\n").split(/\n/).map(s => s.trim()).filter(Boolean);
  return (
    <div style={{ background: COLOR_BG, borderRadius: 14, padding: "16px 20px", border: `1.5px solid ${COLOR}30` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name="BarChart2" size={14} style={{ color: COLOR }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: COLOR, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Что отслеживать</span>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ color: COLOR, fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>·</span>
          <span style={{ fontSize: 13, color: "#444" }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ── Основной компонент ────────────────────────────────────────────────────────

interface Props { onBack: () => void; onRetake?: () => void; }

export default function MindsetSpecialistBot({ onBack, onRetake }: Props) {
  const [data, setData] = useState<{ categories: Category[]; problems: Problem[]; questions: Question[]; options: Option[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Шаги: category → problem → questions → result
  const [step, setStep] = useState<"category" | "problem" | "questions" | "result">("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProblem, setSelectedProblem]   = useState<Problem | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});  // question_id → option_id
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});  // question_id → свой текст
  const [customInput, setCustomInput] = useState("");  // текущее поле ввода
  const [currentQ, setCurrentQ] = useState(0);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [aiSections, setAiSections] = useState<Record<string, string> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    lkApi.msCategories().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: COLOR, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!data) return null;

  const problemsForCategory = data.problems.filter(p => p.category_id === selectedCategory?.id);
  const questionsForProblem = data.questions.filter(q => q.problem_id === selectedProblem?.id);
  const currentQuestion = questionsForProblem[currentQ];
  const optionsForQ = currentQuestion ? data.options.filter(o => o.question_id === currentQuestion.id) : [];

  const reset = () => {
    setStep("category"); setSelectedCategory(null); setSelectedProblem(null);
    setAnswers({}); setCustomAnswers({}); setCustomInput(""); setCurrentQ(0); setScenario(null); setAiSections(null);
  };

  const callAI = async (
    newAnswers: Record<number, number>,
    newCustomAnswers: Record<number, string>,
    questions: Question[],
    options: Option[]
  ): Promise<Record<string, string> | null> => {
    try {
      const session = localStorage.getItem("lk_session") || "";
      const qa_pairs = questions.map(q => {
        // Приоритет: свой текст → выбранный вариант
        const custom = newCustomAnswers[q.id];
        if (custom?.trim()) return { question: q.text, answer: custom.trim() };
        const optId = newAnswers[q.id];
        const opt = options.find(o => o.id === optId);
        return { question: q.text, answer: opt?.text || "" };
      });
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({
          problem_name: selectedProblem?.name || "",
          category_name: selectedCategory?.name || "",
          qa_pairs,
        }),
      });
      const json = await res.json();
      return json.sections || null;
    } catch {
      return null;
    }
  };

  const proceed = async (newAnswers: Record<number, number>, newCustomAnswers: Record<number, string>) => {
    setCustomInput("");
    if (currentQ < questionsForProblem.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setAnalyzing(true);
      try {
        const [result, sections] = await Promise.all([
          lkApi.msAnalyze(newAnswers),
          callAI(newAnswers, newCustomAnswers, questionsForProblem, data!.options),
        ]);
        setScenario(result.scenario);
        setAiSections(sections);
        setStep("result");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleAnswer = (optionId: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    // Если был свой текст — убираем его (выбрали вариант вместо своего)
    const newCustom = { ...customAnswers };
    delete newCustom[currentQuestion.id];
    setAnswers(newAnswers);
    setCustomAnswers(newCustom);
    proceed(newAnswers, newCustom);
  };

  const handleCustomAnswer = () => {
    const text = customInput.trim();
    if (!text) return;
    // Для алгоритма используем первый вариант (нейтральный тег), AI получит реальный текст
    const fallbackOpt = optionsForQ[0];
    const newAnswers = fallbackOpt
      ? { ...answers, [currentQuestion.id]: fallbackOpt.id }
      : answers;
    const newCustom = { ...customAnswers, [currentQuestion.id]: text };
    setAnswers(newAnswers);
    setCustomAnswers(newCustom);
    proceed(newAnswers, newCustom);
  };

  // ── РЕЗУЛЬТАТ ──
  if (step === "result" && scenario) {
    // Если есть AI-секции — используем их, иначе — шаблонный сценарий
    const ai = aiSections;
    // Новые ключи AI (goal-oriented), с фолбэком на старые и на сценарий
    const mainCause    = ai?.["ЧТО Я ВИЖУ"]           || ai?.["ГЛАВНАЯ ПРИЧИНА"]      || scenario.main_cause;
    const obstacle     = ai?.["ГЛАВНОЕ ПРЕПЯТСТВИЕ"]   || ai?.["ЧТО ПРОИСХОДИТ ВНУТРИ"] || scenario.inner_state;
    const clientView   = ai?.["КАК ЭТО ВИДИТ КЛИЕНТ"] || scenario.client_view;
    const whatToChange = ai?.["ЧТО ИЗМЕНИТЬ"]          || scenario.what_to_change;
    const actionPlan   = ai?.["ПЛАН НА ЭТУ НЕДЕЛЮ"]   || scenario.action_plan;
    const exerciseRaw  = ai?.["УПРАЖНЕНИЕ"]            || null;
    const growthPoint  = ai?.["ТОЧКА РОСТА"]           || null;

    // Парсим упражнение из AI: первая строка — название, остальное — описание
    let exerciseName = scenario.exercise_name;
    let exerciseText = scenario.exercise_text;
    if (exerciseRaw) {
      const lines = exerciseRaw.split("\n").filter(Boolean);
      if (lines.length > 1) {
        exerciseName = lines[0].replace(/[«»"]/g, "").trim();
        exerciseText = lines.slice(1).join(" ").trim();
      } else {
        exerciseText = exerciseRaw;
      }
    }

    return (
      <div>
        <button onClick={onRetake ?? reset} style={backBtn}>
          <Icon name="ArrowLeft" size={16} /> Новый анализ
        </button>

        {/* Шапка */}
        <div style={{ background: `linear-gradient(135deg, ${COLOR}, hsl(260,70%,40%))`, borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.75, marginBottom: 6 }}>Развитие специалиста · Персональный план</div>
          <div style={{ fontSize: "clamp(18px,3vw,26px)", fontFamily: "Cormorant, serif", fontWeight: 700, marginBottom: 4 }}>{selectedProblem?.name}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{selectedCategory?.name}</div>
          {ai && (
            <div style={{ marginTop: 10, fontSize: 11, background: "rgba(255,255,255,0.18)", borderRadius: 8, padding: "4px 10px", display: "inline-block" }}>
              ✦ Персональный AI-анализ
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ResultBlock icon="Search" title="Что я вижу" text={mainCause} color={COLOR} />
          <ResultBlock icon="AlertCircle" title="Главное препятствие" text={obstacle} color="hsl(20,85%,48%)" />
          {clientView && <ResultBlock icon="Eye" title="Как это видит клиент" text={clientView} color="hsl(210,85%,45%)" />}
          <ResultBlock icon="Lightbulb" title="Что изменить" text={whatToChange} color="hsl(145,60%,38%)" />
          <ActionPlan text={actionPlan} />

          {/* Упражнение */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: `2px solid ${COLOR}40` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: COLOR_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Dumbbell" size={13} style={{ color: COLOR }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLOR, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Коучинговое упражнение</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>«{exerciseName}»</div>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>{exerciseText}</p>
          </div>

          <TrackBlock text={scenario.track_items} />

          {/* Точка роста — только если есть от AI */}
          {growthPoint && (
            <div style={{ background: `linear-gradient(135deg, ${COLOR}15, hsl(260,70%,97%))`, borderRadius: 14, padding: "16px 20px", border: `1.5px solid ${COLOR}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <Icon name="Sparkles" size={14} style={{ color: COLOR }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: COLOR, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Точка роста</span>
              </div>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{growthPoint}</p>
            </div>
          )}

          {/* Когда нужен коуч */}
          <div style={{ background: "#fafaf8", borderRadius: 14, padding: "14px 18px", border: "1.5px solid #e8e8e4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
              <Icon name="UserCheck" size={13} style={{ color: "#888" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Когда нужна очная коуч-сессия</span>
            </div>
            <p style={{ fontSize: 12, color: "#777", lineHeight: 1.6, margin: 0 }}>{scenario.coaching_note}</p>
          </div>

          <button onClick={reset} style={{ marginTop: 8, padding: "13px", borderRadius: 12, border: `1.5px solid ${COLOR}`, background: "transparent", color: COLOR, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
            Новый анализ
          </button>
        </div>
      </div>
    );
  }

  // ── ВОПРОСЫ ──
  if (step === "questions" && currentQuestion) {
    const progress = ((currentQ) / questionsForProblem.length) * 100;
    return (
      <div>
        <button onClick={() => { setStep("problem"); setAnswers({}); setCurrentQ(0); }} style={backBtn}>
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
            {selectedCategory?.name} · {selectedProblem?.name}
          </div>
          <div style={{ fontSize: 12, color: "#bbb", marginBottom: 8 }}>Вопрос {currentQ + 1} из {questionsForProblem.length}</div>
          <div style={{ height: 4, background: "#f0f0ec", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: COLOR, borderRadius: 4, transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 16 }}>
          <p style={{ fontSize: "clamp(15px,2.5vw,18px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.5, margin: 0 }}>
            {currentQuestion.text}
          </p>
        </div>

        {analyzing ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: COLOR, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {optionsForQ.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: 14,
                  border: "1.5px solid #e8e8e4", background: "#fff",
                  textAlign: "left", fontSize: 14, fontFamily: "Montserrat, sans-serif",
                  color: "#333", cursor: "pointer", lineHeight: 1.4,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLOR; (e.currentTarget as HTMLElement).style.background = COLOR_BG; (e.currentTarget as HTMLElement).style.color = COLOR; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e4"; (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#333"; }}
              >
                {opt.text}
              </button>
            ))}

            {/* Свой вариант */}
            <div style={{ marginTop: 4, borderTop: "1px solid #f0f0ec", paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: "#bbb", marginBottom: 8, fontWeight: 600 }}>Или напишите свой ответ:</div>
              <div style={{ display: "flex", gap: 8 }}>
                <textarea
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey && customInput.trim()) {
                      e.preventDefault();
                      handleCustomAnswer();
                    }
                  }}
                  placeholder="Опишите своими словами..."
                  rows={2}
                  style={{
                    flex: 1, padding: "11px 14px", borderRadius: 12,
                    border: customInput.trim() ? `1.5px solid ${COLOR}` : "1.5px solid #e8e8e4",
                    fontSize: 13, fontFamily: "Montserrat, sans-serif",
                    outline: "none", resize: "none", lineHeight: 1.5,
                    color: "#333", transition: "border-color 0.15s",
                  }}
                />
                <button
                  onClick={handleCustomAnswer}
                  disabled={!customInput.trim()}
                  style={{
                    padding: "0 16px", borderRadius: 12, border: "none",
                    background: customInput.trim() ? COLOR : "#e8e8e4",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    cursor: customInput.trim() ? "pointer" : "default",
                    fontFamily: "Montserrat, sans-serif",
                    alignSelf: "stretch", transition: "background 0.15s",
                    minWidth: 64,
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ВЫБОР ПРОБЛЕМЫ ──
  if (step === "problem" && selectedCategory) {
    return (
      <div>
        <button onClick={() => setStep("category")} style={backBtn}>
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{selectedCategory.name}</div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            Выберите проблему
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {problemsForCategory.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProblem(p); setCurrentQ(0); setAnswers({}); setStep("questions"); }}
              style={{
                width: "100%", padding: "14px 18px", borderRadius: 14,
                border: "1.5px solid #e8e8e4", background: "#fff",
                textAlign: "left", fontSize: 14, fontFamily: "Montserrat, sans-serif",
                color: "#333", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLOR; (e.currentTarget as HTMLElement).style.background = COLOR_BG; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e4"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            >
              <Icon name="ChevronRight" size={14} style={{ color: "#bbb", flexShrink: 0 }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── ВЫБОР КАТЕГОРИИ ──
  return (
    <div>
      <button onClick={onBack} style={backBtn}>
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
          Развитие специалиста
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0, lineHeight: 1.6 }}>
          Выберите цель — ответьте на несколько вопросов и получите персональный план
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {data.categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat); setStep("problem"); }}
            style={{
              background: "#fff", border: "1.5px solid #f0f0ec", borderRadius: 16,
              padding: "20px", textAlign: "left", cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={cat.icon} size={20} style={{ color: cat.color }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>
              {data.problems.filter(p => p.category_id === cat.id).length} тем
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}