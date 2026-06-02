import { useState, useEffect, useRef } from "react";
import { ACCENT, Spinner, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
function sid() { return localStorage.getItem("lk_session") || ""; }
function apiFetch(action: string, method = "GET", body?: object) {
  return fetch(`${API}?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

interface Course {
  id: number; title: string; description: string; cover_url: string;
  category: string; is_published: boolean; sort_order: number;
  access_cost: number; lesson_cost: number;
  modules_count?: number; lessons_count?: number;
}
interface Module { id: number; course_id: number; title: string; sort_order: number; lessons?: Lesson[]; }
interface Lesson {
  id: number; module_id: number; course_id: number; title: string;
  content: string; video_urls: string[]; links: string[];
  ai_context: string; sort_order: number;
  files?: LFile[]; photos?: Photo[];
}
interface LFile { id: number; name: string; url: string; }
interface Photo { id: number; url: string; sort_order: number; }

type Screen = "list" | "course" | "lesson";

export function CoursesSection() {
  const [screen, setScreen] = useState<Screen>("list");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const loadCourses = () => {
    setLoading(true);
    apiFetch("admin_courses_list")
      .then(d => setCourses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const openCourse = (c: Course | null) => {
    setActiveCourse(c);
    setScreen("course");
    if (c?.id) loadModules(c.id);
    else setModules([]);
  };

  const loadModules = (courseId: number) => {
    apiFetch(`course_detail&course_id=${courseId}`)
      .then(d => {
        if (d.modules) setModules(d.modules);
      });
  };

  if (loading && screen === "list") return <Spinner />;

  return (
    <div>
      {screen === "list" && (
        <CourseList
          courses={courses}
          onNew={() => openCourse(null)}
          onEdit={openCourse}
          onReload={loadCourses}
        />
      )}
      {screen === "course" && activeCourse !== undefined && (
        <CourseEditor
          course={activeCourse}
          modules={modules}
          onBack={() => { setScreen("list"); loadCourses(); }}
          onReloadModules={() => activeCourse?.id && loadModules(activeCourse.id)}
          onEditLesson={(l) => { setActiveLesson(l); setScreen("lesson"); }}
          onSaved={(c) => setActiveCourse(c)}
        />
      )}
      {screen === "lesson" && activeLesson !== undefined && activeCourse && (
        <LessonEditor
          lesson={activeLesson}
          courseId={activeCourse.id}
          modules={modules}
          onBack={() => { setScreen("course"); if (activeCourse?.id) loadModules(activeCourse.id); }}
          onSaved={(l) => setActiveLesson(l)}
        />
      )}
    </div>
  );
}

// ── Список курсов ─────────────────────────────────────────────────────────────
function CourseList({ courses, onNew, onEdit, onReload }: {
  courses: Course[]; onNew: () => void; onEdit: (c: Course) => void; onReload: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Курсы Академии</h2>
        <button style={actionBtn(ACCENT)} onClick={onNew}>
          <Icon name="Plus" size={15} /> Создать курс
        </button>
      </div>
      {courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>
          Курсов пока нет — создайте первый
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {courses.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1.5px solid #e8e8e4", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => onEdit(c)}>
              {c.cover_url && <img src={c.cover_url} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />}
              {!c.cover_url && (
                <div style={{ width: 60, height: 60, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={24} style={{ color: ACCENT }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                  {c.modules_count ?? 0} модулей · {c.lessons_count ?? 0} уроков · доступ {c.access_cost}⚡ · урок {c.lesson_cost}⚡
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.is_published ? "hsl(130,60%,94%)" : "#f5f5f2", color: c.is_published ? "hsl(130,60%,35%)" : "#aaa" }}>
                  {c.is_published ? "Опубликован" : "Черновик"}
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Редактор курса ────────────────────────────────────────────────────────────
function CourseEditor({ course, modules, onBack, onReloadModules, onEditLesson, onSaved }: {
  course: Course | null; modules: Module[];
  onBack: () => void; onReloadModules: () => void;
  onEditLesson: (l: Lesson | null) => void;
  onSaved: (c: Course) => void;
}) {
  const [form, setForm] = useState<Partial<Course>>(course || { access_cost: 0, lesson_cost: 1, category: "body", is_published: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [newModTitle, setNewModTitle] = useState("");
  const [addingMod, setAddingMod] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    if (!form.title?.trim()) { setMsg("Введите название курса"); return; }
    setSaving(true); setMsg("");
    const res = await apiFetch("admin_course_save", "POST", form);
    setSaving(false);
    if (res.error) { setMsg(res.error); return; }
    const saved = { ...form, id: res.id } as Course;
    onSaved(saved);
    setMsg("Сохранено ✓");
  };

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = (ev.target?.result as string).split(",")[1];
      const lessonId = form.id || 0;
      const res = await apiFetch("admin_lesson_photo_add", "POST", {
        lesson_id: lessonId || 1,
        data: b64,
        filename: file.name,
      });
      if (res.url) setForm(f => ({ ...f, cover_url: res.url }));
      setCoverUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const addModule = async () => {
    if (!newModTitle.trim() || !form.id) return;
    setAddingMod(true);
    await apiFetch("admin_module_save", "POST", {
      course_id: form.id,
      title: newModTitle.trim(),
      sort_order: modules.length,
    });
    setNewModTitle("");
    setAddingMod(false);
    onReloadModules();
  };

  const deleteModule = async (mid: number) => {
    if (!confirm("Удалить модуль? Уроки останутся без модуля.")) return;
    await apiFetch("admin_module_delete", "POST", { id: mid });
    onReloadModules();
  };

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 20, padding: 0 }}>
        <Icon name="ChevronLeft" size={16} /> Назад к списку
      </button>

      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>
        {form.id ? `Курс: ${form.title}` : "Новый курс"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="admin-grid-2">
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Основное</div>

          <div>
            <label style={labelStyle}>НАЗВАНИЕ *</label>
            <input style={inputStyle} value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Название курса" />
          </div>
          <div>
            <label style={labelStyle}>ОПИСАНИЕ</label>
            <textarea style={{ ...inputStyle, height: 90 }} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Краткое описание для витрины" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>ДОСТУП К КУРСУ (⚡)</label>
              <input style={inputStyle} type="number" min={0} value={form.access_cost ?? 0} onChange={e => setForm(f => ({ ...f, access_cost: +e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>СТОИМОСТЬ УРОКА (⚡)</label>
              <input style={inputStyle} type="number" min={0} value={form.lesson_cost ?? 1} onChange={e => setForm(f => ({ ...f, lesson_cost: +e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>СОРТИРОВКА</label>
              <input style={inputStyle} type="number" min={0} value={form.sort_order ?? 0} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>СТАТУС</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
                <input type="checkbox" checked={!!form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                <span style={{ fontSize: 13, color: form.is_published ? "hsl(130,60%,35%)" : "#888", fontWeight: 600 }}>
                  {form.is_published ? "Опубликован" : "Черновик"}
                </span>
              </label>
            </div>
          </div>

          {msg && <div style={{ fontSize: 13, color: msg.includes("✓") ? "hsl(130,60%,35%)" : "hsl(0,70%,55%)", fontWeight: 600 }}>{msg}</div>}
          <button style={actionBtn(ACCENT)} onClick={save} disabled={saving}>
            {saving ? "Сохраняем..." : form.id ? "Сохранить изменения" : "Создать курс"}
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Обложка</div>
          {form.cover_url ? (
            <div style={{ position: "relative" }}>
              <img src={form.cover_url} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 200 }} />
              <button onClick={() => setForm(f => ({ ...f, cover_url: "" }))} style={{ ...iconBtn, position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)" }}>
                <Icon name="X" size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => coverRef.current?.click()}
              style={{ border: "2px dashed #e0e0dc", borderRadius: 10, padding: "32px 20px", textAlign: "center", cursor: "pointer", color: "#aaa", fontSize: 13 }}
            >
              {coverUploading ? "Загружается..." : <><Icon name="ImagePlus" size={24} /><br />Загрузить обложку</>}
            </div>
          )}
          <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadCover} />
          <div>
            <label style={labelStyle}>ИЛИ ВСТАВИТЬ URL</label>
            <input style={inputStyle} value={form.cover_url || ""} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
      </div>

      {form.id && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Модули и уроки</div>
          </div>

          {modules.map(m => (
            <ModuleBlock key={m.id} module={m} onDelete={() => deleteModule(m.id)} onEditLesson={onEditLesson} courseId={form.id!} onReload={onReloadModules} />
          ))}

          <div style={{ background: "#fff", borderRadius: 12, border: "1.5px dashed #e0e0dc", padding: "14px 18px", marginTop: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 10 }}>Добавить модуль</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={newModTitle} onChange={e => setNewModTitle(e.target.value)} placeholder="Название модуля" onKeyDown={e => e.key === "Enter" && addModule()} />
              <button style={actionBtn(ACCENT)} onClick={addModule} disabled={addingMod || !newModTitle.trim()}>
                <Icon name="Plus" size={14} /> Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Блок модуля ───────────────────────────────────────────────────────────────
function ModuleBlock({ module, onDelete, onEditLesson, courseId, onReload }: {
  module: Module; onDelete: () => void; onEditLesson: (l: Lesson | null) => void; courseId: number; onReload: () => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [saving, setSaving] = useState(false);

  const saveTitle = async () => {
    setSaving(true);
    await apiFetch("admin_module_save", "POST", { id: module.id, course_id: courseId, title, sort_order: module.sort_order });
    setSaving(false);
    setEditTitle(false);
    onReload();
  };

  const newLesson = () => {
    onEditLesson({ id: 0, module_id: module.id, course_id: courseId, title: "", content: "", video_urls: [], links: [], ai_context: "", sort_order: (module.lessons?.length || 0) });
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8e8e4", marginBottom: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "hsl(185,85%,98%)", borderBottom: "1px solid #e8e8e4" }}>
        <Icon name="Layers" size={15} style={{ color: ACCENT, flexShrink: 0 }} />
        {editTitle ? (
          <>
            <input style={{ ...inputStyle, flex: 1, padding: "6px 10px", fontSize: 13 }} value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            <button style={actionBtn(ACCENT)} onClick={saveTitle} disabled={saving}>{saving ? "..." : "Сохранить"}</button>
            <button style={{ ...iconBtn }} onClick={() => setEditTitle(false)}><Icon name="X" size={13} /></button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{module.title}</span>
            <button style={iconBtn} onClick={() => setEditTitle(true)}><Icon name="Pencil" size={13} /></button>
            <button style={{ ...iconBtn, color: "hsl(0,70%,60%)" }} onClick={onDelete}><Icon name="Trash2" size={13} /></button>
          </>
        )}
      </div>

      <div style={{ padding: "10px 16px" }}>
        {(module.lessons || []).map(l => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}
            onClick={() => onEditLesson(l)}
            onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "")}>
            <Icon name="BookOpen" size={14} style={{ color: "#aaa", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: "#444" }}>{l.title}</span>
            <Icon name="ChevronRight" size={14} style={{ color: "#ccc" }} />
          </div>
        ))}
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontSize: 13, fontWeight: 600, padding: "8px 10px" }} onClick={newLesson}>
          <Icon name="Plus" size={14} /> Добавить урок
        </button>
      </div>
    </div>
  );
}

// ── Редактор урока ────────────────────────────────────────────────────────────
function LessonEditor({ lesson, courseId, modules, onBack, onSaved }: {
  lesson: Lesson | null; courseId: number; modules: Module[]; onBack: () => void; onSaved: (l: Lesson) => void;
}) {
  const [form, setForm] = useState<Partial<Lesson>>(lesson || { module_id: modules[0]?.id, course_id: courseId, video_urls: [], links: [], sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [newVideo, setNewVideo] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [photos, setPhotos] = useState<Photo[]>(lesson?.photos || []);
  const [files, setFiles] = useState<LFile[]>(lesson?.files || []);
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    if (!form.title?.trim()) { setMsg("Введите заголовок урока"); return; }
    setSaving(true); setMsg("");
    const res = await apiFetch("admin_lesson_save", "POST", { ...form, course_id: courseId });
    setSaving(false);
    if (res.error) { setMsg(res.error); return; }
    const saved = { ...form, id: res.id } as Lesson;
    onSaved(saved);
    setMsg("Сохранено ✓");
  };

  const addVideo = () => {
    if (!newVideo.trim()) return;
    setForm(f => ({ ...f, video_urls: [...(f.video_urls || []), newVideo.trim()] }));
    setNewVideo("");
  };

  const removeVideo = (i: number) => setForm(f => ({ ...f, video_urls: (f.video_urls || []).filter((_, idx) => idx !== i) }));

  const addLink = () => {
    if (!newLink.url.trim()) return;
    const linkStr = newLink.label.trim() ? `${newLink.label}|${newLink.url}` : newLink.url;
    setForm(f => ({ ...f, links: [...(f.links || []), linkStr] }));
    setNewLink({ label: "", url: "" });
  };

  const removeLink = (i: number) => setForm(f => ({ ...f, links: (f.links || []).filter((_, idx) => idx !== i) }));

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form.id) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = (ev.target?.result as string).split(",")[1];
      const res = await apiFetch("admin_lesson_photo_add", "POST", { lesson_id: form.id, data: b64, filename: file.name });
      if (res.id) setPhotos(p => [...p, { id: res.id, url: res.url, sort_order: p.length }]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = async (id: number) => {
    await apiFetch("admin_lesson_photo_delete", "POST", { id });
    setPhotos(p => p.filter(x => x.id !== id));
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form.id) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = (ev.target?.result as string).split(",")[1];
      const res = await apiFetch("admin_lesson_file_add", "POST", { lesson_id: form.id, data: b64, filename: file.name });
      if (res.id) setFiles(f => [...f, { id: res.id, name: file.name, url: res.url }]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const deleteFile = async (id: number) => {
    await apiFetch("admin_lesson_file_delete", "POST", { id });
    setFiles(f => f.filter(x => x.id !== id));
  };

  const parseLinkLabel = (s: string) => {
    const parts = s.split("|");
    return parts.length === 2 ? { label: parts[0], url: parts[1] } : { label: s, url: s };
  };

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 20, padding: 0 }}>
        <Icon name="ChevronLeft" size={16} /> Назад к курсу
      </button>

      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>
        {form.id ? `Урок: ${form.title}` : "Новый урок"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Основное</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="admin-grid-2">
            <div>
              <label style={labelStyle}>МОДУЛЬ *</label>
              <select style={{ ...inputStyle }} value={form.module_id || ""} onChange={e => setForm(f => ({ ...f, module_id: +e.target.value }))}>
                {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>СОРТИРОВКА</label>
              <input style={inputStyle} type="number" min={0} value={form.sort_order ?? 0} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>ЗАГОЛОВОК УРОКА *</label>
            <input style={inputStyle} value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Заголовок урока" />
          </div>

          <div>
            <label style={labelStyle}>ТЕКСТОВАЯ ЧАСТЬ</label>
            <textarea style={{ ...inputStyle, height: 180, lineHeight: 1.7 }} value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Основной текст урока..." />
          </div>

          <div>
            <label style={labelStyle}>КОНТЕКСТ ДЛЯ ИИ (дополнительные тезисы, которые ИИ использует при ответах)</label>
            <textarea style={{ ...inputStyle, height: 100, lineHeight: 1.7 }} value={form.ai_context || ""} onChange={e => setForm(f => ({ ...f, ai_context: e.target.value }))} placeholder="Ключевые тезисы, термины, пояснения для ИИ-помощника..." />
          </div>

          {msg && <div style={{ fontSize: 13, color: msg.includes("✓") ? "hsl(130,60%,35%)" : "hsl(0,70%,55%)", fontWeight: 600 }}>{msg}</div>}
          <button style={actionBtn(ACCENT)} onClick={save} disabled={saving}>
            {saving ? "Сохраняем..." : form.id ? "Сохранить урок" : "Создать урок"}
          </button>
          {!form.id && <div style={{ fontSize: 12, color: "#aaa" }}>После создания урока можно добавить видео, фото и файлы</div>}
        </div>

        {form.id && (
          <>
            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Видео с Кинескопа</div>
              {(form.video_urls || []).map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
                  <Icon name="Video" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                  <button style={iconBtn} onClick={() => removeVideo(i)}><Icon name="X" size={13} /></button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={newVideo} onChange={e => setNewVideo(e.target.value)} placeholder="https://kinescope.io/..." onKeyDown={e => e.key === "Enter" && addVideo()} />
                <button style={actionBtn(ACCENT)} onClick={addVideo} disabled={!newVideo.trim()}><Icon name="Plus" size={14} /></button>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Ссылки (Google Диск и др.)</div>
              {(form.links || []).map((l, i) => {
                const { label, url } = parseLinkLabel(l);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
                    <Icon name="Link" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, color: "#555" }}>{label !== url ? `${label} → ${url}` : url}</span>
                    <button style={iconBtn} onClick={() => removeLink(i)}><Icon name="X" size={13} /></button>
                  </div>
                );
              })}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input style={inputStyle} value={newLink.label} onChange={e => setNewLink(l => ({ ...l, label: e.target.value }))} placeholder="Подпись ссылки (необязательно)" />
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={newLink.url} onChange={e => setNewLink(l => ({ ...l, url: e.target.value }))} placeholder="https://drive.google.com/..." onKeyDown={e => e.key === "Enter" && addLink()} />
                  <button style={actionBtn(ACCENT)} onClick={addLink} disabled={!newLink.url.trim()}><Icon name="Plus" size={14} /></button>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Фото к уроку</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {photos.map(p => (
                  <div key={p.id} style={{ position: "relative" }}>
                    <img src={p.url} alt="" style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }} />
                    <button onClick={() => deletePhoto(p.id)} style={{ ...iconBtn, position: "absolute", top: 4, right: 4, width: 22, height: 22, background: "rgba(255,255,255,0.9)", color: "hsl(0,70%,60%)" }}>
                      <Icon name="X" size={11} />
                    </button>
                  </div>
                ))}
                <div onClick={() => photoRef.current?.click()} style={{ width: 100, height: 100, borderRadius: 8, border: "2px dashed #e0e0dc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", flexDirection: "column", gap: 4, fontSize: 11 }}>
                  {uploading ? "..." : <><Icon name="ImagePlus" size={20} /><span>Добавить</span></>}
                </div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadPhoto} />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Файлы для скачивания</div>
              {files.map(f => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
                  <Icon name="FileDown" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: "#444" }}>{f.name}</span>
                  <button style={{ ...iconBtn, color: "hsl(0,70%,60%)" }} onClick={() => deleteFile(f.id)}><Icon name="Trash2" size={13} /></button>
                </div>
              ))}
              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px dashed #e0e0dc", borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: "#888", fontSize: 13, fontWeight: 600 }} onClick={() => fileRef.current?.click()}>
                <Icon name="Upload" size={14} /> {uploading ? "Загружается..." : "Загрузить файл"}
              </button>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={uploadFile} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}