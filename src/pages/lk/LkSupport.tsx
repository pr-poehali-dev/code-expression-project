import { useState, useRef, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const TEAL = "#2DD4BF";
const CHAT_URL = "https://functions.poehali.dev/76407b84-9806-414f-9dcb-d3e0604fccc6";
const NOTIFY_URL = "https://functions.poehali.dev/2162b9ca-b5aa-42d7-bf9d-942e28d6cadf";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content: "Привет! Я AI-помощник техподдержки платформы «Промт Диалог». Опишите вашу проблему или задайте вопрос — постараюсь помочь. Если нужна помощь живого специалиста, нажмите кнопку ниже.",
};

export default function LkSupport() {
  const { user } = useLkAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: userText };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "Не удалось получить ответ." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка соединения. Попробуйте ещё раз." }]);
    } finally {
      setLoading(false);
    }
  }

  async function contactOperator() {
    setSending(true);
    const userMsgs = messages.filter(m => m.role === "user");
    if (userMsgs.length === 0) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Пожалуйста, сначала опишите вашу проблему в чате — тогда оператор увидит контекст.",
      }]);
      setSending(false);
      return;
    }
    try {
      await fetch(NOTIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.full_name || user?.username || "Пользователь ЛК",
          email: user?.email || "нет почты",
          phone: "",
          messages: [
            { role: "assistant", content: `[ТЕХПОДДЕРЖКА] Запрос от пользователя ID ${user?.id}, email: ${user?.email}` },
            ...messages,
          ],
        }),
      });
      setSent(true);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "✅ Ваш запрос и история переписки отправлены оператору. Мы ответим вам на почту в течение рабочего дня.",
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Не удалось отправить запрос. Попробуйте позже." }]);
    } finally {
      setSending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Личный кабинет · Промт Диалог
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          Техническая поддержка
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
          AI-помощник ответит на большинство вопросов. Если нужен живой специалист — нажмите «Написать оператору».
        </p>
      </div>

      {/* Область чата */}
      <div style={{
        background: "#fff", border: "1px solid #E8ECF0", borderRadius: 16,
        boxShadow: "0 1px 3px rgba(15,23,42,0.05)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        height: "min(520px, calc(100vh - 280px))",
      }}>
        {/* Хедер чата */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #F1F5F9",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(45,212,191,0.25)",
          }}>
            <Icon name="Bot" size={17} style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>AI-помощник</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Онлайн · Отвечает мгновенно</div>
          </div>
        </div>

        {/* Сообщения */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "80%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user"
                  ? `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`
                  : "#F8FAFC",
                color: msg.role === "user" ? "#fff" : "#0F172A",
                fontSize: 14, lineHeight: 1.6,
                border: msg.role === "user" ? "none" : "1px solid #E8ECF0",
                boxShadow: msg.role === "user" ? "0 2px 8px rgba(20,184,166,0.2)" : "none",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
                background: "#F8FAFC", border: "1px solid #E8ECF0",
                display: "flex", gap: 4, alignItems: "center",
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1",
                    animation: `lk-bounce 1.2s ease-in-out ${j * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Ввод */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", background: "#FAFBFC" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Опишите проблему…"
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid #E2E8F0", fontSize: 14,
                fontFamily: "Montserrat, sans-serif", outline: "none",
                resize: "none", lineHeight: 1.5, color: "#0F172A",
                background: "#fff", boxSizing: "border-box",
                maxHeight: 100, overflowY: "auto",
              }}
              onFocus={e => (e.target.style.borderColor = ACCENT)}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 10, border: "none", flexShrink: 0,
                background: !input.trim() || loading ? "#E2E8F0" : `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
                boxShadow: !input.trim() || loading ? "none" : "0 2px 8px rgba(45,212,191,0.3)",
              }}
            >
              <Icon name="Send" size={16} style={{ color: !input.trim() || loading ? "#94A3B8" : "#0F172A" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Кнопка оператора */}
      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={contactOperator}
          disabled={sent || sending}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 22px", borderRadius: 12, border: "none",
            background: sent ? "#F0FDF4" : `linear-gradient(135deg, #0F172A, #1E293B)`,
            color: sent ? "hsl(145,60%,35%)" : "#fff",
            fontSize: 14, fontWeight: 600, cursor: sent || sending ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", transition: "all 0.15s",
            boxShadow: sent ? "none" : "0 4px 16px rgba(15,23,42,0.2)",
          }}
        >
          {sending
            ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Отправляем…</>
            : sent
            ? <><Icon name="CheckCircle" size={15} /> Запрос отправлен</>
            : <><Icon name="Headphones" size={15} /> Написать оператору</>
          }
        </button>
        {!sent && (
          <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
            История переписки будет отправлена вместе с запросом
          </div>
        )}
      </div>

      <style>{`
        @keyframes lk-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}