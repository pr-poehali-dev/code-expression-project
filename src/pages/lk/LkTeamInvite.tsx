import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, LK_URL, sid, ROLE_OPTIONS, ROLE_COLORS, Invite, inp } from "./LkTeamShared";

// ── Форма приглашения ─────────────────────────────────────────────────────────
export function InviteForm({ onInvited }: { onInvited: (invite: Invite) => void }) {
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
export function PendingInvite({ invite, onCancel }: { invite: Invite; onCancel: (id: number) => void }) {
  const [copied, setCopied]         = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const url = `https://promtdialog.ru/join?token=${invite.token}`;
  const rc = ROLE_COLORS[invite.role_code] || ROLE_COLORS.master;
  const roleLabel = ROLE_OPTIONS.find(r => r.code === invite.role_code)?.label || invite.role_code;

  async function cancel() {
    setCancelling(true);
    await fetch(`${LK_URL}?action=invite_cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ invite_id: invite.id }),
    });
    onCancel(invite.id);
  }

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
      <button onClick={cancel} disabled={cancelling} title="Отозвать приглашение" style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: cancelling ? "#f5f5f2" : "hsl(0,75%,97%)", color: cancelling ? "#ccc" : "hsl(0,70%,55%)", cursor: cancelling ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={cancelling ? "Loader" : "Trash2"} size={14} style={cancelling ? { animation: "spin 1s linear infinite" } : {}} />
      </button>
    </div>
  );
}
