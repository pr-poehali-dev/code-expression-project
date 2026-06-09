import Icon from "@/components/ui/icon";
import { ACCENT, User, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";

export function UserCard({ u, editUser, setEditUser, saving, onUpdate, onNewPw, onCourseAccess, onRepEdit, onDelete }: {
  u: User;
  editUser: User | null;
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
  saving: boolean;
  onUpdate: () => void;
  onNewPw: () => void;
  onCourseAccess: () => void;
  onRepEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{
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
          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={editUser.is_active} onChange={e => setEditUser(p => p ? { ...p, is_active: e.target.checked } : null)} />
              Активен
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", padding: "4px 10px", borderRadius: 8, background: editUser.is_admin ? "hsl(280,60%,95%)" : "#f5f5f2", border: `1.5px solid ${editUser.is_admin ? "hsl(280,60%,70%)" : "#e8e8e4"}`, transition: "all 0.15s" }}>
              <input type="checkbox" checked={!!editUser.is_admin} onChange={e => setEditUser(p => p ? { ...p, is_admin: e.target.checked } : null)} />
              <Icon name="ShieldCheck" size={13} style={{ color: editUser.is_admin ? "hsl(280,60%,55%)" : "#bbb" }} />
              <span style={{ color: editUser.is_admin ? "hsl(280,60%,45%)" : "#666", fontWeight: editUser.is_admin ? 700 : 500 }}>Администратор платформы</span>
            </label>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Продлить доступ</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ value: "12months", label: "+ 1 год" }].map(opt => (
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
            <button onClick={onUpdate} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
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
            <button onClick={onNewPw} style={iconBtn} title="Сменить пароль">
              <Icon name="Key" size={15} />
            </button>
            <button
              onClick={onCourseAccess}
              style={{ ...iconBtn, borderColor: "hsl(185,85%,70%)", background: "hsl(185,85%,96%)" }}
              title="Доступ к курсам"
            >
              <Icon name="GraduationCap" size={15} style={{ color: ACCENT }} />
            </button>
            <button
              onClick={onRepEdit}
              style={{ ...iconBtn, borderColor: u.is_representative ? "hsl(38,80%,50%)" : "#e8e8e4", background: u.is_representative ? "hsl(38,90%,94%)" : "#fafafa" }}
              title="Статус представителя"
            >
              <Icon name="Briefcase" size={15} style={{ color: u.is_representative ? "hsl(38,80%,35%)" : "#888" }} />
            </button>
            <button
              onClick={onDelete}
              style={{ ...iconBtn, borderColor: "hsl(0,75%,88%)", background: "hsl(0,75%,97%)" }}
              title="Удалить пользователя"
            >
              <Icon name="Trash2" size={15} style={{ color: "hsl(0,75%,50%)" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}