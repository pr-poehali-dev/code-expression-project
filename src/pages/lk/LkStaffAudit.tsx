import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

// ── Типы ─────────────────────────────────────────────────────────────────────
interface StaffMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  // Поток
  clients_count: string;
  new_clients: string;
  return_pct: string;
  // Деньги
  revenue: string;
  avg_check: string;
  has_upsell: boolean | null;
  // Повторная запись
  rebooking_pct: string;
  has_rebooking_offer: boolean | null;
  // Качество (1–10)
  service_score: string;
  // Продажи
  has_sales_script: boolean | null;
}

interface StaffResult {
  name: string; role: string;
  score: number; category: string;
  total_loss: number; potential: number;
  loss_return: number; loss_check: number; loss_upsell: number;
  // Исходные метрики (для детальной карточки)
  revenue?: string; avg_check?: string; clients_count?: string;
  new_clients?: string; return_pct?: string; rebooking_pct?: string;
  service_score?: string; experience?: string;
  has_upsell?: boolean | null; has_rebooking_offer?: boolean | null; has_sales_script?: boolean | null;
}

interface AuditResult {
  staff: StaffResult[];
  summary: { avg_score: number; total_loss: number; total_potential: number; stars_count: number; problem_count: number; };
  ai_text: string;
}

interface HistoryItem { id: number; summary: { avg_score: number; total_loss: number }; created_at: string; }

const ROLES = ["Администратор", "Мастер маникюра", "Парикмахер", "Косметолог", "Массажист", "Бровист", "Другое"];

const STAFF_DRAFT_KEY = "lk_staff_audit_draft";
function saveStaffDraft(staff: StaffMember[]) {
  try { localStorage.setItem(STAFF_DRAFT_KEY, JSON.stringify(staff)); } catch (_) { /* ignore */ }
}
function loadStaffDraft(): StaffMember[] | null {
  try { const d = localStorage.getItem(STAFF_DRAFT_KEY); return d ? JSON.parse(d) : null; } catch (_) { return null; }
}
function clearStaffDraft() { localStorage.removeItem(STAFF_DRAFT_KEY); }

function newMember(): StaffMember {
  return { id: Math.random().toString(36).slice(2), name: "", role: "", experience: "", clients_count: "", new_clients: "", return_pct: "", revenue: "", avg_check: "", has_upsell: null, rebooking_pct: "", has_rebooking_offer: null, service_score: "", has_sales_script: null };
}

