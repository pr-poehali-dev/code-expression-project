import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, REP_AI_URL, Message, copyText } from "./rep.constants";

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: isUser ? ACCENT : "#f0f0ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={isUser ? "User" : "Bot"} size={16} style={{ color: isUser ? "#fff" : "#666" }} />
      </div>
      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        <div style={{
          background: isUser ? ACCENT : "#fff", color: isUser ? "#fff" : "#1a1a1a",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px", fontSize: 14, lineHeight: 1.7,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          border: isUser ? "none" : "1px solid #e8e8e4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>{msg.content}</div>
        {!isUser && (
          <button onClick={() => copyText(msg.content, setCopied)} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            marginTop: 6, padding: "4px 10px",
            background: copied ? ACCENT_LIGHT : "transparent",
            border: `1px solid ${copied ? ACCENT : "#e0e0da"}`,
            borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
            color: copied ? ACCENT : "#999",
            fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
          }}>
            <Icon name={copied ? "Check" : "Copy"} size={12} />
            {copied ? "Скопировано!" : "Скопировать"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RepAITab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;
    const newMessages = [...messages, { role: "user" as const, content }];
    setMessages(newMessages); setInput(""); setLoading(true); setError("");
    try {
      const session = localStorage.getItem("lk_session") || "";
      const res = await fetch(REP_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 230px)", minHeight: 400 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#fafaf8", borderRadius: 16, border: "1px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 16, marginBottom: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Icon name="Bot" size={24} style={{ color: ACCENT }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 6 }}>ИИ-ассистент по продажам Промт Диалог</div>
            <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Генерирую КП, письма, скрипты, расчёты окупаемости.<br />Знает все ИИ-инструменты платформы и систему ролей для салонов.<br />Опишите задачу — подберу роль сам.</div>
          </div>
        )}
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f0f0ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="Bot" size={16} style={{ color: "#666" }} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, opacity: 0.4, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
        {error && <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00" }}>{error}</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8e8e4", padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Напишите задачу..."
          rows={2}
          style={{ flex: 1, border: "none", outline: "none", resize: "none", fontSize: 14, lineHeight: 1.6, fontFamily: "Montserrat, sans-serif", color: "#1a1a1a", background: "transparent" }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: 9, border: "none", background: input.trim() && !loading ? ACCENT : "#e8e8e4", color: "#fff", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
          <Icon name="Send" size={15} />
        </button>
      </div>
    </div>
  );
}