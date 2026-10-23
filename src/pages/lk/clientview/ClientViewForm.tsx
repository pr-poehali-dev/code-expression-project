import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SUBJECTS, GOALS } from "./types";

const ACCENT = "hsl(185,85%,32%)";
const DARK = "#0F172A";
const GRAY = "#64748B";

export interface FormValues {
  subject: string;
  goal: string;
  material: string;
  city: string;
  audience: string;
}

interface Props {
  initial?: Partial<FormValues>;
  loading: boolean;
  submitLabel?: string;
  onSubmit: (v: FormValues) => void;
}

const field: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1px solid #E2E8F0", borderRadius: 12,
  padding: "12px 14px", fontSize: 14, fontFamily: "inherit", color: DARK, background: "#fff", outline: "none",
};

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: ACCENT, marginBottom: 12 }}>
      ШАГ {n} · {text}
    </div>
  );
}

export default function ClientViewForm({ initial, loading, submitLabel, onSubmit }: Props) {
  const [v, setV] = useState<FormValues>({
    subject: initial?.subject || "offer",
    goal: initial?.goal || "bookings",
    material: initial?.material || "",
    city: initial?.city || "",
    audience: initial?.audience || "",
  });
  const set = (k: keyof FormValues, val: string) => setV(p => ({ ...p, [k]: val }));
  const ready = v.material.trim().length >= 20 && !loading;

  return (
    <div style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 20, padding: "24px 22px" }}>
      <StepLabel n={1} text="ВЫБЕРИ, ЧТО АНАЛИЗИРОВАТЬ" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 26 }}>
        {SUBJECTS.map(s => {
          const on = v.subject === s.id;
          return (
            <button key={s.id} onClick={() => set("subject", s.id)} style={{
              textAlign: "left", cursor: "pointer", fontFamily: "inherit", padding: "14px 16px", borderRadius: 14,
              border: `1.5px solid ${on ? ACCENT : "#E2E8F0"}`, background: on ? "hsl(185,85%,96%)" : "#fff",
            }}>
              <Icon name={s.icon} size={20} color={on ? ACCENT : GRAY} />
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginTop: 8 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{s.hint}</div>
            </button>
          );
        })}
      </div>

      <StepLabel n={2} text="ДОБАВЬ МАТЕРИАЛ" />
      <textarea
        value={v.material}
        onChange={e => set("material", e.target.value)}
        placeholder="Вставь описание услуги, текст поста или прайс. Например: «Авторский массаж тела, 60 минут. Стоимость — 6 000 ₽. Индивидуальный подход, расслабление и восстановление»"
        rows={6}
        maxLength={6000}
        style={{ ...field, resize: "vertical", lineHeight: 1.6, marginBottom: 6 }}
      />
      <div style={{ fontSize: 12, color: GRAY, marginBottom: 26 }}>
        Не вставляй персональные данные клиентов. Минимум 20 символов.
      </div>

      <StepLabel n={3} text="НАСТРОЙ СИТУАЦИЮ" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 14 }}>
        <input value={v.city} onChange={e => set("city", e.target.value)} placeholder="Город, где работает бизнес" maxLength={120} style={field} />
        <input value={v.audience} onChange={e => set("audience", e.target.value)} placeholder="Для кого предложение" maxLength={500} style={field} />
      </div>
      <div style={{ fontSize: 13, color: GRAY, marginBottom: 8 }}>Какой результат нужен</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {GOALS.map(g => {
          const on = v.goal === g.id;
          return (
            <button key={g.id} onClick={() => set("goal", g.id)} style={{
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "9px 16px", borderRadius: 999,
              border: `1.5px solid ${on ? ACCENT : "#E2E8F0"}`, background: on ? ACCENT : "#fff", color: on ? "#fff" : DARK,
            }}>{g.title}</button>
          );
        })}
      </div>

      <button disabled={!ready} onClick={() => onSubmit(v)} style={{
        display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 12, padding: "14px 26px",
        fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: ready ? "pointer" : "not-allowed",
        background: ready ? "#2DD4BF" : "#CBD5E1", color: DARK,
      }}>
        <Icon name={loading ? "Loader" : "Users"} size={18} />
        {loading ? "Клиентская группа думает…" : (submitLabel || "Получить реакцию клиентской группы")}
      </button>
      <div style={{ fontSize: 12, color: GRAY, marginTop: 10 }}>
        Система моделирует несколько разных взглядов на одно и то же предложение.
      </div>
    </div>
  );
}
