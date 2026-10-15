import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import MessageBubble from "./admin-ai/MessageBubble";
import RoleSelector from "./admin-ai/RoleSelector";
import { AI_URL, ADMIN_TOKEN, STORAGE_KEY, Message, RoleId, ModelId, MODELS, ROLES } from "./admin-ai/shared";

export function AISection() {
  const [role, setRole] = useState<RoleId>("marketer");
  const [model, setModel] = useState<ModelId>("gpt-4.1");
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

    // Маркетолог с инструментами (посты блога/Вордстат) может отвечать дольше обычного —
    // даём запросу до 170с (чуть меньше таймаута бэкенда в 180с), чтобы браузер не обрывал
    // соединение раньше сервера и не показывал голый "Failed to fetch".
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 170_000);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ADMIN_TOKEN, role, model, messages: apiMessages }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");

      const aiMsg: Message = { role: "assistant", content: data.reply, roleId: role };
      const withAi = [...newMessages, aiMsg];
      setMessages(withAi);
      saveHistory(withAi);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setError("ИИ отвечает слишком долго (>170с). Попробуйте сузить запрос — например, попросите объявления по меньшему числу постов.");
      } else if (e instanceof TypeError) {
        setError("Не удалось связаться с сервером — проверьте интернет-соединение и попробуйте ещё раз.");
      } else {
        setError(e instanceof Error ? e.message : "Не удалось получить ответ");
      }
    } finally {
      clearTimeout(timeoutId);
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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", minHeight: 700 }}>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: currentRole.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            <Icon name={currentRole.icon} size={18} style={{ color: currentRole.color }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>ИИ-ассистент PRO</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{MODELS.find(m => m.id === model)?.label} · История сохраняется · {messages.length} сообщений</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", padding: 3, borderRadius: 9, background: "#F1F5F9", border: "1px solid #E8ECF0" }}>
            {MODELS.map(m => {
              const isActive = m.id === model;
              return (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  title={m.hint}
                  style={{
                    padding: "6px 13px", borderRadius: 7, border: "none",
                    background: isActive ? "#fff" : "transparent",
                    color: isActive ? "#0F172A" : "#94A3B8",
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                    boxShadow: isActive ? "0 1px 3px rgba(15,23,42,0.1)" : "none",
                    transition: "all 0.18s",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
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
