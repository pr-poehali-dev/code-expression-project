import { useState, useRef } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { apiFetch, Course, Module, Lesson } from "./LkAdminCourses.types";

// ── Редактор курса ─────────────────────────────────────────────────────────────
export function CourseEditor({ course, modules, onBack, onReloadModules, onEditLesson, onSaved }: {
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
    if (!form.title?.trim()) { setMsg("Введите название тренинга"); return; }
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
      const res = await apiFetch("admin_course_cover_upload", "POST", {
        course_id: form.id || null,
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
        {form.id ? `Тренинг: ${form.title}` : "Новый тренинг"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="admin-grid-2">
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Основное</div>

          <div>
            <label style={labelStyle}>НАЗВАНИЕ *</label>
            <input style={inputStyle} value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Название тренинга" />
          </div>
          <div>
            <label style={labelStyle}>КАТЕГОРИЯ</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { value: "body",    label: "Для специалистов по телу" },
                { value: "owner",   label: "Для владельца" },
                { value: "admin",   label: "Для администратора" },
                { value: "master",  label: "Для мастеров" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: opt.value }))}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                    borderColor: (form.category || "body") === opt.value ? ACCENT : "#e8e8e4",
                    background: (form.category || "body") === opt.value ? "hsl(185,85%,95%)" : "#fafafa",
                    color: (form.category || "body") === opt.value ? ACCENT : "#666",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>ОПИСАНИЕ</label>
            <textarea style={{ ...inputStyle, height: 90 }} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Краткое описание для витрины" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>ДОСТУП К ТРЕНИНГУ (⚡)</label>
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
            {saving ? "Сохраняем..." : form.id ? "Сохранить изменения" : "Создать тренинг"}
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
              style={{ border: "2px dashed #e0e0dc", borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", color: "#aaa", fontSize: 13 }}
            >
              {coverUploading ? "Загружается..." : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Icon name="ImagePlus" size={24} />
                  <span>Загрузить обложку</span>
                  <span style={{ fontSize: 11, color: "#ccc" }}>Рекомендуется 1280×720 px (16:9), JPG или PNG</span>
                </div>
              )}
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
export function ModuleBlock({ module, onDelete, onEditLesson, courseId, onReload }: {
  module: Module; onDelete: () => void; onEditLesson: (l: Lesson | null) => void; courseId: number; onReload: () => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [saving, setSaving] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState<number | null>(null);

  const deleteLesson = async (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    if (!confirm("Удалить урок? Это действие нельзя отменить.")) return;
    setDeletingLesson(lessonId);
    await apiFetch("admin_lesson_delete", "POST", { id: lessonId });
    setDeletingLesson(null);
    onReload();
  };

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
            <button
              onClick={(e) => deleteLesson(e, l.id)}
              disabled={deletingLesson === l.id}
              style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(0,70%,70%)", padding: "2px 4px", display: "flex", alignItems: "center", flexShrink: 0 }}
              title="Удалить урок"
            >
              {deletingLesson === l.id
                ? <Icon name="Loader" size={13} style={{ color: "#aaa" }} />
                : <Icon name="Trash2" size={13} />}
            </button>
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