import { useState, useEffect } from "react";
import { ACCENT } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { apiFetch, Lesson, Module, LFile, Photo } from "./LkAdminCourses.types";
import { LessonView, type LessonFull } from "./LkAcademyCourse";
import { HTML_MARKER } from "./LkAcademyTypes";
import LkAdminLessonFormMain from "./LkAdminLessonFormMain";
import LkAdminLessonMedia from "./LkAdminLessonMedia";
import LkAdminLessonToolsPanel from "./LkAdminLessonToolsPanel";

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
        <LkAdminLessonFormMain
          form={form}
          modules={modules}
          saving={saving}
          msg={msg}
          rehosting={rehosting}
          rehostMsg={rehostMsg}
          onChange={patch => setForm(f => ({ ...f, ...patch }))}
          onSave={save}
          onRehostImages={rehostImages}
        />

        {form.id && (
          <>
            <LkAdminLessonMedia
              videoUrls={form.video_urls || []}
              links={form.links || []}
              photos={photos}
              files={files}
              uploading={uploading}
              newVideo={newVideo}
              newLink={newLink}
              onNewVideoChange={setNewVideo}
              onNewLinkChange={setNewLink}
              onAddVideo={addVideo}
              onRemoveVideo={removeVideo}
              onAddLink={addLink}
              onRemoveLink={removeLink}
              onUploadPhoto={uploadPhoto}
              onDeletePhoto={deletePhoto}
              onUploadFile={uploadFile}
              onDeleteFile={deleteFile}
            />

            <LkAdminLessonToolsPanel
              tools={tools}
              savingTools={savingTools}
              onToggle={toggleTool}
              onSave={saveTools}
            />
          </>
        )}
      </div>
    </div>
  );
}
