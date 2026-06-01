import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

const ROLES = ["Администратор", "Мастер маникюра", "Парикмахер", "Косметолог", "Массажист", "Бровист", "Лэшмейкер", "Другое"];

export interface StaffMember {
  id?: number;
  name: string; role: string; experience: string;
  clients_count: string; new_clients: string; return_pct: string;
  revenue: string; avg_check: string; has_upsell: boolean | null;
  rebooking_pct: string; has_rebooking_offer: boolean | null;
  service_score: string; has_sales_script: boolean | null;
}

function emptyMember(): StaffMember {
  return { name: "", role: "", experience: "", clients_count: "", new_clients: "", return_pct: "", revenue: "", avg_check: "", has_upsell: null, rebooking_pct: "", has_rebooking_offer: null, service_score: "", has_sales_script: null };
}

const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none" };

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[true, false].map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1.5px solid ${value === v ? ACCENT : "#E2E8F0"}`, background: value === v ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 12, fontWeight: value === v ? 700 : 400, color: value === v ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          {v ? "Да" : "Нет"}
        </button>
      ))}
    </div>
  );
}

function MemberForm({ member, onChange, onSave, onCancel, saving }: {
  member: StaffMember;
  onChange: (key: keyof StaffMember, val: string | boolean) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  const f = (key: keyof StaffMember) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(key, e.target.value);
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${ACCENT}`, padding: "20px 20px 18px" }}>
      {/* Основное */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Основное</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Имя *</label>
          <input style={inp} value={member.name} onChange={f("name")} placeholder="Анна" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Роль</label>
          <select style={{ ...inp, cursor: "pointer" }} value={member.role} onChange={f("role")}>
            <option value="">Выберите...</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Стаж (лет)</label>
          <input style={inp} type="number" value={member.experience} onChange={f("experience")} placeholder="2" />
        </div>
      </div>

      {/* Поток */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Поток клиентов / месяц</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[{ k: "clients_count", l: "Клиентов", ph: "40" }, { k: "new_clients", l: "Новых", ph: "10" }, { k: "return_pct", l: "Возврат %", ph: "60" }].map(({ k, l, ph }) => (
          <div key={k}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>{l}</label>
            <input style={inp} type="number" value={(member as Record<string, string>)[k] || ""} onChange={f(k as keyof StaffMember)} placeholder={ph} />
          </div>
        ))}
      </div>

      {/* Финансы */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Финансы</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Выручка/мес (₽)</label>
          <input style={inp} type="number" value={member.revenue} onChange={f("revenue")} placeholder="120000" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Средний чек (₽)</label>
          <input style={inp} type="number" value={member.avg_check} onChange={f("avg_check")} placeholder="3000" />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Делает допродажи</label>
        <YesNo value={member.has_upsell} onChange={v => onChange("has_upsell", v)} />
      </div>

      {/* Повторная запись */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Повторная запись</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>% повторных записей</label>
          <input style={inp} type="number" value={member.rebooking_pct} onChange={f("rebooking_pct")} placeholder="50" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Предлагает повторную запись</label>
          <YesNo value={member.has_rebooking_offer} onChange={v => onChange("has_rebooking_offer", v)} />
        </div>
      </div>

      {/* Качество */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Оценка сотрудника (1–10)</div>
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => onChange("service_score", String(n))} style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${String(n) === member.service_score ? ACCENT : "#E2E8F0"}`, background: String(n) === member.service_score ? `hsla(185,85%,32%,0.1)` : "#fff", fontSize: 11, fontWeight: 700, color: String(n) === member.service_score ? ACCENT : "#888", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            {n}
          </button>
        ))}
      </div>

      {/* Продажи */}
      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Продажи</div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Использует скрипты продаж</label>
        <YesNo value={member.has_sales_script} onChange={v => onChange("has_sales_script", v)} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={saving} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: saving ? "#bbb" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
          {saving ? <><Icon name="Loader" size={14} style={{ animation: "spin 1s linear infinite" }} /> Сохраняю...</> : <><Icon name="Check" size={14} /> Сохранить</>}
        </button>
        <button onClick={onCancel} style={{ padding: "11px 18px", background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          Отмена
        </button>
      </div>
    </div>
  );
}

export default function LkEmployees() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [editForm, setEditForm] = useState<StaffMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<StaffMember>(emptyMember());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadStaff(); }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const r = await fetch(`${LK_URL}?action=staff_list`, { headers: { "X-Session-Id": sid() } });
      const d = await r.json();
      if (Array.isArray(d)) setStaff(d.map(normalizeFromDb));
    } catch { /* тихо */ }
    finally { setLoading(false); }
  }

  function normalizeFromDb(s: Record<string, unknown>): StaffMember {
    return {
      id:                  s.id as number,
      name:                String(s.name || ""),
      role:                String(s.role || ""),
      experience:          s.experience != null ? String(s.experience) : "",
      clients_count:       s.clients_count != null ? String(s.clients_count) : "",
      new_clients:         s.new_clients != null ? String(s.new_clients) : "",
      return_pct:          s.return_pct != null ? String(s.return_pct) : "",
      revenue:             s.revenue != null ? String(s.revenue) : "",
      avg_check:           s.avg_check != null ? String(s.avg_check) : "",
      has_upsell:          s.has_upsell != null ? Boolean(s.has_upsell) : null,
      rebooking_pct:       s.rebooking_pct != null ? String(s.rebooking_pct) : "",
      has_rebooking_offer: s.has_rebooking_offer != null ? Boolean(s.has_rebooking_offer) : null,
      service_score:       s.service_score != null ? String(s.service_score) : "",
      has_sales_script:    s.has_sales_script != null ? Boolean(s.has_sales_script) : null,
    };
  }

  async function handleSave(form: StaffMember) {
    if (!form.name.trim()) { setError("Введите имя сотрудника"); return; }
    setSaving(true); setError("");
    try {
      const r = await fetch(`${LK_URL}?action=staff_save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          ...form,
          experience:    form.experience    ? Number(form.experience)    : null,
          clients_count: form.clients_count ? Number(form.clients_count) : null,
          new_clients:   form.new_clients   ? Number(form.new_clients)   : null,
          return_pct:    form.return_pct    ? Number(form.return_pct)    : null,
          revenue:       form.revenue       ? Number(form.revenue)       : null,
          avg_check:     form.avg_check     ? Number(form.avg_check)     : null,
          rebooking_pct: form.rebooking_pct ? Number(form.rebooking_pct) : null,
          service_score: form.service_score ? Number(form.service_score) : null,
        }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Ошибка сохранения"); return; }
      setAdding(false); setEditing(null); setAddForm(emptyMember()); setEditForm(null);
      await loadStaff();
    } catch { setError("Ошибка соединения"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить сотрудника?")) return;
    await fetch(`${LK_URL}?action=staff_delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ id }),
    });
    await loadStaff();
  }

  const CATEGORY_COLORS: Record<string, string> = { admin: "#888", master: ACCENT, specialist: "hsl(280,60%,55%)" };

  return (
    <div style={{ maxWidth: 720 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>Сотрудники</h2>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Данные сотрудников используются в ИИ-анализе персонала</p>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />{error}
          <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#c33" }}>✕</button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <>
          {/* Список сотрудников */}
          {staff.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {staff.map(m => (
                <div key={m.id}>
                  {editing?.id === m.id && editForm ? (
                    <MemberForm
                      member={editForm}
                      onChange={(key, val) => setEditForm(p => p ? { ...p, [key]: val } : p)}
                      onSave={() => handleSave(editForm)}
                      onCancel={() => { setEditing(null); setEditForm(null); }}
                      saving={saving}
                    />
                  ) : (
                    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `hsla(185,85%,32%,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="User" size={18} style={{ color: ACCENT }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{m.name}</div>
                        <div style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
                          {m.role && <span style={{ fontSize: 11, color: "#888" }}>{m.role}</span>}
                          {m.revenue && <span style={{ fontSize: 11, color: "hsl(145,60%,40%)", fontWeight: 600 }}>{Number(m.revenue).toLocaleString()} ₽/мес</span>}
                          {m.avg_check && <span style={{ fontSize: 11, color: "#aaa" }}>чек {Number(m.avg_check).toLocaleString()} ₽</span>}
                          {m.return_pct && <span style={{ fontSize: 11, color: "#aaa" }}>возврат {m.return_pct}%</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setEditing(m); setEditForm({ ...m }); }} style={{ background: "#f5f5f2", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                          Изменить
                        </button>
                        <button onClick={() => handleDelete(m.id!)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", padding: "7px 8px" }}>
                          <Icon name="Trash2" size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {staff.length === 0 && !adding && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
              <Icon name="Users" size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Сотрудников пока нет</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Добавьте первого сотрудника</div>
            </div>
          )}

          {/* Форма добавления */}
          {adding ? (
            <MemberForm
              member={addForm}
              onChange={(key, val) => setAddForm(p => ({ ...p, [key]: val }))}
              onSave={() => handleSave(addForm)}
              onCancel={() => { setAdding(false); setAddForm(emptyMember()); }}
              saving={saving}
            />
          ) : (
            <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, border: "none", borderRadius: 12, padding: "12px 22px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: `0 4px 16px hsla(185,85%,32%,0.25)` }}>
              <Icon name="UserPlus" size={16} />
              Добавить сотрудника
            </button>
          )}
        </>
      )}
    </div>
  );
}