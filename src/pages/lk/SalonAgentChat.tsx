import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { AgentConfig, Message, AttachedFile, FREE_LIMIT } from "./SalonAgentTypes";
import { MessageBubble } from "./SalonAgentWidgets";

interface SalonAgentChatProps {
  agent: AgentConfig;
  messages: Message[];
  loading: boolean;
  historyLoading: boolean;
  error: string;
  input: string;
  setInput: (v: string) => void;
  attachedFile: AttachedFile | null;
  setAttachedFile: (f: AttachedFile | null) => void;
  batchProgress: { current: number; total: number } | null;
  canSend: boolean;
  isPaid: boolean;
  freeUsed: number;
  energyBalance: number;
  userName: string;
  bottomRef: React.RefObject<HTMLDivElement>;
  onSend: () => void;
  onFileAttach: (file: File) => void;
  onOpenPaywall: () => void;
}

export default function SalonAgentChat({
  agent, messages, loading, historyLoading, error,
  input, setInput, attachedFile, setAttachedFile,
  batchProgress, canSend, isPaid, freeUsed, energyBalance,
  userName, bottomRef, onSend, onFileAttach, onOpenPaywall,
}: SalonAgentChatProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 320px)", minHeight: 500, background: "#fff", borderRadius: 18, border: `1.5px solid ${agent.borderColor}`, boxShadow: `0 4px 24px ${agent.color}12`, overflow: "hidden" }}>

      {/* Заголовок чата */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: agent.bg, borderBottom: `1px solid ${agent.borderColor}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${agent.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={agent.icon} size={17} style={{ color: agent.color }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: agent.color }}>{agent.label}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>{agent.hint}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>онлайн</span>
        </div>
      </div>

      {/* Лента сообщений */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
        {historyLoading && <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 13 }}>Загружаю историю...</div>}

        {!historyLoading && messages.length === 0 && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: agent.bg, border: `1.5px solid ${agent.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={agent.icon} size={15} style={{ color: agent.color }} />
            </div>
            <div style={{ maxWidth: "80%" }}>
              <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", color: "#0F172A", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {agent.welcome.replace("вас", userName)}
              </div>
            </div>
          </div>
        )}

        {!historyLoading && messages.map((msg, i) => {
          const prevUser = msg.role === "assistant"
            ? messages.slice(0, i).filter(m => m.role === "user").at(-1)?.content
            : undefined;
          return <MessageBubble key={i} msg={msg} agent={agent} prevUserMsg={prevUser} />;
        })}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: agent.bg, border: `1.5px solid ${agent.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={agent.icon} size={15} style={{ color: agent.color }} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
              {batchProgress ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                    Обработка файла: пакет {batchProgress.current} из {batchProgress.total}
                  </div>
                  <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%`, background: agent.color, borderRadius: 3, transition: "width 0.4s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    {Math.round((batchProgress.current / batchProgress.total) * 100)}% завершено
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: agent.color, opacity: 0.5, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c44", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="AlertCircle" size={14} />{error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${agent.borderColor}`, background: agent.bg }}>
        {!canSend ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 12, border: "1.5px solid #fde68a" }}>
            <Icon name="Zap" size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Недостаточно энергии</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>Доступно {energyBalance} ⚡ — пополните баланс, чтобы продолжить</div>
            </div>
            <button onClick={onOpenPaywall} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#f59e0b", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}>Пополнить</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {attachedFile && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10 }}>
                  <Icon name="FileText" size={14} style={{ color: "#1e40af", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#93c5fd", padding: 2, display: "flex" }}>
                    <Icon name="X" size={13} />
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "6px 10px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8 }}>
                  <Icon name="Info" size={12} style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11, color: "#92400e", lineHeight: 1.5 }}>Если файл большой — разбейте его на части по <b>~1000 строк</b> и отправляйте по очереди. Иначе ИИ может не успеть обработать всё за один раз.</span>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <button
                onClick={() => fileRef.current?.click()}
                title="Прикрепить файл (txt, csv, json, xlsx)"
                style={{ width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${agent.borderColor}`, flexShrink: 0, background: "#fff", color: attachedFile ? agent.color : "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              >
                <Icon name="Paperclip" size={17} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.csv,.json,.xml,.md,.log,.xls,.xlsx,.pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onFileAttach(f); e.target.value = ""; }}
              />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={attachedFile ? "Опишите задачу для файла..." : `Напишите ${agent.label.toLowerCase()}у...`}
                rows={2}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${agent.borderColor}`, fontSize: 14, fontFamily: "Montserrat, sans-serif", resize: "none", outline: "none", lineHeight: 1.5, background: "#fff", color: "#0F172A", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = agent.color)}
                onBlur={e => (e.target.style.borderColor = agent.borderColor)}
              />
              <button onClick={onSend} disabled={(!input.trim() && !attachedFile) || loading} style={{ width: 46, height: 46, borderRadius: 12, border: "none", flexShrink: 0, background: (!input.trim() && !attachedFile) || loading ? "#E2E8F0" : agent.color, color: "#fff", cursor: (!input.trim() && !attachedFile) || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <Icon name="Send" size={17} />
              </button>
            </div>
          </div>
        )}
        <div style={{ marginTop: 5, fontSize: 10, color: "#CBD5E1", textAlign: "center" }}>
          {canSend ? (isPaid ? `Стоимость зависит от сложности запроса · 📎 файлы · Enter — отправить` : `Осталось ${FREE_LIMIT - freeUsed} бесплатных · Enter — отправить`) : ""}
        </div>
      </div>
    </div>
  );
}