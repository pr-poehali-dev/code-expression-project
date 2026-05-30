import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,95%)";
const REP_AI_URL = "https://functions.poehali.dev/5659445e-489a-411e-9e90-4bb21904624d";
const REP_MAIL_URL = "https://functions.poehali.dev/df48bb51-d4fb-4584-b725-423c7c731624";
const SITE = "https://docdialog.ru";

type Tab = "ai" | "tariffs" | "mail";

interface Message { role: "user" | "assistant"; content: string; }

// ─── Данные тарифов ───────────────────────────────────────────────────────────

const SALON_TARIFFS = [
  {
    name: "Стандарт",
    price: "190 000 ₽",
    period: "6 месяцев · до 5 сотрудников",
    url: `${SITE}/dlya-salonov/formats`,
    color: "hsl(185,85%,32%)",
    features: [
      "Обучение персонала (мышление, коммуникация, диагностика тела)",
      "Протоколы удержания клиента и повторной записи",
      "PDF-материалы, скрипты, стандарты коммуникации",
    ],
    result: "Больше повторных записей, доверие клиентов, рост рекомендаций",
  },
  {
    name: "Премиум салон",
    price: "490 000 ₽",
    period: "12 месяцев · до 15 сотрудников · 4 онлайн-встречи",
    url: `${SITE}/dlya-salonov/formats`,
    color: "hsl(280,60%,45%)",
    features: [
      "Всё из «Стандарта»",
      "Онлайн-диагностика клиента, анализ мышления специалиста",
      "Конструктор ведения клиента, карта диагностики тела",
      "4 стратегические онлайн-встречи с командой",
    ],
    result: "Рост среднего чека, единая система работы, сильная команда",
  },
  {
    name: "Dok Диалог Business",
    price: "от 1 200 000 ₽",
    period: "Индивидуально · 6–12 очных встреч",
    url: `${SITE}/dlya-salonov/formats`,
    color: "hsl(38,80%,38%)",
    features: [
      "Полное внедрение системы с нуля",
      "Обучение + диагностика всей команды",
      "Безлимитный доступ к платформе навсегда",
      "Индивидуальная настройка под бренд, личная поддержка руководителя",
    ],
    result: "Сильный бренд, стабильная база клиентов, выход в премиум-сегмент",
  },
];

const EXTRA_SERVICES = [
  { name: "Аудит салона", price: "от 50 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Обучение администраторов", price: "от 90 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Настройка позиционирования", price: "от 150 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Корпоративный доступ к платформе", price: "от 39 000 ₽ / мес", url: `${SITE}/dlya-salonov` },
];

const USEFUL_LINKS = [
  { label: "Страница для салонов", url: `${SITE}/dlya-salonov` },
  { label: "Форматы внедрения", url: `${SITE}/dlya-salonov/formats` },
  { label: "Диагностика роста салона", url: `${SITE}/diagnostika-salona` },
  { label: "5 шагов к премиум-сервису", url: `${SITE}/dlya-salonov/5-shagov` },
  { label: "Отзывы клиентов", url: `${SITE}/reviews` },
  { label: "Главная страница", url: SITE },
];

