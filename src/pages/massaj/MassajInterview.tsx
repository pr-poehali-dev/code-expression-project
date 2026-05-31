import { useState, useEffect, useRef } from "react";

const MASSAJ_AI_URL = "https://functions.poehali.dev/54d38b17-2d49-42a8-a0b4-d82bf91c8c8b";
const STORAGE_KEY = "massaj_interview_state_v2";
const RESULT_KEY = "massaj_interview_result_v2";
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
function saveResult(applicant: object, result: object) {
  try { localStorage.setItem(RESULT_KEY, JSON.stringify({ applicant, result, _savedAt: Date.now() })); } catch { /* ignore */ }
}
function loadResult(): { applicant: Applicant; result: Result } | null {
  try {
    const r = localStorage.getItem(RESULT_KEY);
    if (!r) return null;
    const parsed = JSON.parse(r);
    if (parsed._savedAt && Date.now() - parsed._savedAt > 7 * 86400000) {
      localStorage.removeItem(RESULT_KEY);
      return null;
    }
    return parsed;
  } catch { return null; }
}
function clearResult() {
  try { localStorage.removeItem(RESULT_KEY); } catch { /* ignore */ }
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

const STATUS_INFO: Record<string, {
  label: string; color: string; bg: string; borderColor: string;
  icon: string; verdict: string; message: string;
  gapTitle: string; gapText: string;
  nextTitle: string; nextText: string;
  btnLabel: string; btnHref: string;
}> = {
  recommended: {
    label: "Перспективный специалист",
    color: "#4a7c59", bg: "#f0f7f3", borderColor: "#4a7c5940",
    icon: "✦",
    verdict: "Вы готовы к премиальному сегменту",
    message: "Ваши ответы показали сильный потенциал: вы умеете работать с клиентом, мыслите профессионально и готовы расти. Именно такие специалисты нужны нашим партнёрским салонам.",
    gapTitle: "Что стоит между вами и премиальными клиентами",
    gapText: "Партнёрские салоны принимают специалистов с подтверждённым уровнем знаний. Сертификаты «Dok Диалог» — это профессиональный стандарт, который котируется в индустрии и открывает двери в заведения с высоким чеком. Без этого документа — даже сильному специалисту сложно попасть в премиальную среду.",
    nextTitle: "Следующий шаг",
    nextText: "Пройдите профессиональные программы «Dok Диалог», получите сертификаты и мы включим вас в кадровый резерв для рекомендаций салонам-партнёрам.",
    btnLabel: "Посмотреть программы",
    btnHref: "/catalog",
  },
  review: {
    label: "Хороший потенциал",
    color: "#a87c2a", bg: "#fdf8ee", borderColor: "#c9a96e40",
    icon: "◈",
    verdict: "Вы на правильном пути",
    message: "У вас есть хорошая база и верный взгляд на профессию. В ответах виден опыт и желание развиваться — это ценно. Но до уровня, который требуют премиальные салоны, ещё есть шаги.",
    gapTitle: "Что вас сдерживает",
    gapText: "Премиальный сегмент — это не только техника рук. Это конкретные навыки: как вести клиента, как выстраивать долгосрочные отношения, как позиционировать себя. Эти знания не приходят сами — им учат. И именно это даёт программа «Dok Диалог».",
    nextTitle: "Ваш план роста",
    nextText: "Пройдите профессиональные курсы, усильте нужные навыки и через короткое время вы будете готовы к работе с премиальной аудиторией.",
    btnLabel: "Получить план развития",
    btnHref: "/catalog",
  },
  declined: {
    label: "Нужна системная база",
    color: "#777", bg: "#f7f7f7", borderColor: "#ddd",
    icon: "◇",
    verdict: "Потенциал есть — нужна основа",
    message: "Вы сделали важный шаг — прошли профессиональную оценку. Это уже говорит о том, что вы хотите расти. Сейчас главное — выстроить правильную базу.",
    gapTitle: "Почему без системы — сложно",
    gapText: "Многие специалисты работают годами, но не могут выйти на новый уровень — не потому что нет таланта, а потому что нет системы. Без неё тяжело удержать клиента, выйти на высокий чек или попасть в хороший салон. Всё это решаемо, если знать как.",
    nextTitle: "С чего начать",
    nextText: "Программа «Dok Диалог» построена именно для того, чтобы дать эту систему. После прохождения вы сможете снова пройти оценку — уже с другим результатом.",
    btnLabel: "Начать с основ",
    btnHref: "/catalog",
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
  const savedResult = loadResult();
  const initPhase = savedResult ? "result" : (saved?.phase ?? "form");
  const [phase, setPhase] = useState<"form" | "chat" | "result">(initPhase);
  const [applicant, setApplicant] = useState<Applicant>(savedResult?.applicant ?? saved?.applicant ?? { full_name: "", phone: "", telegram: "", city: "", experience: "" });
  const [messages, setMessages] = useState<Message[]>(saved?.messages ?? []);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<number>(saved?.step ?? 0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(savedResult?.result ?? saved?.result ?? null);
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
      saveResult(applicant, data);
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
    const firstName = applicant.full_name.split(" ")[0];

    return (
      <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "Montserrat, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          .res-card { animation: fadeUp 0.5s ease both; }
        `}</style>

        {/* Шапка-статус */}
        <div style={{ background: "linear-gradient(135deg,#1a1a1a,#2a2520)", padding: "48px 20px 40px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: 36, color: info.color, marginBottom: 12 }}>{info.icon}</div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 10 }}>
            Результат оценки · Dok Диалог
          </div>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(24px,5vw,38px)", fontWeight: 400, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>
            {firstName}, {info.verdict}
          </div>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(16px,3vw,20px)", fontWeight: 300, color: info.color, fontStyle: "italic" }}>
            {info.label}
          </div>
          <div style={{ marginTop: 20, display: "inline-block", background: "rgba(255,255,255,0.07)", borderRadius: 50, padding: "10px 24px" }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>{result.total}</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>/ 70 баллов</span>
          </div>
        </div>

        <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 16px 60px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Персональный комментарий ИИ */}
          {result.comment && (
            <div className="res-card" style={{ animationDelay: "0.05s", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 16, padding: "20px 20px" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#a8834a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>Личный комментарий</div>
              <p style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(16px,3vw,19px)", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>«{result.comment}»</p>
            </div>
          )}

          {/* Что вы показали */}
          <div className="res-card" style={{ animationDelay: "0.1s", background: "#fff", border: "1px solid #ede8df", borderRadius: 16, padding: "20px 20px" }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.8, margin: 0 }}>
              {info.message}
            </p>
          </div>

          {/* Баллы по критериям */}
          <div className="res-card" style={{ animationDelay: "0.15s", background: "#fff", border: "1px solid #ede8df", borderRadius: 16, padding: "20px 20px" }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Оценка по критериям</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {Object.entries(result.scores).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#555" }}>{SCORE_LABELS[key] || key}</span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{val}<span style={{ fontWeight: 400, color: "#bbb" }}>/10</span></span>
                  </div>
                  <div style={{ height: 5, background: "#f0ebe2", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${(val / 10) * 100}%`, background: val >= 7 ? "linear-gradient(to right,#4a7c59,#6aac7a)" : val >= 5 ? "linear-gradient(to right,#c9a96e,#a8834a)" : "linear-gradient(to right,#bbb,#999)", borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Что стоит между вами и целью */}
          <div className="res-card" style={{ animationDelay: "0.2s", background: "#1a1a1a", borderRadius: 16, padding: "24px 20px" }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#c9a96e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>{info.gapTitle}</div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, margin: 0 }}>
              {info.gapText}
            </p>
          </div>

          {/* Следующий шаг */}
          <div className="res-card" style={{ animationDelay: "0.25s", background: `${info.bg}`, border: `1px solid ${info.borderColor}`, borderRadius: 16, padding: "20px 20px" }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: info.color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>{info.nextTitle}</div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.8, margin: "0 0 18px" }}>
              {info.nextText}
            </p>
            <a href={info.btnHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#c9a96e,#a8834a)", color: "#fff", textDecoration: "none", borderRadius: 50, padding: "15px 28px", fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 6px 24px rgba(201,169,110,0.35)", textAlign: "center" }}>
              {info.btnLabel} →
            </a>
          </div>

          {/* Сноска */}
          <div className="res-card" style={{ animationDelay: "0.3s", textAlign: "center" }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 16px" }}>
              Результат сохранён и будет доступен при следующем визите в течение 7 дней.
            </p>
            <button onClick={() => { clearResult(); clearState(); onBack(); }} style={{ background: "none", border: "1px solid #e0d8cc", borderRadius: 50, padding: "11px 24px", fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#aaa", cursor: "pointer" }}>
              Вернуться на страницу
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}