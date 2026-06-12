import { useState, useRef, useEffect } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { apiFetch, Lesson, Module, LFile, Photo } from "./LkAdminCourses.types";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { LessonView, type LessonFull } from "./LkAcademyCourse";
import { TOOLS_CATALOG } from "./toolsCatalog";
import { HTML_MARKER, isHtmlContent, renderContent } from "./LkAcademyTypes";

export function LessonEditor({ lesson, courseId, modules, onBack, onSaved }: {
  lesson: Lesson | null; courseId: number; modules: Module[]; onBack: () => void; onSaved: (l: Lesson) => void;
}) {
  const [form, setForm] = useState<Partial<Lesson>>(lesson || { module_id: modules[0]?.id, course_id: courseId, video_urls: [], links: [], sort_order: 0 });
  const [loading, setLoading] = useState(!!lesson?.id);
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
  const [rehosting, setRehosting] = useState(false);
  const [rehostMsg, setRehostMsg] = useState("");

  useEffect(() => {
    if (!lesson?.id) return;
    setLoading(true);
    apiFetch(`admin_lesson_detail&lesson_id=${lesson.id}`)
      .then(d => {
        if (d.id) {
          setForm(d);
          setPhotos(d.photos || []);
          setFiles(d.files || []);
          setTools(d.tools || []);
        }
      })
      .finally(() => setLoading(false));
  }, [lesson?.id]);

  const rehostImages = async (html: string) => {
    if (!/src=["'][^"']*https?:\/\/(?!cdn\.poehali\.dev)[^"']+["']/i.test(html)) return;
    setRehosting(true); setRehostMsg("");
    const res = await apiFetch("admin_rehost_images", "POST", { html, lesson_id: form.id || "tmp" });
    setRehosting(false);
    if (res.error) { setRehostMsg("Ошибка: " + res.error); return; }
    if (res.replaced > 0) {
      setForm(f => ({ ...f, content: HTML_MARKER + "\n" + res.html }));
      setRehostMsg(`Загружено картинок: ${res.replaced}`);
    } else {
      setRehostMsg("Внешних картинок не найдено");
    }
    setTimeout(() => setRehostMsg(""), 4000);
  };

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

  const addVideo = async () => {
    if (!newVideo.trim()) return;
    const updated = [...(form.video_urls || []), newVideo.trim()];
    setForm(f => ({ ...f, video_urls: updated }));
    setNewVideo("");
    if (form.id) {
      await apiFetch("admin_lesson_save", "POST", { ...form, video_urls: updated, course_id: courseId });
    }
  };

  const removeVideo = async (i: number) => {
    const updated = (form.video_urls || []).filter((_, idx) => idx !== i);
    setForm(f => ({ ...f, video_urls: updated }));
    if (form.id) {
      await apiFetch("admin_lesson_save", "POST", { ...form, video_urls: updated, course_id: courseId });
    }
  };

  const addLink = async () => {
    if (!newLink.url.trim()) return;
    const linkStr = newLink.label.trim() ? `${newLink.label}|${newLink.url}` : newLink.url;
    const updated = [...(form.links || []), linkStr];
    setForm(f => ({ ...f, links: updated }));
    setNewLink({ label: "", url: "" });
    if (form.id) {
      await apiFetch("admin_lesson_save", "POST", { ...form, links: updated, course_id: courseId });
    }
  };

  const removeLink = async (i: number) => {
    const updated = (form.links || []).filter((_, idx) => idx !== i);
    setForm(f => ({ ...f, links: updated }));
    if (form.id) {
      await apiFetch("admin_lesson_save", "POST", { ...form, links: updated, course_id: courseId });
    }
  };

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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12, color: "#888", fontSize: 14 }}>
        <Icon name="Loader" size={18} style={{ color: ACCENT }} />
        Загружаем урок...
      </div>
    );
  }

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ ...labelStyle, margin: 0 }}>ТЕКСТОВАЯ ЧАСТЬ</label>
              <div style={{ display: "flex", gap: 2, background: "#f0f0ec", borderRadius: 8, padding: 3 }}>
                {[{ id: false, label: "Markdown" }, { id: true, label: "HTML" }].map(m => {
                  const active = isHtmlContent(form.content || "") === m.id;
                  return (
                    <button key={String(m.id)} onClick={() => {
                      const cur = form.content || "";
                      if (m.id && !isHtmlContent(cur)) {
                        setForm(f => ({ ...f, content: HTML_MARKER + "\n" + cur }));
                      } else if (!m.id && isHtmlContent(cur)) {
                        setForm(f => ({ ...f, content: cur.trimStart().slice(HTML_MARKER.length).trimStart() }));
                      }
                    }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: active ? "#fff" : "transparent", color: active ? "#1a1a1a" : "#888", fontSize: 11, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {isHtmlContent(form.content || "") ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={(form.content || "").trimStart().slice(HTML_MARKER.length)}
                  onChange={e => setForm(f => ({ ...f, content: HTML_MARKER + "\n" + e.target.value }))}
                  onPaste={e => {
                    const pasted = e.clipboardData.getData("text");
                    if (pasted && /<img/i.test(pasted)) {
                      setTimeout(() => rehostImages(pasted), 50);
                    }
                  }}
                  placeholder="Вставьте HTML из другой платформы..."
                  style={{ ...inputStyle, height: 220, lineHeight: 1.6, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
                />
                {(rehosting || rehostMsg) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: rehosting ? ACCENT : rehostMsg.startsWith("Ошибка") ? "hsl(0,70%,50%)" : "hsl(130,60%,35%)", fontWeight: 600 }}>
                    {rehosting && <div style={{ width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
                    {rehosting ? "Загружаю картинки в CDN..." : rehostMsg}
                  </div>
                )}
                <div style={{ background: "#f8f8f6", borderRadius: 10, border: "1.5px solid #e8e8e4", padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.06em", marginBottom: 8 }}>ПРЕДПРОСМОТР HTML</div>
                  <div className="lesson-content" style={{ fontSize: 14, color: "#333", lineHeight: 1.85 }}
                    dangerouslySetInnerHTML={{ __html: renderContent(form.content || "") }}
                  />
                </div>
                <style>{`
                  .lesson-content iframe { width: 100%; border-radius: 12px; border: none; }
                  .lesson-content img { max-width: 100%; border-radius: 10px; }
                  .lesson-content a { color: hsl(185,85%,32%); }
                  .lesson-content p { margin: 10px 0; }
                  .lesson-content ul { padding-left: 20px; margin: 8px 0; }
                  .lesson-content li { margin: 4px 0; }
                `}</style>
              </div>
            ) : (
              <MarkdownEditor
                value={form.content || ""}
                onChange={v => setForm(f => ({ ...f, content: v }))}
                placeholder="Основной текст урока..."
                minHeight={220}
              />
            )}
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

              {["tools", "ai", "marketing"].map(cat => {
                const catTools = TOOLS_CATALOG.filter(t => t.category === cat);
                const catLabel = cat === "ai" ? "ИИ-инструменты" : cat === "marketing" ? "Маркетинг" : "Инструменты роста";
                const catColor = cat === "ai" ? "hsl(280,60%,50%)" : cat === "marketing" ? "hsl(25,90%,45%)" : ACCENT;
                const catBg    = cat === "ai" ? "hsl(280,60%,97%)" : cat === "marketing" ? "hsl(25,90%,97%)" : "hsl(185,85%,96%)";
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