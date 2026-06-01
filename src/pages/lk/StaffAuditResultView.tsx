import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, StaffResult, AuditResult } from "./staffAuditTypes";

// ── ScoreBar ──────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ height: 5, borderRadius: 3, background: "#f0f0ec", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── CompareChip ───────────────────────────────────────────────────────────────
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

// ── StaffCard ─────────────────────────────────────────────────────────────────
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

// ── AuditResultView ───────────────────────────────────────────────────────────
export function AuditResultView({ result, onReset }: { result: AuditResult; onReset: () => void }) {
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
          { label: "Средний Score",    value: `${summary.avg_score}/100`, color: scoreColor },
          { label: "Звёзд",            value: summary.stars_count,        color: "hsl(145,60%,35%)" },
          { label: "Требуют внимания", value: summary.problem_count,      color: "hsl(0,75%,55%)" },
          { label: "Сотрудников",      value: staff.length,               color: "#555" },
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
