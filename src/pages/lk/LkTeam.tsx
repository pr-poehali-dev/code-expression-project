import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

const ROLE_OPTIONS = [
  { code: "admin",          label: "Администратор",      icon: "PhoneCall",  desc: "ИИ-инструменты, скрипты, маркетинг" },
  { code: "master",         label: "Мастер",             icon: "Scissors",   desc: "Обучение мастеров, инструменты" },
  { code: "body_specialist",label: "Специалист по телу", icon: "Activity",   desc: "Диагностика, программы восстановления" },
];

const PERM_LABELS: Record<string, string> = {
  ai_tools:     "ИИ-инструменты",
  diagnostics:  "Диагностика",
  analytics:    "Аналитика бизнеса",
  finance:      "Финансы",
  team:         "Управление командой",
  salon_profile:"Профиль салона",
};

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  owner:          { color: "hsl(40,90%,40%)",  bg: "hsl(40,90%,96%)" },
  admin:          { color: "hsl(185,85%,32%)", bg: "hsl(185,85%,95%)" },
  master:         { color: "hsl(280,60%,50%)", bg: "hsl(280,60%,96%)" },
  body_specialist:{ color: "hsl(145,60%,35%)", bg: "hsl(145,60%,96%)" },
};

interface Member {
  id: number; user_id: number; role_code: string;
  permissions: Record<string, boolean>;
  monthly_credit_limit: number | null;
  is_active: boolean; joined_at: string;
  full_name: string; email: string; username: string;
}

interface Invite {
  id: number; token: string; full_name: string; email: string | null;
  phone: string | null; role_code: string; status: string;
  created_at: string; expires_at: string;
}

const inp: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none" };

// ── Тоггл разрешения ──────────────────────────────────────────────────────────
function PermToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: value ? ACCENT : "#ddd", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

