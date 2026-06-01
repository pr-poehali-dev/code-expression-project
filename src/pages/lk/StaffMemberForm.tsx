import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ROLES, inp, StaffMember } from "./staffAuditTypes";

// ── YesNo ─────────────────────────────────────────────────────────────────────
export function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[true, false].map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1.5px solid ${value === v ? ACCENT : "#E2E8F0"}`, background: value === v ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 12, fontWeight: value === v ? 700 : 400, color: value === v ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          {v ? "Да" : "Нет"}
        </button>
      ))}
    </div>
  );
}

// ── MemberForm ────────────────────────────────────────────────────────────────
export function MemberForm({ member, idx, onChange, onRemove, canRemove }: {
  member: StaffMember; idx: number;
  onChange: (id: string, key: keyof StaffMember, val: string | boolean) => void;
  onRemove: (id: string) => void; canRemove: boolean;
}) {
  const [open, setOpen] = useState(idx === 0);
  const f = (key: keyof StaffMember) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(member.id, key, e.target.value);
   
  const hasData = member.name || member.revenue;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
      <div onClick={() => setOpen(p => !p)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsla(185,85%,32%,0.09)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="User" size={15} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{member.name || `Сотрудник ${idx + 1}`}</div>
          {member.role && <div style={{ fontSize: 11, color: "#aaa" }}>{member.role}</div>}
        </div>
        {canRemove && (
          <button onClick={e => { e.stopPropagation(); onRemove(member.id); }} style={{ background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "4px 8px", fontSize: 16 }}>✕</button>
        )}
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#bbb" }} />
      </div>
      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #F1F5F9" }}>
          {/* Основное */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 14 }}>Основное</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Имя</label>
              <input style={inp} value={member.name} onChange={f("name")} placeholder="Анна" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Роль</label>
              <select style={{ ...inp, cursor: "pointer" }} value={member.role} onChange={f("role")}>
                <option value="">Выберите...</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Стаж (лет)</label>
              <input style={inp} type="number" value={member.experience} onChange={f("experience")} placeholder="2" />
            </div>
          </div>

          {/* Поток */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Поток клиентов</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[
              { key: "clients_count", label: "Клиентов/мес",   ph: "40" },
              { key: "new_clients",   label: "Новых клиентов",  ph: "10" },
              { key: "return_pct",    label: "Возврат (%)",     ph: "60" },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>{label}</label>
                <input style={inp} type="number" value={(member as Record<string, string>)[key]} onChange={f(key as keyof StaffMember)} placeholder={ph} />
              </div>
            ))}
          </div>

          {/* Деньги */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Финансы</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Выручка/мес (₽)</label>
              <input style={inp} type="number" value={member.revenue} onChange={f("revenue")} placeholder="120000" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Средний чек (₽)</label>
              <input style={inp} type="number" value={member.avg_check} onChange={f("avg_check")} placeholder="3000" />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Делает допродажи</label>
            <YesNo value={member.has_upsell} onChange={v => onChange(member.id, "has_upsell", v)} />
          </div>

          {/* Повторная запись */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Повторная запись</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>% повторных записей</label>
              <input style={inp} type="number" value={member.rebooking_pct} onChange={f("rebooking_pct")} placeholder="50" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Предлагает повторную запись</label>
              <YesNo value={member.has_rebooking_offer} onChange={v => onChange(member.id, "has_rebooking_offer", v)} />
            </div>
          </div>

          {/* Качество */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Качество сервиса (оценка 1–10)</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 4 }}>Общая оценка сотрудника</label>
            <div style={{ display: "flex", gap: 5 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => onChange(member.id, "service_score", String(n))} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${String(n) === member.service_score ? ACCENT : "#E2E8F0"}`, background: String(n) === member.service_score ? `hsla(185,85%,32%,0.1)` : "#fff", fontSize: 12, fontWeight: 700, color: String(n) === member.service_score ? ACCENT : "#888", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Продажи */}
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>Продажи</div>
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Использует скрипты продаж</label>
            <YesNo value={member.has_sales_script} onChange={v => onChange(member.id, "has_sales_script", v)} />
          </div>
        </div>
      )}
    </div>
  );
}