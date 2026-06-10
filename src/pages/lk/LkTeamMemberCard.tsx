import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, ROLE_OPTIONS, PERM_LABELS, ROLE_COLORS, Member, inp } from "./LkTeamShared";

const LK_API = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface MemberCourse {
  id: number; title: string; category: string; granted: boolean;
  granted_count: number; free_slots_left: number;
}

// ── Тоггл разрешения ──────────────────────────────────────────────────────────
export function PermToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
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
export function MemberCard({ member, onUpdate, onRemove }: {
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

  const [courses, setCourses]         = useState<MemberCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [togglingCourse, setTogglingCourse] = useState<number | null>(null);
  const [freeLimit, setFreeLimit]     = useState(3);
  const [extraCost, setExtraCost]     = useState(500);

  const rc = ROLE_COLORS[member.role_code] || ROLE_COLORS.master;
  const roleLabel = ROLE_OPTIONS.find(r => r.code === member.role_code)?.label || member.role_code;

  useEffect(() => {
    if (!open) return;
    setCoursesLoading(true);
    fetch(`${LK_API}?action=member_course_access&member_id=${member.id}`, {
      headers: { "X-Session-Id": sid() },
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d?.courses)) setCourses(d.courses);
        if (d?.free_limit) setFreeLimit(d.free_limit);
        if (d?.extra_cost) setExtraCost(d.extra_cost);
      })
      .finally(() => setCoursesLoading(false));
  }, [open, member.id]);

  async function toggleCourse(courseId: number, granted: boolean) {
    setTogglingCourse(courseId);
    try {
      await fetch(`${LK_API}?action=member_course_access_set`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ member_id: member.id, course_id: courseId, granted }),
      });
      setCourses(cs => cs.map(c => c.id === courseId ? { ...c, granted } : c));
    } finally { setTogglingCourse(null); }
  }

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
            {member.monthly_credit_limit && <span style={{ fontSize: 10, color: "#aaa" }}>лимит {member.monthly_credit_limit} ⚡/мес</span>}
          </div>
        </div>
        {/* Расход за месяц */}
        <div style={{ textAlign: "right", flexShrink: 0, marginRight: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: (member.spent_month ?? 0) > 0 ? "#0F172A" : "#ccc" }}>
            {member.spent_month ?? 0} ⚡
          </div>
          <div style={{ fontSize: 9, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>за месяц</div>
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

          {/* Академия */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Академия — доступ к тренингам</div>
            {coursesLoading ? (
              <div style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 8, color: "#bbb", fontSize: 13 }}>
                <Icon name="Loader" size={14} style={{ animation: "spin 1s linear infinite" }} /> Загрузка...
              </div>
            ) : courses.length === 0 ? (
              <div style={{ padding: "12px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E8ECF0", fontSize: 12, color: "#aaa", textAlign: "center" }}>
                Нет купленных тренингов. Приобретите тренинг, чтобы выдать доступ сотруднику.
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E8ECF0", overflow: "hidden" }}>
                {courses.map((c, i) => {
                  const isFree = c.free_slots_left > 0;
                  return (
                    <div key={c.id} style={{ padding: "10px 12px", borderBottom: i < courses.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: "#333", fontWeight: 500, lineHeight: 1.3 }}>{c.title}</div>
                          {!c.granted && (
                            <div style={{ fontSize: 11, marginTop: 3, color: isFree ? "hsl(130,55%,40%)" : "hsl(25,85%,45%)", fontWeight: 600 }}>
                              {isFree
                                ? `Бесплатно · осталось ${c.free_slots_left} из ${freeLimit}`
                                : `${extraCost} ⚡ — лимит исчерпан`}
                            </div>
                          )}
                        </div>
                        {c.granted ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                            <Icon name="CheckCircle" size={15} style={{ color: ACCENT }} />
                            <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700 }}>Выдан</span>
                          </div>
                        ) : (
                          <button
                            disabled={togglingCourse === c.id}
                            onClick={() => toggleCourse(c.id, true)}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: isFree ? `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})` : "hsl(25,85%,55%)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: togglingCourse === c.id ? "not-allowed" : "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 4, opacity: togglingCourse === c.id ? 0.6 : 1 }}
                          >
                            {togglingCourse === c.id ? <Icon name="Loader" size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="Unlock" size={11} />}
                            Выдать
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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