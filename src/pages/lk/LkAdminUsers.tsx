import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, User, Spinner, actionBtn } from "./LkAdminShared";
import { CourseAccessModal, DeleteConfirmModal } from "./LkAdminUserModals";
import { CreateUserForm, RepEditForm, PasswordForm } from "./LkAdminUserForms";
import { UserCard } from "./LkAdminUserCard";

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
  const [courseAccessUser, setCourseAccessUser] = useState<User | null>(null);

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
      {courseAccessUser && (
        <CourseAccessModal user={courseAccessUser} onClose={() => setCourseAccessUser(null)} />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          name={deleteConfirm.name}
          saving={saving}
          onConfirm={deleteUser}
          onCancel={() => setDeleteConfirm(null)}
        />
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

      {creating && (
        <CreateUserForm
          form={form}
          setForm={setForm}
          saving={saving}
          onCreate={createUser}
          onCancel={() => setCreating(false)}
        />
      )}

      {repEdit && (
        <RepEditForm
          repEdit={repEdit}
          setRepEdit={setRepEdit}
          saving={saving}
          onSave={saveRep}
          onCancel={() => setRepEdit(null)}
        />
      )}

      {newPw && (
        <PasswordForm
          pw={newPw.pw}
          setPw={(pw) => setNewPw(p => p ? { ...p, pw } : null)}
          saving={saving}
          onSave={setPassword}
          onCancel={() => setNewPw(null)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map(u => (
          <UserCard
            key={u.id}
            u={u}
            editUser={editUser}
            setEditUser={setEditUser}
            saving={saving}
            onUpdate={updateUser}
            onNewPw={() => setNewPw({ userId: u.id, pw: "" })}
            onCourseAccess={() => setCourseAccessUser(u)}
            onRepEdit={() => setRepEdit({ userId: u.id, isRep: u.is_representative || false, perms: u.rep_permissions || [] })}
            onDelete={() => setDeleteConfirm({ id: u.id, name: u.full_name || u.username })}
          />
        ))}
      </div>
    </div>
  );
}
