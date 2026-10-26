import { useEffect, useState } from "react";
import { partnerRequest } from "./api";
import { GRAY, DARK, LINE } from "./data";
import { Btn, Notice, Field, Spinner, card, inputCss, fmtDate } from "./ui";
import { MeData } from "./PartnerHome";

interface Sub { id: number; publication_url: string; platform: string; status: string; admin_comment: string | null; submitted_at: string }
const SUB: Record<string, { t: string; c: string }> = {
  accepted: { t: "Принято", c: "#166534" }, pending: { t: "На проверке", c: "#92400E" }, rejected: { t: "Не принято", c: "#991B1B" },
};
const PLATFORMS = ["Telegram", "Сайт или блог", "Статья", "ВКонтакте", "Instagram", "YouTube", "Профессиональное сообщество", "Рассылка", "Другое"];
const H = (label: string, hint: string, example?: string, required = true) => ({ label, hint, example, required, limit: 0 });

export default function PartnerPromo({ me, reload }: { me: MeData; reload: () => void }) {
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [f, setF] = useState({ publication_url: "", platform: "Telegram", publication_date: "", partner_comment: "", manual: false });
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  const load = () => partnerRequest<{ submissions: Sub[] }>("submissions_list").then(r => setSubs(r.submissions));
  useEffect(() => { load(); }, []);
  const set = (k: string, v: any) => setF(x => ({ ...x, [k]: v }));

  const send = async () => {
    setBusy(true); setRes(null);
    try {
      const r = await partnerRequest<{ result: string; reason?: string }>("submission_create", { body: f });
      if (r.result === "accepted") setRes({ kind: "success", text: `Размещение подтверждено. Показы продлены на ${me.period_days} дней.` });
      else if (r.result === "pending") setRes({ kind: "info", text: `Отправлено на проверку модератору. ${r.reason || ""} Пока идёт проверка, показы продолжаются.` });
      else setRes({ kind: "error", text: `Автопроверка не подтвердила размещение: ${r.reason}. Исправьте публикацию и отправьте снова.` });
      setF(x => ({ ...x, publication_url: "", partner_comment: "", manual: false }));
      load(); reload();
    } catch (e) { setRes({ kind: "error", text: (e as Error).message }); }
    finally { setBusy(false); }
  };

  const o = me.obligation;
  return (
    <div style={{ display: "grid", gap: 18, maxWidth: 760 }}>
      <div style={card}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: "0 0 6px" }}>Продвижение «Промт Диалог»</h2>
        <p style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: "0 0 14px" }}>
          Раз в {me.period_days} дней опубликуйте материал о платформе и отправьте ссылку. Так ваши показы продлеваются.
          {o.shows_until && <> Сейчас показы {o.shows_allowed ? "активны" : "остановлены"}, срок до <b>{fmtDate(o.shows_until)}</b>.</>}
        </p>
        <Notice kind="info">
          <b>Что должно быть в материале:</b> содержательный рассказ о «Промт Диалог» (чем полезна платформа вашей аудитории) и ваша персональная ссылка:<br />
          <span style={{ wordBreak: "break-all", fontWeight: 600 }}>{me.ref_link}</span>
        </Notice>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 14 }}>Подтвердить размещение</div>
        <Field hint={H("Ссылка на публикацию", "Прямая ссылка на пост или статью. Страница должна быть открыта без входа. Каждая публикация засчитывается один раз.", "https://t.me/ваш_канал/123")}>
          <input style={inputCss} value={f.publication_url} onChange={e => set("publication_url", e.target.value)} placeholder="https://" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          <Field hint={H("Где опубликовано", "Выберите площадку. От неё зависит, сможет ли система проверить страницу автоматически.")}>
            <select style={inputCss} value={f.platform} onChange={e => set("platform", e.target.value)}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
          </Field>
          <Field hint={H("Дата публикации", "Публикация должна быть не старше 14 дней.", undefined, false)}>
            <input type="date" style={inputCss} value={f.publication_date} onChange={e => set("publication_date", e.target.value)} />
          </Field>
        </div>
        <Field hint={H("Комментарий", "Необязательно. Например, если публикация в закрытом сообществе.", undefined, false)}>
          <textarea style={{ ...inputCss, minHeight: 64 }} maxLength={1000} value={f.partner_comment} onChange={e => set("partner_comment", e.target.value)} />
        </Field>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: GRAY, lineHeight: 1.5, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={f.manual} onChange={e => set("manual", e.target.checked)} style={{ marginTop: 3, accentColor: "#14B8A6" }} />
          <span>Площадка закрыта для роботов (например, соцсеть требует вход): проверьте вручную</span>
        </label>
        {res && <div style={{ marginBottom: 12 }}><Notice kind={res.kind}>{res.text}</Notice></div>}
        <Btn onClick={send} disabled={busy || !f.publication_url}>{busy ? "Проверяем страницу…" : "Отправить на подтверждение"}</Btn>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 12 }}>История подтверждений</div>
        {!subs ? <Spinner /> : subs.length === 0 ? <div style={{ fontSize: 13.5, color: GRAY }}>Подтверждений пока не было.</div> : (
          <div style={{ display: "grid", gap: 10 }}>
            {subs.map(s => (
              <div key={s.id} style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <a href={s.publication_url} target="_blank" rel="noopener noreferrer nofollow" style={{ fontSize: 13.5, color: "#0F766E", wordBreak: "break-all" }}>{s.publication_url}</a>
                  <b style={{ fontSize: 12.5, color: SUB[s.status]?.c }}>{SUB[s.status]?.t || s.status}</b>
                </div>
                <div style={{ fontSize: 12, color: GRAY, marginTop: 3 }}>{s.platform} · {fmtDate(s.submitted_at)}</div>
                {s.admin_comment && s.status !== "accepted" && <div style={{ fontSize: 13, color: "#9A3412", marginTop: 4 }}>{s.admin_comment}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
