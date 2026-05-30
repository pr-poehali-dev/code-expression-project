import { useState, useEffect } from "react";

const STORAGE_KEY = "job_interview_state";

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) { return null; }
}

function saveState(state: object) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_e) { /* ignore */ }
}

function clearState() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch (_e) { /* ignore */ }
}

const JOB_AI_URL = "https://functions.poehali.dev/78478eb2-9825-47e4-b184-32ad35d6d7c7";

interface Message { role: "user" | "assistant"; content: string; }
interface Applicant {
  full_name: string; age: string; city: string; phone: string;
  telegram: string; experience: string; current_job: string; motivation: string;
}
interface Result {
  scores: Record<string, number>; total: number;
  status: string; status_label: string; comment: string;
}

const SCORE_LABELS: Record<string, string> = {
  communication: "Коммуникация",
  literacy: "Грамотность речи",
  motivation: "Мотивация",
  responsibility: "Ответственность",
  people_skills: "Работа с людьми",
  stability: "Эмоциональная устойчивость",
  fit: "Соответствие проекту",
};

const STATUS_COLORS: Record<string, string> = {
  recommended: "#4a7c59",
  review: "#a87c2a",
  declined: "#8a3a3a",
};

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  border: "1.5px solid #e0d8cc", fontSize: 14, outline: "none",
  fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box",
  background: "#fff", color: "#1a1a1a",
  transition: "border-color 0.2s",
};

const lbl: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 500, color: "#888",
  marginBottom: 6, fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.5px",
};

