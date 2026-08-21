import { useState, useRef } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { apiFetch, Course, Module, Lesson, ScheduleBlock } from "./LkAdminCourses.types";

// ── Редактор курса ─────────────────────────────────────────────────────────────
export function CourseEditor({ course, modules, onBack, onReloadModules, onEditLesson, onSaved }: {
  course: Course | null; modules: Module[];
  onBack: () => void; onReloadModules: () => void;
  onEditLesson: (l: Lesson | null) => void;
  onSaved: (c: Course) => void;
}) {
  const initCategories = course?.categories?.length ? course.categories : [course?.category || "body"];
  const [form, setForm] = useState<Partial<Course>>(course
    ? { ...course, categories: initCategories, schedule: course.schedule || [] }
    : { access_cost: 0, lesson_cost: 1, category: "body", categories: ["body"], is_published: false, type: "online", schedule: [], energy_reward: 0, is_partner: false, partner_format: "online" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [newModTitle, setNewModTitle] = useState("");
  const [addingMod, setAddingMod] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const schedule: ScheduleBlock[] = (form.schedule as ScheduleBlock[]) || [];

  const addScheduleBlock = () => {
    setForm(f => ({ ...f, schedule: [...(f.schedule || []), { time_start: "", time_end: "", title: "" }] as ScheduleBlock[] }));
  };
  const removeScheduleBlock = (i: number) => {
    setForm(f => ({ ...f, schedule: (f.schedule as ScheduleBlock[]).filter((_, idx) => idx !== i) }));
  };
  const updateScheduleBlock = (i: number, field: keyof ScheduleBlock, value: string) => {
    setForm(f => {
      const s = [...((f.schedule || []) as ScheduleBlock[])];
      s[i] = { ...s[i], [field]: value };
      return { ...f, schedule: s };
    });
  };

  const save = async () => {
    if (!form.title?.trim()) { setMsg("Введите название тренинга"); return; }
    if (form.is_partner && !form.partner_url?.trim()) { setMsg("Укажите ссылку на страницу тренинга партнёра"); return; }
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
            <label style={labelStyle}>КАТЕГОРИЯ <span style={{ fontWeight: 400, color: "#aaa" }}>(можно выбрать несколько)</span></label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { value: "body",    label: "Для специалистов по телу" },
                { value: "owner",   label: "Для владельца" },
                { value: "admin",   label: "Для администратора" },
                { value: "master",  label: "Для мастеров" },
                { value: "clients", label: "Для клиентов" },
              ].map(opt => {
                const selected = (form.categories || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => {
                      const cur = f.categories || [];
                      const next = selected
                        ? cur.filter(c => c !== opt.value)
                        : [...cur, opt.value];
                      return { ...f, categories: next.length ? next : [opt.value], category: next[0] || opt.value };
                    })}
                    style={{
                      padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                      borderColor: selected ? ACCENT : "#e8e8e4",
                      background: selected ? "hsl(185,85%,95%)" : "#fafafa",
                      color: selected ? ACCENT : "#666",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    {selected && <Icon name="Check" size={11} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {(form.categories || []).length > 1 && (
              <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
                Тренинг появится в {(form.categories || []).length} разделах витрины
              </div>
            )}
          </div>
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!!form.is_partner}
                onChange={e => setForm(f => ({ ...f, is_partner: e.target.checked }))}
                style={{ width: 15, height: 15 }}
              />
              <span style={{ color: form.is_partner ? "hsl(38,80%,40%)" : "#666" }}>ПАРТНЁРСКИЙ ТРЕНИНГ (внешняя школа)</span>
            </label>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
              Карточка на витрине с картинкой, описанием и ценой — кнопка «Подробнее» ведёт на сайт партнёра, без уроков внутри кабинета
            </div>
          </div>

          {form.is_partner ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "14px 16px", background: "hsl(38,90%,97%)", border: "1.5px solid hsl(38,80%,85%)", borderRadius: 10 }}>
              <div>
                <label style={labelStyle}>ШКОЛА-ПАРТНЁР</label>
                <input style={inputStyle} value={form.partner_name || ""} onChange={e => setForm(f => ({ ...f, partner_name: e.target.value }))} placeholder="Название школы/автора" />
              </div>
              <div>
                <label style={labelStyle}>ССЫЛКА НА СТРАНИЦУ ТРЕНИНГА *</label>
                <input style={inputStyle} value={form.partner_url || ""} onChange={e => setForm(f => ({ ...f, partner_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>ФОРМАТ</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {([["online", "Онлайн"], ["offline", "Офлайн"]] as const).map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(f => ({ ...f, partner_format: val }))}
                        style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                          borderColor: form.partner_format === val ? "hsl(38,80%,45%)" : "#e8e8e4",
                          background: form.partner_format === val ? "hsl(38,90%,92%)" : "#fff",
                          color: form.partner_format === val ? "hsl(38,80%,35%)" : "#666" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>ЦЕНА <span style={{ fontWeight: 400, color: "#aaa" }}>(текст, пусто = бесплатно)</span></label>
                  <input style={inputStyle} value={form.partner_price || ""} onChange={e => setForm(f => ({ ...f, partner_price: e.target.value }))} placeholder="Например: 12 900 ₽" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={labelStyle}>ТИП</label>
              <div style={{ display: "flex", gap: 8 }}>
                {([["online", "Онлайн-курс"], ["offline", "Офлайн-тренинг"]] as const).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm(f => ({ ...f, type: val }))}
                    style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                      borderColor: form.type === val ? ACCENT : "#e8e8e4",
                      background: form.type === val ? "hsl(185,85%,95%)" : "#fafafa",
                      color: form.type === val ? ACCENT : "#666" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>ОПИСАНИЕ</label>
            <textarea style={{ ...inputStyle, height: 90 }} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Краткое описание для витрины" />
          </div>

          {!form.is_partner && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>СТОИМОСТЬ УЧАСТИЯ (⚡)</label>
                <input style={inputStyle} type="number" min={0} value={form.access_cost ?? 0} onChange={e => setForm(f => ({ ...f, access_cost: +e.target.value }))} />
              </div>
              {form.type === "offline" ? (
                <div>
                  <label style={labelStyle}>БОНУС ЭНЕРГИИ (⚡) после покупки</label>
                  <input style={inputStyle} type="number" min={0} value={form.energy_reward ?? 0} onChange={e => setForm(f => ({ ...f, energy_reward: +e.target.value }))} />
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>СТОИМОСТЬ УРОКА (⚡)</label>
                  <input style={inputStyle} type="number" min={0} value={form.lesson_cost ?? 1} onChange={e => setForm(f => ({ ...f, lesson_cost: +e.target.value }))} />
                </div>
              )}
            </div>
          )}

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
              <img src={form.cover_url} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "contain", display: "block" }} />
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

          {/* Трейлер */}
          <div>
            <label style={labelStyle}>ТРЕЙЛЕР (KINESCOPE)</label>
            <input
              style={inputStyle}
              value={form.trailer_url || ""}
              onChange={e => setForm(f => ({ ...f, trailer_url: e.target.value }))}
              placeholder="https://kinescope.io/abc123"
            />
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
              Короткое видео-знакомство. Показывается на витрине <strong>вместо обложки</strong>.
            </div>
            {form.trailer_url && (() => {
              const match = form.trailer_url!.match(/kinescope\.io\/([a-zA-Z0-9]+)/);
              const embedUrl = match ? `https://kinescope.io/embed/${match[1]}` : form.trailer_url!;
              return (
                <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", background: "#000", marginTop: 10 }}>
                  <iframe src={embedUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen allow="autoplay; fullscreen" />
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Блок офлайн-тренинга ───────────────────────────────────────────── */}
      {!form.is_partner && form.type === "offline" && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Параметры офлайн-тренинга</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="admin-grid-3">
            <div>
              <label style={labelStyle}>ДАТА ПРОВЕДЕНИЯ</label>
              <input style={inputStyle} type="date" value={form.event_date || ""} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>НАЧАЛО</label>
              <input style={inputStyle} type="time" value={form.event_time_start || ""} onChange={e => setForm(f => ({ ...f, event_time_start: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>КОНЕЦ</label>
              <input style={inputStyle} type="time" value={form.event_time_end || ""} onChange={e => setForm(f => ({ ...f, event_time_end: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }} className="admin-grid-2">
            <div>
              <label style={labelStyle}>МЕСТО ПРОВЕДЕНИЯ</label>
              <input style={inputStyle} value={form.event_location || ""} onChange={e => setForm(f => ({ ...f, event_location: e.target.value }))} placeholder="Например: Москва, ул. Тверская, 10" />
            </div>
            <div>
              <label style={labelStyle}>МАКС. УЧАСТНИКОВ</label>
              <input style={inputStyle} type="number" min={1} value={form.max_participants || ""} onChange={e => setForm(f => ({ ...f, max_participants: +e.target.value || undefined }))} placeholder="20" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>ПОЛНОЕ ОПИСАНИЕ ТРЕНИНГА</label>
            <textarea
              style={{ ...inputStyle, height: 160, lineHeight: 1.6 }}
              value={(form as Record<string, unknown>).full_description as string || ""}
              onChange={e => setForm(f => ({ ...f, full_description: e.target.value }))}
              placeholder={"Подробное описание для страницы тренинга:\n— что будет на тренинге\n— кому подойдёт\n— что участники унесут с собой\n— особенности формата"}
            />
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Показывается на странице тренинга. Краткое описание — на витрине в кабинете.</div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ ...labelStyle, margin: 0 }}>РАСПИСАНИЕ ПО БЛОКАМ</label>
              <button type="button" onClick={addScheduleBlock}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1.5px solid ${ACCENT}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", color: ACCENT, fontSize: 12, fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>
                <Icon name="Plus" size={12} /> Добавить блок
              </button>
            </div>
            {schedule.length === 0 && (
              <div style={{ fontSize: 12, color: "#aaa", padding: "12px 0" }}>Добавьте блоки расписания — например «10:00–11:30 — Введение»</div>
            )}
            {schedule.map((block, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 90px 1fr 32px", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input style={{ ...inputStyle, margin: 0 }} type="time" value={block.time_start} onChange={e => updateScheduleBlock(i, "time_start", e.target.value)} placeholder="10:00" />
                <input style={{ ...inputStyle, margin: 0 }} type="time" value={block.time_end} onChange={e => updateScheduleBlock(i, "time_end", e.target.value)} placeholder="11:30" />
                <input style={{ ...inputStyle, margin: 0 }} value={block.title} onChange={e => updateScheduleBlock(i, "title", e.target.value)} placeholder="Название блока / темы" />
                <button type="button" onClick={() => removeScheduleBlock(i)}
                  style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid #fcc", background: "#fff0f0", cursor: "pointer", color: "#c44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="X" size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {form.id && !form.is_partner && form.type !== "offline" && (
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