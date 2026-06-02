import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, LK_URL, sid, Member, Invite } from "./LkTeamShared";
import { MemberCard } from "./LkTeamMemberCard";
import { InviteForm, PendingInvite } from "./LkTeamInvite";

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

  function handleCancelInvite(id: number) {
    setInvites(p => p.filter(inv => inv.id !== id));
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
          ) : invites.map(inv => <PendingInvite key={inv.id} invite={inv} onCancel={handleCancelInvite} />)}
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
