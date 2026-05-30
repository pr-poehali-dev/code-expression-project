import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";

const AI_URL = "https://functions.poehali.dev/41af747e-03ee-4e7f-8c58-a5eddca468de";
const ADMIN_TOKEN = "Sss07011974ssS";

interface Message {
  role: "user" | "assistant";
  content: string;
}



function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 10,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: isUser ? ACCENT : "#f0f0ed",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={isUser ? "User" : "Bot"} size={16} style={{ color: isUser ? "#fff" : "#666" }} />
      </div>

      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        <div style={{
          background: isUser ? ACCENT : "#fff",
          color: isUser ? "#fff" : "#1a1a1a",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          border: isUser ? "none" : "1px solid #e8e8e4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {msg.content}
        </div>

        {!isUser && (
          <button
            onClick={() => copyToClipboard(msg.content, setCopied)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              marginTop: 6, padding: "4px 10px",
              background: copied ? `${ACCENT}18` : "transparent",
              border: `1px solid ${copied ? ACCENT : "#e0e0da"}`,
              borderRadius: 7, cursor: "pointer",
              fontSize: 12, fontWeight: 600,
              color: copied ? ACCENT : "#999",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.2s",
            }}
          >
            <Icon name={copied ? "Check" : "Copy"} size={12} />
            {copied ? "Скопировано!" : "Скопировать"}
          </button>
        )}
      </div>
    </div>
  );
}

export function AISection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: ADMIN_TOKEN,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось получить ответ");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 500 }}>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Bot" size={18} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>ИИ-ассистент Dok Диалог</div>
            <div style={{ fontSize: 12, color: "#999" }}>Копирайтер · Маркетолог · SEO · Продажи · Финансы · PR</div>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            border: "1.5px solid #e8e8e4", background: "#fff",
            color: "#999", fontSize: 13, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}>
            <Icon name="Trash2" size={13} />
            Очистить
          </button>
        )}
      </div>

      {/* Область сообщений */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        background: "#fafaf8", borderRadius: 16,
        border: "1px solid #e8e8e4",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb", fontSize: 14 }}>
            Напишите задание — ИИ сам определит роль и даст результат
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f0f0ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="Bot" size={16} style={{ color: "#666" }} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, opacity: 0.4, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c44", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="AlertCircle" size={14} />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите запрос... (Enter — отправить, Shift+Enter — перенос)"
          rows={2}
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 12,
            border: "1.5px solid #e8e8e4", fontSize: 14,
            fontFamily: "Montserrat, sans-serif", resize: "none",
            outline: "none", lineHeight: 1.5,
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = ACCENT)}
          onBlur={e => (e.target.style.borderColor = "#e8e8e4")}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 48, height: 48, borderRadius: 12, border: "none",
            background: !input.trim() || loading ? "#e8e8e4" : ACCENT,
            color: "#fff", cursor: !input.trim() || loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.2s",
          }}
        >
          <Icon name="Send" size={18} />
        </button>
      </div>

      <div style={{ fontSize: 11, color: "#bbb", marginTop: 6, textAlign: "center" }}>
        Shift+Enter — перенос строки · Ответы ИИ можно скопировать кнопкой под сообщением
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}