// ─── Email-шаблоны ────────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
  {
    id: "intro",
    label: "Знакомство с платформой",
    subject: "Dok Диалог — платформа для роста вашего салона",
    body: `<p>Хочу познакомить вас с платформой <strong>Dok Диалог</strong> — образовательной системой, которая помогает салонам красоты выстроить сильную команду, повысить средний чек и удержать клиентов.</p>

<p>Мы работаем с владельцами и управляющими салонов, которые хотят:</p>
<ul>
  <li>Сократить текучку мастеров и стандартизировать сервис</li>
  <li>Увеличить процент повторных записей</li>
  <li>Выйти в премиум-сегмент без роста рекламного бюджета</li>
</ul>

<p>Хочу предложить вам <strong>формат «Стандарт»</strong> — оптимальный старт для салонов до 5 мастеров:</p>
<ul>
  <li>Обучение персонала: мышление, коммуникация, диагностика клиента</li>
  <li>Готовые скрипты и стандарты работы</li>
  <li>Протоколы удержания и повторной записи</li>
</ul>

<p>Стоимость: <strong>190 000 ₽</strong> · доступ 6 месяцев.</p>

<p>Готов ответить на любые вопросы и провести онлайн-презентацию в удобное для вас время.</p>`,
  },
  {
    id: "premium",
    label: "Предложение Премиум",
    subject: "Dok Диалог — Премиум салон: система роста для вашей команды",
    body: `<p>Хочу представить вам формат <strong>«Премиум салон»</strong> от платформы Dok Диалог — это полная система обучения и стандартизации для салонов с командой до 15 мастеров.</p>

<p><strong>Что входит:</strong></p>
<ul>
  <li>12 месяцев доступа к обучающим модулям для всей команды</li>
  <li>Онлайн-диагностика клиента и анализ мышления каждого специалиста</li>
  <li>Конструктор ведения клиента и карта диагностики тела</li>
  <li>4 стратегические онлайн-встречи с вашей командой</li>
  <li>Единые стандарты коммуникации и сервиса</li>
</ul>

<p><strong>Результаты клиентов:</strong> рост среднего чека, снижение текучки мастеров, стабильная база постоянных клиентов.</p>

<p>Стоимость: <strong>490 000 ₽</strong> · до 15 сотрудников · 12 месяцев.</p>

<p>Предлагаю договориться об онлайн-встрече, чтобы показать платформу и ответить на ваши вопросы.</p>`,
  },
  {
    id: "followup",
    label: "Follow-up после встречи",
    subject: "Рады знакомству — материалы о Dok Диалог",
    body: `<p>Был рад(а) нашему разговору! Как и обещал(а), отправляю материалы о платформе Dok Диалог.</p>

<p>Кратко о том, что мы обсудили:</p>
<ul>
  <li>Платформа помогает выстроить систему обучения и стандарты сервиса в салоне</li>
  <li>Форматы — от «Стандарт» (190 000 ₽) до «Business» (от 1 200 000 ₽) под любой масштаб</li>
  <li>Результат видим уже в первые месяцы: рост повторных записей и среднего чека</li>
</ul>

<p>Предлагаю следующий шаг: <strong>бесплатный аудит вашего салона</strong> — я подготовлю персональные рекомендации по точкам роста.</p>

<p>Напишите, когда вам удобно созвониться — я подстроюсь под ваше расписание.</p>`,
  },
];

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function copyText(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

function CopyBtn({ text, label = "Скопировать" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => copyText(text, setCopied)} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 7,
      border: `1px solid ${copied ? ACCENT : "#e0e0da"}`,
      background: copied ? ACCENT_LIGHT : "transparent",
      color: copied ? ACCENT : "#999",
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
    }}>
      <Icon name={copied ? "Check" : "Copy"} size={12} />
      {copied ? "Скопировано!" : label}
    </button>
  );
}

// ─── Вкладка: Тарифы ─────────────────────────────────────────────────────────

function TariffsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Тарифы для салонов</h2>

      {SALON_TARIFFS.map(t => (
        <div key={t.name} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ background: t.color, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{t.period}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>{t.price}</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <ul style={{ margin: "0 0 12px", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {t.features.map(f => (
                <li key={f} style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{f}</li>
              ))}
            </ul>
            <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#666", marginBottom: 14 }}>
              <strong>Результат:</strong> {t.result}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <a href={t.url} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 8,
                background: t.color, color: "#fff",
                fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>
                <Icon name="ExternalLink" size={12} />
                Открыть
              </a>
              <CopyBtn text={t.url} label="Скопировать ссылку" />
              <CopyBtn text={`${t.name} — ${t.price}\n${t.period}\n\n${t.features.join("\n")}\n\nРезультат: ${t.result}\n\nПодробнее: ${t.url}`} label="Скопировать текст" />
            </div>
          </div>
        </div>
      ))}

      {/* Доп. услуги */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", padding: "18px 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 14 }}>Дополнительные услуги</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EXTRA_SERVICES.map(s => (
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 12px", background: "#f8f8f6", borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700, marginTop: 2 }}>{s.price}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "1px solid #e0e0da", background: "#fff", color: "#666", textDecoration: "none" }}>
                  <Icon name="ExternalLink" size={13} />
                </a>
                <CopyBtn text={s.url} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Полезные ссылки */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", padding: "18px 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 14 }}>Полезные ссылки</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {USEFUL_LINKS.map(l => (
            <div key={l.url} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <a href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 600, textDecoration: "underline", textDecorationColor: `${ACCENT}50` }}>
                {l.label}
              </a>
              <CopyBtn text={l.url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Вкладка: Письмо ─────────────────────────────────────────────────────────

function MailTab({ senderName }: { senderName: string }) {
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  function applyTemplate(tpl: typeof EMAIL_TEMPLATES[0]) {
    setSubject(tpl.subject);
    setBodyText(tpl.body);
    setActiveTemplate(tpl.id);
  }

  function textToHtml(text: string): string {
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split("\n\n").map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("\n");
  }

  async function sendMail() {
    if (!toEmail || !subject || !bodyText) { setError("Заполните все обязательные поля"); return; }
    setSending(true); setError(""); setSent(false);
    try {
      const session = localStorage.getItem("lk_session") || "";
      const res = await fetch(REP_MAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({ to_email: toEmail, to_name: toName, subject, body_html: textToHtml(bodyText) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setSentTo(toEmail);
      setSent(true);
      setToEmail(""); setToName(""); setSubject(""); setBodyText(""); setActiveTemplate(null);
      setTimeout(() => setSent(false), 6000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    } finally { setSending(false); }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e8e8e4", fontSize: 14, outline: "none",
    fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
    background: "#fff", color: "#1a1a1a",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Отправить письмо</h2>

      {/* Шаблоны */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 18px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Готовые шаблоны</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EMAIL_TEMPLATES.map(tpl => (
            <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{
              padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
              borderColor: activeTemplate === tpl.id ? ACCENT : "#e8e8e4",
              background: activeTemplate === tpl.id ? ACCENT_LIGHT : "#fafaf8",
              color: activeTemplate === tpl.id ? ACCENT : "#555",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}>
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>Email получателя *</label>
            <input value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="salon@email.ru" type="email" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>Имя / Название салона</label>
            <input value={toName} onChange={e => setToName(e.target.value)} placeholder="Салон «Ромашка»" style={inp} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>Тема письма *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Dok Диалог — платформа для вашего салона" style={inp} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>
            Текст письма * <span style={{ fontWeight: 400, color: "#aaa" }}>(поддерживает HTML: &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt;)</span>
          </label>
          <textarea
            value={bodyText}
            onChange={e => setBodyText(e.target.value)}
            placeholder="Напишите текст или выберите шаблон выше..."
            rows={12}
            style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#888" }}>
          <strong>От кого:</strong> Dok Диалог &lt;massopro@mail.ru&gt; · Подпись: <strong>{senderName}</strong>, Представитель Dok Диалог
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c00", marginBottom: 12 }}>
            {error}
          </div>
        )}
        {sent && (
          <div style={{ background: "hsl(140,60%,95%)", border: "1px solid hsl(140,60%,70%)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "hsl(140,60%,32%)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={16} />
            Письмо успешно отправлено на {sentTo}
          </div>
        )}

        <button onClick={sendMail} disabled={sending} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "11px 28px", borderRadius: 10, border: "none",
          background: sending ? "#ccc" : ACCENT, color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: sending ? "default" : "pointer",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="Send" size={16} />
          {sending ? "Отправляю..." : "Отправить письмо"}
        </button>
      </div>
    </div>
  );
}

// ─── Вкладка: ИИ-чат ─────────────────────────────────────────────────────────

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

function AITab() {
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
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 6 }}>ИИ-ассистент по продажам</div>
            <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Генерирую КП, письма, скрипты и расчёты окупаемости.<br />Опишите задачу — подберу роль сам.</div>
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

// ─── Главный компонент ────────────────────────────────────────────────────────

const TABS = [
  { id: "tariffs" as Tab, icon: "LayoutGrid", label: "Тарифы" },
  { id: "mail" as Tab, icon: "Mail", label: "Отправить письмо" },
  { id: "ai" as Tab, icon: "Bot", label: "ИИ-ассистент" },
];

export default function RepDashboard() {
  const { user, logout } = useLkAuth();
  const [tab, setTab] = useState<Tab>("tariffs");

  const senderName = user?.full_name || user?.username || "Представитель";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "Montserrat, sans-serif" }}>

      {/* Шапка */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Briefcase" size={17} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Кабинет представителя</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Dok Диалог · {senderName}</div>
          </div>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={13} />
          Выйти
        </button>
      </div>

      {/* Табы */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", padding: "0 24px", display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "13px 18px", border: "none", background: "transparent",
            borderBottom: tab === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
            color: tab === t.id ? ACCENT : "#888",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", marginBottom: -1,
            transition: "all 0.15s",
          }}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "tariffs" && <TariffsTab />}
        {tab === "mail" && <MailTab senderName={senderName} />}
        {tab === "ai" && <AITab />}
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (max-width: 600px) {
          .rep-mail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}