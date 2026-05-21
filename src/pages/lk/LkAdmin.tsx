import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  notes: string;
}

interface BodyZone {
  id: number;
  slug: string;
  name: string;
  description: string;
  diagnosis: string;
  video_url: string;
  sort_order: number;
  techniques: Technique[];
}

interface Technique {
  id: number;
  zone_id: number;
  title: string;
  description: string;
  video_url: string;
  sort_order: number;
}

type Section = "users" | "body";

export default function LkAdmin() {
  const [section, setSection] = useState<Section>("users");

  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>
        Администрирование
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {[
          { id: "users" as Section, icon: "Users", label: "Пользователи" },
          { id: "body" as Section, icon: "User", label: "Схема тела" },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
              borderRadius: 10, border: "none",
              background: section === s.id ? ACCENT : "#fff",
              color: section === s.id ? "#fff" : "#666",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Icon name={s.icon} size={16} />
            {s.label}
          </button>
        ))}
      </div>

      {section === "users" && <UsersSection />}
      {section === "body" && <BodySection />}
    </div>
  );
}

// ── Управление пользователями ──────────────────────────────────────────────

function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newPw, setNewPw] = useState<{ userId: number; pw: string } | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "", notes: "", is_admin: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => lkApi.adminUsers().then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const createUser = async () => {
    setSaving(true); setMsg("");
    try {
      await lkApi.adminCreateUser(form);
      setCreating(false);
      setForm({ username: "", email: "", password: "", full_name: "", notes: "", is_admin: false });
      load();
      setMsg("Пользователь создан");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally { setSaving(false); }
  };

  const updateUser = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await lkApi.adminUpdateUser(editUser);
      setEditUser(null);
      load();
    } finally { setSaving(false); }
  };

  const setPassword = async () => {
    if (!newPw || newPw.pw.length < 6) { setMsg("Минимум 6 символов"); return; }
    setSaving(true);
    try {
      await lkApi.adminSetPassword(newPw.userId, newPw.pw);
      setNewPw(null);
      setMsg("Пароль обновлён");
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: "#888" }}>{users.length} пользователей</span>
        <button onClick={() => setCreating(!creating)} style={actionBtn(ACCENT)}>
          <Icon name="Plus" size={15} /> Создать
        </button>
      </div>

      {msg && <div style={{ background: "hsl(185,85%,96%)", border: `1px solid ${ACCENT}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: ACCENT }}>{msg}</div>}

      {/* Форма создания */}
      {creating && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 18px" }}>Новый пользователь</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "username", label: "Логин", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "password", label: "Пароль", type: "password" },
              { key: "full_name", label: "Имя", type: "text" },
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
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={createUser} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Создаю..." : "Создать"}
            </button>
            <button onClick={() => setCreating(false)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {/* Смена пароля */}
      {newPw && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Новый пароль</h3>
          <input
            type="password"
            value={newPw.pw}
            onChange={e => setNewPw(p => p ? { ...p, pw: e.target.value } : null)}
            placeholder="Минимум 6 символов"
            style={{ ...inputStyle, width: "auto", minWidth: 220 }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={setPassword} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
            <button onClick={() => setNewPw(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {/* Таблица пользователей */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map(u => (
          <div key={u.id} style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            opacity: u.is_active ? 1 : 0.5,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: u.is_admin ? "hsl(280,60%,95%)" : "hsl(185,85%,95%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={u.is_admin ? "ShieldCheck" : "User"} size={18} style={{ color: u.is_admin ? "hsl(280,60%,55%)" : ACCENT }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
                {u.full_name || u.username}
                {u.is_admin && <span style={{ marginLeft: 8, fontSize: 11, background: "hsl(280,60%,95%)", color: "hsl(280,60%,55%)", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>Admin</span>}
                {!u.is_active && <span style={{ marginLeft: 8, fontSize: 11, background: "#f5f5f0", color: "#999", padding: "2px 8px", borderRadius: 20 }}>Неактивен</span>}
              </div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{u.username} · {u.email}</div>
            </div>
            {editUser?.id === u.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 280 }}>
                <input value={editUser.full_name || ""} onChange={e => setEditUser(p => p ? { ...p, full_name: e.target.value } : null)} placeholder="Имя" style={{ ...inputStyle, marginBottom: 0 }} />
                <input value={editUser.email} onChange={e => setEditUser(p => p ? { ...p, email: e.target.value } : null)} placeholder="Email" style={{ ...inputStyle, marginBottom: 0 }} />
                <textarea value={editUser.notes || ""} onChange={e => setEditUser(p => p ? { ...p, notes: e.target.value } : null)} placeholder="Заметки" style={{ ...inputStyle, height: 56, resize: "none", marginBottom: 0 }} />
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={editUser.is_active} onChange={e => setEditUser(p => p ? { ...p, is_active: e.target.checked } : null)} />
                  Активен
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={updateUser} disabled={saving} style={actionBtn(ACCENT)}>Сохранить</button>
                  <button onClick={() => setEditUser(null)} style={actionBtn("#999")}>Отмена</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditUser(u)} style={iconBtn}><Icon name="Edit2" size={15} /></button>
                <button onClick={() => setNewPw({ userId: u.id, pw: "" })} style={iconBtn}><Icon name="Key" size={15} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Управление зонами тела ────────────────────────────────────────────────

function BodySection() {
  const [zones, setZones] = useState<BodyZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editZone, setEditZone] = useState<BodyZone | null>(null);
  const [editTech, setEditTech] = useState<Partial<Technique> & { zone_id?: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => lkApi.adminBodyZones().then(setZones).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const saveZone = async () => {
    if (!editZone) return;
    setSaving(true);
    try { await lkApi.adminBodyZoneSave(editZone); setEditZone(null); load(); }
    finally { setSaving(false); }
  };

  const saveTech = async () => {
    if (!editTech) return;
    setSaving(true);
    try { await lkApi.adminTechniqueSave(editTech); setEditTech(null); load(); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 20 }}>
        Кликни на зону чтобы добавить описание, диагностику и техники
      </p>

      {editZone && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Зона: {editZone.name}</h3>
          {[
            { key: "description", label: "Общее описание", rows: 3 },
            { key: "diagnosis", label: "Диагностика", rows: 5 },
            { key: "video_url", label: "Видео диагностики (Kinescope URL)", rows: 1 },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                rows={f.rows}
                value={(editZone as Record<string, string>)[f.key] || ""}
                onChange={e => setEditZone(p => p ? { ...p, [f.key]: e.target.value } : null)}
                style={{ ...inputStyle, height: f.rows * 28, resize: "vertical" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveZone} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
            <button onClick={() => setEditZone(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {editTech && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>
            {editTech.id ? "Редактировать технику" : "Новая техника"}
          </h3>
          {[
            { key: "title", label: "Название", rows: 1 },
            { key: "description", label: "Описание / инструкция", rows: 5 },
            { key: "video_url", label: "Видео (Kinescope URL)", rows: 1 },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                rows={f.rows}
                value={(editTech as Record<string, string | number | undefined>)[f.key] as string || ""}
                onChange={e => setEditTech(p => p ? { ...p, [f.key]: e.target.value } : null)}
                style={{ ...inputStyle, height: f.rows * 28, resize: "vertical" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveTech} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
            <button onClick={() => setEditTech(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {zones.map(zone => (
          <div key={zone.id} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{zone.name}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>
                  {zone.diagnosis ? "✓ Диагностика" : "— нет диагностики"} · {zone.techniques.length} техник
                </div>
              </div>
              <button onClick={() => setEditZone(zone)} style={iconBtn}><Icon name="Edit2" size={15} /></button>
              <button
                onClick={() => setEditTech({ zone_id: zone.id, title: "", description: "", video_url: "", sort_order: zone.techniques.length })}
                style={iconBtn}
              >
                <Icon name="Plus" size={15} />
              </button>
            </div>
            {zone.techniques.length > 0 && (
              <div style={{ borderTop: "1px solid #f5f5f0", padding: "0 20px 12px" }}>
                {zone.techniques.map(tech => (
                  <div key={tech.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #fafafa" }}>
                    <Icon name="Zap" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#444", flex: 1 }}>{tech.title}</span>
                    {tech.video_url && <Icon name="Video" size={13} style={{ color: "#aaa" }} />}
                    <button onClick={() => setEditTech(tech)} style={{ ...iconBtn, padding: 4 }}>
                      <Icon name="Edit2" size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: "1.5px solid #e8e8e4", fontSize: 14, outline: "none",
  fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
  resize: "none",
};

const actionBtn = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "9px 18px", borderRadius: 10, border: "none",
  background: color, color: "#fff",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "Montserrat, sans-serif",
});

const iconBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e8e8e4",
  background: "#fafafa", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", color: "#888",
  flexShrink: 0,
};
