import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, User, Spinner, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";

const REP_PERMISSIONS = [
  { key: "ai", label: "ИИ-ассистент" },
  { key: "kp", label: "КП и письма" },
  { key: "scripts", label: "Скрипты продаж" },
  { key: "calc", label: "Расчёт выгоды" },
];

export function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newPw, setNewPw] = useState<{ userId: number; pw: string } | null>(null);
  const [repEdit, setRepEdit] = useState<{ userId: number; isRep: boolean; perms: string[] } | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "", notes: "", is_admin: false, access_type: "12months", segment: "specialist" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  const load = () => lkApi.adminUsers().then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const createUser = async () => {
    setSaving(true); setMsg("");
    try {
      await lkApi.adminCreateUser(form);
      setCreating(false);
      setForm({ username: "", email: "", password: "", full_name: "", notes: "", is_admin: false, access_type: "12months", segment: "specialist" });
      load();
      setMsg("Пользователь создан");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally { setSaving(false); }
  };

  const updateUser = async () => {
    if (!editUser) return;
    setSaving(true);
    try { await lkApi.adminUpdateUser(editUser); setEditUser(null); load(); }
    finally { setSaving(false); }
  };

  const setPassword = async () => {
    if (!newPw || newPw.pw.length < 6) { setMsg("Минимум 6 символов"); return; }
    setSaving(true);
    try { await lkApi.adminSetPassword(newPw.userId, newPw.pw); setNewPw(null); setMsg("Пароль обновлён"); }
    finally { setSaving(false); }
  };

  const saveRep = async () => {
    if (!repEdit) return;
    setSaving(true);
    try {
      await lkApi.adminUpdateRep(repEdit.userId, repEdit.isRep, repEdit.perms);
      setRepEdit(null);
      load();
      setMsg(repEdit.isRep ? "Статус представителя назначен" : "Статус представителя снят");
    } finally { setSaving(false); }
  };

  const deleteUser = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      await lkApi.adminDeleteUser(deleteConfirm.id);
      setDeleteConfirm(null);
      load();
      setMsg("Пользователь удалён");
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Диалог подтверждения удаления */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 380, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="Trash2" size={22} style={{ color: "hsl(0,75%,50%)" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Удалить пользователя?</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px", lineHeight: 1.5 }}>
              <strong>{deleteConfirm.name}</strong> и все его данные (салон, транзакции, сессии) будут удалены безвозвратно.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e8e8e4", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                Отмена
              </button>
              <button onClick={deleteUser} disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "hsl(0,75%,50%)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Удаляю..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{users.length} пользователей</span>
        <button onClick={() => setCreating(!creating)} style={actionBtn(ACCENT)}>
          <Icon name="Plus" size={15} /> Создать
        </button>
      </div>

      {msg && (
        <div style={{ background: "hsl(185,85%,96%)", border: `1px solid ${ACCENT}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: ACCENT }}>
          {msg}
        </div>
      )}

      {/* Форма создания */}
      {creating && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Новый пользователь</h3>
          <div className="admin-grid-2">
            {[
              { key: "username",  label: "Логин",  type: "text"     },
              { key: "email",     label: "Email",  type: "email"    },
              { key: "password",  label: "Пароль", type: "password" },
              { key: "full_name", label: "Имя",    type: "text"     },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Заметки</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              style={{ ...inputStyle, height: 72, resize: "vertical" }}
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={form.is_admin} onChange={e => setForm(p => ({ ...p, is_admin: e.target.checked }))} />
            Администратор
          </label>
          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>Доступ к кабинету</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { value: "12months", label: "1 год" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, access_type: opt.value }))}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "1.5px solid",
                    borderColor: form.access_type === opt.value ? ACCENT : "#e8e8e4",
                    background: form.access_type === opt.value ? `hsl(185,85%,95%)` : "#fafafa",
                    color: form.access_type === opt.value ? ACCENT : "#555",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>Сегмент</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { value: "specialist", label: "Специалист", icon: "User" },
                { value: "salon",      label: "Салон",       icon: "Scissors" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, segment: opt.value }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 8, border: "1.5px solid",
                    borderColor: form.segment === opt.value ? ACCENT : "#e8e8e4",
                    background: form.segment === opt.value ? `hsl(185,85%,95%)` : "#fafafa",
                    color: form.segment === opt.value ? ACCENT : "#555",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <Icon name={opt.icon} size={13} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button onClick={createUser} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Создаю..." : "Создать"}
            </button>
            <button onClick={() => setCreating(false)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {/* Настройка представителя */}
      {repEdit && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>Статус представителя</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
            <input type="checkbox" checked={repEdit.isRep} onChange={e => setRepEdit(p => p ? { ...p, isRep: e.target.checked } : null)} />
            Назначить представителем по салонам
          </label>
          {repEdit.isRep && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>Доступные разделы:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {REP_PERMISSIONS.map(p => (
                  <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${repEdit.perms.includes(p.key) ? ACCENT : "#e8e8e4"}`, background: repEdit.perms.includes(p.key) ? "hsl(185,85%,95%)" : "#fafafa" }}>
                    <input type="checkbox" checked={repEdit.perms.includes(p.key)} onChange={e => setRepEdit(prev => prev ? { ...prev, perms: e.target.checked ? [...prev.perms, p.key] : prev.perms.filter(x => x !== p.key) } : null)} style={{ display: "none" }} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={saveRep} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
            <button onClick={() => setRepEdit(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {/* Смена пароля */}
      {newPw && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Новый пароль</h3>
          <div className="admin-pw-row">
            <input
              type="password"
              value={newPw.pw}
              onChange={e => setNewPw(p => p ? { ...p, pw: e.target.value } : null)}
              placeholder="Минимум 6 символов"
              style={{ ...inputStyle, marginBottom: 0 }}
              className="admin-pw-input"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={setPassword} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
              <button onClick={() => setNewPw(null)} style={actionBtn("#999")}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Список пользователей */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map(u => (
          <div key={u.id} style={{
            background: "#fff", borderRadius: 14, padding: "14px 18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            opacity: u.is_active ? 1 : 0.5,
          }}>
            {editUser?.id === u.id ? (
              /* ── Режим редактирования ── */
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
                  Редактирование: {u.full_name || u.username}
                </div>
                <div className="admin-grid-2" style={{ marginBottom: 10 }}>
                  <div>
                    <label style={labelStyle}>Имя</label>
                    <input value={editUser.full_name || ""} onChange={e => setEditUser(p => p ? { ...p, full_name: e.target.value } : null)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input value={editUser.email} onChange={e => setEditUser(p => p ? { ...p, email: e.target.value } : null)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>Заметки</label>
                  <textarea value={editUser.notes || ""} onChange={e => setEditUser(p => p ? { ...p, notes: e.target.value } : null)} style={{ ...inputStyle, height: 56, resize: "none" }} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={editUser.is_active} onChange={e => setEditUser(p => p ? { ...p, is_active: e.target.checked } : null)} />
                  Активен
                </label>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Продлить доступ</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: "12months", label: "+ 1 год" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEditUser(p => p ? { ...p, access_type: (p as User & { access_type?: string }).access_type === opt.value ? undefined : opt.value } as User & { access_type?: string } : null)}
                        style={{
                          padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                          borderColor: (editUser as User & { access_type?: string }).access_type === opt.value ? ACCENT : "#e8e8e4",
                          background: (editUser as User & { access_type?: string }).access_type === opt.value ? "hsl(185,85%,95%)" : "#fafafa",
                          color: (editUser as User & { access_type?: string }).access_type === opt.value ? ACCENT : "#555",
                          fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Сегмент</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: "specialist", label: "Специалист", icon: "User" },
                      { value: "salon",      label: "Салон",       icon: "Scissors" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEditUser(p => p ? { ...p, segment: opt.value as "specialist" | "salon" } : null)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                          borderColor: editUser.segment === opt.value ? ACCENT : "#e8e8e4",
                          background: editUser.segment === opt.value ? "hsl(185,85%,95%)" : "#fafafa",
                          color: editUser.segment === opt.value ? ACCENT : "#555",
                          fontSize: 12, fontWeight: 600, cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        <Icon name={opt.icon} size={12} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={updateUser} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
                  <button onClick={() => setEditUser(null)} style={actionBtn("#999")}>Отмена</button>
                </div>
              </div>
            ) : (
              /* ── Карточка пользователя ── */
              <div className="admin-user-row">
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: u.is_admin ? "hsl(280,60%,95%)" : "hsl(185,85%,95%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={u.is_admin ? "ShieldCheck" : "User"} size={17} style={{ color: u.is_admin ? "hsl(280,60%,55%)" : ACCENT }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {u.full_name || u.username}
                    {u.is_admin && (
                      <span style={{ fontSize: 10, background: "hsl(280,60%,95%)", color: "hsl(280,60%,55%)", padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>Admin</span>
                    )}
                    {u.is_representative && (
                      <span style={{ fontSize: 10, background: "hsl(38,90%,94%)", color: "hsl(38,80%,35%)", padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>Представитель</span>
                    )}
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 600, background: u.segment === "salon" ? "hsl(335,80%,96%)" : "hsl(185,85%,95%)", color: u.segment === "salon" ? "hsl(335,80%,45%)" : ACCENT }}>
                      {u.segment === "salon" ? "Салон" : "Специалист"}
                    </span>
                    {!u.is_active && (
                      <span style={{ fontSize: 10, background: "#f5f5f0", color: "#999", padding: "2px 7px", borderRadius: 20 }}>Неактивен</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.username} · {u.email}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 3 }}>
                    {u.access_expires_at === null
                      ? <span style={{ color: "#aaa", fontWeight: 500 }}>Дата не задана</span>
                      : new Date(u.access_expires_at) > new Date()
                        ? <span style={{ color: ACCENT, fontWeight: 600 }}>Доступ до {new Date(u.access_expires_at).toLocaleDateString("ru-RU")}</span>
                        : <span style={{ color: "#e55", fontWeight: 600 }}>Доступ истёк {new Date(u.access_expires_at).toLocaleDateString("ru-RU")}</span>
                    }
                  </div>
                </div>
                <div className="admin-user-actions">
                  <button onClick={() => setEditUser(u)} style={iconBtn} title="Редактировать">
                    <Icon name="Edit2" size={15} />
                  </button>
                  <button onClick={() => setNewPw({ userId: u.id, pw: "" })} style={iconBtn} title="Сменить пароль">
                    <Icon name="Key" size={15} />
                  </button>
                  <button
                    onClick={() => setRepEdit({ userId: u.id, isRep: u.is_representative || false, perms: u.rep_permissions || [] })}
                    style={{ ...iconBtn, borderColor: u.is_representative ? "hsl(38,80%,50%)" : "#e8e8e4", background: u.is_representative ? "hsl(38,90%,94%)" : "#fafafa" }}
                    title="Статус представителя"
                  >
                    <Icon name="Briefcase" size={15} style={{ color: u.is_representative ? "hsl(38,80%,35%)" : "#888" }} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ id: u.id, name: u.full_name || u.username })}
                    style={{ ...iconBtn, borderColor: "hsl(0,75%,88%)", background: "hsl(0,75%,97%)" }}
                    title="Удалить пользователя"
                  >
                    <Icon name="Trash2" size={15} style={{ color: "hsl(0,75%,50%)" }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}