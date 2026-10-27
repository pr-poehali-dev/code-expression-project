import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const URL_ = (func2url as Record<string, string>)["masters-accrual"] || "";
const sid = () => localStorage.getItem("lk_session") || "";

interface Rec { id: number; text: string; partner_name: string; offer_title: string | null; price: string | null }

const call = (action: string, qs: Record<string, string | number>) =>
  fetch(`${URL_}?${new URLSearchParams({ action, ...Object.fromEntries(Object.entries(qs).map(([k, v]) => [k, String(v)])) })}`, {
    headers: { "X-Session-Id": sid() },
  }).then(r => r.json());

export default function PartnerRecommendation({ source, dark = false }: { source: "pulse" | "steps"; dark?: boolean }) {
  const [rec, setRec] = useState<Rec | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
    if (!URL_) return;
    call("partner_recommendation", { source }).then(d => setRec(d.recommendation || null)).catch(() => {});
  }, [source]);

  useEffect(() => {
    if (rec && !sent.current) {
      sent.current = true;
      call("partner_rec_shown", { id: rec.id }).catch(() => {});
    }
  }, [rec]);

  if (!rec) return null;

  const open = async () => {
    setBusy(true); setFailed(false);
    const w = window.open("", "_blank");
    try {
      const d = await call("partner_rec_click", { id: rec.id });
      if (d.url && w) { w.opener = null; w.location.href = d.url; }
      else { w?.close(); setFailed(true); }
    } catch { w?.close(); setFailed(true); }
    finally { setBusy(false); }
  };

  const c = dark
    ? { bg: "rgba(139,92,246,0.1)", br: "rgba(139,92,246,0.3)", title: "hsl(260,70%,78%)", text: "rgba(255,255,255,0.88)", sub: "rgba(255,255,255,0.5)", btnBg: "linear-gradient(135deg,#2DD4BF,#14B8A6)", btnTx: "#0F172A" }
    : { bg: "#F5F3FF", br: "#DDD6FE", title: "#6D28D9", text: "#1E293B", sub: "#64748B", btnBg: "linear-gradient(135deg,#2DD4BF,#14B8A6)", btnTx: "#0F172A" };

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.br}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <Icon name="Handshake" size={14} style={{ color: c.title }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: c.title, textTransform: "uppercase", letterSpacing: 1 }}>Если нужна помощь специалиста</span>
      </div>
      <div style={{ fontSize: 13.5, color: c.text, lineHeight: 1.65, whiteSpace: "pre-line", marginBottom: 12 }}>{rec.text}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button onClick={open} disabled={busy} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: c.btnTx, background: c.btnBg, border: "none", borderRadius: 9, padding: "10px 18px", cursor: busy ? "default" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
          Посмотреть предложение <Icon name="ExternalLink" size={13} />
        </button>
        <span style={{ fontSize: 12, color: c.sub }}>{rec.partner_name}{rec.price ? ` · ${rec.price}` : ""}</span>
      </div>
      {failed && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 8 }}>Не удалось открыть страницу. Попробуйте еще раз.</div>}
      <div style={{ fontSize: 11, color: c.sub, marginTop: 10, lineHeight: 1.5 }}>
        Партнерская рекомендация: исполнитель сотрудничает с «Промт Диалог». Вы перейдете на сайт внешнего специалиста, а рекомендация сформирована по вашей ситуации и не гарантирует результат.
      </div>
    </div>
  );
}
