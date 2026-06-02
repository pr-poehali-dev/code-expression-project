import { useState, useRef } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { apiFetch, Lesson, Module, LFile, Photo } from "./LkAdminCourses.types";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { LessonView, type LessonFull } from "./LkAcademyCourse";
import { TOOLS_CATALOG } from "./toolsCatalog";

export function LessonEditor({ lesson, courseId, modules, onBack, onSaved }: {
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
  const [preview, setPreview] = useState(false);
  const [tools, setTools] = useState<string[]>(lesson?.tools || []);
  const [savingTools, setSavingTools] = useState(false);

  const toPreviewLesson = (): LessonFull => ({
    id: form.id || 0,
    title: form.title || "",
    content: form.content || "",
    video_urls: form.video_urls || [],
    links: form.links || [],
    ai_context: form.ai_context || "",
    homework: form.homework || "",
    photos: photos,
    files: files,
    tools: tools,
  });

  const toggleTool = (slug: string) => {
    setTools(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const saveTools = async () => {
    if (!form.id) return;
    setSavingTools(true);
    await apiFetch("admin_lesson_tools_save", "POST", { lesson_id: form.id, tools });
    setSavingTools(false);
  };

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

  if (preview) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 16px", background: "hsl(185,85%,97%)", border: "1.5px solid hsl(185,85%,75%)", borderRadius: 12 }}>
          <Icon name="Eye" size={16} style={{ color: ACCENT }} />
          <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600, flex: 1 }}>Режим предпросмотра — так видит урок ученик</span>
          <button
            onClick={() => setPreview(false)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            <Icon name="Pencil" size={13} /> Вернуться к редактору
          </button>
        </div>
        <LessonView
          lesson={toPreviewLesson()}
          courseTitle="Предпросмотр"
          onBack={() => setPreview(false)}
          onRefreshLesson={() => {}}
          isPreview
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, padding: 0 }}>
          <Icon name="ChevronLeft" size={16} /> Назад к курсу
        </button>
        {form.id && (
          <button
            onClick={() => setPreview(true)}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "none", border: `1.5px solid ${ACCENT}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", color: ACCENT, fontSize: 13, fontWeight: 600 }}
          >
            <Icon name="Eye" size={14} /> Предпросмотр
          </button>
        )}
      </div>

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
            <MarkdownEditor
              value={form.content || ""}
              onChange={v => setForm(f => ({ ...f, content: v }))}
              placeholder="Основной текст урока..."
              minHeight={220}
            />
          </div>

          <div>
            <label style={labelStyle}>КОНТЕКСТ ДЛЯ ИИ (дополнительные тезисы, которые ИИ использует при ответах)</label>
            <textarea style={{ ...inputStyle, height: 90, lineHeight: 1.7 }} value={form.ai_context || ""} onChange={e => setForm(f => ({ ...f, ai_context: e.target.value }))} placeholder="Ключевые тезисы, термины, пояснения для ИИ-помощника..." />
          </div>

          <div style={{ borderTop: "1.5px solid #f0f0ec", paddingTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="ClipboardList" size={15} style={{ color: "hsl(280,60%,55%)" }} />
              <label style={{ ...labelStyle, margin: 0, color: "hsl(280,60%,45%)" }}>ДОМАШНЕЕ ЗАДАНИЕ</label>
            </div>
            <MarkdownEditor
              value={form.homework || ""}
              onChange={v => setForm(f => ({ ...f, homework: v }))}
              placeholder="Опишите задание для самостоятельной работы. ИИ-куратор будет вести ученика по этому заданию в диалоге..."
              minHeight={130}
            />
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
              ИИ получит текст урока + этот текст и будет вести ученика через диалог до выполнения задания
            </div>
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

            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Layers" size={15} style={{ color: ACCENT }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Инструменты к уроку</div>
                <div style={{ fontSize: 11, color: "#aaa", marginLeft: 2 }}>Отображаются в конце урока — ученик сразу может попробовать</div>
              </div>

              {["tools", "ai"].map(cat => {
                const catTools = TOOLS_CATALOG.filter(t => t.category === cat);
                const catLabel = cat === "ai" ? "ИИ-инструменты" : "Инструменты роста";
                const catColor = cat === "ai" ? "hsl(280,60%,50%)" : ACCENT;
                const catBg    = cat === "ai" ? "hsl(280,60%,97%)" : "hsl(185,85%,96%)";
                return (
                  <div key={cat}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: catColor, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{catLabel}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {catTools.map(tool => {
                        const active = tools.includes(tool.slug);
                        return (
                          <button
                            key={tool.slug}
                            onClick={() => toggleTool(tool.slug)}
                            title={tool.description}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                              fontSize: 12, fontWeight: active ? 700 : 500,
                              fontFamily: "Montserrat, sans-serif",
                              border: `1.5px solid ${active ? catColor : "#e0e0dc"}`,
                              background: active ? catBg : "#fafaf8",
                              color: active ? catColor : "#888",
                              transition: "all 0.15s",
                            }}
                          >
                            <Icon name={tool.icon} size={13} />
                            {tool.name}
                            {tool.audience && (
                              <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 500 }}>· {tool.audience}</span>
                            )}
                            {active && <Icon name="Check" size={11} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={saveTools}
                disabled={savingTools}
                style={{ ...actionBtn(ACCENT), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Icon name="Save" size={13} />
                {savingTools ? "Сохраняем..." : `Сохранить инструменты (${tools.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}