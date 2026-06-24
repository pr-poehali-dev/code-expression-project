import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const AI_LANDING_URL = "https://functions.poehali.dev/12df0290-571d-42d1-8fb0-8889ae15cd68";
const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";
const LS_MSGS = "landing_builder_msgs";
const LS_HTML = "landing_builder_html";
const LS_PHASE = "landing_builder_phase";
const LS_TYPE = "landing_builder_type";

type LandingType = "budget" | "premium";
interface Message { role: "user" | "assistant"; content: string; }

const NETLIFY_STEPS = [
  { n: "1", text: "Зайдите на сайт netlify.com и нажмите «Sign up» (бесплатно)" },
  { n: "2", text: "После регистрации откроется раздел Sites — перетащите скачанный HTML-файл прямо в браузер" },
  { n: "3", text: "Через 10 секунд сайт будет онлайн по адресу вида random-name.netlify.app" },
  { n: "4", text: "Чтобы подключить свой домен: Settings → Domain management → Add custom domain" },
];

const BUDGET_FEATURES = [
  "5 блоков: обложка, услуги, преимущества, контакты, футер",
  "Чистый минималистичный дизайн",
  "Один акцентный цвет под тематику",
  "Адаптивная вёрстка под мобильные",
  "Форма обратной связи",
];

const PREMIUM_FEATURES = [
  "7–9 блоков: обложка, о компании, услуги, кейсы, отзывы, цены, FAQ, CTA, футер",
  "Уникальный дизайн: асимметрия, градиенты, анимации",
  "Индивидуальная цветовая палитра и паттерны",
  "Премиальная типографика и кастомные кнопки",
  "Расширенная форма + карта / соцсети / мессенджеры",
];

function session() { return localStorage.getItem("lk_session") || ""; }

function getWelcome(type: LandingType): Message {
  return {
    role: "assistant",
    content: type === "budget"
      ? "Отлично, создаём бюджетный лендинг — лаконичный и современный 👍\n\nРасскажите о бизнесе: название компании и чем занимаетесь?"
      : "Создаём премиальный лендинг — с уникальным дизайном и расширенной структурой ✨\n\nРасскажите о бизнесе: название, чем занимаетесь и кто ваши клиенты?",
  };
}

