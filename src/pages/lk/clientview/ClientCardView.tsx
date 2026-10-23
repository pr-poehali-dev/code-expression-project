import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ClientCard, ChatEntry, QUESTIONS, Interest } from "./types";
import { clientViewApi } from "./api";
import { CostBadge, BalanceHint } from "./EnergyHint";
import { useEnergy } from "@/contexts/EnergyContext";

const DARK = "#0F172A";
const GRAY = "#64748B";

const INTEREST: Record<Interest, { label: string; color: string; bg: string }> = {
  interest: { label: "Потенциальный интерес", color: "#047857", bg: "#D1FAE5" },
  lack_info: { label: "Недостаточно информации", color: "#B45309", bg: "#FEF3C7" },
  risk: { label: "Высокий риск отказа", color: "#B91C1C", bg: "#FEE2E2" },
};

function List({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "0.04em", marginBottom: 6 }}>{title}</div>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: DARK, lineHeight: 1.5, marginBottom: 4 }}>
          <span style={{ color }}>•</span><span>{t}</span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  card: ClientCard;
  index: number;
  testId: number;
  chat: ChatEntry[];
  onChat: (e: ChatEntry) => void;
  onTopUp?: () => void;
}

export default function ClientCardView({ card, index, testId, chat, onChat, onTopUp }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { refresh } = useEnergy();
  const tag = INTEREST[card.interest];
  const mine = chat.filter(c => c.client_index === index);

  const ask = async (text: string) => {
    if (busy || text.trim().length < 3) return;
    setBusy(true);
    setErr("");
    try {
      const entry = await clientViewApi.ask(testId, index, text.trim());
      onChat(entry);
      setQ("");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 18, padding: "20px 20px 16px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: DARK, lineHeight: 1.35 }}>{card.title}</div>
      <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{card.tagline}</div>
      <span style={{ alignSelf: "flex-start", marginTop: 12, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999, background: tag.bg, color: tag.color }}>
        {tag.label}
      </span>

      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.04em" }}>ЧТО МОЖЕТ ПОДУМАТЬ</div>
      <div style={{ marginTop: 6, fontSize: 14, fontStyle: "italic", color: DARK, lineHeight: 1.55, borderLeft: "3px solid #2DD4BF", paddingLeft: 12 }}>
        {card.thought}
      </div>
      <List title="ЧТО ПРИВЛЕКАЕТ" items={card.attracts} color="#047857" />
      <List title="ЧТО ВЫЗЫВАЕТ СОМНЕНИЕ" items={card.doubts} color="#B45309" />
      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: "hsl(185,85%,32%)", letterSpacing: "0.04em" }}>ЧТО СТОИТ ПРОВЕРИТЬ</div>
      <div style={{ marginTop: 6, fontSize: 14, color: DARK, lineHeight: 1.55 }}>{card.check}</div>

      <button onClick={() => setOpen(o => !o)} style={{
        marginTop: 16, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        background: "#F1F5F9", border: "none", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, fontFamily: "inherit", color: DARK,
      }}>
        <Icon name="MessageCircle" size={15} />
        {open ? "Скрыть диалог" : `Задать вопрос${mine.length ? ` (${mine.length})` : ""}`}
      </button>

      {open && (
        <div style={{ marginTop: 14, borderTop: "1px solid #E8ECF0", paddingTop: 14 }}>
          {mine.map((m, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: GRAY, marginBottom: 4 }}>Ты: {m.question}</div>
              <div style={{ fontSize: 14, color: DARK, lineHeight: 1.55, background: "#F8FAFC", borderRadius: 12, padding: "10px 12px" }}>{m.answer}</div>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {QUESTIONS.map(s => (
              <button key={s} disabled={busy} onClick={() => ask(s)} style={{
                cursor: busy ? "wait" : "pointer", fontFamily: "inherit", fontSize: 12, padding: "6px 10px", borderRadius: 999,
                border: "1px solid #E2E8F0", background: "#fff", color: DARK,
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(q)}
              placeholder="Твой вопрос" maxLength={400} disabled={busy}
              style={{ flex: 1, minWidth: 0, border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: DARK }} />
            <button disabled={busy || q.trim().length < 3} onClick={() => ask(q)} style={{
              border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 700, fontFamily: "inherit", fontSize: 14,
              background: "#2DD4BF", color: DARK, cursor: "pointer", opacity: busy || q.trim().length < 3 ? 0.5 : 1,
            }}>{busy ? "…" : <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Спросить <CostBadge /></span>}</button>
          </div>
          <div style={{ marginTop: 8 }}><BalanceHint onTopUp={onTopUp} /></div>
          {err && <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 8 }}>{err}</div>}
        </div>
      )}
    </div>
  );
}