// ── Карточка участника ────────────────────────────────────────────────────────
function MemberCard({ member, onUpdate, onRemove }: {
  member: Member;
  onUpdate: (id: number, data: Partial<Member>) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [removing, setRemoving] = useState(false);
  const [role, setRole]         = useState(member.role_code);
  const [perms, setPerms]       = useState<Record<string, boolean>>(member.permissions || {});
  const [limit, setLimit]       = useState(String(member.monthly_credit_limit ?? ""));
  const [confirmRemove, setConfirmRemove] = useState(false);

  const rc = ROLE_COLORS[member.role_code] || ROLE_COLORS.master;
  const roleLabel = ROLE_OPTIONS.find(r => r.code === member.role_code)?.label || member.role_code;

  async function save() {
    setSaving(true);
    try {
      await onUpdate(member.id, {
        role_code: role,
        permissions: perms,
        monthly_credit_limit: limit ? parseInt(limit) : null,
      } as Partial<Member>);
      setOpen(false);
    } finally { setSaving(false); }
  }

  async function remove() {
    setRemoving(true);
    try { await onRemove(member.id); } finally { setRemoving(false); }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Аватар */}
        <div style={{ width: 42, height: 42, borderRadius: 12, background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: rc.color }}>{(member.full_name || "?")[0].toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{member.full_name}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: rc.bg, color: rc.color, borderRadius: 5, padding: "2px 8px" }}>{roleLabel}</span>
            {member.monthly_credit_limit && <span style={{ fontSize: 10, color: "#aaa" }}>лимит {member.monthly_credit_limit} кред./мес</span>}
          </div>
        </div>
        <button onClick={() => setOpen(p => !p)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: open ? `hsla(185,85%,32%,0.08)` : "#f5f5f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={open ? "ChevronUp" : "Settings"} size={15} style={{ color: open ? ACCENT : "#999" }} />
        </button>
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #F1F5F9" }}>
          {/* Роль */}
          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Роль</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ROLE_OPTIONS.map(r => (
                <button key={r.code} onClick={() => {
                  setRole(r.code);
                  // Сбрасываем права на дефолт новой роли
                  const defaults: Record<string, Record<string, boolean>> = {
                    admin:          { ai_tools: true, diagnostics: true, analytics: false, finance: false, team: false, salon_profile: false },
                    master:         { ai_tools: true, diagnostics: true, analytics: false, finance: false, team: false, salon_profile: false },
                    body_specialist:{ ai_tools: true, diagnostics: true, analytics: false, finance: false, team: false, salon_profile: false },
                  };
                  setPerms(defaults[r.code] || {});
                }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${role === r.code ? ACCENT : "#E2E8F0"}`, background: role === r.code ? `hsla(185,85%,32%,0.05)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "left" }}>
                  <Icon name={r.icon} size={15} style={{ color: role === r.code ? ACCENT : "#ccc", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: role === r.code ? ACCENT : "#444" }}>{r.label}</div>
                    <div style={{ fontSize: 10, color: "#bbb" }}>{r.desc}</div>
                  </div>
                  {role === r.code && <Icon name="Check" size={13} style={{ color: ACCENT, marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Права */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Права доступа</div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "4px 12px", border: "1px solid #E8ECF0" }}>
              {Object.entries(PERM_LABELS).map(([key, label]) => (
                <PermToggle key={key} label={label} value={!!perms[key]}
                  onChange={v => setPerms(p => ({ ...p, [key]: v }))} />
              ))}
            </div>
          </div>

          {/* Лимит кредитов */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Лимит кредитов / месяц</div>
            <input style={inp} type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="Без лимита" />
            <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>Оставьте пустым — лимита нет</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
              {saving ? <Icon name="Loader" size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="Check" size={14} />}
              Сохранить
            </button>
            {confirmRemove ? (
              <button onClick={remove} disabled={removing} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "hsl(0,75%,55%)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                {removing ? <Icon name="Loader" size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="UserMinus" size={13} />}
                Удалить?
              </button>
            ) : (
              <button onClick={() => setConfirmRemove(true)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", color: "#aaa", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", gap: 6 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(0,75%,85%)"; e.currentTarget.style.color = "hsl(0,75%,55%)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#aaa"; }}>
                <Icon name="UserMinus" size={13} />
                Удалить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Форма приглашения ─────────────────────────────────────────────────────────
function InviteForm({ onInvited }: { onInvited: (invite: Invite) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [roleCode, setRoleCode] = useState("master");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [result, setResult]     = useState<{ invite_url: string; full_name: string; email_sent?: boolean; email?: string } | null>(null);
  const [copied, setCopied]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) { setError("Введите имя сотрудника"); return; }
    setLoading(true); setError("");
    try {
      const r = await fetch(`${LK_URL}?action=team_invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ full_name: fullName, email, phone, role_code: roleCode }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Ошибка"); return; }
      setResult(d);
      onInvited(d as Invite);
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  function copyLink() {
    if (!result) return;
    const tryFallback = () => {
      const ta = document.createElement("textarea");
      ta.value = result.invite_url; ta.style.cssText = "position:fixed;top:-9999px;left:-9999px";
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand("copy"); } catch (_) { /* ignore */ }
      document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(result.invite_url)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(tryFallback);
    } else { tryFallback(); }
  }

  function reset() { setResult(null); setFullName(""); setEmail(""); setPhone(""); }

  if (result) return (
    <div style={{ background: "hsl(145,60%,96%)", borderRadius: 14, padding: "20px 20px", border: "1.5px solid hsl(145,60%,85%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(145,60%,88%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="CheckCircle2" size={18} style={{ color: "hsl(145,60%,35%)" }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(145,60%,25%)" }}>Приглашение создано</div>
          <div style={{ fontSize: 12, color: "hsl(145,60%,40%)" }}>
            {result.email_sent
              ? `Письмо отправлено на ${email}`
              : email
                ? "Не удалось отправить письмо — скопируйте ссылку"
                : `Отправьте ссылку ${result.full_name}`}
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#555", wordBreak: "break-all", lineHeight: 1.6 }}>
        {result.invite_url}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={copyLink} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 9, border: "none", background: copied ? "hsl(145,60%,35%)" : ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name={copied ? "Check" : "Copy"} size={13} />
          {copied ? "Скопировано!" : "Копировать ссылку"}
        </button>
        <button onClick={reset} style={{ padding: "10px 14px", borderRadius: 9, border: "1px solid hsl(145,60%,70%)", background: "transparent", color: "hsl(145,60%,35%)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          Ещё
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${ACCENT}`, padding: "20px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Пригласить сотрудника</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 5 }}>Имя *</label>
          <input style={inp} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Анна Петрова" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 5 }}>Email</label>
          <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="anna@salon.ru" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 5 }}>Телефон</label>
          <input style={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 999 000 00 00" />
        </div>
      </div>

      {/* Роль */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 8 }}>Роль</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ROLE_OPTIONS.map(r => (
            <button key={r.code} type="button" onClick={() => setRoleCode(r.code)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${roleCode === r.code ? ACCENT : "#E2E8F0"}`, background: roleCode === r.code ? `hsla(185,85%,32%,0.05)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "left" }}>
              <Icon name={r.icon} size={15} style={{ color: roleCode === r.code ? ACCENT : "#ccc" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: roleCode === r.code ? ACCENT : "#444" }}>{r.label}</div>
                <div style={{ fontSize: 10, color: "#bbb" }}>{r.desc}</div>
              </div>
              {roleCode === r.code && <Icon name="Check" size={13} style={{ color: ACCENT }} />}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "hsl(0,75%,97%)", borderRadius: 9, padding: "9px 12px", marginBottom: 12, fontSize: 12, color: "hsl(0,75%,50%)" }}>
          <Icon name="AlertCircle" size={13} />{error}
        </div>
      )}

      <button type="submit" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 11, border: "none", background: loading ? "#ccc" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : `0 4px 16px hsla(185,85%,32%,0.28)` }}>
        {loading ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} />Создаю ссылку...</> : <><Icon name="UserPlus" size={15} />Создать приглашение</>}
      </button>
    </form>
  );
}

// ── Ожидающее приглашение ─────────────────────────────────────────────────────
function PendingInvite({ invite }: { invite: Invite }) {
  const [copied, setCopied] = useState(false);
  const url = `https://promtdialog.ru/join?token=${invite.token}`;
  const rc = ROLE_COLORS[invite.role_code] || ROLE_COLORS.master;
  const roleLabel = ROLE_OPTIONS.find(r => r.code === invite.role_code)?.label || invite.role_code;

  function copy() {
    const tryFallback = () => {
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.cssText = "position:fixed;top:-9999px;left:-9999px";
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand("copy"); } catch (_) { /* ignore */ }
      document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(tryFallback);
    } else { tryFallback(); }
  }

  // Нормализуем строку даты — PostgreSQL может вернуть без "Z"
  const expiresTs = invite.expires_at ? new Date(invite.expires_at.replace(" ", "T").replace(/(\+\d{2})$/, "$1:00")).getTime() : NaN;
  const daysLeft = isNaN(expiresTs) ? 7 : Math.max(0, Math.round((expiresTs - Date.now()) / 86400000));

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8ECF0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name="Clock" size={15} style={{ color: rc.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{invite.full_name}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: rc.bg, color: rc.color, borderRadius: 5, padding: "1px 6px" }}>{roleLabel}</span>
          <span style={{ fontSize: 10, color: "#bbb" }}>истекает через {daysLeft} дн.</span>
        </div>
      </div>
      <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: copied ? "hsl(145,60%,96%)" : "#f5f5f2", color: copied ? "hsl(145,60%,35%)" : "#666", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
        <Icon name={copied ? "Check" : "Copy"} size={12} />
        {copied ? "Скопировано" : "Скопировать"}
      </button>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkTeam() {
  const [members, setMembers]   = useState<Member[]>([]);
  const [invites, setInvites]   = useState<Invite[]>([]);
  const [credits, setCredits]   = useState(0);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab]           = useState<"members" | "invites" | "credits">("members");

  useEffect(() => {
    fetch(`${LK_URL}?action=team_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        if (d.members) setMembers(d.members);
        if (d.invites) setInvites(d.invites);
        if (d.credits_balance !== undefined) setCredits(d.credits_balance);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(id: number, data: Partial<Member>) {
    await fetch(`${LK_URL}?action=team_member_update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ member_id: id, ...data }),
    });
    setMembers(p => p.map(m => m.id === id ? { ...m, ...data } : m));
  }

  async function handleRemove(id: number) {
    await fetch(`${LK_URL}?action=team_member_remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ member_id: id }),
    });
    setMembers(p => p.filter(m => m.id !== id));
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Users" size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Команда</h2>
            <div style={{ fontSize: 12, color: "#aaa" }}>{members.length} сотрудников · {credits} кредитов</div>
          </div>
        </div>
        <button onClick={() => setShowForm(p => !p)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, border: "none", background: showForm ? "#f5f5f2" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: showForm ? "#666" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name={showForm ? "X" : "UserPlus"} size={15} />
          {showForm ? "Отмена" : "Пригласить"}
        </button>
      </div>

      {/* Форма приглашения */}
      {showForm && (
        <div style={{ marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
          <InviteForm onInvited={invite => {
            setInvites(p => [invite, ...p]);
            setShowForm(false);
          }} />
        </div>
      )}

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, background: "#f0f0ec", borderRadius: 11, padding: 4, marginBottom: 16 }}>
        {([
          { id: "members", label: "Сотрудники", count: members.length },
          { id: "invites", label: "Ожидают",    count: invites.length },
          { id: "credits", label: "Кредиты",    count: null },
        ] as { id: typeof tab; label: string; count: number | null }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "none", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#888", fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t.label}
            {t.count !== null && t.count > 0 && <span style={{ background: tab === t.id ? ACCENT : "#ddd", color: tab === t.id ? "#fff" : "#999", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "1px 6px" }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
        </div>
      ) : tab === "members" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #ddd" }}>
              <Icon name="Users" size={32} style={{ color: "#ddd", marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa" }}>Пока нет сотрудников</div>
              <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Нажмите «Пригласить» чтобы добавить первого</div>
            </div>
          ) : members.map(m => (
            <MemberCard key={m.id} member={m} onUpdate={handleUpdate} onRemove={handleRemove} />
          ))}
        </div>
      ) : tab === "invites" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {invites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #ddd" }}>
              <Icon name="MailOpen" size={32} style={{ color: "#ddd", marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa" }}>Нет активных приглашений</div>
            </div>
          ) : invites.map(inv => <PendingInvite key={inv.id} invite={inv} />)}
        </div>
      ) : (
        /* Кредиты */
        <div>
          <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, borderRadius: 16, padding: "22px 24px", marginBottom: 14, color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Баланс кредитов</div>
            <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{credits}</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>кредитов доступно команде</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Icon name="Info" size={18} style={{ color: ACCENT, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              Пополнение баланса и история расходов сотрудников <strong>скоро</strong>. Кредиты тратятся при использовании ИИ-инструментов.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}