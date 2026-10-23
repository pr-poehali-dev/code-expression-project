import { useState } from "react";
import Icon from "@/components/ui/icon";
import ClientCardView from "./ClientCardView";
import { ViewTest, ChatEntry, subjectTitle, goalTitle } from "./types";
import { clientViewApi } from "./api";

const DARK = "#0F172A";
const GRAY = "#64748B";
const ACCENT = "hsl(185,85%,32%)";

const SHIFT = {
  better: { label: "Стало понятнее", color: "#047857", icon: "TrendingUp" },
  same: { label: "Без существенных изменений", color: GRAY, icon: "Minus" },
  worse: { label: "Стало хуже", color: "#B91C1C", icon: "TrendingDown" },
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

interface Props {
  test: ViewTest;
  onRetest: () => void;
  onNew: () => void;
}

export default function ClientViewResult({ test, onRetest, onNew }: Props) {
  const [chat, setChat] = useState<ChatEntry[]>(test.chat || []);
  const [note, setNote] = useState(test.reality_note || "");
  const [saved, setSaved] = useState(false);
  const r = test.result;

  const saveNote = async () => {
    await clientViewApi.saveNote(test.id, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, background: "#F1F5F9", color: DARK, padding: "5px 11px", borderRadius: 999 }}>{subjectTitle(test.subject)}</span>
        <span style={{ fontSize: 12, fontWeight: 700, background: "#F1F5F9", color: DARK, padding: "5px 11px", borderRadius: 999 }}>{goalTitle(test.goal)}</span>
      </div>
      <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.5, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "10px 14px", margin: "12px 0 20px" }}>
        Это условные профили, а не реальные опрошенные люди. Реакции — гипотезы для проверки, а не измеренные вероятности покупки.
      </div>

      {r.comparison && (
        <div style={{ background: "hsl(185,85%,96%)", border: `1px solid ${ACCENT}`, borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 6 }}>Что изменилось по сравнению с прошлой версией</div>
          <div style={{ fontSize: 14, color: DARK, lineHeight: 1.55, marginBottom: 12 }}>{r.comparison.summary}</div>
          {r.comparison.per_client.map((p, i) => {
            const s = SHIFT[p.shift];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: DARK, marginBottom: 8, lineHeight: 1.5 }}>
                <Icon name={s.icon} size={16} color={s.color} />
                <span><b>{p.title}</b> — <span style={{ color: s.color, fontWeight: 600 }}>{s.label}.</span> {p.text}</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16, alignItems: "start" }}>
        {r.clients.map((c, i) => (
          <ClientCardView key={i} card={c} index={i} testId={test.id} chat={chat} onChat={e => setChat(p => [...p, e])} />
        ))}
      </div>

      <Section title="Что клиентская группа обнаружила в предложении">
        <div style={{ display: "grid", gap: 10 }}>
          {r.barriers.map((b, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: "#2DD4BF", color: DARK, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{b.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55, marginTop: 2 }}>{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Что попробовать изменить в первую очередь">
        <div style={{ fontSize: 13, color: GRAY, marginBottom: 12, marginTop: -6 }}>Это варианты для проверки, а не доказанные решения.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {r.variants.map((v, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, letterSpacing: "0.06em" }}>ВАРИАНТ {v.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "4px 0 6px" }}>{v.title}</div>
              <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{v.text}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Проверь реальностью">
        <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, color: DARK, lineHeight: 1.6, marginBottom: 12 }}>{r.reality_check}</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} maxLength={2000}
            placeholder="Что ответили настоящие клиенты? Запиши, чтобы сравнить с предположениями"
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: DARK, resize: "vertical" }} />
          <button onClick={saveNote} style={{ marginTop: 10, border: "none", borderRadius: 10, padding: "10px 18px", background: "#F1F5F9", color: DARK, fontWeight: 600, fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>
            {saved ? "Сохранено" : "Сохранить заметку"}
          </button>
        </div>
      </Section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
        <button onClick={onRetest} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 12, padding: "13px 22px", background: "#2DD4BF", color: DARK, fontWeight: 700, fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>
          <Icon name="RefreshCw" size={16} /> Проверить исправленную версию
        </button>
        <button onClick={onNew} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: "13px 22px", background: "#fff", color: DARK, fontWeight: 600, fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>
          Новая проверка
        </button>
      </div>
    </div>
  );
}
