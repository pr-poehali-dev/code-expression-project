import { useState, useEffect } from "react";
import { ACCENT, Spinner } from "./LkAdminShared";
import Icon from "@/components/ui/icon";

const JOB_AI_URL = "https://functions.poehali.dev/78478eb2-9825-47e4-b184-32ad35d6d7c7";

interface Candidate {
  id: number;
  full_name: string;
  age: string;
  city: string;
  phone: string;
  telegram: string;
  total_score: number;
  status: string;
  ai_comment: string;
  created_at: string;
}

interface CandidateDetail extends Candidate {
  experience: string;
  current_job: string;
  motivation: string;
  scores: Record<string, number>;
  interview: { role: string; content: string }[];
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  recommended: { bg: "hsl(140,50%,94%)", color: "hsl(140,50%,32%)", label: "Рекомендован" },
  review: { bg: "hsl(40,80%,94%)", color: "hsl(40,60%,35%)", label: "На доп. оценку" },
  declined: { bg: "hsl(0,50%,95%)", color: "hsl(0,50%,40%)", label: "Не подошёл" },
};

const SCORE_LABELS: Record<string, string> = {
  communication: "Коммуникация",
  literacy: "Грамотность",
  motivation: "Мотивация",
  responsibility: "Ответственность",
  people_skills: "Работа с людьми",
  stability: "Устойчивость",
  fit: "Соответствие",
};

function getSession() { return localStorage.getItem("lk_session") || ""; }

export function CandidatesSection() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CandidateDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filter, setFilter] = useState<"all" | "recommended" | "review" | "declined">("all");

  useEffect(() => {
    fetch(`${JOB_AI_URL}?action=list`, { headers: { "X-Session-Id": getSession() } })
      .then(r => r.json())
      .then(setCandidates)
      .finally(() => setLoading(false));
  }, []);

  async function openDetail(id: number) {
    setLoadingDetail(true);
    const res = await fetch(`${JOB_AI_URL}?action=detail&id=${id}`, { headers: { "X-Session-Id": getSession() } });
    const data = await res.json();
    setDetail(data);
    setLoadingDetail(false);
  }

  const filtered = filter === "all" ? candidates : candidates.filter(c => c.status === filter);

  if (loading) return <Spinner />;

  if (detail) {
    const st = STATUS_STYLE[detail.status] || STATUS_STYLE.review;
    return (
      <div>
        <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#888", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          <Icon name="ArrowLeft" size={14} /> Назад к списку
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{detail.full_name}</div>
            <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
              {detail.city && `${detail.city} · `}{detail.age && `${detail.age} лет · `}
              {new Date(detail.created_at).toLocaleDateString("ru-RU")}
            </div>
          </div>
          <div style={{ background: st.bg, color: st.color, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            {st.label} · {detail.total_score}/70
          </div>
        </div>

        {/* Контакты */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Контакты</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
            {[
              { icon: "Phone", val: detail.phone },
              { icon: "Send", val: detail.telegram },
              { icon: "Briefcase", val: detail.current_job },
            ].filter(i => i.val).map(i => (
              <div key={i.icon} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
                <Icon name={i.icon} size={14} style={{ color: "#aaa" }} />
                {i.val}
              </div>
            ))}
          </div>
        </div>

        {/* Оценки */}
        {detail.scores && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Оценки ИИ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(detail.scores).map(([k, v]) => (
                <div key={k}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>{SCORE_LABELS[k] || k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{v}/10</span>
                  </div>
                  <div style={{ height: 4, background: "#f0f0ea", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${v * 10}%`, background: ACCENT, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Комментарий ИИ */}
        {detail.ai_comment && (
          <div style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Комментарий ИИ</div>
            <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7, fontStyle: "italic" }}>«{detail.ai_comment}»</div>
          </div>
        )}

        {/* Мотивация */}
        {detail.motivation && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Мотивация кандидата</div>
            <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{detail.motivation}</div>
          </div>
        )}

        {/* Транскрипт */}
        {detail.interview && detail.interview.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e4", padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Транскрипт интервью</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
              {detail.interview.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: m.role === "user" ? ACCENT : "#f0f0ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: m.role === "user" ? "#fff" : "#666" }}>
                    {m.role === "user" ? "К" : "AI"}
                  </div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6, paddingTop: 4 }}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Фильтры и счётчик */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{candidates.length} заявок</span>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "recommended", "review", "declined"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 8, border: "1.5px solid",
              borderColor: filter === f ? ACCENT : "#e8e8e4",
              background: filter === f ? `${ACCENT}12` : "#fff",
              color: filter === f ? ACCENT : "#888",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "Montserrat,sans-serif",
            }}>
              {f === "all" ? "Все" : STATUS_STYLE[f]?.label}
              {f !== "all" && ` (${candidates.filter(c => c.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb", fontSize: 14 }}>
          Заявок пока нет
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(c => {
          const st = STATUS_STYLE[c.status] || STATUS_STYLE.review;
          return (
            <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16, color: st.color, fontWeight: 700 }}>{c.full_name[0]}</span>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{c.full_name}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                  {c.city && `${c.city} · `}{new Date(c.created_at).toLocaleDateString("ru-RU")}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT }}>{c.total_score}</div>
                  <div style={{ fontSize: 10, color: "#bbb" }}>/ 70</div>
                </div>
                <div style={{ background: st.bg, color: st.color, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {st.label}
                </div>
                <button
                  onClick={() => openDetail(c.id)}
                  disabled={loadingDetail}
                  style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e8e8e4", background: "#fafafa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}
                >
                  <Icon name="ChevronRight" size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
