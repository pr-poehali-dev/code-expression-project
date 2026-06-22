import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { LK_URL, sid, ACCENT } from "./LkTeamShared";
import LkAcademyCourse from "./LkAcademyCourse";

const SERIF = "Cormorant, serif";

interface MemberCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  categories: string[];
  cover_url: string;
  granted: boolean;
  owner_has: boolean;
  request_status: "pending" | "approved" | "rejected" | null;
}

const CAT_LABELS: Record<string, string> = {
  owner: "Для владельца и руководителя",
  admin: "Для администратора",
  master: "Для мастеров",
  body: "Для специалистов по телу",
};

export default function LkMemberAcademy({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [courses, setCourses] = useState<MemberCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(() => {
    const saved = sessionStorage.getItem("lk_open_course_id");
    if (saved) { sessionStorage.removeItem("lk_open_course_id"); return Number(saved); }
    return null;
  });
  const [requesting, setRequesting] = useState<number | null>(null);
  const [requestMsg, setRequestMsg] = useState<Record<number, string>>({});
  const [showMsgFor, setShowMsgFor] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${LK_URL}?action=member_courses_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d?.courses)) setCourses(d.courses); })
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function sendRequest(courseId: number) {
    setRequesting(courseId);
    try {
      const res = await fetch(`${LK_URL}?action=course_request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ course_id: courseId, message: requestMsg[courseId] || "" }),
      }).then(r => r.json());

      if (res.ok) {
        setCourses(cs => cs.map(c => c.id === courseId ? { ...c, request_status: "pending" } : c));
        setShowMsgFor(null);
        showToast("Запрос отправлен руководителю");
      } else {
        showToast(res.error || "Ошибка при отправке запроса");
      }
    } finally { setRequesting(null); }
  }

  if (activeCourseId) {
    return <LkAcademyCourse courseId={activeCourseId} onBack={() => { setActiveCourseId(null); window.scrollTo({ top: 0, behavior: "instant" }); }} onNavigate={onNavigate} />;
  }

  const categories = [...new Set(courses.flatMap(c => c.categories?.length ? c.categories : [c.category]))];

  return (
    <div style={{ maxWidth: 860 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#fff", padding: "12px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Академия
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 24px" }}>
        Тренинги, доступные в вашем салоне
      </p>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Icon name="Loader" size={28} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec" }}>
          <Icon name="GraduationCap" size={40} style={{ color: "#ddd", marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>Тренинги ещё не добавлены</div>
          <div style={{ fontSize: 13, color: "#bbb", marginTop: 6, maxWidth: 280, margin: "6px auto 0" }}>
            Когда руководитель приобретёт тренинги, они появятся здесь
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {categories.map(cat => {
            const catCourses = courses.filter(c => (c.categories?.length ? c.categories : [c.category]).includes(cat));
            return (
              <div key={cat} style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f5f5f2", fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>
                  {CAT_LABELS[cat] || cat}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: "#f5f5f2" }}>
                  {catCourses.map(c => (
                    <div key={c.id} style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
                      {c.cover_url && <img src={c.cover_url} alt="" style={{ width: "100%", objectFit: "contain", display: "block" }} />}
                      <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{c.title}</div>
                        {c.description && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, flex: 1 }}>{c.description}</div>}

                        <div style={{ marginTop: 4 }}>
                          {c.granted ? (
                            <button
                              onClick={() => { setActiveCourseId(c.id); window.scrollTo({ top: 0, behavior: "instant" }); }}
                              style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},hsl(185,85%,24%))`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            >
                              <Icon name="PlayCircle" size={14} /> Открыть тренинг
                            </button>
                          ) : !c.owner_has ? (
                            <div style={{ fontSize: 11, color: "#bbb", textAlign: "center", padding: "6px 0" }}>
                              Тренинг не приобретён руководителем
                            </div>
                          ) : c.request_status === "pending" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, background: "hsl(45,90%,96%)", border: "1px solid hsl(45,90%,80%)" }}>
                              <Icon name="Clock" size={13} style={{ color: "hsl(45,80%,45%)", flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: "hsl(45,70%,35%)", fontWeight: 600 }}>Запрос отправлен, ждём ответа</span>
                            </div>
                          ) : c.request_status === "rejected" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <div style={{ fontSize: 11, color: "hsl(0,65%,55%)", fontWeight: 600 }}>Запрос отклонён</div>
                              <button
                                onClick={() => setShowMsgFor(c.id)}
                                style={{ padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: "#fff", color: ACCENT, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                              >
                                Отправить повторно
                              </button>
                            </div>
                          ) : (
                            showMsgFor === c.id ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <textarea
                                  value={requestMsg[c.id] || ""}
                                  onChange={e => setRequestMsg(p => ({ ...p, [c.id]: e.target.value }))}
                                  placeholder="Сообщение руководителю (необязательно)"
                                  rows={2}
                                  style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", resize: "none", boxSizing: "border-box" }}
                                />
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    onClick={() => sendRequest(c.id)}
                                    disabled={requesting === c.id}
                                    style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${ACCENT},hsl(185,85%,24%))`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: requesting === c.id ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                                  >
                                    {requesting === c.id ? <Icon name="Loader" size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="Send" size={12} />}
                                    Отправить
                                  </button>
                                  <button onClick={() => setShowMsgFor(null)} style={{ padding: "8px 12px", borderRadius: 9, border: "1px solid #E2E8F0", background: "#fff", color: "#aaa", fontSize: 12, cursor: "pointer" }}>
                                    Отмена
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowMsgFor(c.id)}
                                style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: "#fff", color: ACCENT, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                              >
                                <Icon name="Bell" size={13} /> Запросить доступ
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}