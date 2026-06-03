import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, REP_MAIL_URL, EMAIL_TEMPLATES } from "./rep.constants";

export default function RepMailTab({ senderName }: { senderName: string }) {
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
          <strong>От кого:</strong> Про Диалог &lt;massopro@mail.ru&gt; · Подпись: <strong>{senderName}</strong>, Представитель Про Диалог
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