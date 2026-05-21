import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import MindsetBot from "./MindsetBot";
import MindsetResult, { IndexMap } from "./MindsetResult";
import BarriersBot from "./BarriersBot";
import BarriersResult from "./BarriersResult";
import { BarrierIndexMap } from "./barriers.logic";

const ACCENT = "hsl(185,85%,32%)";

interface Test {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  score?: number;
}

interface Option {
  id: number;
  text: string;
  score: number;
  sort_order: number;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface TestDetail {
  test: Test & { id: number };
  questions: Question[];
}

interface TestResult {
  title: string;
  description: string;
  advice: string;
  score_min: number;
  score_max: number;
}

interface MindsetHistoryItem {
  id: number;
  igp: number;
  iu: number; ipm: number; ido: number; ipg: number; ics: number; isd: number; izk: number;
  type_title: string;
  completed_at: string;
}

interface BarriersHistoryItem {
  id: number;
  iib: number;
  ivo: number; iss: number; isd: number; ido: number; iir: number; iei: number; isp: number;
  type_title: string;
  completed_at: string;
}

export default function LkTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<TestDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; result: TestResult | null } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openMindset, setOpenMindset] = useState(false);
  const [mindsetHistory, setMindsetHistory] = useState<MindsetHistoryItem[]>([]);
  const [viewingResult, setViewingResult] = useState<{ idx: IndexMap; date: string } | null>(null);
  const [openBarriers, setOpenBarriers] = useState(false);
  const [barriersHistory, setBarriersHistory] = useState<BarriersHistoryItem[]>([]);
  const [viewingBarriers, setViewingBarriers] = useState<{ idx: BarrierIndexMap; date: string } | null>(null);

  useEffect(() => {
    lkApi.tests().then(setTests).finally(() => setLoading(false));
    lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {});
    lkApi.barriersHistory().then(setBarriersHistory).catch(() => {});
  }, []);

  if (openMindset) {
    return <MindsetBot onBack={() => {
      setOpenMindset(false);
      lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {});
    }} />;
  }

  if (viewingResult) {
    return (
      <MindsetResult
        idx={viewingResult.idx}
        date={viewingResult.date}
        onRetake={() => { setViewingResult(null); setOpenMindset(true); }}
        onBack={() => setViewingResult(null)}
        backLabel="← К истории"
      />
    );
  }

  if (openBarriers) {
    return <BarriersBot onBack={() => {
      setOpenBarriers(false);
      lkApi.barriersHistory().then(setBarriersHistory).catch(() => {});
    }} />;
  }

  if (viewingBarriers) {
    return (
      <BarriersResult
        idx={viewingBarriers.idx}
        date={viewingBarriers.date}
        onRetake={() => { setViewingBarriers(null); setOpenBarriers(true); }}
        onBack={() => setViewingBarriers(null)}
        backLabel="← К истории"
      />
    );
  }

  const openTest = async (slug: string) => {
    setResult(null);
    setAnswers({});
    const data = await lkApi.testDetail(slug);
    setActiveTest(data);
  };

  const handleAnswer = (qId: number, optId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    if (!activeTest) return;
    const total = activeTest.questions.length;
    const answered = Object.keys(answers).length;
    if (answered < total) {
      alert(`Ответьте на все вопросы (осталось ${total - answered})`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await lkApi.submitTest(activeTest.test.id, answers as Record<string, number>);
      setResult(res);
      setTests(prev => prev.map(t =>
        t.id === activeTest.test.id ? { ...t, completed: true, score: res.score } : t
      ));
    } finally {
      setSubmitting(false);
    }
  };

  const TOOL_COLORS: Record<string, { color: string; bg: string }> = {
    mindset: { color: "hsl(280,60%,55%)", bg: "hsl(280,60%,96%)" },
    barriers: { color: "hsl(20,85%,52%)", bg: "hsl(20,85%,96%)" },
    finance: { color: "hsl(145,60%,40%)", bg: "hsl(145,60%,95%)" },
  };

  if (loading) return <Spinner />;

  if (activeTest) {
    if (result) {
      const pct = Math.round(((result.score) / (activeTest.questions.length * 4)) * 100);
      return (
        <div style={{ maxWidth: 640 }}>
          <button onClick={() => { setActiveTest(null); setResult(null); }} style={backBtn}>
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", marginTop: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Icon name="Award" size={32} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Результат теста</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
              {result.result?.title || "Тест пройден!"}
            </h2>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, margin: "16px 0 24px",
            }}>
              <div style={{ flex: 1, height: 8, background: "#f0f0ec", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${ACCENT}, hsl(185,85%,22%))`, borderRadius: 4, transition: "width 1s ease" }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: ACCENT, minWidth: 40 }}>{pct}%</span>
            </div>
            {result.result && (
              <>
                <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 20 }}>
                  {result.result.description}
                </p>
                <div style={{
                  background: "hsl(185,85%,96%)", borderRadius: 14, padding: "18px 20px",
                  borderLeft: `4px solid ${ACCENT}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Что делать дальше
                  </div>
                  <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>
                    {result.result.advice}
                  </p>
                </div>
              </>
            )}
            <button
              onClick={() => { setActiveTest(null); setResult(null); }}
              style={{
                marginTop: 28, padding: "12px 28px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              К инструментам
            </button>
          </div>
        </div>
      );
    }

    const progress = Math.round((Object.keys(answers).length / activeTest.questions.length) * 100);

    return (
      <div style={{ maxWidth: 640 }}>
        <button onClick={() => setActiveTest(null)} style={backBtn}>
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
            {activeTest.test.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 6, background: "#f0f0ec", borderRadius: 3 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: ACCENT, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 13, color: "#aaa" }}>{Object.keys(answers).length}/{activeTest.questions.length}</span>
          </div>

          {activeTest.questions.map((q, qi) => (
            <div key={q.id} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.5 }}>
                {qi + 1}. {q.text}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map(opt => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(q.id, opt.id)}
                      style={{
                        padding: "11px 16px", borderRadius: 10, textAlign: "left",
                        border: selected ? `2px solid ${ACCENT}` : "1.5px solid #e8e8e4",
                        background: selected ? "hsl(185,85%,96%)" : "#fafafa",
                        color: selected ? ACCENT : "#444",
                        fontSize: 14, fontWeight: selected ? 600 : 400,
                        cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: submitting ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "Montserrat, sans-serif", marginTop: 8,
            }}
          >
            {submitting ? "Считаем результат..." : "Получить результат"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Инструменты роста
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>
        Пройди тест — получи персональный разбор и конкретные советы
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tests.map(test => {
          const colors = TOOL_COLORS[test.slug] || { color: ACCENT, bg: "hsl(185,85%,96%)" };
          return (
            <div key={test.id} style={{
              background: "#fff", borderRadius: 16, padding: "22px 24px",
              display: "flex", alignItems: "center", gap: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={test.icon} size={22} style={{ color: colors.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{test.title}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{test.description}</div>
                {test.completed && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <Icon name="CheckCircle" size={14} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>Пройден · {test.score} баллов</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (test.slug === "mindset") setOpenMindset(true);
                  else if (test.slug === "barriers") setOpenBarriers(true);
                  else openTest(test.slug);
                }}
                style={{
                  padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${ACCENT}`,
                  background: test.completed ? "transparent" : ACCENT,
                  color: test.completed ? ACCENT : "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", flexShrink: 0,
                }}
              >
                {test.completed ? "Пройти снова" : "Начать"}
              </button>
            </div>
          );
        })}

        {/* Карточка «Внутренние барьеры» — всегда показывается */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "22px 24px",
          display: "flex", alignItems: "center", gap: 18,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: "hsl(20,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="ShieldAlert" size={22} style={{ color: "hsl(20,85%,50%)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
              Внутренние барьеры специалиста
            </div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
              Выяви психологические блоки, которые мешают профессиональному росту
            </div>
            {barriersHistory.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <Icon name="CheckCircle" size={14} style={{ color: "hsl(20,85%,50%)" }} />
                <span style={{ fontSize: 12, color: "hsl(20,85%,50%)", fontWeight: 600 }}>
                  Пройден · IIB {barriersHistory[0].iib}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setOpenBarriers(true)}
            style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1.5px solid hsl(20,85%,50%)`,
              background: barriersHistory.length > 0 ? "transparent" : "hsl(20,85%,50%)",
              color: barriersHistory.length > 0 ? "hsl(20,85%,50%)" : "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", flexShrink: 0,
            }}
          >
            {barriersHistory.length > 0 ? "Пройти снова" : "Начать"}
          </button>
        </div>

        {tests.length === 0 && barriersHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
            Тесты ещё не добавлены
          </div>
        )}
      </div>

      {/* История прохождений mindset */}
      {mindsetHistory.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
            История · Мышление с премиум-клиентами
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mindsetHistory.map((item, i) => {
              const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const pct = item.igp;
              const color = pct >= 85 ? "#14b8a6" : pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : pct >= 30 ? "#f97316" : "#ef4444";
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${color}18`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
                    <span style={{ fontSize: 9, color, fontWeight: 600 }}>IGP</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      {item.type_title}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
                    {i === 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {[
                          { label: "Уверен.", val: item.iu },
                          { label: "Границы", val: item.ipg },
                          { label: "Ценность", val: item.ics },
                          { label: "Коммун.", val: item.izk },
                        ].map(idx => (
                          <span key={idx.label} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "#f4f4f0", color: "#666",
                          }}>
                            {idx.label}: <b>{idx.val}%</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const idx: IndexMap = { IU: item.iu, IPM: item.ipm, IDO: item.ido, IPG: item.ipg, ICS: item.ics, ISD: item.isd, IZK: item.izk };
                        const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                        setViewingResult({ idx, date: dateStr });
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "none",
                        background: ACCENT, color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Смотреть
                    </button>
                    <button
                      onClick={() => setOpenMindset(true)}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: `1.5px solid ${ACCENT}`,
                        background: "transparent", color: ACCENT,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Пройти снова
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* История прохождений: Внутренние барьеры */}
      {barriersHistory.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
            История · Внутренние барьеры
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {barriersHistory.map((item, i) => {
              const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const pct = item.iib;
              const color = pct <= 30 ? "#14b8a6" : pct <= 50 ? "#22c55e" : pct <= 70 ? "#eab308" : pct <= 85 ? "#f97316" : "#ef4444";
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${color}18`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
                    <span style={{ fontSize: 9, color, fontWeight: 600 }}>IIB</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      {item.type_title}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
                    {i === 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {[
                          { label: "Опора", val: item.ivo },
                          { label: "Самозв.", val: item.iss },
                          { label: "Деньги", val: item.isd },
                          { label: "Выгор.", val: item.iei },
                        ].map(b => (
                          <span key={b.label} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "#f4f4f0", color: "#666",
                          }}>
                            {b.label}: <b>{b.val}%</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const idx: BarrierIndexMap = {
                          IVO: item.ivo, ISS: item.iss, ISD: item.isd,
                          IDO: item.ido, IIR: item.iir, IEI: item.iei,
                          ISP: item.isp, IPZ_raw: 0,
                        };
                        const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                        setViewingBarriers({ idx, date: dateStr });
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "none",
                        background: "hsl(20,85%,50%)", color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Смотреть
                    </button>
                    <button
                      onClick={() => setOpenBarriers(true)}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "1.5px solid hsl(20,85%,50%)",
                        background: "transparent", color: "hsl(20,85%,50%)",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Пройти снова
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const backBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "none",
  border: "none", color: "#888", fontSize: 14, cursor: "pointer",
  padding: "8px 0", fontFamily: "Montserrat, sans-serif",
};