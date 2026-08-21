import { useState, useEffect, useRef } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn, Spinner } from "./LkAdminShared";
import { apiFetch, AcademyCategory } from "./LkAdminCourses.types";
import Icon from "@/components/ui/icon";

const ICONS = ["Building2", "UserCog", "Scissors", "Heart", "Smile", "GraduationCap", "Sparkles", "Users", "Star"];

export function CategoriesSection() {
  const [categories, setCategories] = useState<AcademyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AcademyCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    apiFetch("admin_categories_list").then(d => setCategories(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.code?.trim() || !editing?.title?.trim()) { setMsg("Код и название обязательны"); return; }
    setSaving(true); setMsg("");
    const res = await apiFetch("admin_category_save", "POST", editing);
    setSaving(false);
    if (res.error) { setMsg(res.error); return; }
    setEditing(null);
    load();
  };

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setCoverUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = (ev.target?.result as string).split(",")[1];
      const res = await apiFetch("admin_category_cover_upload", "POST", { category_id: editing.id || null, data: b64, filename: file.name });
      if (res.url) setEditing(f => f ? { ...f, cover_url: res.url } : f);
      setCoverUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <Spinner />;

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 20, padding: 0 }}>
          <Icon name="ChevronLeft" size={16} /> Назад к категориям
        </button>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>
          {editing.id ? `Категория: ${editing.title}` : "Новая категория"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="admin-grid-2">
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>КОД <span style={{ fontWeight: 400, color: "#aaa" }}>(латиницей, используется для привязки тренингов)</span></label>
              <input style={inputStyle} value={editing.code || ""} onChange={e => setEditing(f => f ? { ...f, code: e.target.value.trim() } : f)} placeholder="owner" disabled={!!editing.id} />
            </div>
            <div>
              <label style={labelStyle}>НАЗВАНИЕ *</label>
              <input style={inputStyle} value={editing.title || ""} onChange={e => setEditing(f => f ? { ...f, title: e.target.value } : f)} placeholder="Для владельца салона" />
            </div>
            <div>
              <label style={labelStyle}>КОРОТКОЕ ОПИСАНИЕ</label>
              <textarea style={{ ...inputStyle, height: 80 }} value={editing.description || ""} onChange={e => setEditing(f => f ? { ...f, description: e.target.value } : f)} placeholder="1-2 предложения — что найдёт здесь пользователь" />
            </div>
            <div>
              <label style={labelStyle}>ИКОНКА</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setEditing(f => f ? { ...f, icon: ic } : f)}
                    style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      borderColor: editing.icon === ic ? ACCENT : "#e8e8e4", background: editing.icon === ic ? "hsl(185,85%,95%)" : "#fafafa" }}>
                    <Icon name={ic} size={16} style={{ color: editing.icon === ic ? ACCENT : "#888" }} />
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>СОРТИРОВКА</label>
                <input style={inputStyle} type="number" min={0} value={editing.sort_order ?? 0} onChange={e => setEditing(f => f ? { ...f, sort_order: +e.target.value } : f)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>СТАТУС</label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
                  <input type="checkbox" checked={editing.is_active ?? true} onChange={e => setEditing(f => f ? { ...f, is_active: e.target.checked } : f)} />
                  <span style={{ fontSize: 13, color: editing.is_active ? "hsl(130,60%,35%)" : "#888", fontWeight: 600 }}>
                    {editing.is_active ? "Активна" : "Скрыта"}
                  </span>
                </label>
              </div>
            </div>

            {msg && <div style={{ fontSize: 13, color: "hsl(0,70%,55%)", fontWeight: 600 }}>{msg}</div>}
            <button style={actionBtn(ACCENT)} onClick={save} disabled={saving}>
              {saving ? "Сохраняем..." : editing.id ? "Сохранить изменения" : "Создать категорию"}
            </button>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Обложка категории</div>
            {editing.cover_url ? (
              <div style={{ position: "relative" }}>
                <img src={editing.cover_url} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "cover", aspectRatio: "16/9", display: "block" }} />
                <button onClick={() => setEditing(f => f ? { ...f, cover_url: "" } : f)} style={{ ...iconBtn, position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)" }}>
                  <Icon name="X" size={14} />
                </button>
              </div>
            ) : (
              <div onClick={() => coverRef.current?.click()} style={{ border: "2px dashed #e0e0dc", borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", color: "#aaa", fontSize: 13 }}>
                {coverUploading ? "Загружается..." : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <Icon name="ImagePlus" size={24} />
                    <span>Загрузить обложку</span>
                    <span style={{ fontSize: 11, color: "#ccc" }}>Рекомендуется 800×450 px (16:9)</span>
                  </div>
                )}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadCover} />
            <div>
              <label style={labelStyle}>ИЛИ ВСТАВИТЬ URL</label>
              <input style={inputStyle} value={editing.cover_url || ""} onChange={e => setEditing(f => f ? { ...f, cover_url: e.target.value } : f)} placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Категории витрины Академии</h2>
        <button style={actionBtn(ACCENT)} onClick={() => setEditing({ code: "", title: "", description: "", icon: "GraduationCap", sort_order: categories.length, is_active: true })}>
          <Icon name="Plus" size={15} /> Создать категорию
        </button>
      </div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16, lineHeight: 1.6 }}>
        Категория — раздел витрины (например «Для владельца салона»). У каждого тренинга в редакторе можно выбрать одну или несколько категорий — он появится в витрине каждой из них.
      </div>
      {categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>Категорий пока нет</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {categories.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1.5px solid #e8e8e4", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setEditing(c)}>
              {c.cover_url ? (
                <img src={c.cover_url} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={c.icon || "GraduationCap"} size={22} style={{ color: ACCENT }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description || c.code}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.is_active ? "hsl(130,60%,94%)" : "#f5f5f2", color: c.is_active ? "hsl(130,60%,35%)" : "#aaa", flexShrink: 0 }}>
                {c.is_active ? "Активна" : "Скрыта"}
              </div>
              <Icon name="ChevronRight" size={16} style={{ color: "#ccc", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
