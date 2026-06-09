import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, LK_URL, sid, Member, Invite } from "./LkTeamShared";
import { MemberCard } from "./LkTeamMemberCard";
import { InviteForm, PendingInvite } from "./LkTeamInvite";

interface CourseRequest {
  id: number;
  course_id: number;
  member_id: number;
  course_title: string;
  member_name: string;
  message: string;
  created_at: string;
}

const FREE_LIMIT = 3;
const EXTRA_COST = 500;

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkTeam() {
  const [members, setMembers]   = useState<Member[]>([]);
  const [invites, setInvites]   = useState<Invite[]>([]);
  const [credits, setCredits]   = useState(0);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab]           = useState<"members" | "invites" | "credits" | "requests">("members");
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [resolving, setResolving] = useState<number | null>(null);

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

  // Загружаем запросы сразу при монтировании — чтобы знать есть ли они
  useEffect(() => {
    fetch(`${LK_URL}?action=course_requests_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d?.requests)) {
          setRequests(d.requests);
          // Если есть запросы — автоматически открываем вкладку
          if (d.requests.length > 0) setTab("requests");
        }
      });
  }, []);

  useEffect(() => {
    if (tab !== "requests") return;
    setRequestsLoading(true);
    fetch(`${LK_URL}?action=course_requests_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d?.requests)) setRequests(d.requests); })
      .finally(() => setRequestsLoading(false));
  }, [tab]);

  async function resolveRequest(id: number, action: "approve" | "reject") {
    setResolving(id);
    try {
      const res = await fetch(`${LK_URL}?action=course_request_resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ request_id: id, action }),
      }).then(r => r.json());
      if (res.ok) {
        setRequests(p => p.filter(r => r.id !== id));
      }
    } finally { setResolving(null); }
  }

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

      {/* Баннер о лимите тренингов */}
      <div style={{ marginBottom: 16, padding: "12px 16px", background: "hsl(185,85%,97%)", borderRadius: 12, border: `1px solid hsl(185,85%,82%)`, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Icon name="GraduationCap" size={16} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#444", lineHeight: 1.7 }}>
          <strong>Академия:</strong> при покупке тренинга вы можете бесплатно открыть доступ до <strong>{FREE_LIMIT} сотрудников</strong>. Каждый следующий — <strong>{EXTRA_COST} ⚡</strong> за человека. Количество не ограничено.
        </div>
      </div>

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, background: "#f0f0ec", borderRadius: 11, padding: 4, marginBottom: 16 }}>
        {([
          { id: "members",  label: "Сотрудники", count: members.length },
          { id: "invites",  label: "Ожидают",    count: invites.length },
          { id: "requests", label: "Запросы",     count: requests.length },
          { id: "credits",  label: "Кредиты",     count: null },
        ] as { id: typeof tab; label: string; count: number | null }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px", borderRadius: 8, border: "none", background: tab === t.id ? (t.id === "requests" && t.count ? "hsl(25,90%,97%)" : "#fff") : (t.id === "requests" && t.count && t.count > 0 ? "hsl(25,90%,95%)" : "transparent"), color: tab === t.id ? (t.id === "requests" && t.count ? "hsl(25,85%,40%)" : "#0F172A") : (t.id === "requests" && t.count && t.count > 0 ? "hsl(25,85%,45%)" : "#888"), fontSize: 12, fontWeight: (tab === t.id || (t.id === "requests" && t.count && t.count > 0)) ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t.label}
            {t.count !== null && t.count > 0 && <span style={{ background: t.id === "requests" ? "hsl(25,90%,55%)" : (tab === t.id ? ACCENT : "#ddd"), color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "1px 6px" }}>{t.count}</span>}
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
      ) : tab === "requests" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {requestsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #ddd" }}>
              <Icon name="Bell" size={32} style={{ color: "#ddd", marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa" }}>Нет входящих запросов</div>
              <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Когда сотрудник запросит тренинг — запрос появится здесь</div>
            </div>
          ) : requests.map(req => (
            <div key={req.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: "16px 18px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{req.member_name}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>запрашивает: <strong>{req.course_title}</strong></div>
                  {req.message && <div style={{ fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" }}>«{req.message}»</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => resolveRequest(req.id, "approve")}
                    disabled={resolving === req.id}
                    style={{ padding: "8px 14px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: resolving === req.id ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {resolving === req.id ? <Icon name="Loader" size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="Check" size={12} />}
                    Одобрить
                  </button>
                  <button
                    onClick={() => resolveRequest(req.id, "reject")}
                    disabled={resolving === req.id}
                    style={{ padding: "8px 12px", borderRadius: 9, border: "1px solid #E2E8F0", background: "#fff", color: "#aaa", fontSize: 12, cursor: resolving === req.id ? "not-allowed" : "pointer" }}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          ))}
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