const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #e8e8e4", fontSize: 12, fontFamily: "Montserrat,sans-serif", background: "#fafaf8", boxSizing: "border-box", color: "#1a1a1a", outline: "none" };

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[true, false].map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1.5px solid ${value === v ? ACCENT : "#e8e8e4"}`, background: value === v ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 12, fontWeight: value === v ? 700 : 400, color: value === v ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          {v ? "Да" : "Нет"}
        </button>
      ))}
    </div>
  );
}

// ── Карточка результата сотрудника ────────────────────────────────────────────
function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ height: 5, borderRadius: 3, background: "#f0f0ec", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

function CompareChip({ label, own, peer, unit = "" }: { label: string; own: number; peer: number; unit?: string }) {
  if (peer === 0) return null;
  const diff = own - peer;
  const pct = peer > 0 ? Math.round((diff / peer) * 100) : 0;
  const better = diff >= 0;
  return (
    <div style={{ fontSize: 10, color: better ? "hsl(145,60%,35%)" : "hsl(0,75%,55%)", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
      <Icon name={better ? "ArrowUp" : "ArrowDown"} size={10} />
      {better ? "+" : ""}{pct}% {label} vs коллег{unit}
    </div>
  );
}

function StaffCard({ emp, peers }: { emp: StaffResult; peers: StaffResult[] }) {
  const [open, setOpen] = useState(false);
  const CAT: Record<string, { label: string; color: string; bg: string }> = {
    star:    { label: "Звезда ⭐",           color: "hsl(145,60%,35%)", bg: "hsl(145,60%,96%)" },
    strong:  { label: "Сильный сотрудник",   color: "hsl(185,85%,32%)", bg: "hsl(185,85%,95%)" },
    average: { label: "Средний",             color: "hsl(40,90%,45%)",  bg: "hsl(40,90%,96%)" },
    problem: { label: "Требует внимания 🔴",  color: "hsl(0,75%,55%)",  bg: "hsl(0,75%,97%)" },
  };
  const cat = CAT[emp.category] || CAT.average;
  const sameRole = peers.filter(p => p.role === emp.role && p.name !== emp.name);
  const hasPeers = sameRole.length > 0;

  const n = (v?: string) => parseFloat(v || "0") || 0;
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const peerAvgRevenue  = avg(sameRole.map(p => n(p.revenue)));
  const peerAvgCheck    = avg(sameRole.map(p => n(p.avg_check)));
  const peerAvgReturn   = avg(sameRole.map(p => n(p.return_pct)));
  const peerAvgRebook   = avg(sameRole.map(p => n(p.rebooking_pct)));
  const peerAvgScore    = avg(sameRole.map(p => p.score));
  const peerAvgClients  = avg(sameRole.map(p => n(p.clients_count)));

  const revenue   = n(emp.revenue);
  const avgCheck  = n(emp.avg_check);
  const returnPct = n(emp.return_pct);
  const reBookPct = n(emp.rebooking_pct);
  const svcScore  = n(emp.service_score);
  const clients   = n(emp.clients_count);
  const newCl     = n(emp.new_clients);

  const returnColor  = returnPct >= 70 ? "hsl(145,60%,35%)" : returnPct >= 50 ? "hsl(40,90%,45%)" : "hsl(0,75%,55%)";
  const rebookColor  = reBookPct >= 60 ? "hsl(145,60%,35%)" : reBookPct >= 35 ? "hsl(40,90%,45%)" : "hsl(0,75%,55%)";

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden" }}>
      {/* Шапка */}
      <div onClick={() => setOpen(p => !p)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: cat.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: cat.color, lineHeight: 1 }}>{emp.score}</div>
          <div style={{ fontSize: 9, color: cat.color, opacity: 0.7 }}>/ 100</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{emp.name || "Без имени"}</div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{emp.role}{emp.experience ? ` · ${emp.experience}` : ""}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: cat.bg, color: cat.color, borderRadius: 5, padding: "2px 7px" }}>{cat.label}</span>
            {emp.total_loss > 0 && <span style={{ fontSize: 10, color: "hsl(0,75%,55%)", fontWeight: 600 }}>−{emp.total_loss.toLocaleString()} ₽/мес</span>}
            {hasPeers && <span style={{ fontSize: 10, color: "#bbb" }}>vs {sameRole.length} коллег</span>}
          </div>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#bbb", flexShrink: 0 }} />
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #f5f5f2" }}>

          {/* Score-бар */}
          <div style={{ marginTop: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>Employee Score</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>
                {hasPeers && `среднее по роли: ${Math.round(peerAvgScore)}`}
              </div>
            </div>
            <ScoreBar value={emp.score} color={cat.color} />
            {hasPeers && peerAvgScore > 0 && (
              <div style={{ display: "flex", marginTop: 6 }}>
                <CompareChip label="score" own={emp.score} peer={peerAvgScore} />
              </div>
            )}
          </div>

          {/* Ключевые метрики */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Ключевые показатели</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8, marginBottom: 14 }}>
            {revenue > 0 && (
              <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Выручка / мес</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{revenue.toLocaleString()} ₽</div>
                {hasPeers && peerAvgRevenue > 0 && <CompareChip label="" own={revenue} peer={peerAvgRevenue} />}
              </div>
            )}
            {avgCheck > 0 && (
              <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Средний чек</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{avgCheck.toLocaleString()} ₽</div>
                {hasPeers && peerAvgCheck > 0 && <CompareChip label="" own={avgCheck} peer={peerAvgCheck} />}
              </div>
            )}
            {clients > 0 && (
              <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Клиентов / мес</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{clients}</div>
                {newCl > 0 && <div style={{ fontSize: 10, color: "hsl(185,85%,32%)", fontWeight: 600 }}>{newCl} новых</div>}
                {hasPeers && peerAvgClients > 0 && <CompareChip label="" own={clients} peer={peerAvgClients} />}
              </div>
            )}
            {svcScore > 0 && (
              <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Качество работы</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{svcScore}/10</div>
                <ScoreBar value={svcScore} max={10} color="hsl(185,85%,32%)" />
              </div>
            )}
          </div>

          {/* Удержание и повторные */}
          {(returnPct > 0 || reBookPct > 0) && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Удержание клиентов</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8, marginBottom: 14 }}>
                {returnPct > 0 && (
                  <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                    <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Возврат клиентов</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: returnColor }}>{returnPct}%</div>
                    <ScoreBar value={returnPct} color={returnColor} />
                    <div style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>норма ≥ 70%</div>
                    {hasPeers && peerAvgReturn > 0 && <CompareChip label="" own={returnPct} peer={peerAvgReturn} unit="%" />}
                  </div>
                )}
                {reBookPct > 0 && (
                  <div style={{ background: "#f8f8f5", borderRadius: 10, padding: "11px 13px" }}>
                    <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Повторная запись</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: rebookColor }}>{reBookPct}%</div>
                    <ScoreBar value={reBookPct} color={rebookColor} />
                    <div style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>норма ≥ 60%</div>
                    {hasPeers && peerAvgRebook > 0 && <CompareChip label="" own={reBookPct} peer={peerAvgRebook} unit="%" />}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Чекбоксы-практики */}
          {(emp.has_upsell !== null || emp.has_rebooking_offer !== null || emp.has_sales_script !== null) && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Практики продаж</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Допродажи", val: emp.has_upsell },
                  { label: "Предлагает повторную запись", val: emp.has_rebooking_offer },
                  { label: "Скрипт продаж", val: emp.has_sales_script },
                ].filter(x => x.val !== null).map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: val ? "hsl(145,60%,96%)" : "hsl(0,75%,97%)", borderRadius: 8, padding: "6px 12px" }}>
                    <Icon name={val ? "Check" : "X"} size={12} style={{ color: val ? "hsl(145,60%,35%)" : "hsl(0,75%,55%)" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: val ? "hsl(145,60%,35%)" : "hsl(0,75%,55%)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Потери */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Финансовые потери</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginBottom: emp.potential > 0 ? 10 : 0 }}>
            {[
              { label: "Потери от возврата", value: emp.loss_return, color: "hsl(0,75%,55%)" },
              { label: "Потери от чека",     value: emp.loss_check,  color: "hsl(40,90%,45%)" },
              { label: "Потери от допродаж", value: emp.loss_upsell, color: "hsl(280,60%,55%)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#f8f8f5", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: value > 0 ? color : "#ccc" }}>{value.toLocaleString()} ₽</div>
              </div>
            ))}
          </div>

          {emp.potential > 0 && (
            <div style={{ padding: "11px 14px", background: "hsl(145,60%,96%)", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "hsl(145,60%,35%)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="TrendingUp" size={13} />
                Потенциал роста: +{emp.potential.toLocaleString()} ₽/мес
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Результат ─────────────────────────────────────────────────────────────────
function AuditResultView({ result, onReset }: { result: AuditResult; onReset: () => void }) {
  const { summary, staff, ai_text } = result;
  const scoreColor = summary.avg_score >= 70 ? "hsl(145,60%,35%)" : summary.avg_score >= 50 ? "hsl(40,90%,45%)" : "hsl(0,75%,55%)";

  return (
    <div style={{ maxWidth: 760 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

      {/* Главный баннер — потери */}
      <div style={{ background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,50%))`, borderRadius: 20, padding: "24px 28px", marginBottom: 16, color: "#fff", animation: "fadeIn 0.4s ease" }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Финансовый рентген команды</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "clamp(36px,6vw,56px)", fontWeight: 800, lineHeight: 1 }}>{summary.total_loss.toLocaleString()} ₽</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>теряете в месяц из-за персонала</div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>+{summary.total_potential.toLocaleString()} ₽</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>потенциал роста</div>
            </div>
          </div>
        </div>
      </div>

      {/* Сводка */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Средний Score",  value: `${summary.avg_score}/100`, color: scoreColor },
          { label: "Звёзд",          value: summary.stars_count,        color: "hsl(145,60%,35%)" },
          { label: "Требуют внимания", value: summary.problem_count,    color: "hsl(0,75%,55%)" },
          { label: "Сотрудников",    value: staff.length,               color: "#555" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#aaa", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Карточки сотрудников */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Оценка каждого сотрудника</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...staff].sort((a, b) => b.score - a.score).map((emp, i) => <StaffCard key={i} emp={emp} peers={staff} />)}
        </div>
      </div>

      {/* ИИ-анализ */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Анализ консультанта</div>
        {ai_text.split("\n").map((line, i) => {
          const isHeader = /^\d+\.|^[А-ЯA-Z].*:$/.test(line.trim()) || line.startsWith("**");
          return line.trim() ? (
            <p key={i} style={{ fontSize: isHeader ? 13 : 13, fontWeight: isHeader ? 700 : 400, color: isHeader ? "#1a1a1a" : "#444", lineHeight: 1.8, margin: "0 0 8px" }}>
              {line.replace(/\*\*/g, "")}
            </p>
          ) : <div key={i} style={{ height: 6 }} />;
        })}
      </div>

      <button onClick={onReset} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="RotateCcw" size={14} />
        Новый анализ
      </button>
    </div>
  );
}

// ── Форма одного сотрудника ───────────────────────────────────────────────────
function MemberForm({ member, idx, onChange, onRemove, canRemove }: {
  member: StaffMember; idx: number;
  onChange: (id: string, key: keyof StaffMember, val: string | boolean) => void;
  onRemove: (id: string) => void; canRemove: boolean;
}) {
  const [open, setOpen] = useState(idx === 0);
  const f = (key: keyof StaffMember) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(member.id, key, e.target.value);
  const hasData = member.name || member.revenue;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden" }}>
      <div onClick={() => setOpen(p => !p)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsla(185,85%,32%,0.09)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="User" size={15} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{member.name || `Сотрудник ${idx + 1}`}</div>
          {member.role && <div style={{ fontSize: 11, color: "#aaa" }}>{member.role}</div>}
        </div>
        {canRemove && (
          <button onClick={e => { e.stopPropagation(); onRemove(member.id); }} style={{ background: "none", border: "none", color: "#ddd", cursor: "pointer", padding: "4px 8px", fontSize: 16 }}>✕</button>
        )}
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#bbb" }} />
      </div>
      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #f5f5f2" }}>
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
              { key: "clients_count", label: "Клиентов/мес",  ph: "40" },
              { key: "new_clients",   label: "Новых клиентов", ph: "10" },
              { key: "return_pct",    label: "Возврат (%)",    ph: "60" },
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
                <button key={n} onClick={() => onChange(member.id, "service_score", String(n))} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${String(n) === member.service_score ? ACCENT : "#e8e8e4"}`, background: String(n) === member.service_score ? `hsla(185,85%,32%,0.1)` : "#fff", fontSize: 12, fontWeight: 700, color: String(n) === member.service_score ? ACCENT : "#888", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
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

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkStaffAudit() {
  const { user } = useLkAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoaded, setStaffLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Загружаем историю анализов
    fetch(`${LK_URL}?action=staff_audit_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});

    // Загружаем сотрудников из базы; если нет — проверяем черновик
    fetch(`${LK_URL}?action=staff_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => {
        if (Array.isArray(d) && d.length > 0) {
          // Данные с сервера: сначала проверяем черновик — он мог содержать несохранённые изменения
          const draft = loadStaffDraft();
          const serverStaff = d.map((s: Record<string, unknown>) => ({
            id:                  String(s.id),
            name:                String(s.name || ""),
            role:                String(s.role || ""),
            experience:          s.experience != null ? String(s.experience) : "",
            clients_count:       s.clients_count != null ? String(s.clients_count) : "",
            new_clients:         s.new_clients != null ? String(s.new_clients) : "",
            return_pct:          s.return_pct != null ? String(s.return_pct) : "",
            revenue:             s.revenue != null ? String(s.revenue) : "",
            avg_check:           s.avg_check != null ? String(s.avg_check) : "",
            has_upsell:          s.has_upsell != null ? Boolean(s.has_upsell) : null,
            rebooking_pct:       s.rebooking_pct != null ? String(s.rebooking_pct) : "",
            has_rebooking_offer: s.has_rebooking_offer != null ? Boolean(s.has_rebooking_offer) : null,
            service_score:       s.service_score != null ? String(s.service_score) : "",
            has_sales_script:    s.has_sales_script != null ? Boolean(s.has_sales_script) : null,
          }));
          // Если черновик новее (больше заполненных полей) — используем его
          if (draft && draft.length > 0 && draft.some(m => m.name)) {
            setStaff(draft);
            setHasDraft(true);
          } else {
            setStaff(serverStaff);
          }
        } else {
          // Нет данных на сервере — проверяем черновик
          const draft = loadStaffDraft();
          if (draft && draft.length > 0 && draft.some(m => m.name)) {
            setStaff(draft);
            setHasDraft(true);
          } else {
            setStaff([newMember()]);
          }
        }
        setStaffLoaded(true);
      }).catch(() => {
        const draft = loadStaffDraft();
        setStaff(draft && draft.length > 0 ? draft : [newMember()]);
        if (draft) setHasDraft(true);
        setStaffLoaded(true);
      });
  }, []);

  // Автосохранение черновика при каждом изменении
  useEffect(() => {
    if (staffLoaded && step === "form") saveStaffDraft(staff);
  }, [staff, staffLoaded, step]);

  function updateMember(id: string, key: keyof StaffMember, val: string | boolean) {
    setStaff(p => p.map(m => m.id === id ? { ...m, [key]: val } : m));
  }

  async function handleAnalyze() {
    const filled = staff.filter(m => m.name && m.revenue);
    if (filled.length === 0) { setError("Заполните данные хотя бы одного сотрудника (имя и выручка обязательны)"); return; }
    setStep("loading"); setError("");
    try {
      const res = await fetch(`${LK_URL}?action=staff_analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ staff: filled }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка анализа"); setStep("form"); return; }
      clearStaffDraft();
      setHasDraft(false);
      setResult(data.result);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setStep("form");
    }
  }

  if (step === "result" && result) {
    return <AuditResultView result={result} onReset={() => { setStep("form"); setResult(null); }} />;
  }

  if (step === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 20 }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Users" size={30} style={{ color: "#fff", animation: "pulse 1.5s ease infinite" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Считаю показатели команды...</div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>Рассчитываю Employee Score, потери и потенциал роста.<br />Обычно 15–30 секунд.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(0,75%,50%)", animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
        </div>
      </div>
    );
  }

  if (!staffLoaded) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} /></div>;
  }

  const dbStaff = staff.filter(m => m.id && !m.id.startsWith("_"));
  const hasDbStaff = dbStaff.length > 0;

  return (
    <div style={{ maxWidth: 700 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Users" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Анализ персонала</h2>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Данные сотрудников загружены из раздела «Сотрудники». Проверьте и запустите анализ.
        </p>
      </div>

      {/* Баннер восстановленного черновика */}
      {hasDraft && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 12, padding: "11px 16px", marginBottom: 16 }}>
          <Icon name="RotateCcw" size={15} style={{ color: "hsl(40,90%,40%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "hsl(40,90%,35%)", fontWeight: 600 }}>Данные восстановлены — продолжайте с того места, где остановились.</div>
          <button onClick={() => { clearStaffDraft(); setHasDraft(false); setStaff([newMember()]); }}
            style={{ marginLeft: "auto", fontSize: 11, color: "hsl(40,90%,50%)", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
            Очистить
          </button>
        </div>
      )}

      {/* Баннер если нет сотрудников в БД */}
      {!hasDbStaff && (
        <div style={{ background: "hsla(40,90%,50%,0.08)", border: "1px solid hsla(40,90%,50%,0.3)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="AlertCircle" size={16} style={{ color: "hsl(40,90%,45%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "#555" }}>
            В базе нет сотрудников. <strong>Добавьте их в разделе «Сотрудники»</strong> — тогда они появятся здесь автоматически, или заполните вручную ниже.
          </div>
        </div>
      )}

      {hasDbStaff && (
        <div style={{ background: "hsla(145,60%,40%,0.06)", border: "1px solid hsla(145,60%,40%,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="CheckCircle" size={14} style={{ color: "hsl(145,60%,40%)", flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#555" }}>Загружено {dbStaff.length} сотрудников из базы. Данные можно отредактировать прямо здесь.</div>
        </div>
      )}

      {/* Сотрудники */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {staff.map((m, i) => (
          <MemberForm key={m.id} member={m} idx={i}
            onChange={updateMember}
            onRemove={id => setStaff(p => p.filter(m => m.id !== id))}
            canRemove={staff.length > 1}
          />
        ))}
      </div>

      {staff.length < 10 && (
        <button onClick={() => setStaff(p => [...p, newMember()])} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: ACCENT, background: `hsla(185,85%,32%,0.07)`, border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", marginBottom: 20 }}>
          <Icon name="Plus" size={15} />
          Добавить сотрудника
        </button>
      )}

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      <button onClick={handleAnalyze} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: "0 4px 18px hsla(0,75%,50%,0.3)" }}>
        <Icon name="BarChart2" size={16} />
        Провести анализ персонала
      </button>

      {/* История */}
      {history.length > 0 && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Предыдущие анализы</div>
          {history.map(h => (
            <div key={h.id}
              onClick={async () => {
                setStep("loading");
                try {
                  const r = await fetch(`${LK_URL}?action=staff_audit_get&id=${h.id}`, { headers: { "X-Session-Id": sid() } });
                  const d = await r.json();
                  if (d.result) { setResult(d.result); setStep("result"); }
                  else setStep("form");
                } catch { setStep("form"); }
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f2", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fafaf8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Score {h.summary?.avg_score || "—"}/100</div>
                <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {h.summary?.total_loss > 0 && <span style={{ fontSize: 12, color: "hsl(0,75%,55%)", fontWeight: 600 }}>−{h.summary.total_loss.toLocaleString()} ₽</span>}
                <Icon name="ChevronRight" size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}