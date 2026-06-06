import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const AGENT_URL = "https://functions.poehali.dev/40feaf4c-2193-430d-98ae-16712a91feb4";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
const FREE_LIMIT = 10;
const ENERGY_PER_MSG = 10;

type AgentRole = "business" | "service" | "admin" | "marketer";

interface AgentConfig {
  id: AgentRole;
  label: string;
  icon: string;
  color: string;
  bg: string;
  borderColor: string;
  hint: string;
  welcome: string;
}

const AGENTS: AgentConfig[] = [
  { id: "business", label: "Бизнес-ассистент",  icon: "Briefcase",      color: "#1e40af", bg: "#eff6ff", borderColor: "#bfdbfe", hint: "Стратегия, финансы, управление командой", welcome: "Здравствуйте! Я ваш бизнес-ассистент.\n\nПомогу с финансовыми расчётами, стратегией развития, управлением командой и операционными вопросами. Что обсудим?" },
  { id: "service",  label: "Эксперт по сервису", icon: "HeartHandshake", color: "#065f46", bg: "#ecfdf5", borderColor: "#a7f3d0", hint: "Техники, работа с клиентами, протоколы",  welcome: "Добро пожаловать! Я эксперт по телесным практикам и сервису.\n\nРазберём любой клиентский случай, подберём технику, помогу с коммуникацией. Расскажите о задаче." },
  { id: "admin",    label: "Администратор",       icon: "PhoneCall",      color: "#92400e", bg: "#fffbeb", borderColor: "#fde68a", hint: "Скрипты, ответы клиентам, отзывы",        welcome: "Привет! Я помощник администратора.\n\nНапишу скрипт для звонка, ответ на отзыв или сообщение клиенту — готовое, чтобы сразу использовать. Что нужно?" },
  { id: "marketer", label: "Маркетолог",          icon: "Megaphone",      color: "#6d28d9", bg: "#f5f3ff", borderColor: "#ddd6fe", hint: "Контент, акции, продвижение, реклама",    welcome: "Привет! Я маркетолог вашего салона.\n\nПомогу с постами, акциями, настройкой рекламы и удержанием клиентов. С чего начнём?" },
];

const PACKAGES = [
  { code: "start",    name: "Старт",   price: 990,  energy: 150,  msgs: 15  },
  { code: "business", name: "Бизнес",  price: 2990, energy: 550,  msgs: 55, popular: true },
  { code: "growth",   name: "Рост",    price: 4990, energy: 1200, msgs: 120 },
  { code: "premium",  name: "Премиум", price: 9990, energy: 3000, msgs: 300 },
];

interface Message { role: "user" | "assistant"; content: string; }

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
}

