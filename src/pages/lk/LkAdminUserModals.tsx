import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, User, actionBtn, iconBtn } from "./LkAdminShared";

const COURSES_API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
function sid() { return localStorage.getItem("lk_session") || ""; }
function coursesApiFetch(action: string, method = "GET", body?: object) {
  return fetch(`${COURSES_API}?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

interface DbCourse { id: number; title: string; }

export function CourseAccessModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApiFetch("admin_courses_list")
      .then(d => setCourses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const grant = async (courseId: number) => {
    setSaving(courseId);
    const res = await coursesApiFetch("admin_grant_access", "POST", { user_id: user.id, course_id: courseId });
    setSaving(null);
    if (!res.error) setDone(prev => [...prev, courseId]);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "24px 24px 20px", maxWidth: 420, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Доступ к курсам</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{user.full_name || user.username}</div>
          </div>
          <button onClick={onClose} style={{ ...iconBtn, flexShrink: 0 }}><Icon name="X" size={15} /></button>
        </div>
        {loading ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>Загрузка курсов...</div>
        ) : courses.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>Курсов ещё нет — создайте их в разделе «Курсы»</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {courses.map(c => {
              const granted = done.includes(c.id);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: granted ? "hsl(130,60%,96%)" : "#f8f8f6", borderRadius: 10, border: `1.5px solid ${granted ? "hsl(130,60%,82%)" : "#e8e8e4"}` }}>
                  <Icon name={granted ? "CheckCircle" : "GraduationCap"} size={16} style={{ color: granted ? "hsl(130,60%,40%)" : ACCENT, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{c.title}</span>
                  {granted ? (
                    <span style={{ fontSize: 11, color: "hsl(130,60%,40%)", fontWeight: 700 }}>Выдан</span>
                  ) : (
                    <button
                      onClick={() => grant(c.id)}
                      disabled={saving === c.id}
                      style={{ ...actionBtn(ACCENT), padding: "6px 14px", fontSize: 12 }}
                    >
                      {saving === c.id ? "..." : "Выдать"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <button onClick={onClose} style={{ ...actionBtn("#999"), marginTop: 16, width: "100%", justifyContent: "center" }}>Закрыть</button>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ name, saving, onConfirm, onCancel }: {
  name: string; saving: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 380, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Icon name="Trash2" size={22} style={{ color: "hsl(0,75%,50%)" }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Удалить пользователя?</h3>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px", lineHeight: 1.5 }}>
          <strong>{name}</strong> и все его данные (салон, транзакции, сессии) будут удалены безвозвратно.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e8e8e4", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Отмена
          </button>
          <button onClick={onConfirm} disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "hsl(0,75%,50%)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Удаляю..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}
