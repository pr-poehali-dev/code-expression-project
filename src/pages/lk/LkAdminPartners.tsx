import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { partnerRequest } from "@/pages/partner/api";
import { SEGMENTS, OFFER_FIELDS } from "@/pages/partner/data";
import { ACCENT, Spinner } from "./LkAdminShared";

const sid = () => localStorage.getItem("lk_session") || "";
const call = <T,>(action: string, body?: unknown, query?: Record<string, string | number>) =>
  partnerRequest<T>(action, { body, query, session: sid() });

const box: React.CSSProperties = { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 };
const btn = (bg: string, color = "#fff"): React.CSSProperties => ({ background: bg, color, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });
const fd = (v?: string | null) => (v ? new Date(v).toLocaleDateString("ru-RU") : "—");

export function PartnersSection() {
  const [d, setD] = useState<any>(null);
  const [comment, setComment] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const [hist, setHist] = useState<{ id: number; rows: any[] } | null>(null);

  const load = useCallback(() => { call("admin_overview").then(setD).catch(e => setErr(e.message)); }, []);
  useEffect(load, [load]);

  const act = async (fn: () => Promise<unknown>) => {
    setErr("");
    try { await fn(); load(); } catch (e) { setErr((e as Error).message); }
  };
  const c = (k: string) => comment[k] || "";
  const setC = (k: string, v: string) => setComment(x => ({ ...x, [k]: v }));

  const openCabinet = async (partnerId: number) => {
    setErr("");
    const w = window.open("", "_blank");
    try {
      const r = await call<{ session: string }>("admin_view_session", { partner_id: partnerId });
      if (w) { w.opener = null; w.location.href = `/partner?view=${r.session}`; }
    } catch (e) { w?.close(); setErr((e as Error).message); }
  };

  if (!d) return err ? <div style={{ color: "#B91C1C" }}>{err}</div> : <Spinner />;

  return (
    <div>
      {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: 12, borderRadius: 10, marginBottom: 14, fontSize: 14 }}>{err}</div>}

      <h3 style={{ margin: "0 0 12px" }}>Предложения на модерации ({d.pending_offers.length})</h3>
      {d.pending_offers.length === 0 && <div style={{ ...box, color: "#64748B", fontSize: 14 }}>Нет предложений на проверке.</div>}
      {d.pending_offers.map((o: any) => {
        const k = "o" + o.version_id;
        return (
          <div key={o.version_id} style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div><b>{o.data.title}</b><div style={{ fontSize: 13, color: "#64748B" }}>{o.business_name} · версия {o.version_no}{o.approved_version_id ? " · правки одобренного предложения" : " · новое"}</div></div>
              {o.partner_status === "suspended" && <span style={{ color: "#B91C1C", fontWeight: 700, fontSize: 13 }}>Партнёр заблокирован</span>}
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>
              {Object.entries(OFFER_FIELDS).filter(([key]) => key !== "title" && key !== "destination_url" && o.data[key]).map(([key, h]) => (
                <div key={key}><span style={{ color: "#64748B" }}>{h.label}: </span>{o.data[key]}</div>
              ))}
              <div><span style={{ color: "#64748B" }}>Для кого: </span>{(o.data.audience_segments || []).map((s: string) => SEGMENTS[s] || s).join(", ")}</div>
              <div><span style={{ color: "#64748B" }}>Ссылка: </span><a href={o.data.destination_url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: ACCENT, wordBreak: "break-all" }}>{o.data.destination_url}</a></div>
            </div>
            <textarea placeholder="Комментарий для партнёра (обязателен при отклонении и запросе правок)" value={c(k)} onChange={e => setC(k, e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", minHeight: 56, borderRadius: 8, border: "1.5px solid #E2E8F0", padding: 10, fontFamily: "inherit", fontSize: 13.5, marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={btn("#16A34A")} onClick={() => act(() => call("admin_offer_decide", { version_id: o.version_id, decision: "approve", comment: c(k) }))}>Одобрить</button>
              <button style={btn("#EA580C")} onClick={() => act(() => call("admin_offer_decide", { version_id: o.version_id, decision: "changes", comment: c(k) }))}>Запросить исправления</button>
              <button style={btn("#DC2626")} onClick={() => act(() => call("admin_offer_decide", { version_id: o.version_id, decision: "reject", comment: c(k) }))}>Отклонить</button>
            </div>
          </div>
        );
      })}

      <h3 style={{ margin: "24px 0 12px" }}>Подтверждения размещения ({d.pending_submissions.length})</h3>
      {d.pending_submissions.length === 0 && <div style={{ ...box, color: "#64748B", fontSize: 14 }}>Нет подтверждений на проверке. Остальные проверены автоматически.</div>}
      {d.pending_submissions.map((s: any) => {
        const k = "s" + s.id;
        return (
          <div key={s.id} style={box}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>{s.business_name} · {s.platform} · {fd(s.submitted_at)}</div>
            <a href={s.publication_url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: ACCENT, wordBreak: "break-all", fontSize: 14 }}>{s.publication_url}</a>
            {s.admin_comment && <div style={{ fontSize: 13, color: "#92400E", marginTop: 6 }}>Автопроверка: {s.admin_comment}</div>}
            {s.partner_comment && <div style={{ fontSize: 13, marginTop: 6 }}>Комментарий партнёра: {s.partner_comment}</div>}
            <input placeholder="Причина отказа (обязательна при отклонении)" value={c(k)} onChange={e => setC(k, e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1.5px solid #E2E8F0", padding: 10, fontFamily: "inherit", fontSize: 13.5, margin: "10px 0" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={btn("#16A34A")} onClick={() => act(() => call("admin_submission_decide", { id: s.id, decision: "approve" }))}>Подтвердить</button>
              <button style={btn("#DC2626")} onClick={() => act(() => call("admin_submission_decide", { id: s.id, decision: "reject", comment: c(k) }))}>Отклонить</button>
            </div>
          </div>
        );
      })}

      <h3 style={{ margin: "24px 0 12px" }}>Одобренные предложения ({d.live_offers.length})</h3>
      <div style={box}>
        {d.live_offers.length === 0 && <div style={{ color: "#64748B", fontSize: 14 }}>Пока нет.</div>}
        {d.live_offers.map((o: any) => (
          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: 14 }}><b>{o.title}</b> <span style={{ color: "#64748B" }}>· {o.business_name}</span> {o.status === "suspended" && <span style={{ color: "#B91C1C", fontWeight: 700 }}>· приостановлено</span>}</div>
            {o.status === "approved"
              ? <button style={btn("#FEE2E2", "#991B1B")} onClick={() => confirm("Приостановить показ предложения?") && act(() => call("admin_offer_toggle", { offer_id: o.id, action: "suspend" }))}>Приостановить</button>
              : <button style={btn("#DCFCE7", "#166534")} onClick={() => act(() => call("admin_offer_toggle", { offer_id: o.id, action: "resume" }))}>Возобновить</button>}
          </div>
        ))}
      </div>

      <h3 style={{ margin: "24px 0 12px" }}>Партнёры ({d.partners.length})</h3>
      <div style={{ ...box, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 720 }}>
          <thead><tr style={{ textAlign: "left", color: "#64748B" }}>
            {["Партнёр", "Показы до", "Предложений", "Показы / клики", "Регистрации", ""].map(h => <th key={h} style={{ padding: "6px 8px", fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>{d.partners.map((p: any) => (
            <tr key={p.id} style={{ borderTop: "1px solid #F1F5F9" }}>
              <td style={{ padding: "8px" }}><b>{p.business_name}</b><div style={{ color: "#64748B", fontSize: 12 }}>{p.email}</div></td>
              <td style={{ padding: "8px" }}>{p.status === "suspended" ? <span style={{ color: "#B91C1C", fontWeight: 700 }}>заблокирован</span> : <span style={{ color: p.shows_active ? "#166534" : "#92400E" }}>{p.shows_until ? fd(p.shows_until) : "не начато"}{p.shows_until && !p.shows_active ? " (истёк)" : ""}</span>}</td>
              <td style={{ padding: "8px" }}>{p.approved_offers} / {p.offers}</td>
              <td style={{ padding: "8px" }}>{p.shown} / {p.clicked}</td>
              <td style={{ padding: "8px" }}>{p.registrations}</td>
              <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                <button style={{ ...btn("#E0F2FE", "#075985"), marginRight: 6 }} title="Открыть кабинет партнёра в режиме просмотра" onClick={() => openCabinet(p.id)}>Открыть кабинет</button>
                <button style={{ ...btn("#F1F5F9", "#334155"), marginRight: 6 }} onClick={() => call<{ history: any[] }>("admin_partner_history", undefined, { partner_id: p.id }).then(r => setHist({ id: p.id, rows: r.history }))}><Icon name="History" size={13} /></button>
                <button style={btn(p.status === "suspended" ? "#DCFCE7" : "#FEE2E2", p.status === "suspended" ? "#166534" : "#991B1B")}
                  onClick={() => confirm(p.status === "suspended" ? "Снять блокировку?" : "Заблокировать партнёра? Все его предложения перестанут показываться.") && act(() => call("admin_partner_block", { partner_id: p.id, blocked: p.status !== "suspended" }))}>
                  {p.status === "suspended" ? "Разблокировать" : "Заблокировать"}
                </button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {d.partners.length === 0 && <div style={{ color: "#64748B", fontSize: 14, padding: 8 }}>Партнёров пока нет.</div>}
      </div>

      {hist && (
        <div style={box}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><b>История действий</b><button style={btn("#F1F5F9", "#334155")} onClick={() => setHist(null)}>Закрыть</button></div>
          {hist.rows.map((r, i) => <div key={i} style={{ fontSize: 13, padding: "5px 0", borderBottom: "1px solid #F1F5F9" }}><b>{r.action}</b> · {r.actor} · {fd(r.created_at)}{r.comment ? ` · ${r.comment}` : ""}</div>)}
        </div>
      )}
    </div>
  );
}
