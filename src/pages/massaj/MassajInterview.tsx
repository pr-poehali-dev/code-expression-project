import { useState, useEffect, useRef } from "react";

const MASSAJ_AI_URL = "https://functions.poehali.dev/54d38b17-2d49-42a8-a0b4-d82bf91c8c8b";
const STORAGE_KEY = "massaj_interview_state_v2";
const TOTAL_QUESTIONS = 15;

function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (!r) return null;
    const parsed = JSON.parse(r);
    // Проверяем что данные не старше 24 часов
    if (parsed._savedAt && Date.now() - parsed._savedAt > 86400000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch { return null; }
}
function saveState(s: object) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, _savedAt: Date.now() })); } catch { /* ignore */ }
}
function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) return res;
      if (i < retries) await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw new Error("Нет ответа от сервера");
}

interface Message { role: "user" | "assistant"; content: string; }
interface Applicant { full_name: string; phone: string; telegram: string; city: string; experience: string; }
interface Result { scores: Record<string, number>; total: number; status: string; comment: string; }

const SCORE_LABELS: Record<string, string> = {
  communication: "Коммуникация",
  literacy: "Грамотность речи",
  awareness: "Осознанность",
  learning_readiness: "Готовность обучаться",
  client_orientation: "Клиентоориентированность",
  growth_potential: "Потенциал роста",
  philosophy_fit: "Соответствие философии Dok Диалог",
};

const STATUS_INFO: Record<string, { label: string; color: string; bg: string; btnLabel: string; btnHref: string; message: string }> = {
  recommended: {
    label: "Перспективный специалист",
    color: "#4a7c59",
    bg: "#f0f7f3",
    btnLabel: "Посмотреть программы обучения",
    btnHref: "/catalog",
    message: "Ваши ответы показывают высокий потенциал для работы в премиальном сегменте. Для включения в кадровый резерв проекта и получения рекомендаций в партнёрские салоны необходимо пройти обучение по системе «Dok Диалог».",
  },
  review: {
    label: "Хороший потенциал",
    color: "#a87c2a",
    bg: "#fdf8ee",
    btnLabel: "Получить план развития",
    btnHref: "/catalog",
    message: "У вас есть хорошая база, однако для работы в премиальном сегменте рекомендуется развить навыки коммуникации, ведения клиента и системного подхода.",
  },
  declined: {
    label: "Требуется развитие",
    color: "#888",
    bg: "#fafafa",
    btnLabel: "Ознакомиться с обучением",
    btnHref: "/catalog",
    message: "На текущем этапе рекомендуем уделить внимание профессиональному развитию и формированию системного подхода к работе с клиентами. После обучения вы сможете пройти оценку повторно.",
  },
};

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  border: "1.5px solid #e0d8cc", fontSize: 14, outline: "none",
  fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box",
  background: "#fff", color: "#1a1a1a", transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#555",
  marginBottom: 6, fontFamily: "'Montserrat', sans-serif",
};