export default function JobInterview({ onBack }: { onBack: () => void }) {
  const saved = loadState();

  const [phase, setPhase] = useState<"form" | "chat" | "result">(saved?.phase ?? "form");
  const [applicant, setApplicant] = useState<Applicant>(saved?.applicant ?? {
    full_name: "", age: "", city: "", phone: "",
    telegram: "", experience: "", current_job: "", motivation: "",
  });
  const [messages, setMessages] = useState<Message[]>(saved?.messages ?? []);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<number>(saved?.step ?? 0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(saved?.result ?? null);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState<boolean>(saved?.agreed ?? false);

  // Сохраняем состояние при каждом изменении
  useEffect(() => {
    saveState({ phase, applicant, messages, step, result, agreed });
  }, [phase, applicant, messages, step, result, agreed]);

  const TOTAL_QUESTIONS = 10;

  async function startInterview() {
    const req = applicant;
    if (!req.full_name || !req.phone) { setError("Заполните имя и телефон"); return; }
    if (!agreed) { setError("Необходимо принять политику конфиденциальности"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${JOB_AI_URL}?action=chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], step: 0 }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.reply }]);
      setStep(data.step);
      setPhase("chat");
    } catch { setError("Ошибка соединения. Попробуйте снова."); }
    finally { setLoading(false); }
  }

  async function sendAnswer() {
    const content = input.trim();
    if (!content || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages); setInput(""); setLoading(true);
    try {
      const res = await fetch(`${JOB_AI_URL}?action=chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, step }),
      });
      const data = await res.json();
      const withReply: Message[] = [...newMessages, { role: "assistant", content: data.reply }];
      setMessages(withReply);
      setStep(data.step);
      if (data.done) {
        setTimeout(() => finishInterview(withReply), 800);
      }
    } catch { setError("Ошибка. Попробуйте отправить снова."); }
    finally { setLoading(false); }
  }

  async function finishInterview(msgs: Message[]) {
    setLoading(true);
    try {
      const res = await fetch(`${JOB_AI_URL}?action=finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicant, messages: msgs }),
      });
      const data = await res.json();
      setResult(data);
      setPhase("result");
      clearState();
    } catch { setError("Ошибка при анализе. Попробуйте снова."); }
    finally { setLoading(false); }
  }

  const progress = Math.min((step / TOTAL_QUESTIONS) * 100, 100);

  // ── ФОРМА ──────────────────────────────────────────────────────────────────
  if (phase === "form") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f5f0e8,#faf9f6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <button onClick={() => { clearState(); onBack(); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#aaa", marginBottom: 32, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Вернуться к вакансии
          </button>

          <div className="job-tag">Первый шаг</div>
          <div className="job-divider" style={{ margin: "16px 0 24px" }} />
          <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: 36, fontWeight: 300, margin: "0 0 8px", color: "#1a1a1a" }}>
            Расскажите о себе
          </h2>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#888", marginBottom: 32, fontWeight: 300, lineHeight: 1.6 }}>
            После заполнения формы запустится первичное интервью с ИИ-ассистентом.
            Это займёт около 10 минут.
          </p>

          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede8df", padding: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>ФИО *</label>
                <input value={applicant.full_name} onChange={e => setApplicant(p => ({ ...p, full_name: e.target.value }))} placeholder="Иванова Мария Сергеевна" style={inp} />
              </div>
              <div>
                <label style={lbl}>Возраст</label>
                <input value={applicant.age} onChange={e => setApplicant(p => ({ ...p, age: e.target.value }))} placeholder="28" style={inp} />
              </div>
              <div>
                <label style={lbl}>Город</label>
                <input value={applicant.city} onChange={e => setApplicant(p => ({ ...p, city: e.target.value }))} placeholder="Москва" style={inp} />
              </div>
              <div>
                <label style={lbl}>Телефон *</label>
                <input value={applicant.phone} onChange={e => setApplicant(p => ({ ...p, phone: e.target.value }))} placeholder="+7 900 000 00 00" style={inp} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Telegram</label>
                <input value={applicant.telegram} onChange={e => setApplicant(p => ({ ...p, telegram: e.target.value }))} placeholder="@username" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Текущее место работы / сфера деятельности</label>
              <input value={applicant.current_job} onChange={e => setApplicant(p => ({ ...p, current_job: e.target.value }))} placeholder="Менеджер в beauty-студии" style={inp} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Опыт работы с людьми / клиентами</label>
              <textarea value={applicant.experience} onChange={e => setApplicant(p => ({ ...p, experience: e.target.value }))} placeholder="Кратко опишите ваш опыт..." rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Почему вас заинтересовала эта вакансия?</label>
              <textarea value={applicant.motivation} onChange={e => setApplicant(p => ({ ...p, motivation: e.target.value }))} placeholder="Расскажите своими словами..." rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#c9a96e", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 300, color: "#888", lineHeight: 1.6 }}>
                Я ознакомилась и принимаю{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: "#c9a96e", textDecoration: "underline" }}>
                  политику конфиденциальности
                </a>{" "}
                и даю согласие на обработку персональных данных.
              </span>
            </label>

            {error && <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c00", marginBottom: 16, fontFamily: "'Montserrat',sans-serif" }}>{error}</div>}

            <button onClick={startInterview} disabled={loading || !agreed} className="job-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: agreed ? 1 : 0.5 }}>
              {loading ? "Запускаю интервью..." : "Начать интервью"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ЧАТ-ИНТЕРВЬЮ ────────────────────────────────────────────────────────────
  if (phase === "chat") {
    return (
      <div style={{ minHeight: "100vh", background: "#faf9f6", display: "flex", flexDirection: "column" }}>
        {/* Шапка */}
        <div style={{ background: "#1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: 20, fontWeight: 400, color: "#fff" }}>
            Dok <span style={{ color: "#c9a96e" }}>Диалог</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 300, marginLeft: 12 }}>· Первичное интервью</span>
          </div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {applicant.full_name}
          </div>
        </div>

        {/* Прогресс */}
        <div style={{ background: "#1a1a1a", padding: "0 24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Прогресс интервью</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#c9a96e" }}>Вопрос {Math.min(step, TOTAL_QUESTIONS)} из {TOTAL_QUESTIONS}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right,#c9a96e,#a8834a)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Сообщения */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 720, margin: "0 auto", width: "100%" }}>
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: isUser ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#1a1a1a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant',serif", fontSize: 14, color: "#fff", fontWeight: 600,
                }}>
                  {isUser ? applicant.full_name[0] || "В" : "AI"}
                </div>
                <div style={{
                  maxWidth: "75%", padding: "14px 18px",
                  background: isUser ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#fff",
                  color: isUser ? "#fff" : "#1a1a1a",
                  borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  fontSize: 14, lineHeight: 1.7, fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                  border: isUser ? "none" : "1px solid #ede8df",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant',serif", fontSize: 14, color: "#fff" }}>AI</div>
              <div style={{ background: "#fff", border: "1px solid #ede8df", borderRadius: "4px 18px 18px 18px", padding: "16px 20px", display: "flex", gap: 6 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a96e", opacity: 0.5, animation: `dot-pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
              </div>
            </div>
          )}

          {error && <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00", fontFamily: "'Montserrat',sans-serif" }}>{error}</div>}
        </div>

        {/* Поле ввода */}
        <div style={{ background: "#fff", borderTop: "1px solid #ede8df", padding: "16px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
              placeholder="Напишите ваш ответ..."
              rows={2}
              disabled={loading}
              style={{ flex: 1, ...inp, resize: "none", lineHeight: 1.6, border: "1.5px solid #e0d8cc" }}
            />
            <button
              onClick={sendAnswer}
              disabled={loading || !input.trim()}
              style={{
                width: 46, height: 46, borderRadius: 12, border: "none", flexShrink: 0,
                background: input.trim() && !loading ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#e8e4dc",
                color: "#fff", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                transition: "all 0.2s",
              }}
            >→</button>
          </div>
          <div style={{ maxWidth: 720, margin: "6px auto 0", fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#bbb", textAlign: "right" }}>
            Enter — отправить · Shift+Enter — новая строка
          </div>
        </div>

        <style>{`@keyframes dot-pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
      </div>
    );
  }

  // ── РЕЗУЛЬТАТ ───────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const statusColor = STATUS_COLORS[result.status] || "#555";
    const statusBg = result.status === "recommended" ? "#f0f7f3" : result.status === "review" ? "#fdf8ee" : "#fdf0f0";

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f5f0e8,#faf9f6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: 44, color: "#c9a96e", marginBottom: 8 }}>✦</div>
            <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: 36, fontWeight: 300, margin: "0 0 8px", color: "#1a1a1a" }}>
              Интервью завершено
            </h2>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#888", fontWeight: 300 }}>
              Спасибо, {applicant.full_name.split(" ")[1] || applicant.full_name}! Ваша заявка принята.
            </p>
          </div>

          {/* Статус */}
          <div style={{ background: statusBg, border: `1px solid ${statusColor}40`, borderRadius: 16, padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 600, color: statusColor, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
              Результат оценки
            </div>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: 22, fontWeight: 500, color: statusColor }}>
              {result.status_label}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#aaa", fontWeight: 300, marginBottom: 20 }}>
              Мы свяжемся с вами в ближайшее время по указанным контактам.
            </p>
            <button onClick={() => { clearState(); onBack(); }} style={{ background: "none", border: "1px solid #e0d8cc", borderRadius: 50, padding: "10px 28px", fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#888", cursor: "pointer" }}>
              Вернуться на страницу вакансии
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}