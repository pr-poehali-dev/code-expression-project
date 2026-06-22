import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, REP_MAIL_URL, REP_CONTACTS_URL, EMAIL_TEMPLATES } from "./rep.constants";

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
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [fileError, setFileError] = useState("");
  const PAGE_SIZE = 30;
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

  function session() { return localStorage.getItem("lk_session") || ""; }

  useEffect(() => {
    setLoading(true);
    fetch(REP_CONTACTS_URL, { headers: { "X-Session-Id": session() } })
      .then(r => r.json())
      .then(d => { if (d.contacts) setContacts(d.contacts); })
      .finally(() => setLoading(false));
  }, []);

  function handleFile(file: File) {
    setFileError("");

    const tryParse = (text: string) => {
      const hasGarbled = /[�\uFFFD]/.test(text) || /[\x80-\x9F]/.test(text);
      return hasGarbled ? null : parseCsv(text);
    };

    const readWith = (encoding: string, fallback?: string) => {
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target?.result as string;
        const parsed = tryParse(text);
        if (!parsed && fallback) { readWith(fallback); return; }
        const final = parsed ?? parseCsv(text);
        if (final.length === 0) {
          setFileError("Не удалось найти данные. Убедитесь, что файл CSV с колонками: Название салона, Email");
          return;
        }
        setUploading(true);
        try {
          await fetch(REP_CONTACTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Session-Id": session() },
            body: JSON.stringify({ contacts: final }),
          });
          const r = await fetch(REP_CONTACTS_URL, { headers: { "X-Session-Id": session() } });
          const d = await r.json();
          if (d.contacts) setContacts(d.contacts);
        } finally {
          setUploading(false);
        }
        setSearch("");
      };
      reader.readAsText(file, encoding);
    };

    readWith("utf-8", "windows-1251");
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

  async function clearContacts() {
    setUploading(true);
    try {
      for (const c of contacts) {
        await fetch(REP_CONTACTS_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "X-Session-Id": session() },
          body: JSON.stringify({ email: c.email }),
        });
      }
      setContacts([]);
      setSearch("");
    } finally {
      setUploading(false);
    }
  }

  async function sendMail() {
    if (!toEmail || !subject || !bodyText) { setError("Заполните все обязательные поля"); return; }
    setSending(true); setError(""); setSent(false);
    try {
      const tplLabel = EMAIL_TEMPLATES.find(t => t.id === activeTemplate)?.label || "";
      const res = await fetch(REP_MAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
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
      const sentEmail = toEmail;
      setToEmail(""); setToName(""); setSubject(""); setBodyText(""); setActiveTemplate(null);
      await fetch(REP_CONTACTS_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ email: sentEmail }),
      });
      setContacts(prev => {
        const updated = prev.filter(c => c.email !== sentEmail);
        setPage(p => {
          const newTotal = Math.ceil(updated.length / PAGE_SIZE);
          return Math.min(p, Math.max(0, newTotal - 1));
        });
        return updated;
      });
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
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Отправить письмо</h2>

      {/* ── База салонов ── */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>База салонов</div>
          <button
            onClick={() => {
              const csv = "\uFEFFНазвание салона;Email\nСалон Ромашка;romashka@mail.ru\nСтудия Style;style@gmail.com\nBeauty Studio;beauty@mail.ru\n";
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

        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", fontSize: 13, color: "#aaa" }}>Загрузка базы...</div>
        ) : contacts.length === 0 ? (
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
                {uploading ? "Сохранение..." : `Загружено ${contacts.length} контактов`}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ fontSize: 12, color: ACCENT, background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                  Добавить ещё
                </button>
                <button onClick={clearContacts} disabled={uploading} style={{ fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                  Очистить базу
                </button>
              </div>
            </div>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Поиск по названию или email..."
              style={{ ...inp, marginBottom: 8 }}
            />
            <div style={{ border: "1px solid #e8e8e4", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "12px 14px", fontSize: 13, color: "#aaa" }}>Ничего не найдено</div>
              ) : paginated.map((c, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    borderBottom: i < paginated.length - 1 ? "1px solid #f0f0ec" : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = ACCENT_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <div onClick={() => selectSalon(c)} style={{ cursor: "pointer", flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{c.email}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={async e => { e.stopPropagation(); await fetch(REP_CONTACTS_URL, { method: "DELETE", headers: { "Content-Type": "application/json", "X-Session-Id": session() }, body: JSON.stringify({ email: c.email }) }); setContacts(prev => prev.filter(x => x.email !== c.email)); }}
                      title="Удалить"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#ccc", padding: 0, fontFamily: "Montserrat, sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#e00")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                    >
                      <Icon name="X" size={13} />
                    </button>
                    <Icon name="ArrowRight" size={13} style={{ color: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: page === 0 ? "#ccc" : ACCENT, background: "none", border: "none", cursor: page === 0 ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", padding: "4px 0" }}
                >
                  <Icon name="ChevronLeft" size={14} /> Назад
                </button>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {page + 1} / {totalPages} · {filtered.length} контактов
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: page === totalPages - 1 ? "#ccc" : ACCENT, background: "none", border: "none", cursor: page === totalPages - 1 ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", padding: "4px 0" }}
                >
                  Вперёд <Icon name="ChevronRight" size={14} />
                </button>
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
          <strong>От кого:</strong> Про Диалог &lt;massopro@mail.ru&gt; · Подпись: <strong>{senderName}</strong>, Администратор Про Диалог
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
          {sending ? <><Icon name="Loader" size={15} /> Отправка...</> : <><Icon name="Send" size={15} /> Отправить письмо</>}
        </button>
      </div>
    </div>
  );
}