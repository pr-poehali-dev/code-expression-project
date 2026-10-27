import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { partnerRequest } from "./api";
import { SEGMENTS, OFFER_FIELDS, GRAY, DARK, LINE } from "./data";
import { Btn, Notice, Field, StatusBadge, Spinner, card, inputCss, fmtDate } from "./ui";

interface OfferItem { id: number; title: string; status: string; last_admin_comment: string | null; updated_at: string; pending_version_id: number | null }

export function OffersList({ go }: { go: (t: string, id?: number) => void }) {
  const [items, setItems] = useState<OfferItem[] | null>(null);
  useEffect(() => { partnerRequest<{ offers: OfferItem[] }>("offers_list").then(r => setItems(r.offers)); }, []);
  if (!items) return <Spinner />;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>Мои предложения</h2>
        <Btn onClick={() => go("offer-new")}><Icon name="Plus" size={16} />Создать предложение</Btn>
      </div>
      {items.length === 0 && <div style={card}><div style={{ color: GRAY, fontSize: 14, lineHeight: 1.6 }}>Предложений пока нет. Создайте первое: опишите услугу, для кого она и какую задачу решает.</div></div>}
      {items.filter(o => o.status !== "archived").map(o => (
        <div key={o.id} style={{ ...card, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", cursor: "pointer" }} onClick={() => go("offer-edit", o.id)}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: DARK }}>{o.title}</div>
            <div style={{ fontSize: 12.5, color: GRAY, marginTop: 3 }}>Обновлено {fmtDate(o.updated_at)}{o.pending_version_id ? " · правки на проверке" : ""}</div>
            {o.last_admin_comment && <div style={{ fontSize: 13, color: "#9A3412", marginTop: 6 }}>Комментарий модератора: {o.last_admin_comment}</div>}
          </div>
          <StatusBadge status={o.status} />
          <Icon name="ChevronRight" size={18} style={{ color: GRAY }} />
        </div>
      ))}
    </div>
  );
}

const EMPTY: Record<string, any> = { audience_segments: [], destination_url: "" };

export function OfferForm({ id, go }: { id?: number; go: (t: string) => void }) {
  const [f, setF] = useState<Record<string, any>>(EMPTY);
  const [meta, setMeta] = useState<{ status: string; last_admin_comment: string | null; pending_version_id: number | null; approved_version_id: number | null } | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  const [offerId, setOfferId] = useState<number | undefined>(id);

  const load = useCallback(() => {
    if (!id) return;
    partnerRequest<{ offer: any }>("offer_get", { query: { id } }).then(r => {
      setF({ ...EMPTY, ...r.offer.data }); setMeta(r.offer); setLoading(false);
    });
  }, [id]);
  useEffect(load, [load]);

  const set = (k: string, v: any) => setF(x => ({ ...x, [k]: v }));
  const toggle = (k: string) => set("audience_segments", f.audience_segments.includes(k) ? f.audience_segments.filter((x: string) => x !== k) : [...f.audience_segments, k]);
  const locked = !!meta?.pending_version_id || meta?.status === "pending_review" || meta?.status === "suspended";

  const save = async (): Promise<number | null> => {
    const r = await partnerRequest<{ id: number }>("offer_save", { body: { ...f, id: offerId } });
    setOfferId(r.id);
    return r.id;
  };

  const doSave = async () => {
    setBusy(true); setMsg(null);
    try { await save(); setMsg({ kind: "success", text: "Черновик сохранен" }); }
    catch (e) { setMsg({ kind: "error", text: (e as Error).message }); }
    finally { setBusy(false); }
  };

  const doSubmit = async () => {
    setBusy(true); setMsg(null);
    try {
      const oid = await save();
      await partnerRequest("offer_submit", { body: { id: oid } });
      go("offers");
    } catch (e) { setMsg({ kind: "error", text: (e as Error).message }); }
    finally { setBusy(false); }
  };

  const doArchive = async () => {
    if (!offerId || !confirm("Убрать предложение в архив? Показы остановятся.")) return;
    await partnerRequest("offer_archive", { body: { id: offerId } });
    go("offers");
  };

  if (loading) return <Spinner />;
  const text = (k: string, rows = 0) => {
    const h = OFFER_FIELDS[k];
    return (
      <Field hint={h} key={k}>
        {rows ? <textarea disabled={locked} style={{ ...inputCss, minHeight: rows * 26 + 20, resize: "vertical" }} value={f[k] || ""} maxLength={h.limit} onChange={e => set(k, e.target.value)} />
          : <input disabled={locked} style={inputCss} value={f[k] || ""} maxLength={h.limit} onChange={e => set(k, e.target.value)} />}
      </Field>
    );
  };

  return (
    <div style={{ ...card, maxWidth: 760 }}>
      <button onClick={() => go("offers")} style={{ background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 13.5, padding: 0, marginBottom: 12 }}>← К списку предложений</button>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>{offerId ? "Предложение" : "Новое предложение"}</h2>
        {meta && <StatusBadge status={meta.status} />}
      </div>
      <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>Опишите услугу фактами. ИИ сам решит, кому и когда ее предложить, и сам напишет рекомендацию. Нажмите «?» у поля, чтобы увидеть подсказку и пример.</p>

      {meta?.last_admin_comment && <div style={{ marginBottom: 16 }}><Notice kind="warn"><b>Комментарий модератора:</b> {meta.last_admin_comment}</Notice></div>}
      {locked && <div style={{ marginBottom: 16 }}><Notice kind="info">Предложение на проверке или приостановлено, сейчас его нельзя править.{meta?.approved_version_id ? " Пока идет проверка правок, показывается последняя одобренная версия." : ""}</Notice></div>}
      {meta?.status === "approved" && !locked && <div style={{ marginBottom: 16 }}><Notice kind="info">Если изменить одобренное предложение, правки пойдут на повторную проверку. Пока они не одобрены, показывается прежняя версия.</Notice></div>}

      {text("title")}
      {text("description", 5)}
      <Field hint={{ label: "Для кого предложение", required: true, limit: 0, hint: "Отметьте только тех, кому услуга действительно подходит. Чем точнее выбор, тем качественнее переходы." }}>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(SEGMENTS).map(([k, v]) => (
            <label key={k} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, cursor: locked ? "default" : "pointer" }}>
              <input type="checkbox" disabled={locked} checked={(f.audience_segments || []).includes(k)} onChange={() => toggle(k)} style={{ accentColor: "#14B8A6" }} />{v}
            </label>
          ))}
        </div>
      </Field>
      {text("customer_needs", 3)}
      {text("expected_result", 3)}
      {text("service_format")}
      {text("geography")}
      {text("price")}
      {text("limitations", 3)}
      {text("destination_url")}
      {text("qualification", 3)}
      {text("booking_terms")}

      <div style={{ marginBottom: 16 }}><Notice kind="info">Не пишите гарантий результата («приведу клиентов», «вырастет выручка»), выдуманных отзывов и ложной срочности. Такие предложения отклоняются.</Notice></div>
      {msg && <div style={{ marginBottom: 12 }}><Notice kind={msg.kind}>{msg.text}</Notice></div>}
      {!locked && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn kind="ghost" onClick={doSave} disabled={busy}>Сохранить черновик</Btn>
          <Btn onClick={doSubmit} disabled={busy}>{busy ? "Отправляем…" : "Отправить на модерацию"}</Btn>
          {offerId && <Btn kind="danger" onClick={doArchive}>В архив</Btn>}
        </div>
      )}
      <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 20, paddingTop: 12, fontSize: 12.5, color: GRAY }}>Одобрение не гарантирует показ каждому пользователю: ИИ предлагает услугу только тогда, когда она подходит.</div>
    </div>
  );
}
