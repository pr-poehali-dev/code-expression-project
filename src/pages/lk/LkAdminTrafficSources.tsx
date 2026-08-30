import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";

interface TrafficSource {
  id: number;
  name: string;
  url: string | null;
  category: string;
  audience: string | null;
  categories_target: string[];
  content_types: string[];
  is_paid: boolean;
  allowed_in_russia: boolean;
  priority: "high" | "medium" | "low";
  notes: string | null;
  status: "active" | "disabled";
}

const CATEGORY_OPTIONS = [
  { value: "search", label: "Поисковый трафик" },
  { value: "social", label: "Соцсети и платформы" },
  { value: "specialized_site", label: "Специализированный сайт" },
  { value: "paid", label: "Платное продвижение" },
  { value: "own_resource", label: "Собственный ресурс" },
  { value: "partner", label: "Партнёрский трафик" },
];

const TARGET_OPTIONS = [
  { value: "salon", label: "Салон" },
  { value: "solo_master", label: "Мастер" },
  { value: "psychologist", label: "Психолог" },
  { value: "body_psychologist", label: "Телесный психолог" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "Высокий" },
  { value: "medium", label: "Средний" },
  { value: "low", label: "Низкий" },
];

const emptyForm = {
  name: "", url: "", category: "search", audience: "",
  categories_target: [] as string[], content_types: "" as string,
  is_paid: false, allowed_in_russia: true, priority: "medium" as string,
  notes: "", status: "active" as string,
};

function toFormFromSource(s: TrafficSource) {
  return {
    name: s.name, url: s.url || "", category: s.category, audience: s.audience || "",
    categories_target: s.categories_target || [], content_types: (s.content_types || []).join(", "),
    is_paid: s.is_paid, allowed_in_russia: s.allowed_in_russia, priority: s.priority,
    notes: s.notes || "", status: s.status,
  };
}

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORY_OPTIONS.map(o => [o.value, o.label]));
const PRIORITY_COLOR: Record<string, string> = { high: "hsl(145,60%,40%)", medium: "hsl(40,90%,45%)", low: "#94A3B8" };

