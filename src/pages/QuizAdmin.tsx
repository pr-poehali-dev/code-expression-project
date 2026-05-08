import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Icon from "@/components/ui/icon";

const QUIZ_URL = "https://functions.poehali.dev/ce81ec2c-593c-47ad-84fc-73713cb74197";
const ACCENT = "#2d8b76";

interface Course {
  id: number;
  title: string;
  description: string;
  url: string;
  buy_url: string | null;
  price: string;
  category: string;
  format: string;
  is_active: boolean;
  sort_order: number;
}

interface Submission {
  id: number;
  name: string;
  email: string;
  category: string;
  created_at: string;
  answers: Record<string, unknown>;
  recommended_courses: Course[];
}

const CATEGORY_NAMES: Record<string, string> = {
  A: "Для себя и семьи",
  B: "Для массажистов",
  C: "Для тренеров",
  D: "Новая профессия",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e0e0da",
  borderRadius: 9,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: 9,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const dangerBtn: React.CSSProperties = {
  background: "#e53e3e",
  color: "#fff",
  border: "none",
  borderRadius: 9,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function QuizAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem("quiz_admin_token") || "");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"submissions" | "courses">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({ format: "online", category: "A", is_active: true, sort_order: 0 });

  const headers = { "Content-Type": "application/json", "x-admin-token": token };

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${QUIZ_URL}?action=admin_submissions`, { headers });
      const d = await r.json();
      if (r.status === 401) { setAuthed(false); setError("Неверный токен"); return; }
      setSubmissions(d.submissions || []);
    } catch { setError("Ошибка загрузки"); }
    finally { setLoading(false); }
  }, [token]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${QUIZ_URL}?action=admin_courses`, { headers });
      const d = await r.json();
      if (r.status === 401) { setAuthed(false); setError("Неверный токен"); return; }
      setCourses(d.courses || []);
    } catch { setError("Ошибка загрузки"); }
    finally { setLoading(false); }
  }, [token]);

  const login = async () => {
    if (!token.trim()) { setError("Введите токен"); return; }
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${QUIZ_URL}?action=admin_submissions`, {
        headers: { "Content-Type": "application/json", "x-admin-token": token.trim() }
      });
      if (r.status === 401) {
        setError("Неверный токен. Проверьте значение в Ядро → Секреты → ADMIN_TOKEN");
        return;
      }
      if (!r.ok) {
        setError(`Ошибка сервера: ${r.status}`);
        return;
      }
      localStorage.setItem("quiz_admin_token", token.trim());
      setAuthed(true);
    } catch (e) {
      setError(`Ошибка соединения: ${e}`);
    }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!authed) return;
    if (tab === "submissions") loadSubmissions();
    else loadCourses();
  }, [authed, tab, loadSubmissions, loadCourses]);

  const saveCourse = async () => {
    if (!editingCourse) return;
    setLoading(true);
    try {
      await fetch(`${QUIZ_URL}?action=admin_update_course&id=${editingCourse.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editingCourse),
      });
      setEditingCourse(null);
      loadCourses();
    } catch { setError("Ошибка сохранения"); }
    finally { setLoading(false); }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Скрыть курс из квиза?")) return;
    setLoading(true);
    try {
      await fetch(`${QUIZ_URL}?action=admin_delete_course&id=${id}`, { method: "DELETE", headers });
      loadCourses();
    } catch { setError("Ошибка удаления"); }
    finally { setLoading(false); }
  };

  const createCourse = async () => {
    setLoading(true);
    try {
      await fetch(`${QUIZ_URL}?action=admin_create_course`, {
        method: "POST",
        headers,
        body: JSON.stringify(newCourse),
      });
      setShowAddForm(false);
      setNewCourse({ format: "online", category: "A", is_active: true, sort_order: 0 });
      loadCourses();
    } catch { setError("Ошибка создания"); }
    finally { setLoading(false); }
  };

  const exportEmails = () => {
    const emails = submissions.map(s => `${s.name} <${s.email}>`).join("\n");
    const blob = new Blob([emails], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quiz_emails.txt";
    a.click();
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Golos Text, sans-serif" }}>
        <Helmet><title>Админ квиза — Dok Диалог</title></Helmet>
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 400, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <Icon name="ShieldCheck" size={28} style={{ color: ACCENT }} />
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Администратор квиза</h1>
          </div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>
            Токен доступа
          </label>
          <input
            type="password"
            style={{ ...inputStyle, marginBottom: 16 }}
            placeholder="Введите токен..."
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {error && <div style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button style={{ ...primaryBtn, width: "100%", padding: "12px" }} onClick={login} disabled={loading}>
            {loading ? "Проверка токена..." : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "Golos Text, sans-serif" }}>
      <Helmet><title>Админ квиза — Dok Диалог</title></Helmet>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="GraduationCap" size={24} style={{ color: ACCENT }} />
          <span style={{ fontSize: 18, fontWeight: 700 }}>Квиз — Панель управления</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/catalog/private" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>← На сайт</a>
          <button
            style={{ ...primaryBtn, background: "transparent", color: "#888", border: "1px solid #e0e0da" }}
            onClick={() => { localStorage.removeItem("quiz_admin_token"); setAuthed(false); }}
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid #eee", width: "fit-content", marginBottom: 28 }}>
          {(["submissions", "courses"] as const).map(t => (
            <button
              key={t}
              style={{
                padding: "9px 22px", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14, fontWeight: tab === t ? 700 : 400,
                background: tab === t ? ACCENT : "transparent",
                color: tab === t ? "#fff" : "#666",
                transition: "all 0.18s",
              }}
              onClick={() => setTab(t)}
            >
              {t === "submissions" ? "Заявки" : "Курсы"}
            </button>
          ))}
        </div>

        {error && <div style={{ color: "#e53e3e", fontSize: 14, marginBottom: 16 }}>{error}</div>}
        {loading && <div style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>Загрузка...</div>}

        {/* SUBMISSIONS TAB */}
        {tab === "submissions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Заявки из квиза</h2>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Всего: {submissions.length}</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={primaryBtn} onClick={exportEmails}>
                  Экспорт email
                </button>
                <button style={{ ...primaryBtn, background: "transparent", color: ACCENT, border: `1.5px solid ${ACCENT}` }} onClick={loadSubmissions}>
                  Обновить
                </button>
              </div>
            </div>

            {submissions.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
                Заявок пока нет
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {submissions.map(sub => (
                <div key={sub.id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #eee", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{sub.name}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                        background: `${ACCENT}15`, color: ACCENT,
                      }}>
                        {CATEGORY_NAMES[sub.category] || sub.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: ACCENT }}>{sub.email}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                      {new Date(sub.created_at).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Рекомендовано:</div>
                    {(sub.recommended_courses || []).slice(0, 3).map((c: Course) => (
                      <div key={c.id} style={{ marginBottom: 2 }}>• {c.title}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Курсы в квизе</h2>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Управляйте курсами, которые рекомендуются пользователям</p>
              </div>
              <button style={primaryBtn} onClick={() => setShowAddForm(true)}>
                + Добавить курс
              </button>
            </div>

            {/* Форма добавления */}
            {showAddForm && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `2px solid ${ACCENT}`, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 18px" }}>Новый курс</h3>
                <CourseForm course={newCourse} onChange={setNewCourse} />
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button style={primaryBtn} onClick={createCourse}>Сохранить</button>
                  <button style={{ ...primaryBtn, background: "transparent", color: "#888", border: "1px solid #e0e0da" }} onClick={() => setShowAddForm(false)}>Отмена</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {courses.map(c => (
                <div key={c.id}>
                  {editingCourse?.id === c.id ? (
                    <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: `2px solid ${ACCENT}` }}>
                      <CourseForm course={editingCourse} onChange={setEditingCourse} />
                      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button style={primaryBtn} onClick={saveCourse}>Сохранить</button>
                        <button style={{ ...primaryBtn, background: "transparent", color: "#888", border: "1px solid #e0e0da" }} onClick={() => setEditingCourse(null)}>Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eee", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: `${ACCENT}15`, color: ACCENT }}>
                            {CATEGORY_NAMES[c.category] || c.category}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: c.format === "offline" ? "#fef3c7" : "#e0f2f1", color: c.format === "offline" ? "#d97706" : ACCENT }}>
                            {c.format === "offline" ? "Офлайн" : "Онлайн"}
                          </span>
                          {!c.is_active && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "#fee2e2", color: "#e53e3e" }}>Скрыт</span>}
                        </div>
                        <div style={{ fontSize: 13, color: "#888" }}>{c.price} · {c.url}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ ...primaryBtn, background: "transparent", color: ACCENT, border: `1.5px solid ${ACCENT}`, padding: "7px 16px" }} onClick={() => setEditingCourse(c)}>
                          Изменить
                        </button>
                        <button style={{ ...dangerBtn, padding: "7px 16px" }} onClick={() => deleteCourse(c.id)}>
                          Скрыть
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Форма редактирования курса ────────────────────────────────────────────────

function CourseForm({ course, onChange }: { course: Partial<Course>; onChange: (c: Partial<Course>) => void }) {
  const f = (field: keyof Course, val: unknown) => onChange({ ...course, [field]: val });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Название *</label>
        <input style={inputStyle} value={course.title || ""} onChange={e => f("title", e.target.value)} placeholder="Название курса" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Описание *</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={course.description || ""} onChange={e => f("description", e.target.value)} placeholder="Краткое описание" />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>URL страницы *</label>
        <input style={inputStyle} value={course.url || ""} onChange={e => f("url", e.target.value)} placeholder="/course/my-course" />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>URL покупки</label>
        <input style={inputStyle} value={course.buy_url || ""} onChange={e => f("buy_url", e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Цена *</label>
        <input style={inputStyle} value={course.price || ""} onChange={e => f("price", e.target.value)} placeholder="5 970 ₽" />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Категория</label>
        <select style={{ ...inputStyle }} value={course.category || "A"} onChange={e => f("category", e.target.value)}>
          <option value="A">A — Для себя и семьи</option>
          <option value="B">B — Для массажистов</option>
          <option value="C">C — Для тренеров</option>
          <option value="D">D — Новая профессия</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Формат</label>
        <select style={{ ...inputStyle }} value={course.format || "online"} onChange={e => f("format", e.target.value)}>
          <option value="online">Онлайн</option>
          <option value="offline">Офлайн (Москва)</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Порядок сортировки</label>
        <input style={inputStyle} type="number" value={course.sort_order ?? 0} onChange={e => f("sort_order", parseInt(e.target.value) || 0)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" id="is_active" checked={course.is_active ?? true} onChange={e => f("is_active", e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="is_active" style={{ fontSize: 14, color: "#333" }}>Активен (показывается в квизе)</label>
      </div>
    </div>
  );
}