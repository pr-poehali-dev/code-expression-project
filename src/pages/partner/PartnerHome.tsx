import { useState } from "react";
import Icon from "@/components/ui/icon";
import { GRAY, DARK, LINE, TEAL_DARK } from "./data";
import { Btn, Notice, card, fmtDate } from "./ui";

export interface MeData {
  partner: { business_name: string; ref_code: string; status: string };
  obligation: { state: string; shows_allowed: boolean };
  offers_total: number;
  offers_counts: Record<string, number>;
  stats: { shown: number; clicked: number; ctr: number; registrations: number; link_visits: number; link_visitors: number };
  ref_link: string;
  notifications: { action: string; comment: string | null; created_at: string }[];
}

const ACTION_TEXT: Record<string, string> = {
  offer_approved: "Предложение одобрено", offer_rejected: "Предложение отклонено", offer_changes_requested: "Модератор просит доработать предложение",
  offer_suspend: "Предложение приостановлено", offer_resume: "Предложение возобновлено", submission_accepted: "Размещение подтверждено",
  submission_rejected: "Подтверждение не принято", partner_blocked: "Участие приостановлено", partner_unblocked: "Участие возобновлено",
};

function Stat({ icon, label, value, note }: { icon: string; label: string; value: string | number; note?: string }) {
  return (
    <div style={{ ...card, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: GRAY, fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}><Icon name={icon} size={15} />{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: DARK, fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{note}</div>}
    </div>
  );
}

export default function PartnerHome({ me, go }: { me: MeData; go: (t: string) => void }) {
  const [copied, setCopied] = useState(false);
  const o = me.obligation;
  const approved = me.offers_counts.approved || 0;
  const pending = (me.offers_counts.pending_review || 0);

  const banner = (() => {
    if (me.partner.status === "suspended") return <Notice kind="error">Участие приостановлено модератором. Причину смотрите в уведомлениях ниже или напишите нам.</Notice>;
    if (o.state === "done") return <Notice kind="success">Размещение подтверждено, показы ваших одобренных предложений включены. Повторно публиковать материалы не нужно.</Notice>;
    if (o.state === "awaiting_review") return <Notice kind="info">Размещение на проверке. Как только модератор его подтвердит, показы включатся.</Notice>;
    return <Notice kind="info">Для запуска показов один раз расскажите о «Промт Диалог» на своей площадке и отправьте ссылку в разделе «Продвижение». После подтверждения публикации показы включатся и больше ничего подтверждать не нужно.</Notice>;
  })();

  const copy = async () => {
    await navigator.clipboard.writeText(me.ref_link).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {banner}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14 }}>
        <Stat icon="FileText" label="Предложений" value={me.offers_total} note={`активных ${approved}, на модерации ${pending}`} />
        <Stat icon="Eye" label="Показов" value={me.stats.shown} />
        <Stat icon="MousePointerClick" label="Переходов" value={me.stats.clicked} note={`CTR ${me.stats.ctr}%`} />
        <Stat icon="Link" label="Переходов по ссылке" value={me.stats.link_visits} note={`уникальных ${me.stats.link_visitors}`} />
        <Stat icon="UserPlus" label="Регистраций от вас" value={me.stats.registrations} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => go("offer-new")}><Icon name="Plus" size={16} />Создать предложение</Btn>
        <Btn kind="ghost" onClick={() => go("offers")}>Мои предложения</Btn>
        <Btn kind="ghost" onClick={() => go("promo")}>Подтвердить размещение</Btn>
        <Btn kind="ghost" onClick={() => go("faq")}>Частые вопросы</Btn>
      </div>

      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 6 }}>Ваша персональная ссылка</div>
        <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.55, marginBottom: 10 }}>Используйте ее в материале о «Промт Диалог». По ней считаются регистрации от вас, и по ней система находит размещение на вашей странице.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input readOnly value={me.ref_link} onFocus={e => e.target.select()} style={{ flex: 1, minWidth: 200, padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${LINE}`, fontSize: 13.5, color: DARK, background: "#F8FAFC" }} />
          <Btn kind="ghost" onClick={copy}><Icon name={copied ? "Check" : "Copy"} size={15} />{copied ? "Скопировано" : "Копировать"}</Btn>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 10 }}>Последние уведомления</div>
        {me.notifications.length === 0 && <div style={{ fontSize: 13.5, color: GRAY }}>Пока ничего нового.</div>}
        <div style={{ display: "grid", gap: 10 }}>
          {me.notifications.map((n, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${TEAL_DARK}`, paddingLeft: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{ACTION_TEXT[n.action] || n.action}</div>
              {n.comment && <div style={{ fontSize: 13, color: GRAY, marginTop: 2 }}>{n.comment}</div>}
              <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{fmtDate(n.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