function MessageBubble({ msg, agent }: { msg: Message; agent: AgentConfig }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: isUser ? "#0F172A" : agent.bg, border: `1.5px solid ${isUser ? "transparent" : agent.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={isUser ? "User" : agent.icon} size={15} style={{ color: isUser ? "#fff" : agent.color }} />
      </div>
      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        <div style={{ background: isUser ? "#0F172A" : "#fff", color: isUser ? "#fff" : "#0F172A", borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", border: isUser ? "none" : "1px solid #E8ECF0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {msg.content}
        </div>
        {!isUser && (
          <button onClick={() => copyToClipboard(msg.content, setCopied)} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, padding: "4px 10px", background: copied ? `${agent.color}15` : "transparent", border: `1px solid ${copied ? agent.color : "#e0e0da"}`, borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, color: copied ? agent.color : "#999", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s" }}>
            <Icon name={copied ? "Check" : "Copy"} size={12} />
            {copied ? "Скопировано!" : "Скопировать"}
          </button>
        )}
      </div>
    </div>
  );
}

function PaywallModal({ onClose, energyBalance, onNavigateShop }: { onClose: () => void; energyBalance: number; onNavigateShop: () => void }) {
  const [paying, setPaying] = useState<string | null>(null);
  const sessionId = localStorage.getItem("lk_session") || "";

  async function buyPackage(code: string) {
    setPaying(code);
    try {
      const res = await fetch(`${LK_URL}?action=payment_create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ package_code: code, return_url: window.location.href, enable_autopay: false, threshold: 50 }),
      });
      const data = await res.json();
      if (data.confirmation_url) { window.location.href = data.confirmation_url; }
      else { alert(data.error || "Ошибка создания платежа"); }
    } catch { alert("Не удалось подключиться к платёжной системе"); }
    finally { setPaying(null); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", maxWidth: 520, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5 }}>Бесплатные сообщения закончились</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>1 сообщение = {ENERGY_PER_MSG} ⚡ · Баланс: {energyBalance} ⚡</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}><Icon name="X" size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {PACKAGES.map(pkg => (
            <button key={pkg.code} onClick={() => buyPackage(pkg.code)} disabled={!!paying} style={{ position: "relative", padding: "16px 14px", borderRadius: 14, border: pkg.popular ? "2px solid #6d28d9" : "1.5px solid #E8ECF0", background: pkg.popular ? "#f5f3ff" : "#fff", cursor: paying ? "default" : "pointer", textAlign: "left", fontFamily: "Montserrat, sans-serif", transition: "all 0.15s", opacity: paying && paying !== pkg.code ? 0.6 : 1 }}>
              {pkg.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#6d28d9", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>ПОПУЛЯРНЫЙ</div>}
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>{pkg.name}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: pkg.popular ? "#6d28d9" : "#0F172A" }}>{pkg.price.toLocaleString("ru")} ₽</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{pkg.energy} ⚡ · ~{pkg.msgs} сообщений</div>
              {paying === pkg.code && <div style={{ marginTop: 6, fontSize: 11, color: "#6d28d9" }}>Переход к оплате...</div>}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onNavigateShop} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #E8ECF0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Раздел «Энергия»</button>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "#0F172A", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Назад к диалогу</button>
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#CBD5E1", textAlign: "center" }}>Оплата картой, СБП, ЮMoney через ЮКассу</div>
      </div>
    </div>
  );
}

function FreeUsageBar({ used, limit, energyBalance, onPaywall }: { used: number; limit: number; energyBalance: number; onPaywall: () => void }) {
  const remaining = limit - used;
  const isPaid = used >= limit;
  const pct = Math.min(100, (used / limit) * 100);

  if (isPaid) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 12 }}>
        <Icon name="Zap" size={14} style={{ color: "#f59e0b" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{energyBalance} ⚡</span>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>баланс · {ENERGY_PER_MSG} ⚡ / сообщение</span>
        {energyBalance < ENERGY_PER_MSG && (
          <button onClick={onPaywall} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}>
            Пополнить ⚡
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 16px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="Gift" size={13} style={{ color: "#22c55e" }} />
          Бесплатный период
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: remaining <= 3 ? "#ef4444" : "#0F172A" }}>
          осталось {remaining} из {limit}
        </span>
      </div>
      <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: remaining <= 3 ? "#ef4444" : "#22c55e", borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      {remaining <= 3 && <div style={{ marginTop: 5, fontSize: 11, color: "#ef4444", fontWeight: 600 }}>Осталось мало — пополните баланс заранее</div>}
    </div>
  );
}

