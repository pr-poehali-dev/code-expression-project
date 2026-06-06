import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import { renderMarkdown } from "@/utils/markdown";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const ACCENT_LIGHT = "hsl(185,85%,95%)";

const MSG_AI_URL = "https://functions.poehali.dev/37688739-4c90-4dce-b0f3-631513d8e919";
const MSG_SVC_URL = "https://functions.poehali.dev/f30db617-e2c9-461d-aafc-9e585992eb0c";

function sid() { return localStorage.getItem("lk_session") || ""; }

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff",
  boxSizing: "border-box", color: "#0F172A", outline: "none",
};

const MSG_TYPES = [
  { id: "appointment_reminder", icon: "CalendarCheck", label: "Напоминание о записи",    color: "hsl(185,85%,32%)",  bg: "hsl(185,85%,95%)",  fields: ["client_name", "date_time", "service"] },
  { id: "win_back",             icon: "UserCheck",     label: "Вернуть клиента",          color: "hsl(280,60%,55%)",  bg: "hsl(280,60%,96%)",  fields: ["client_name", "service"] },
  { id: "new_service",          icon: "Sparkles",      label: "Новая услуга / акция",     color: "hsl(40,90%,50%)",   bg: "hsl(40,90%,96%)",   fields: ["client_name", "service"] },
  { id: "birthday",             icon: "Gift",          label: "День рождения",            color: "hsl(340,80%,55%)",  bg: "hsl(340,80%,96%)",  fields: ["client_name"] },
  { id: "review_request",       icon: "Star",          label: "Попросить отзыв",          color: "hsl(45,95%,50%)",   bg: "hsl(45,95%,96%)",   fields: ["client_name", "service"] },
  { id: "seasonal",             icon: "Sun",           label: "Сезонное предложение",     color: "hsl(145,60%,40%)",  bg: "hsl(145,60%,95%)",  fields: ["client_name", "service"] },
];

const TONE_OPTIONS = ["Тёплый и дружелюбный", "Профессиональный", "Лёгкий и неформальный", "Заботливый"];

interface Service { id: number; name: string; }