// ── Экран выбора типа ──
function TypeSelector({ onSelect }: { onSelect: (t: LandingType) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Globe" size={20} style={{ color: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Конструктор лендингов</div>
          <div style={{ fontSize: 13, color: "#888" }}>Выберите тип лендинга — ИИ подберёт дизайн и структуру</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Бюджетный */}
        <button
          onClick={() => onSelect("budget")}
          style={{ textAlign: "left", background: "#fff", border: "2px solid #E8ECF0", borderRadius: 16, padding: 20, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "border-color 0.15s, box-shadow 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${ACCENT}22`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF0"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="FileText" size={20} style={{ color: "#64748B" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: 20 }}>БЮДЖЕТНЫЙ</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Стандартный</div>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 14, lineHeight: 1.5 }}>Чистый, минималистичный. Быстро и по делу.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {BUDGET_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={9} style={{ color: "#64748B" }} />
                </div>
                <span style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "10px 0 0", borderTop: "1px solid #F1F5F9", fontSize: 13, fontWeight: 700, color: "#64748B" }}>
            Выбрать →
          </div>
        </button>

        {/* Премиальный */}
        <button
          onClick={() => onSelect("premium")}
          style={{ textAlign: "left", background: `linear-gradient(135deg, ${ACCENT_LIGHT} 0%, #fff 60%)`, border: `2px solid ${ACCENT}40`, borderRadius: 16, padding: 20, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "border-color 0.15s, box-shadow 0.15s", position: "relative", overflow: "hidden" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${ACCENT}33`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}40`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Sparkles" size={20} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: ACCENT, padding: "4px 10px", borderRadius: 20 }}>ПРЕМИАЛЬНЫЙ</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Премиум</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>Уникальный дизайн, больше блоков, больше деталей.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PREMIUM_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={9} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "10px 0 0", borderTop: `1px solid ${ACCENT}20`, fontSize: 13, fontWeight: 700, color: ACCENT }}>
            Выбрать →
          </div>
        </button>
      </div>

      <style>{`@media(max-width:520px){.landing-type-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default function LkLandingBuilder() {
  const [landingType, setLandingType] = useState<LandingType | null>(() => {
    try { return (localStorage.getItem(LS_TYPE) as LandingType) || null; } catch { return null; }
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const s = localStorage.getItem(LS_MSGS); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"chat" | "generating" | "done">(() => {
    try { return (localStorage.getItem(LS_PHASE) as "chat" | "done") || "chat"; } catch { return "chat"; }
  });
  const [htmlResult, setHtmlResult] = useState(() => {
    try { return localStorage.getItem(LS_HTML) || ""; } catch { return ""; }
  });
  const [showPreview, setShowPreview] = useState(() => {
    try { return !!localStorage.getItem(LS_HTML); } catch { return false; }
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem(LS_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LS_HTML, htmlResult);
    localStorage.setItem(LS_PHASE, phase);
  }, [htmlResult, phase]);

  function selectType(type: LandingType) {
    setLandingType(type);
    localStorage.setItem(LS_TYPE, type);
    const welcome = getWelcome(type);
    setMessages([welcome]);
  }

  function resetChat() {
    localStorage.removeItem(LS_MSGS);
    localStorage.removeItem(LS_HTML);
    localStorage.removeItem(LS_PHASE);
    localStorage.removeItem(LS_TYPE);
    setLandingType(null);
    setMessages([]);
    setInput("");
    setPhase("chat");
    setHtmlResult("");
    setShowPreview(false);
    setLoading(false);
  }

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
        body: JSON.stringify({ messages: newMessages, mode: "chat", landingType }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: "Сервис временно недоступен. Попробуйте через минуту." }]);
        return;
      }
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка соединения. Проверьте интернет и попробуйте ещё раз." }]);
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
        body: JSON.stringify({ messages, mode: "generate", landingType }),
        signal: AbortSignal.timeout(120_000),
      });
      const data = await res.json();
      const html = data.reply || data.html || "";
      if (!html || !html.includes("<!DOCTYPE")) {
        setPhase("chat");
        setMessages(prev => [...prev, { role: "assistant", content: "Не удалось сгенерировать лендинг — попробуйте ещё раз или добавьте больше деталей о бизнесе." }]);
        return;
      }
      setHtmlResult(html);
      setPhase("done");
      setShowPreview(true);
    } catch {
      setPhase("chat");
      setMessages(prev => [...prev, { role: "assistant", content: "Генерация заняла слишком долго. Попробуйте ещё раз — обычно со второй попытки всё работает." }]);
    } finally {
      setLoading(false);
    }
  }

  function openInBrowser() {
    const blob = new Blob([htmlResult], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
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

  // ── Выбор типа ──
  if (!landingType) {
    return <TypeSelector onSelect={selectType} />;
  }

  // ── Генерация / Превью ──
  if (phase === "done" && !htmlResult) setPhase("chat");

  const typeBadge = landingType === "premium"
    ? { label: "Премиум", color: ACCENT, bg: ACCENT_LIGHT }
    : { label: "Стандартный", color: "#64748B", bg: "#F1F5F9" };

  if (phase === "generating" || phase === "done") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Globe" size={20} style={{ color: ACCENT }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Ваш лендинг готов</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: typeBadge.color, background: typeBadge.bg, padding: "3px 9px", borderRadius: 20 }}>{typeBadge.label}</span>
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>
              {htmlResult ? `HTML готов · ${Math.round(htmlResult.length / 1024)} КБ` : "Просмотрите и скачайте HTML-файл"}
            </div>
          </div>
        </div>

        {phase === "generating" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 40, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: `3px solid ${ACCENT_LIGHT}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>ИИ создаёт {landingType === "premium" ? "премиальный" : "стандартный"} лендинг...</div>
            <div style={{ fontSize: 13, color: "#888" }}>{landingType === "premium" ? "Премиум занимает немного дольше — до 60 секунд" : "Обычно занимает 15–30 секунд"}</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {phase === "done" && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={openInBrowser} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="ExternalLink" size={16} />
                Открыть в браузере
              </button>
              <button onClick={downloadHtml} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="Download" size={16} />
                Скачать HTML
              </button>
              <button onClick={() => setShowPreview(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "1.5px solid #E8ECF0", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name={showPreview ? "EyeOff" : "Eye"} size={16} />
                {showPreview ? "Скрыть превью" : "Мини-превью"}
              </button>
              <button onClick={resetChat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "1.5px solid #E8ECF0", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="RefreshCw" size={15} />
                Создать заново
              </button>
            </div>

            {showPreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #E8ECF0", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                <div style={{ background: "#F1F5F9", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#888" }}>Предварительный просмотр</div>
                </div>
                <iframe srcDoc={htmlResult} style={{ width: "100%", height: 600, border: "none", display: "block" }} title="Превью лендинга" />
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0" }}>
              <button onClick={() => setShowInstructions(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
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
                  <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "9px 18px", borderRadius: 8, background: ACCENT_LIGHT, color: ACCENT, fontSize: 13, fontWeight: 700, textDecoration: "none", border: `1px solid ${ACCENT}30` }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Globe" size={20} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Конструктор лендингов</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: typeBadge.color, background: typeBadge.bg, padding: "3px 9px", borderRadius: 20 }}>{typeBadge.label}</span>
          </div>
          <div style={{ fontSize: 13, color: "#888" }}>Расскажите о бизнесе — ИИ создаст готовый сайт</div>
        </div>
        <button
          onClick={resetChat}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#888", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
        >
          <Icon name="RotateCcw" size={12} />
          Начать заново
        </button>
      </div>

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
            style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: input.trim() && !loading ? ACCENT : "#E8ECF0", color: input.trim() && !loading ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "background 0.15s" }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>

      {isReadyToGenerate && (
        <button
          onClick={generateLanding}
          disabled={loading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px 24px", borderRadius: 14, border: "none", background: loading ? "#E8ECF0" : `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,26%) 100%)`, color: loading ? "#aaa" : "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : `0 4px 16px ${ACCENT}44` }}
        >
          <Icon name={landingType === "premium" ? "Sparkles" : "Wand2"} size={18} />
          {landingType === "premium" ? "Создать премиальный лендинг" : "Создать лендинг"}
        </button>
      )}

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
