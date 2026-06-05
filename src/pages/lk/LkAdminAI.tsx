import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";

const AI_URL = "https://functions.poehali.dev/db81ea19-4426-448e-b956-d895d8dc266c";
const ADMIN_TOKEN = "Sss07011974ssS";
const STORAGE_KEY = "admin_ai_pro_history";

interface Message {
  role: "user" | "assistant";
  content: string;
  roleId?: string;
}

type RoleId = "marketer" | "blogger" | "financier" | "philosopher" | "programmer" | "businessman" | "psychologist" | "screenwriter" | "politician" | "lawyer";

interface Role {
  id: RoleId;
  label: string;
  icon: string;
  color: string;
  bg: string;
  hint: string;
}

const ROLES: Role[] = [
  { id: "marketer",      label: "Маркетолог",   icon: "Target",       color: "hsl(220,80%,50%)", bg: "hsl(220,80%,95%)", hint: "Стратегии, воронки, реклама, УТП" },
  { id: "blogger",       label: "Блогер",        icon: "Sparkles",     color: "hsl(335,80%,50%)", bg: "hsl(335,80%,96%)", hint: "Контент, посты, сценарии, охваты" },
  { id: "financier",     label: "Финансист",     icon: "TrendingUp",   color: "hsl(145,60%,38%)", bg: "hsl(145,60%,94%)", hint: "P&L, инвестиции, юнит-экономика" },
  { id: "philosopher",   label: "Философ",       icon: "Brain",        color: "hsl(270,60%,52%)", bg: "hsl(270,60%,95%)", hint: "Смыслы, этика, стратегическое мышление" },
  { id: "programmer",    label: "Программист",   icon: "Code2",        color: "hsl(185,85%,32%)", bg: "hsl(185,85%,93%)", hint: "Код, архитектура, алгоритмы, AI" },
  { id: "businessman",   label: "Бизнесмен",     icon: "Briefcase",    color: "hsl(25,90%,45%)",  bg: "hsl(25,90%,94%)",  hint: "Рост, переговоры, команда, стратегия" },
  { id: "psychologist",  label: "Психолог",      icon: "HeartHandshake", color: "hsl(350,65%,48%)", bg: "hsl(350,65%,95%)", hint: "Поведение, мотивация, эмоции, отношения" },
  { id: "screenwriter",  label: "Сценарист",     icon: "Film",         color: "hsl(45,90%,40%)",  bg: "hsl(45,90%,94%)",  hint: "Сценарии, истории, драматургия, видео" },
  { id: "politician",    label: "Политик",       icon: "Landmark",     color: "hsl(200,70%,38%)", bg: "hsl(200,70%,94%)", hint: "Стратегия, влияние, переговоры, риторика" },
  { id: "lawyer",        label: "Юрист",         icon: "Scale",        color: "hsl(240,50%,45%)", bg: "hsl(240,50%,95%)", hint: "Право, договоры, риски, защита интересов" },
];

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const role = ROLES.find(r => r.id === msg.roleId);

  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: isUser ? ACCENT : (role?.bg ?? "#f0f0ed"),
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={isUser ? "User" : (role?.icon ?? "Bot")} size={15} style={{ color: isUser ? "#fff" : (role?.color ?? "#666") }} />
      </div>

      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        {!isUser && role && (
          <div style={{ fontSize: 10, fontWeight: 700, color: role.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {role.label}
          </div>
        )}
        <div style={{
          background: isUser ? ACCENT : "#fff",
          color: isUser ? "#fff" : "#0F172A",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          border: isUser ? "none" : "1px solid #E8ECF0",
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

function RoleSelector({ active, onChange }: { active: RoleId; onChange: (id: RoleId) => void }) {
  const role = ROLES.find(r => r.id === active)!;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {ROLES.map(r => {
          const isActive = r.id === active;
          return (
            <button
              key={r.id}
              onClick={() => onChange(r.id)}
              title={r.hint}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 13px", borderRadius: 10,
                border: `1.5px solid ${isActive ? r.color : "#E8ECF0"}`,
                background: isActive ? r.bg : "#fff",
                color: isActive ? r.color : "#64748B",
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                transition: "all 0.18s",
              }}
            >
              <Icon name={r.icon} size={13} style={{ color: isActive ? r.color : "#94A3B8" }} />
              {r.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: role.color, flexShrink: 0 }} />
        {role.label} — {role.hint}
      </div>
    </div>
  );
}

export function AISection() {
  const [role, setRole] = useState<RoleId>("marketer");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadHistory = (): Message[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const [messages, setMessages] = useState<Message[]>(loadHistory);

  const saveHistory = (msgs: Message[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content, roleId: role };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ADMIN_TOKEN, role, messages: apiMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");

      const aiMsg: Message = { role: "assistant", content: data.reply, roleId: role };
      const withAi = [...newMessages, aiMsg];
      setMessages(withAi);
      saveHistory(withAi);
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
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); return; }
    setMessages([]);
    saveHistory([]);
    setError("");
    setConfirmClear(false);
  }

  const currentRole = ROLES.find(r => r.id === role)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 500 }}>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: currentRole.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            <Icon name={currentRole.icon} size={18} style={{ color: currentRole.color }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>ИИ-ассистент PRO</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>GPT-4.1 · История сохраняется · {messages.length} сообщений</div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 8,
              border: confirmClear ? "1.5px solid #ef4444" : "1.5px solid #E2E8F0",
              background: confirmClear ? "#fef2f2" : "#fff",
              color: confirmClear ? "#ef4444" : "#999",
              fontSize: 13, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.2s",
            }}
          >
            <Icon name="Trash2" size={13} />
            {confirmClear ? "Точно удалить?" : "Удалить переписку"}
          </button>
        )}
      </div>

      {/* Переключатель ролей */}
      <RoleSelector active={role} onChange={setRole} />

      {/* Область сообщений */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        background: "#fff", borderRadius: 16,
        border: "1px solid #E8ECF0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: currentRole.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name={currentRole.icon} size={26} style={{ color: currentRole.color }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Готов к работе как {currentRole.label}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", maxWidth: 340, margin: "0 auto" }}>{currentRole.hint}</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: currentRole.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={currentRole.icon} size={15} style={{ color: currentRole.color }} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: currentRole.color, opacity: 0.5, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
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
          placeholder={`Спросите ${currentRole.label.toLowerCase()}а... (Enter — отправить, Shift+Enter — перенос)`}
          rows={2}
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 12,
            border: "1.5px solid #E2E8F0", fontSize: 14,
            fontFamily: "Montserrat, sans-serif", resize: "none",
            outline: "none", lineHeight: 1.5,
            background: "#fff", color: "#0F172A",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = currentRole.color)}
          onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            width: 48, height: 48, borderRadius: 12,
            border: "none",
            background: !input.trim() || loading ? "#E2E8F0" : currentRole.color,
            color: "#fff",
            cursor: !input.trim() || loading ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          <Icon name="Send" size={18} />
        </button>
      </div>

      <div style={{ marginTop: 6, fontSize: 11, color: "#CBD5E1", textAlign: "center" }}>
        Shift+Enter — перенос строки · История сохраняется при смене роли
      </div>
    </div>
  );
}