export default function LkClientMsg() {
  const { user } = useLkAuth();
  const { refresh: refreshEnergy } = useEnergy();
  const hasSalon = !!user?.salon_id;

  const [tab, setTab] = useState<"generate" | "services">("generate");
  const getInitialMsgType = () => {
    const saved = sessionStorage.getItem("clientmsg_type");
    if (saved) { sessionStorage.removeItem("clientmsg_type"); return saved; }
    return MSG_TYPES[0].id;
  };

  // Услуги
  const [services, setServices] = useState<Service[]>([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [newSvc, setNewSvc] = useState("");
  const [svcSaving, setSvcSaving] = useState(false);

  // Генератор
  const [msgType, setMsgType] = useState(getInitialMsgType);
  const [clientName, setClientName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [extra, setExtra] = useState("");

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [genError, setGenError] = useState("");

  const activeMsgType = MSG_TYPES.find(t => t.id === msgType)!;
  const showDatetime = activeMsgType.fields.includes("date_time");
  const showService  = activeMsgType.fields.includes("service");

  useEffect(() => {
    if (!hasSalon) return;
    fetch(MSG_SVC_URL, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => setServices(d.services || []))
      .finally(() => setSvcLoading(false));
  }, [hasSalon]);

  async function addService() {
    if (!newSvc.trim()) return;
    setSvcSaving(true);
    const res = await fetch(MSG_SVC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ name: newSvc.trim() }),
    });
    const data = await res.json();
    if (data.id) {
      setServices(prev => [...prev, { id: data.id, name: data.name }]);
      setNewSvc("");
    }
    setSvcSaving(false);
  }

  async function removeService(id: number) {
    await fetch(`${MSG_SVC_URL}?action=delete&id=${id}`, { method: "POST", headers: { "X-Session-Id": sid() } });
    setServices(prev => prev.filter(s => s.id !== id));
    if (service === String(id)) setService("");
  }

  async function generate() {
    setGenError(""); setResult("");
    setGenerating(true);
    try {
      const finalService = service === "__custom" ? customService : (services.find(s => String(s.id) === service)?.name || service);
      const res = await fetch(MSG_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          msg_type: msgType,
          client_name: clientName,
          date_time: dateTime,
          service: finalService,
          tone,
          extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setResult(data.text);
      refreshEnergy();
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setGenerating(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!hasSalon) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 340, gap: 14, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="MessageSquare" size={28} style={{ color: ACCENT }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>Заполните профиль салона</div>
        <div style={{ fontSize: 13, color: "#888", maxWidth: 320, lineHeight: 1.6 }}>
          Для генератора сообщений нужно привязать салон — ИИ будет писать от его имени.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>ИИ-инструмент · бесплатно</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Сообщения клиентам</h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
          Персональные тексты для WhatsApp и Telegram — каждый раз уникальные, живые, без шаблонных фраз.
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(145,60%,96%)", borderRadius: 12, border: "1px solid hsl(145,60%,85%)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Почему это работает лучше, чем писать самому</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
            Клиенты чувствуют, когда сообщение написано наспех или скопировано из шаблона — и просто не отвечают. ИИ каждый раз составляет живой, персональный текст под конкретную ситуацию: запись, напоминание, возврат ушедшего клиента. Это повышает открываемость и отклик без затрат времени мастера. Инструмент полностью бесплатный — пользуйтесь без ограничений.
          </div>
        </div>
      </div>

      {/* Переключатель вкладок */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#F1F5F9", borderRadius: 10, padding: 4 }}>
        {[
          { id: "generate", label: "Генератор", icon: "Wand2" },
          { id: "services", label: "Мои услуги", icon: "List" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as "generate" | "services")} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 12px", borderRadius: 8, border: "none",
            background: tab === t.id ? "#fff" : "transparent",
            color: tab === t.id ? ACCENT : "#64748B",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "Montserrat,sans-serif",
            boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ ВКЛАДКА: Генератор ═══ */}
      {tab === "generate" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Тип сообщения */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Тип сообщения</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 }}>
              {MSG_TYPES.map(t => (
                <button key={t.id} onClick={() => { setMsgType(t.id); setResult(""); }} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "10px 12px", borderRadius: 10, border: "1.5px solid",
                  borderColor: msgType === t.id ? t.color : "#E2E8F0",
                  background: msgType === t.id ? t.bg : "#FAFAFA",
                  cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                  transition: "all 0.15s",
                }}>
                  <Icon name={t.icon} size={16} style={{ color: msgType === t.id ? t.color : "#94A3B8", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: msgType === t.id ? t.color : "#334155", textAlign: "left", lineHeight: 1.3 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Параметры */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Данные</div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Имя клиента</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Мария" style={inp} />
            </div>

            {showDatetime && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Дата и время записи</label>
                <input value={dateTime} onChange={e => setDateTime(e.target.value)} placeholder="Завтра в 15:00, среда 14 июня в 12:30..." style={inp} />
              </div>
            )}

            {showService && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Услуга</label>
                {services.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <select value={service} onChange={e => setService(e.target.value)} style={{ ...inp, appearance: "none" }}>
                      <option value="">— Выберите услугу —</option>
                      {services.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                      <option value="__custom">Ввести вручную...</option>
                    </select>
                    {service === "__custom" && (
                      <input value={customService} onChange={e => setCustomService(e.target.value)} placeholder="Название услуги" style={inp} />
                    )}
                  </div>
                ) : (
                  <input value={customService} onChange={e => setCustomService(e.target.value)} placeholder="Стрижка, маникюр, окрашивание..." style={inp} />
                )}
                {services.length === 0 && !svcLoading && (
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
                    Добавьте услуги в разделе «Мои услуги» — тогда можно выбирать из списка
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Тон общения</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TONE_OPTIONS.map(t => (
                  <button key={t} onClick={() => setTone(t)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "1.5px solid",
                    borderColor: tone === t ? ACCENT : "#E2E8F0",
                    background: tone === t ? ACCENT_LIGHT : "#FAFAFA",
                    color: tone === t ? ACCENT : "#64748B",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "Montserrat,sans-serif",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>
                Дополнительно <span style={{ fontWeight: 400, color: "#94A3B8" }}>(необязательно)</span>
              </label>
              <input value={extra} onChange={e => setExtra(e.target.value)} placeholder="Скидка 15%, приходите с подругой, новый мастер..." style={inp} />
            </div>
          </div>

          {/* Кнопка генерации */}
          <button onClick={generate} disabled={generating} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "13px 28px", borderRadius: 12, border: "none",
            background: generating ? "#CBD5E1" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: generating ? "default" : "pointer",
            fontFamily: "Montserrat,sans-serif", transition: "all 0.2s",
          }}>
            {generating
              ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} />Генерирую...</>
              : <><Icon name="Wand2" size={16} />Сгенерировать сообщение</>
            }
          </button>

          {/* Ошибка */}
          {genError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="AlertCircle" size={15} />
              {genError}
            </div>
          )}

          {/* Результат */}
          {result && (
            <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${ACCENT}40`, overflow: "hidden" }}>
              <div style={{ background: ACCENT_LIGHT, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: ACCENT }}>
                  <Icon name="MessageSquare" size={14} />
                  Готово — скопируйте и отправьте клиенту
                </div>
                <button onClick={() => generate()} style={{ fontSize: 11, fontWeight: 600, color: ACCENT, background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="RefreshCw" size={12} />
                  Ещё вариант — бесплатно
                </button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.75, wordBreak: "break-word", marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
                <button onClick={copy} style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 20px", borderRadius: 9, border: "none",
                  background: copied ? "hsl(145,60%,40%)" : ACCENT,
                  color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Montserrat,sans-serif", transition: "background 0.2s",
                }}>
                  <Icon name={copied ? "Check" : "Copy"} size={14} />
                  {copied ? "Скопировано!" : "Скопировать"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ВКЛАДКА: Мои услуги ═══ */}
      {tab === "services" && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Список услуг салона</div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.6 }}>
            Добавьте услуги один раз — потом выбирайте из списка при генерации сообщений.
          </div>

          {/* Добавить */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              value={newSvc}
              onChange={e => setNewSvc(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addService()}
              placeholder="Стрижка, маникюр, ламинирование..."
              style={{ ...inp, flex: 1 }}
            />
            <button onClick={addService} disabled={svcSaving || !newSvc.trim()} style={{
              padding: "10px 18px", borderRadius: 10, border: "none",
              background: !newSvc.trim() ? "#E2E8F0" : ACCENT,
              color: !newSvc.trim() ? "#94A3B8" : "#fff",
              fontSize: 13, fontWeight: 700, cursor: !newSvc.trim() ? "default" : "pointer",
              fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap",
            }}>
              {svcSaving ? "..." : "Добавить"}
            </button>
          </div>

          {/* Список */}
          {svcLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#94A3B8", fontSize: 13 }}>Загружаю...</div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#94A3B8", fontSize: 13 }}>
              Услуг пока нет — добавьте первую
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {services.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="Scissors" size={13} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>{s.name}</span>
                  </div>
                  <button onClick={() => removeService(s.id)} style={{ padding: "4px 8px", borderRadius: 7, border: "none", background: "none", cursor: "pointer", color: "#CBD5E1", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#CBD5E1")}
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}