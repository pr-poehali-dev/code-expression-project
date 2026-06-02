import Icon from "@/components/ui/icon";
import { ACCENT, labelStyle, inputStyle, actionBtn } from "./LkAdminShared";

export const REP_PERMISSIONS = [
  { key: "ai", label: "ИИ-ассистент" },
  { key: "kp", label: "КП и письма" },
  { key: "scripts", label: "Скрипты продаж" },
  { key: "calc", label: "Расчёт выгоды" },
];

type CreateForm = {
  username: string; email: string; password: string; full_name: string;
  notes: string; is_admin: boolean; access_type: string; segment: string;
};

export function CreateUserForm({ form, setForm, saving, onCreate, onCancel }: {
  form: CreateForm;
  setForm: React.Dispatch<React.SetStateAction<CreateForm>>;
  saving: boolean;
  onCreate: () => void;
  onCancel: () => void;
}) {
  return (
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
          {[{ value: "12months", label: "1 год" }].map(opt => (
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
        <button onClick={onCreate} disabled={saving} style={actionBtn(ACCENT)}>
          {saving ? "Создаю..." : "Создать"}
        </button>
        <button onClick={onCancel} style={actionBtn("#999")}>Отмена</button>
      </div>
    </div>
  );
}

export function RepEditForm({ repEdit, setRepEdit, saving, onSave, onCancel }: {
  repEdit: { userId: number; isRep: boolean; perms: string[] };
  setRepEdit: React.Dispatch<React.SetStateAction<{ userId: number; isRep: boolean; perms: string[] } | null>>;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
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
        <button onClick={onSave} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
        <button onClick={onCancel} style={actionBtn("#999")}>Отмена</button>
      </div>
    </div>
  );
}

export function PasswordForm({ pw, setPw, saving, onSave, onCancel }: {
  pw: string;
  setPw: (pw: string) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Новый пароль</h3>
      <div className="admin-pw-row">
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Минимум 6 символов"
          style={{ ...inputStyle, marginBottom: 0 }}
          className="admin-pw-input"
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onSave} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
          <button onClick={onCancel} style={actionBtn("#999")}>Отмена</button>
        </div>
      </div>
    </div>
  );
}
