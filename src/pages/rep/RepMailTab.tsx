import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, REP_MAIL_URL, EMAIL_TEMPLATES } from "./rep.constants";

interface SalonContact { name: string; email: string; }

function parseCsv(text: string): SalonContact[] {
  const lines = text.trim().split(/\r?\n/);
  const results: SalonContact[] = [];
  for (const line of lines) {
    const sep = line.includes(";") ? ";" : ",";
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ""));
    if (cols.length < 2) continue;
    const [a, b] = cols;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRe.test(b)) results.push({ name: a, email: b });
    else if (emailRe.test(a)) results.push({ name: b, email: a });
  }
  return results;
}

export default function RepMailTab({ senderName }: { senderName: string }) {
  const [contacts, setContacts] = useState<SalonContact[]>([]);
  const [search, setSearch] = useState("");
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setFileError("");
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setFileError("Не удалось найти данные. Убедитесь, что файл CSV с колонками: Название салона, Email");
        return;
      }
      setContacts(parsed);
      setSearch("");
    };
    reader.readAsText(file, "utf-8");
  }

  function onFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function selectSalon(c: SalonContact) {
    setToName(c.name);
    setToEmail(c.email);
    setSearch("");
  }

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
      const tplLabel = EMAIL_TEMPLATES.find(t => t.id === activeTemplate)?.label || "";
      const res = await fetch(REP_MAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({
          to_email: toEmail, to_name: toName,
          subject, body_html: textToHtml(bodyText),
          template_label: tplLabel,
        }),
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

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Отправить письмо</h2>

      {/* ── База салонов ── */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>База салонов</div>
          <button
            onClick={() => {
              const csv = "Название салона;Email\nСалон Ромашка;romashka@mail.ru\nСтудия Style;style@gmail.com\n";
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "шаблон_салоны.csv"; a.click();
              URL.revokeObjectURL(url);
            }}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: ACCENT, background: ACCENT_LIGHT, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
          >
            <Icon name="Download" size={12} />
            Скачать шаблон
          </button>
        </div>

        {/* Пример формата */}
        <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: "#555", marginBottom: 8 }}>Как подготовить файл:</div>
          <div style={{ color: "#777", lineHeight: 1.7, marginBottom: 10 }}>
            Откройте Excel или Google Таблицы. В колонке A — название салона, в колонке B — email. Никаких разделителей не нужно — просто две колонки. Затем сохраните как CSV (Файл → Скачать → CSV).
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#e8e8e4", borderRadius: 6, overflow: "hidden", border: "1px solid #e8e8e4" }}>
            {[
              { a: "A", b: "B", header: true },
              { a: "Салон Ромашка", b: "romashka@mail.ru", header: false },
              { a: "Студия Style", b: "style@gmail.com", header: false },
            ].map((row, i) => (
              <>
                <div key={`a${i}`} style={{ background: row.header ? "#eee" : "#fff", padding: "5px 10px", fontSize: 11, fontWeight: row.header ? 700 : 400, color: row.header ? "#888" : "#333", fontFamily: "monospace" }}>{row.a}</div>
                <div key={`b${i}`} style={{ background: row.header ? "#eee" : "#fff", padding: "5px 10px", fontSize: 11, fontWeight: row.header ? 700 : 400, color: row.header ? "#888" : "#555", fontFamily: "monospace" }}>{row.b}</div>
              </>
            ))}
          </div>
        </div>

        {contacts.length === 0 ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={onFileDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${ACCENT}40`, borderRadius: 10, padding: "24px 16px",
              textAlign: "center", cursor: "pointer", background: "#fafaf8",
            }}
          >
            <Icon name="Upload" size={22} style={{ color: ACCENT, marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Перетащите файл сюда или нажмите для выбора</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Поддерживаются файлы .csv и .txt</div>
            {fileError && <div style={{ marginTop: 10, fontSize: 12, color: "#c00" }}>{fileError}</div>}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="CheckCircle" size={14} />
                Загружено {contacts.length} контактов
              </div>
              <button onClick={() => { setContacts([]); setSearch(""); }} style={{ fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                Заменить файл
              </button>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию или email..."
              style={{ ...inp, marginBottom: search ? 8 : 0 }}
            />
            {search && (
              <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #e8e8e4", borderRadius: 8, background: "#fff" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "12px 14px", fontSize: 13, color: "#aaa" }}>Ничего не найдено</div>
                ) : filtered.slice(0, 30).map((c, i) => (
                  <div
                    key={i}
                    onClick={() => selectSalon(c)}
                    style={{
                      padding: "10px 14px", cursor: "pointer",
                      borderBottom: i < filtered.length - 1 ? "1px solid #f0f0ec" : "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = ACCENT_LIGHT)}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{c.email}</div>
                    </div>
                    <Icon name="ArrowRight" size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>

      {/* ── Шаблоны ── */}
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

      {/* ── Форма ── */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="rep-mail-grid">
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
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Про Диалог — платформа для вашего салона" style={inp} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5 }}>
            Текст письма * <span style={{ fontWeight: 400, color: "#aaa" }}>(поддерживает HTML)</span>
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