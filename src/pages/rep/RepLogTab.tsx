import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, REP_MAIL_LOG_URL } from "./rep.constants";

interface LogEntry {
  id: number;
  to_email: string;
  to_name: string;
  subject: string;
  template_label: string;
  sent_at: string;
  sender_name?: string;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function RepLogTab({ isAdmin }: { isAdmin: boolean }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("lk_session") || "";
    fetch(REP_MAIL_LOG_URL, { headers: { "X-Session-Id": session } })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setLogs(data.logs || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    l.to_name.toLowerCase().includes(search.toLowerCase()) ||
    l.to_email.toLowerCase().includes(search.toLowerCase()) ||
    l.subject.toLowerCase().includes(search.toLowerCase()) ||
    (l.template_label || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.sender_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e8e8e4", fontSize: 14, outline: "none",
    fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
    background: "#fff", color: "#1a1a1a",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
          История отправок {isAdmin ? "— все представители" : ""}
        </h2>
        {!loading && !error && (
          <div style={{ fontSize: 12, color: "#aaa" }}>Всего: {logs.length}</div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 13 }}>Загружаю...</div>
      )}
      {error && (
        <div style={{ background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#c00" }}>{error}</div>
      )}

      {!loading && !error && (
        <>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по салону, email, теме, шаблону..."
            style={inp}
          />

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#bbb", fontSize: 13 }}>
              {logs.length === 0 ? "Писем ещё не отправлено" : "Ничего не найдено"}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", overflow: "hidden" }}>
              {/* Шапка таблицы */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isAdmin ? "1.4fr 1.4fr 1.8fr 1.2fr 1fr 1fr" : "1.4fr 1.4fr 1.8fr 1.2fr 1fr",
                gap: 0, background: "#f8f8f6",
                borderBottom: "1px solid #e8e8e4",
                padding: "10px 16px",
                fontSize: 11, fontWeight: 600, color: "#999",
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>
                <div>Салон</div>
                <div>Email</div>
                <div>Тема письма</div>
                <div>Шаблон</div>
                {isAdmin && <div>Представитель</div>}
                <div>Дата</div>
              </div>

              {filtered.map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isAdmin ? "1.4fr 1.4fr 1.8fr 1.2fr 1fr 1fr" : "1.4fr 1.4fr 1.8fr 1.2fr 1fr",
                    gap: 0, padding: "12px 16px", alignItems: "center",
                    borderBottom: i < filtered.length - 1 ? "1px solid #f0f0ec" : "none",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#1a1a1a", paddingRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.to_name}>
                    {l.to_name || <span style={{ color: "#ccc" }}>—</span>}
                  </div>
                  <div style={{ color: "#555", paddingRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.to_email}>
                    {l.to_email}
                  </div>
                  <div style={{ color: "#333", paddingRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.subject}>
                    {l.subject}
                  </div>
                  <div style={{ paddingRight: 8 }}>
                    {l.template_label ? (
                      <span style={{ display: "inline-block", background: ACCENT_LIGHT, color: ACCENT, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                        {l.template_label}
                      </span>
                    ) : (
                      <span style={{ color: "#ccc", fontSize: 12 }}>Свой текст</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div style={{ color: "#666", fontSize: 12, paddingRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.sender_name || "—"}
                    </div>
                  )}
                  <div style={{ color: "#aaa", fontSize: 12, whiteSpace: "nowrap" }}>
                    {fmtDate(l.sent_at)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Сводка по шаблонам */}
          {logs.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Статистика по шаблонам
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(
                  logs.reduce((acc, l) => {
                    const k = l.template_label || "Свой текст";
                    acc[k] = (acc[k] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).sort((a, b) => b[1] - a[1]).map(([label, count]) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#f8f8f6", borderRadius: 8, padding: "8px 14px",
                  }}>
                    <Icon name="Mail" size={13} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 13, color: ACCENT, fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
