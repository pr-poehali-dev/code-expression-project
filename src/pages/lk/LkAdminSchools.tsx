import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import { SchoolsStats } from "./LkAdminSchoolsStats";

interface School {
  id: number;
  name: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  promo_code: string;
  bonus_energy: number;
  is_active: boolean;
  notes: string | null;
  usages_count: number;
  total_bonus_given: number;
}

interface Usage {
  id: number;
  full_name: string;
  email: string;
  bonus_energy: number;
  created_at: string;
}

const emptyForm = { name: "", contact_name: "", contact_phone: "", contact_email: "", bonus_energy: 200, notes: "" };

export function SchoolsSection() {
  const [tab, setTab] = useState<"list" | "stats">("list");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [usagesFor, setUsagesFor] = useState<School | null>(null);
  const [usages, setUsages] = useState<Usage[]>([]);
  const [usagesLoading, setUsagesLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const load = () => lkApi.adminSchoolsList().then(setSchools).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const createSchool = async () => {
    if (!form.name.trim()) { setMsg("Укажите название школы"); return; }
    setSaving(true); setMsg("");
    try {
      const res = await lkApi.adminSchoolCreate(form);
      setCreating(false);
      setForm(emptyForm);
      load();
      setMsg(
        form.contact_email.trim()
          ? (res.email_sent
              ? `Школа создана, промокод сгенерирован и отправлен на ${form.contact_email}`
              : `Школа создана, промокод сгенерирован — письмо на ${form.contact_email} отправить не удалось, скопируйте код вручную`)
          : "Школа создана, промокод сгенерирован. Укажите email школы, чтобы отправлять промокод автоматически"
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally { setSaving(false); }
  };

  const updateSchool = async () => {
    if (!editSchool) return;
    setSaving(true);
    try { await lkApi.adminSchoolUpdate(editSchool); setEditSchool(null); load(); }
    finally { setSaving(false); }
  };

  const deleteSchool = async (s: School) => {
    if (!confirm(`Удалить школу «${s.name}»? Промокод перестанет работать. Действие нельзя отменить.`)) return;
    await lkApi.adminSchoolDelete(s.id);
    load();
  };

  const openUsages = async (s: School) => {
    setUsagesFor(s);
    setUsagesLoading(true);
    try { setUsages(await lkApi.adminSchoolUsages(s.id)); }
    finally { setUsagesLoading(false); }
  };

  const copyCode = (s: School) => {
    navigator.clipboard.writeText(s.promo_code);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {usagesFor && (
        <UsagesModal
          school={usagesFor}
          usages={usages}
          loading={usagesLoading}
          onClose={() => { setUsagesFor(null); setUsages([]); }}
        />
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {([["list", "Школы", "School"], ["stats", "Статистика", "BarChart3"]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
            borderRadius: 9, border: "none", cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
            background: tab === id ? ACCENT : "#f0f0ec",
            color: tab === id ? "#fff" : "#666",
          }}>
            <Icon name={icon} size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "stats" && <SchoolsStats />}

      {tab === "list" && (
      <>
      <div style={{ background: "hsl(185,85%,97%)", border: `1px solid hsl(185,85%,80%)`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12.5, color: "#334155", lineHeight: 1.7, display: "flex", gap: 10 }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
        <span>
          Промокод школы можно применить только при регистрации мастера (не салона). Начисляется разово {" "}
          <strong>указанная сумма энергии</strong> на баланс. Повторная регистрация одного человека под другим email
          с тем же промокодом блокируется по IP и отпечатку устройства. Если указать email школы — письмо с промокодом
          и инструкцией для учеников отправится ей автоматически сразу после создания.
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{schools.length} школ-партнёров</span>
        <button onClick={() => setCreating(!creating)} style={actionBtn(ACCENT)}>
          <Icon name="Plus" size={15} /> Добавить школу
        </button>
      </div>

      {msg && (
        <div style={{ background: "hsl(185,85%,96%)", border: `1px solid ${ACCENT}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: ACCENT }}>
          {msg}
        </div>
      )}

      {creating && (
        <div className="admin-edit-inline" style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Новая школа-партнёр</div>
          <div className="admin-grid-2">
            <div>
              <label style={labelStyle}>НАЗВАНИЕ ШКОЛЫ *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Академия красоты «Стиль»" />
            </div>
            <div>
              <label style={labelStyle}>БОНУС ЭНЕРГИИ ЗА РЕГИСТРАЦИЮ (⚡)</label>
              <input style={inputStyle} type="number" min={0} value={form.bonus_energy} onChange={e => setForm(f => ({ ...f, bonus_energy: +e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>КОНТАКТНОЕ ЛИЦО</label>
              <input style={inputStyle} value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Имя представителя" />
            </div>
            <div>
              <label style={labelStyle}>ТЕЛЕФОН</label>
              <input style={inputStyle} value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="+7 900 000 00 00" />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input style={inputStyle} type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="school@example.com" />
            </div>
            <div>
              <label style={labelStyle}>ЗАМЕТКИ</label>
              <input style={inputStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Внутренний комментарий" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={actionBtn(ACCENT)} onClick={createSchool} disabled={saving}>
              {saving ? "Создаём..." : "Создать и сгенерировать промокод"}
            </button>
            <button style={{ ...actionBtn("#f0f0ec"), color: "#666" }} onClick={() => { setCreating(false); setForm(emptyForm); }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {schools.length === 0 && !creating && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
            Школ-партнёров пока нет
          </div>
        )}
        {schools.map(s => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8e8e4", padding: "14px 18px" }}>
            {editSchool?.id === s.id ? (
              <div className="admin-edit-inline">
                <div className="admin-grid-2">
                  <div>
                    <label style={labelStyle}>НАЗВАНИЕ</label>
                    <input style={inputStyle} value={editSchool.name} onChange={e => setEditSchool(f => f && { ...f, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>БОНУС ЭНЕРГИИ (⚡)</label>
                    <input style={inputStyle} type="number" min={0} value={editSchool.bonus_energy} onChange={e => setEditSchool(f => f && { ...f, bonus_energy: +e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>КОНТАКТНОЕ ЛИЦО</label>
                    <input style={inputStyle} value={editSchool.contact_name || ""} onChange={e => setEditSchool(f => f && { ...f, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>ТЕЛЕФОН</label>
                    <input style={inputStyle} value={editSchool.contact_phone || ""} onChange={e => setEditSchool(f => f && { ...f, contact_phone: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL</label>
                    <input style={inputStyle} value={editSchool.contact_email || ""} onChange={e => setEditSchool(f => f && { ...f, contact_email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 8 }}>СТАТУС</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={editSchool.is_active} onChange={e => setEditSchool(f => f && { ...f, is_active: e.target.checked })} />
                      <span style={{ fontSize: 13, color: editSchool.is_active ? "hsl(130,60%,35%)" : "#888", fontWeight: 600 }}>
                        {editSchool.is_active ? "Активна (промокод работает)" : "Отключена (промокод не работает)"}
                      </span>
                    </label>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button style={actionBtn(ACCENT)} onClick={updateSchool} disabled={saving}>{saving ? "..." : "Сохранить"}</button>
                  <button style={{ ...actionBtn("#f0f0ec"), color: "#666" }} onClick={() => setEditSchool(null)}>Отмена</button>
                </div>
              </div>
            ) : (
              <div className="admin-user-row">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="School" size={18} style={{ color: ACCENT }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{s.name}</span>
                    {!s.is_active && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#f5f5f2", color: "#aaa" }}>ОТКЛЮЧЕНА</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 3, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span
                      onClick={() => copyCode(s)}
                      title="Скопировать промокод"
                      style={{ fontFamily: "monospace", fontWeight: 700, color: ACCENT, background: "hsl(185,85%,96%)", padding: "2px 8px", borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      {s.promo_code} <Icon name={copiedId === s.id ? "Check" : "Copy"} size={11} />
                    </span>
                    <span>{s.bonus_energy} ⚡ за регистрацию</span>
                    <span>·</span>
                    <span
                      onClick={() => openUsages(s)}
                      style={{ cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
                    >
                      {s.usages_count} учеников зарегистрировано
                    </span>
                  </div>
                </div>
                <div className="admin-user-actions">
                  <button style={iconBtn} onClick={() => setEditSchool(s)} title="Редактировать">
                    <Icon name="Pencil" size={14} />
                  </button>
                  <button style={{ ...iconBtn, color: "hsl(0,70%,55%)" }} onClick={() => deleteSchool(s)} title="Удалить">
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}

function UsagesModal({ school, usages, loading, onClose }: { school: School; usages: Usage[]; loading: boolean; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: "24px 26px", maxWidth: 480, width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Ученики школы «{school.name}»</div>
          <button onClick={onClose} style={iconBtn}><Icon name="X" size={15} /></button>
        </div>
        {loading ? <Spinner /> : usages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#aaa", fontSize: 13 }}>Пока никто не регистрировался</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {usages.map(u => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8f8f5", borderRadius: 9 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{u.full_name}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>+{u.bonus_energy} ⚡</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}