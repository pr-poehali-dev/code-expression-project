import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AI_LANDING_URL = "https://functions.poehali.dev/12df0290-571d-42d1-8fb0-8889ae15cd68";
const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";
const LS_MSGS = "landing_builder_msgs";
const LS_HTML = "landing_builder_html";
const LS_PHASE = "landing_builder_phase";

interface Message { role: "user" | "assistant"; content: string; }

const NETLIFY_STEPS = [
  { n: "1", text: "Зайдите на сайт netlify.com и нажмите «Sign up» (бесплатно)" },
  { n: "2", text: "После регистрации откроется раздел Sites — перетащите скачанный HTML-файл прямо в браузер" },
  { n: "3", text: "Через 10 секунд сайт будет онлайн по адресу вида random-name.netlify.app" },
  { n: "4", text: "Чтобы подключить свой домен: Settings → Domain management → Add custom domain" },
];

function session() { return localStorage.getItem("lk_session") || ""; }

const WELCOME: Message = {
  role: "assistant",
  content: "Привет! Я помогу создать красивый лендинг для вашего бизнеса 🚀\n\nРасскажите — чем занимается ваш бизнес? Название, сфера деятельности — начнём с этого.",
};

export default function LkLandingBuilder() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const s = localStorage.getItem(LS_MSGS); return s ? JSON.parse(s) : [WELCOME]; } catch { return [WELCOME]; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"chat" | "generating" | "done">(() => {
    try { return (localStorage.getItem(LS_PHASE) as "chat" | "done") || "chat"; } catch { return "chat"; }
  });
  const [htmlResult, setHtmlResult] = useState(() => {
    try { return localStorage.getItem(LS_HTML) || ""; } catch { return ""; }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem(LS_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LS_HTML, htmlResult);
    localStorage.setItem(LS_PHASE, phase);
  }, [htmlResult, phase]);

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ messages: newMessages, mode: "chat" }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } finally {
      setLoading(false);
    }
  }

  async function generateLanding() {
    setPhase("generating");
    setLoading(true);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ messages, mode: "generate" }),
      });
      const data = await res.json();
      setHtmlResult(data.reply);
      setPhase("done");
      setShowPreview(true);
    } finally {
      setLoading(false);
    }
  }

  function downloadHtml() {
    const blob = new Blob([htmlResult], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isReadyToGenerate = messages.length >= 6 && phase === "chat";

  // ── Генерация / Превью ──
  if (phase === "generating" || phase === "done") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Заголовок */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Globe" size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Ваш лендинг готов</div>
            <div style={{ fontSize: 13, color: "#888" }}>Просмотрите и скачайте HTML-файл</div>
          </div>
        </div>

        {phase === "generating" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 40, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: `3px solid ${ACCENT_LIGHT}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>ИИ создаёт лендинг...</div>
            <div style={{ fontSize: 13, color: "#888" }}>Обычно занимает 15–30 секунд</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {phase === "done" && (
          <>
            {/* Кнопки действий */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={downloadHtml}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Download" size={16} />
                Скачать HTML
              </button>
              <button
                onClick={() => setShowPreview(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name={showPreview ? "EyeOff" : "Eye"} size={16} />
                {showPreview ? "Скрыть превью" : "Показать превью"}
              </button>
              <button
                onClick={() => { setPhase("chat"); setHtmlResult(""); setMessages([WELCOME]); localStorage.removeItem(LS_MSGS); localStorage.removeItem(LS_HTML); localStorage.removeItem(LS_PHASE); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "1.5px solid #E8ECF0", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="RefreshCw" size={15} />
                Создать заново
              </button>
            </div>

            {/* Превью */}
            {showPreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #E8ECF0", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                <div style={{ background: "#F1F5F9", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#888" }}>Предварительный просмотр</div>
                </div>
                <iframe
                  srcDoc={htmlResult}
                  style={{ width: "100%", height: 600, border: "none", display: "block" }}
                  title="Превью лендинга"
                />
              </div>
            )}

            {/* Инструкция */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0" }}>
              <button
                onClick={() => setShowInstructions(v => !v)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="BookOpen" size={16} style={{ color: ACCENT }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Как разместить лендинг в интернете (бесплатно)</span>
                </div>
                <Icon name={showInstructions ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#888" }} />
              </button>
              {showInstructions && (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>
                    Самый простой способ — <strong>Netlify Drop</strong>. Бесплатно, без регистрации домена, за 1 минуту.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {NETLIFY_STEPS.map(s => (
                      <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                        <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{s.text}</div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "9px 18px", borderRadius: 8, background: ACCENT_LIGHT, color: ACCENT, fontSize: 13, fontWeight: 700, textDecoration: "none", border: `1px solid ${ACCENT}30` }}
                  >
                    <Icon name="ExternalLink" size={14} />
                    Открыть Netlify Drop
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Чат ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Globe" size={20} style={{ color: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Конструктор лендингов</div>
          <div style={{ fontSize: 13, color: "#888" }}>Расскажите о бизнесе — ИИ создаст готовый сайт</div>
        </div>
      </div>

      {/* Чат */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", maxHeight: 420, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 16, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="Sparkles" size={11} style={{ color: "#fff" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>ИИ-ассистент</span>
                </div>
              )}
              <div style={{
                maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user" ? ACCENT : "#F8FAFC",
                color: m.role === "user" ? "#fff" : "#1a1a1a",
                fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
                border: m.role === "assistant" ? "1px solid #E8ECF0" : "none",
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Sparkles" size={11} style={{ color: "#fff" }} />
              </div>
              <div style={{ display: "flex", gap: 4, padding: "8px 12px", background: "#F8FAFC", borderRadius: "14px 14px 14px 4px", border: "1px solid #E8ECF0" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, opacity: 0.5, animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Ввод */}
        <div style={{ borderTop: "1px solid #E8ECF0", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напишите о своём бизнесе..."
            rows={2}
            style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8ECF0", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.5, color: "#1a1a1a" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, border: "none", background: !input.trim() || loading ? "#E8ECF0" : ACCENT, color: !input.trim() || loading ? "#aaa" : "#fff", cursor: !input.trim() || loading ? "default" : "pointer", flexShrink: 0 }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>

      {/* Кнопка генерации */}
      {isReadyToGenerate && (
        <button
          onClick={generateLanding}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 24px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: `0 4px 20px ${ACCENT}40` }}
        >
          <Icon name="Wand2" size={18} />
          Создать лендинг
        </button>
      )}
      {!isReadyToGenerate && messages.length >= 2 && (
        <div style={{ fontSize: 12, color: "#aaa", textAlign: "center" }}>
          Кнопка «Создать лендинг» появится после того, как ИИ соберёт достаточно информации
        </div>
      )}

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}