export default function SalonAIAgent({ onNavigateShop }: { onNavigateShop?: () => void }) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";

  const [activeAgent, setActiveAgent] = useState<AgentRole>("business");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [energyBalance, setEnergyBalance] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const agent = AGENTS.find(a => a.id === activeAgent)!;

  const loadHistory = useCallback(async (role: AgentRole) => {
    setHistoryLoading(true);
    setError("");
    try {
      const res = await fetch(`${AGENT_URL}?agent_role=${role}`, { headers: { "X-Session-Id": sessionId } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
      setMessages(data.messages || []);
      setFreeUsed(data.free_used ?? 0);
      setEnergyBalance(data.energy_balance ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить историю");
    } finally { setHistoryLoading(false); }
  }, [sessionId]);

  useEffect(() => { loadHistory(activeAgent); }, [activeAgent, loadHistory]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;
    setMessages(prev => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AGENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ agent_role: activeAgent, message: content }),
      });
      const data = await res.json();
      if (data.error === "no_energy") {
        setMessages(prev => prev.slice(0, -1));
        setInput(content);
        setFreeUsed(data.free_used ?? freeUsed);
        setEnergyBalance(data.energy_balance ?? energyBalance);
        setShowPaywall(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      setFreeUsed(data.free_used ?? freeUsed);
      setEnergyBalance(data.energy_balance ?? energyBalance);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось получить ответ");
      setMessages(prev => prev.slice(0, -1));
      setInput(content);
    } finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  async function clearHistory() {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); return; }
    setConfirmClear(false);
    await fetch(`${AGENT_URL}?agent_role=${activeAgent}`, { method: "DELETE", headers: { "X-Session-Id": sessionId } });
    setMessages([]);
    setError("");
  }

  const userName = user?.full_name?.split(" ")[0] || "вас";
  const isPaid = freeUsed >= FREE_LIMIT;
  const canSend = isPaid ? energyBalance >= ENERGY_PER_MSG : true;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          energyBalance={energyBalance}
          onNavigateShop={() => { setShowPaywall(false); onNavigateShop?.(); }}
        />
      )}

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5 }}>ИИ-Агент салона</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Персональный ассистент для вас и команды</div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: confirmClear ? "1.5px solid #ef4444" : "1.5px solid #E2E8F0", background: confirmClear ? "#fef2f2" : "#fff", color: confirmClear ? "#ef4444" : "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s" }}>
            <Icon name="Trash2" size={13} />
            {confirmClear ? "Точно очистить?" : "Очистить"}
          </button>
        )}
      </div>

      {/* Счётчик бесплатных / баланс */}
      <FreeUsageBar used={freeUsed} limit={FREE_LIMIT} energyBalance={energyBalance} onPaywall={() => setShowPaywall(true)} />

      {/* Выбор агента */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {AGENTS.map(a => {
          const isActive = a.id === activeAgent;
          return (
            <button key={a.id} onClick={() => { setActiveAgent(a.id); setError(""); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, textAlign: "left", border: `2px solid ${isActive ? a.color : "#E8ECF0"}`, background: isActive ? a.bg : "#fff", cursor: "pointer", transition: "all 0.18s", boxShadow: isActive ? `0 4px 16px ${a.color}22` : "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: isActive ? `${a.color}18` : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={a.icon} size={18} style={{ color: isActive ? a.color : "#94A3B8" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? a.color : "#0F172A", lineHeight: 1.3 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, lineHeight: 1.4 }}>{a.hint}</div>
              </div>
              {isActive && <div style={{ marginLeft: "auto", flexShrink: 0 }}><Icon name="CheckCircle2" size={16} style={{ color: a.color }} /></div>}
            </button>
          );
        })}
      </div>

      {/* Чат */}
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 480px)", minHeight: 340, background: "#fff", borderRadius: 18, border: `1.5px solid ${agent.borderColor}`, boxShadow: `0 4px 24px ${agent.color}12`, overflow: "hidden" }}>

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

          {!historyLoading && messages.map((msg, i) => <MessageBubble key={i} msg={msg} agent={agent} />)}

          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: agent.bg, border: `1.5px solid ${agent.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={agent.icon} size={15} style={{ color: agent.color }} />
              </div>
              <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: agent.color, opacity: 0.5, animation: `dot-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
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
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Нужно {ENERGY_PER_MSG} ⚡, доступно {energyBalance} ⚡</div>
              </div>
              <button onClick={() => setShowPaywall(true)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#f59e0b", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}>Пополнить</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Напишите ${agent.label.toLowerCase()}у...`}
                rows={2}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${agent.borderColor}`, fontSize: 14, fontFamily: "Montserrat, sans-serif", resize: "none", outline: "none", lineHeight: 1.5, background: "#fff", color: "#0F172A", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = agent.color)}
                onBlur={e => (e.target.style.borderColor = agent.borderColor)}
              />
              <button onClick={send} disabled={!input.trim() || loading} style={{ width: 46, height: 46, borderRadius: 12, border: "none", flexShrink: 0, background: !input.trim() || loading ? "#E2E8F0" : agent.color, color: "#fff", cursor: !input.trim() || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <Icon name="Send" size={17} />
              </button>
            </div>
          )}
          <div style={{ marginTop: 5, fontSize: 10, color: "#CBD5E1", textAlign: "center" }}>
            {canSend ? (isPaid ? `${ENERGY_PER_MSG} ⚡ / сообщение · Enter — отправить` : `Осталось ${FREE_LIMIT - freeUsed} бесплатных · Enter — отправить`) : ""}
          </div>
        </div>
      </div>

      <style>{`@keyframes dot-pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
    </div>
  );
}