export function TrafficSourcesSection() {
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = () => lkApi.adminTrafficSourcesList().then(setSources).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggleTarget = (list: string[], value: string) =>
    list.includes(value) ? list.filter(v => v !== value) : [...list, value];

  const createSource = async () => {
    if (!form.name.trim()) { setMsg("Укажите название площадки"); return; }
    if (form.categories_target.length === 0) { setMsg("Выберите хотя бы одну целевую категорию"); return; }
    setSaving(true); setMsg("");
    try {
      await lkApi.adminTrafficSourceCreate({
        ...form,
        content_types: form.content_types.split(",").map(s => s.trim()).filter(Boolean),
      });
      setCreating(false);
      setForm(emptyForm);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally { setSaving(false); }
  };

  const startEdit = (s: TrafficSource) => { setEditId(s.id); setEditForm(toFormFromSource(s)); };

  const updateSource = async () => {
    if (editId === null) return;
    setSaving(true);
    try {
      await lkApi.adminTrafficSourceUpdate({
        id: editId, ...editForm,
        content_types: editForm.content_types.split(",").map(s => s.trim()).filter(Boolean),
      });
      setEditId(null);
      load();
    } finally { setSaving(false); }
  };

  const deleteSource = async (s: TrafficSource) => {
    if (!confirm(`Удалить площадку «${s.name}»? Она перестанет использоваться в рекомендациях.`)) return;
    await lkApi.adminTrafficSourceDelete(s.id);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ background: "hsl(185,85%,97%)", border: `1px solid hsl(185,85%,80%)`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12.5, color: "#334155", lineHeight: 1.7, display: "flex", gap: 10 }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
        <span>
          Этот список используется ИИ в блоке «Карта привлечения клиентов» (расширенный «Пульс бизнеса», платный пакет) —
          модель рекомендует пользователю ТОЛЬКО площадки отсюда, ничего от себя не добавляет. Отключайте площадку
          (статус «Отключена») или снимайте «Разрешено в РФ», если она перестала быть актуальной или легальной —
          она сразу перестанет попадать в рекомендации.
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{sources.length} источников трафика</span>
        <button onClick={() => setCreating(!creating)} style={actionBtn(ACCENT)}>
          <Icon name="Plus" size={15} /> Добавить площадку
        </button>
      </div>

      {msg && (
        <div style={{ background: "hsl(0,70%,97%)", border: "1px solid hsl(0,70%,80%)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "hsl(0,70%,45%)" }}>
          {msg}
        </div>
      )}

      {creating && (
        <SourceForm form={form} setForm={setForm} toggleTarget={toggleTarget}>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={actionBtn(ACCENT)} onClick={createSource} disabled={saving}>{saving ? "Создаём..." : "Создать площадку"}</button>
            <button style={{ ...actionBtn("#f0f0ec"), color: "#666" }} onClick={() => { setCreating(false); setForm(emptyForm); setMsg(""); }}>Отмена</button>
          </div>
        </SourceForm>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sources.length === 0 && !creating && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>Источников трафика пока нет</div>
        )}
        {sources.map(s => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8e8e4", padding: "14px 18px" }}>
            {editId === s.id ? (
              <SourceForm form={editForm} setForm={setEditForm} toggleTarget={toggleTarget}>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button style={actionBtn(ACCENT)} onClick={updateSource} disabled={saving}>{saving ? "..." : "Сохранить"}</button>
                  <button style={{ ...actionBtn("#f0f0ec"), color: "#666" }} onClick={() => setEditId(null)}>Отмена</button>
                </div>
              </SourceForm>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{s.name}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#666", background: "#f0f0ec", borderRadius: 20, padding: "2px 8px" }}>{CATEGORY_LABEL[s.category] || s.category}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: PRIORITY_COLOR[s.priority] }}>{PRIORITY_OPTIONS.find(p => p.value === s.priority)?.label}</span>
                    {s.is_paid && <span style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(280,60%,50%)" }}>Платно</span>}
                    {!s.allowed_in_russia && <span style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(0,70%,50%)" }}>ЗАПРЕЩЕНО В РФ</span>}
                    {s.status === "disabled" && <span style={{ fontSize: 10.5, fontWeight: 700, color: "#aaa" }}>ОТКЛЮЧЕНА</span>}
                  </div>
                  {s.audience && <div style={{ fontSize: 12.5, color: "#666", marginBottom: 4 }}>{s.audience}</div>}
                  <div style={{ fontSize: 11.5, color: "#aaa" }}>
                    Для: {(s.categories_target || []).map(t => TARGET_OPTIONS.find(o => o.value === t)?.label || t).join(", ") || "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={iconBtn} onClick={() => startEdit(s)} title="Редактировать"><Icon name="Pencil" size={15} /></button>
                  <button style={iconBtn} onClick={() => deleteSource(s)} title="Удалить"><Icon name="Trash2" size={15} style={{ color: "hsl(0,70%,55%)" }} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceForm({ form, setForm, toggleTarget, children }: {
  form: typeof emptyForm; setForm: (f: typeof emptyForm | ((p: typeof emptyForm) => typeof emptyForm)) => void;
  toggleTarget: (list: string[], value: string) => string[]; children: React.ReactNode;
}) {
  return (
    <div className="admin-edit-inline" style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", padding: "18px 20px", marginBottom: 16 }}>
      <div className="admin-grid-2">
        <div>
          <label style={labelStyle}>НАЗВАНИЕ ПЛОЩАДКИ *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Например, B17.ru" />
        </div>
        <div>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>КАТЕГОРИЯ</label>
          <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>ПРИОРИТЕТ</label>
          <select style={inputStyle} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
            {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>ДЛЯ КАКОЙ АУДИТОРИИ ПОДХОДИТ</label>
          <input style={inputStyle} value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} placeholder="Люди, ищущие психолога, читают статьи по психологии" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>ЧТО МОЖНО РАЗМЕСТИТЬ (через запятую)</label>
          <input style={inputStyle} value={form.content_types} onChange={e => setForm(f => ({ ...f, content_types: e.target.value }))} placeholder="экспертная статья, кейс, профиль специалиста" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ ...labelStyle, marginBottom: 8 }}>ДЛЯ КАКИХ КАТЕГОРИЙ ПОЛЬЗОВАТЕЛЕЙ *</label>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {TARGET_OPTIONS.map(o => (
              <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#444" }}>
                <input type="checkbox" checked={form.categories_target.includes(o.value)} onChange={() => setForm(f => ({ ...f, categories_target: toggleTarget(f.categories_target, o.value) }))} />
                {o.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={{ ...labelStyle, marginBottom: 8 }}>ПЛАТНЫЙ КАНАЛ</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.is_paid} onChange={e => setForm(f => ({ ...f, is_paid: e.target.checked }))} />
            <span style={{ fontSize: 13, color: "#444" }}>Требует рекламного бюджета</span>
          </label>
        </div>
        <div>
          <label style={{ ...labelStyle, marginBottom: 8 }}>СТАТУС</label>
          <div style={{ display: "flex", gap: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={form.allowed_in_russia} onChange={e => setForm(f => ({ ...f, allowed_in_russia: e.target.checked }))} />
              <span style={{ fontSize: 13, color: form.allowed_in_russia ? "hsl(150,60%,35%)" : "hsl(0,70%,50%)", fontWeight: 600 }}>Разрешено в РФ</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={form.status === "active"} onChange={e => setForm(f => ({ ...f, status: e.target.checked ? "active" : "disabled" }))} />
              <span style={{ fontSize: 13, color: form.status === "active" ? "hsl(150,60%,35%)" : "#888", fontWeight: 600 }}>Активна</span>
            </label>
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>ЗАМЕТКИ (внутренние)</label>
          <input style={inputStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Почему добавлена, на что обратить внимание" />
        </div>
      </div>
      {children}
    </div>
  );
}
