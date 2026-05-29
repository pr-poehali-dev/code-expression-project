import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const API_URL = "https://functions.poehali.dev/76407b84-9806-414f-9dcb-d3e0604fccc6";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Какие курсы есть на платформе?",
  "Сколько стоит доступ?",
  "Что такое AI-инструменты?",
  "Есть ли тарифы для салонов?",
];

const WELCOME: Message = {
  role: "assistant",
  content: "Привет! Я AI-консультант платформы Dok Dialog. Помогу разобраться с обучением, тарифами и инструментами. Что вас интересует?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: userText };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "Не удалось получить ответ." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка соединения. Попробуйте ещё раз." }]);
    } finally {
      setLoading(false);
    }
  }

  function renderWithLinks(text: string, isUser: boolean) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const result: React.ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(text)) !== null) {
      const raw = match[0];
      const url = raw.replace(/[.,!?:;)»"']+$/, "");
      const end = match.index + url.length;
      if (match.index > last) result.push(<span key={last}>{text.slice(last, match.index)}</span>);
      result.push(
        <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: isUser ? "rgba(255,255,255,0.9)" : ACCENT, textDecoration: "underline", wordBreak: "break-all" }}>
          {url}
        </a>
      );
      last = end;
      urlRegex.lastIndex = end;
    }
    if (last < text.length) result.push(<span key={last}>{text.slice(last)}</span>);
    return result;
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Кнопка-триггер */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Открыть чат с консультантом"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          width: 58, height: 58, borderRadius: "50%",
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Icon name={open ? "X" : "MessageCircle"} size={26} style={{ color: "#fff" }} />
      </button>

      {/* Окно чата */}
      {open && (
        <div style={{
          position: "fixed", bottom: 94, right: 24, zIndex: 998,
          width: "min(380px, calc(100vw - 32px))",
          height: "min(520px, calc(100vh - 120px))",
          background: "#fff", borderRadius: 20,
          boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "Montserrat, sans-serif",
          overflow: "hidden",
          animation: "chatSlideUp 0.22s ease",
        }}>
          <style>{`
            @keyframes chatSlideUp {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Шапка */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
            padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name="Bot" size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>AI-консультант</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>Отвечает мгновенно</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <Icon name="X" size={18} style={{ color: "rgba(255,255,255,0.8)" }} />
            </button>
          </div>

          {/* Сообщения */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`
                    : "#f4f4f0",
                  color: msg.role === "user" ? "#fff" : "#1a1a1a",
                  fontSize: 13, lineHeight: 1.65,
                }}>
                  {msg.content.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {renderWithLinks(line, msg.role === "user")}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Быстрые вопросы */}
            {showSuggestions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      padding: "8px 12px", borderRadius: 10, textAlign: "left",
                      border: `1.5px solid ${ACCENT}30`, background: "#fff",
                      fontSize: 12, color: ACCENT, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${ACCENT}10`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Индикатор печати */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
                  background: "#f4f4f0", display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#bbb",
                      animation: `chatDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                  <style>{`
                    @keyframes chatDot {
                      0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
                      40% { transform: scale(1); opacity: 1; }
                    }
                  `}</style>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Ввод */}
          <div style={{
            padding: "12px 14px", borderTop: "1px solid #f0f0ec",
            display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напишите вопрос..."
              rows={1}
              style={{
                flex: 1, padding: "10px 13px", borderRadius: 12,
                border: "1.5px solid #e8e8e4",
                fontSize: 13, fontFamily: "Montserrat, sans-serif",
                outline: "none", resize: "none", lineHeight: 1.5,
                color: "#1a1a1a", maxHeight: 80, overflowY: "auto",
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
              onBlur={e => (e.currentTarget.style.borderColor = "#e8e8e4")}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 11, border: "none",
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`
                  : "#f0f0ec",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}
            >
              <Icon name="Send" size={16} style={{ color: input.trim() && !loading ? "#fff" : "#bbb" }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}