export default function MassajInterview({ onBack }: { onBack: () => void }) {
  const saved = loadState();
  const [phase, setPhase] = useState<"form" | "chat" | "result">(saved?.phase ?? "form");
  const [applicant, setApplicant] = useState<Applicant>(saved?.applicant ?? { full_name: "", phone: "", telegram: "", city: "", experience: "" });
  const [messages, setMessages] = useState<Message[]>(saved?.messages ?? []);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<number>(saved?.step ?? 0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(saved?.result ?? null);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState<boolean>(saved?.agreed ?? false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveState({ phase, applicant, messages, step, result, agreed });
  }, [phase, applicant, messages, step, result, agreed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const progress = Math.min((step / TOTAL_QUESTIONS) * 100, 100);

  async function startInterview() {
    if (!applicant.full_name || !applicant.phone) { setError("Заполните имя и телефон"); return; }
    if (!agreed) { setError("Необходимо принять политику конфиденциальности"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetchWithRetry(`${MASSAJ_AI_URL}?action=chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], step: 0 }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.reply }]);
      setStep(data.step ?? 0);
      setPhase("chat");
    } catch { setError("Ошибка соединения. Проверьте интернет и попробуйте снова."); }
    finally { setLoading(false); }
  }

  async function sendAnswer() {
    const content = input.trim();
    if (!content || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages); setInput(""); setLoading(true);
    try {
      const res = await fetchWithRetry(`${MASSAJ_AI_URL}?action=chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, step }),
      });
      const data = await res.json();
      const withReply: Message[] = [...newMessages, { role: "assistant", content: data.reply }];
      setMessages(withReply);
      setStep(data.step ?? step + 1);
      if (data.done) setTimeout(() => finishInterview(withReply), 800);
    } catch {
      // Откатываем — убираем сообщение пользователя из списка, чтобы он мог отправить снова
      setMessages(messages);
      setInput(content);
      setError("Не удалось отправить. Проверьте интернет и нажмите отправить снова.");
    }
    finally { setLoading(false); }
  }

  async function finishInterview(msgs: Message[]) {
    setLoading(true);
    try {
      const res = await fetchWithRetry(`${MASSAJ_AI_URL}?action=finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicant, messages: msgs }),
      }, 3);
      const data = await res.json();
      setResult(data);
      setPhase("result");
      clearState();
    } catch { setError("Ошибка при формировании результата. Подождите немного и нажмите «Завершить» снова."); }
    finally { setLoading(false); }
  }

  // ── ФОРМА ──────────────────────────────────────────────────────────
  if (phase === "form") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f5f0e8,#faf9f6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 16px 40px" }}>
        <div style={{ maxWidth: 520, width: "100%" }}>
          <button onClick={() => { clearState(); onBack(); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#777", marginBottom: 24, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Вернуться
          </button>

          <div style={{ display: "inline-block", fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#c9a96e", marginBottom: 12 }}>Первый шаг</div>
          <div style={{ width: 40, height: 1, background: "#c9a96e", marginBottom: 18 }} />
          <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(22px,5vw,34px)", fontWeight: 400, margin: "0 0 8px", color: "#1a1a1a" }}>
            Расскажите о себе
          </h2>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#555", marginBottom: 24, fontWeight: 400, lineHeight: 1.6 }}>
            После заполнения формы запустится профессиональное интервью с ИИ-ассистентом. Займёт около 15 минут.
          </p>

          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede8df", padding: "clamp(18px,4vw,28px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Имя и фамилия *</label>
                <input value={applicant.full_name} onChange={e => setApplicant(p => ({ ...p, full_name: e.target.value }))} placeholder="Иванова Мария" style={inp} />
              </div>
              <div>
                <label style={lbl}>Телефон *</label>
                <input value={applicant.phone} onChange={e => setApplicant(p => ({ ...p, phone: e.target.value }))} placeholder="+7 900 000 00 00" style={inp} inputMode="tel" />
              </div>
              <div>
                <label style={lbl}>Telegram</label>
                <input value={applicant.telegram} onChange={e => setApplicant(p => ({ ...p, telegram: e.target.value }))} placeholder="@username" style={inp} />
              </div>
              <div>
                <label style={lbl}>Город</label>
                <input value={applicant.city} onChange={e => setApplicant(p => ({ ...p, city: e.target.value }))} placeholder="Москва" style={inp} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Опыт работы</label>
              <textarea value={applicant.experience} onChange={e => setApplicant(p => ({ ...p, experience: e.target.value }))} placeholder="Сколько лет работаете, в какой сфере..." rows={2} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: "#c9a96e", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 400, color: "#555", lineHeight: 1.6 }}>
                Я ознакомилась и принимаю{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: "#c9a96e", textDecoration: "underline" }}>политику конфиденциальности</a>{" "}
                и даю согласие на обработку персональных данных.
              </span>
            </label>

            {error && <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c00", marginBottom: 16, fontFamily: "'Montserrat',sans-serif" }}>{error}</div>}

            <button
              onClick={startInterview}
              disabled={loading || !agreed}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: agreed ? "linear-gradient(135deg, #c9a96e, #a8834a)" : "#ddd", color: "#fff", border: "none", borderRadius: 50, padding: "15px 32px", fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "1px", cursor: agreed ? "pointer" : "default", textTransform: "uppercase", width: "100%", transition: "all 0.3s" }}
            >
              {loading ? "Запускаю интервью..." : "Начать оценку"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ЧАТ ────────────────────────────────────────────────────────────
  if (phase === "chat") {
    return (
      <div style={{ height: "100dvh", background: "#faf9f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Шапка */}
        <div style={{ background: "#1a1a1a", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(15px,3vw,18px)", fontWeight: 400, color: "#fff", flexShrink: 0 }}>
            Dok <span style={{ color: "#c9a96e" }}>Диалог</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 400, marginLeft: 8 }}>· Оценка</span>
          </div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "45%" }}>
            {applicant.full_name}
          </div>
        </div>

        {/* Прогресс */}
        <div style={{ background: "#1a1a1a", padding: "0 16px 12px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Прогресс оценки</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#c9a96e" }}>Вопрос {Math.min(step, TOTAL_QUESTIONS)} из {TOTAL_QUESTIONS}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right,#c9a96e,#a8834a)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Сообщения */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14, WebkitOverflowScrolling: "touch" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: isUser ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant',serif", fontSize: 13, color: "#fff", fontWeight: 600 }}>
                    {isUser ? (applicant.full_name[0] || "В") : "Б"}
                  </div>
                  <div style={{ maxWidth: "85%", padding: "11px 14px", background: isUser ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#fff", color: isUser ? "#fff" : "#1a1a1a", borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", fontSize: 14, lineHeight: 1.7, fontFamily: "'Montserrat',sans-serif", fontWeight: 400, border: isUser ? "none" : "1px solid #ede8df", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant',serif", fontSize: 13, color: "#fff" }}>Б</div>
                <div style={{ background: "#fff", border: "1px solid #ede8df", borderRadius: "4px 16px 16px 16px", padding: "13px 16px", display: "flex", gap: 6 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a96e", opacity: 0.5, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}

            {error && <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00", fontFamily: "'Montserrat',sans-serif" }}>{error}</div>}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Поле ввода */}
        <div style={{ background: "#fff", borderTop: "1px solid #ede8df", padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))", flexShrink: 0 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
              placeholder="Напишите ваш ответ..."
              rows={2}
              disabled={loading}
              style={{ flex: 1, ...inp, resize: "none", lineHeight: 1.6, border: "1.5px solid #e0d8cc", fontSize: 14, maxHeight: 120 }}
            />
            <button
              onClick={sendAnswer}
              disabled={loading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: 12, border: "none", flexShrink: 0, background: input.trim() && !loading ? "linear-gradient(135deg,#c9a96e,#a8834a)" : "#e8e4dc", color: "#fff", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.2s" }}
            >→</button>
          </div>
          <div style={{ maxWidth: 680, margin: "3px auto 0", fontFamily: "'Montserrat',sans-serif", fontSize: 10, color: "#bbb", textAlign: "right" }}>
            Enter — отправить · Shift+Enter — новая строка
          </div>
        </div>

        <style>{`@keyframes dot-pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
      </div>
    );
  }

  // ── РЕЗУЛЬТАТ ───────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const info = STATUS_INFO[result.status] || STATUS_INFO.declined;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f5f0e8,#faf9f6)", padding: "48px 16px 60px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {/* Заголовок */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: 40, color: "#c9a96e", marginBottom: 8, lineHeight: 1 }}>✦</div>
            <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(22px,5vw,34px)", fontWeight: 400, margin: "0 0 8px", color: "#1a1a1a" }}>
              Оценка завершена
            </h2>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#666", fontWeight: 400 }}>
              Спасибо, {applicant.full_name.split(" ")[0]}! Ваши ответы обработаны.
            </p>
          </div>

          {/* Статус + баллы */}
          <div style={{ background: info.bg, border: `1px solid ${info.color}40`, borderRadius: 18, padding: "20px 18px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: info.color, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Результат оценки</div>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(18px,4vw,26px)", fontWeight: 500, color: info.color, marginBottom: 8 }}>{info.label}</div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>{result.total} <span style={{ fontSize: 15, color: "#888", fontWeight: 400 }}>/ 70 баллов</span></div>
          </div>

          {/* Описание результата */}
          <div style={{ background: "#fff", border: "1px solid #ede8df", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.75, margin: 0 }}>
              {info.message}
            </p>
          </div>

          {/* Комментарий ИИ */}
          {result.comment && (
            <div style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#a8834a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Комментарий</div>
              <p style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(15px,3vw,18px)", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>«{result.comment}»</p>
            </div>
          )}

          {/* Баллы по критериям */}
          <div style={{ background: "#fff", border: "1px solid #ede8df", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>Оценка по критериям</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(result.scores).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 400, color: "#444" }}>{SCORE_LABELS[key] || key}</span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{val}/10</span>
                  </div>
                  <div style={{ height: 4, background: "#f0ebe2", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${(val / 10) * 100}%`, background: "linear-gradient(to right, #c9a96e, #a8834a)", borderRadius: 4, transition: "width 0.8s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={info.btnHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(135deg, #c9a96e, #a8834a)", color: "#fff", border: "none", borderRadius: 50, padding: "15px 32px", fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 8px 28px rgba(201,169,110,0.35)", textAlign: "center" }}>
              {info.btnLabel}
            </a>
            <button onClick={() => { clearState(); onBack(); }} style={{ background: "none", border: "1px solid #e0d8cc", borderRadius: 50, padding: "12px 28px", fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#888", cursor: "pointer", width: "100%" }}>
              Вернуться на страницу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}