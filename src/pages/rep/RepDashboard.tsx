import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const ACCENT = "hsl(185,85%,32%)";
const REP_AI_URL = "https://functions.poehali.dev/5659445e-489a-411e-9e90-4bb21904624d";

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
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
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
          padding: "12px 16px", fontSize: 14, lineHeight: 1.7,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
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

export default function RepDashboard() {
  const { user, logout } = useLkAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const session = localStorage.getItem("lk_session") || "";
      const res = await fetch(REP_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "Montserrat, sans-serif" }}>

      {/* Шапка */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e4",
        padding: "14px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Briefcase" size={17} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Кабинет представителя</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Dok Диалог · {user?.full_name || user?.username}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setError(""); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: "#999", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
            >
              <Icon name="Trash2" size={13} />
              Очистить
            </button>
          )}
          <button
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
          >
            <Icon name="LogOut" size={13} />
            Выйти
          </button>
        </div>
      </div>

      {/* Основная зона */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>

        {/* Чат */}
        <div style={{
          flex: 1, overflowY: "auto", padding: 16,
          background: "#fafaf8", borderRadius: 16, border: "1px solid #e8e8e4",
          display: "flex", flexDirection: "column", gap: 16,
          marginBottom: 16,
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="Bot" size={26} style={{ color: ACCENT }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}>
                ИИ-ассистент по работе с салонами
              </div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                Генерирую КП, письма, скрипты продаж и расчёты выгоды под конкретный салон. Опишите задачу — подберу роль сам.
              </div>
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
            <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00" }}>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Поле ввода */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите задачу — ИИ сам подберёт роль..."
            rows={2}
            style={{
              flex: 1, border: "none", outline: "none", resize: "none",
              fontSize: 14, lineHeight: 1.6, fontFamily: "Montserrat, sans-serif",
              color: "#1a1a1a", background: "transparent",
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: 10, border: "none",
              background: input.trim() && !loading ? ACCENT : "#e8e8e4",
              color: "#fff", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.2s",
            }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "#ccc", marginTop: 8 }}>
          Enter — отправить · Shift+Enter — новая строка
        </div>
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
