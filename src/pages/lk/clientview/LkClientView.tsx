import { useEffect, useState } from "react";
import ClientViewForm, { FormValues } from "./ClientViewForm";
import ClientViewResult from "./ClientViewResult";
import ClientViewHistory from "./ClientViewHistory";
import { clientViewApi } from "./api";
import { ViewTest, HistoryItem } from "./types";

const DARK = "#0F172A";
const GRAY = "#64748B";

type Mode = "form" | "result" | "retest";

export default function LkClientView() {
  const [mode, setMode] = useState<Mode>("form");
  const [test, setTest] = useState<ViewTest | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = () => clientViewApi.list().then(d => setHistory(d.items)).catch(() => {});

  useEffect(() => { loadHistory(); }, []);

  const submit = async (v: FormValues, parentId?: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await clientViewApi.analyze({ ...v, parent_id: parentId ?? null });
      setTest(res);
      setMode("result");
      loadHistory();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const open = async (id: number) => {
    setError("");
    try {
      const t = await clientViewApi.get(id);
      setTest(t);
      setMode("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    }
  };

  return (
    <div style={{ maxWidth: 980, fontFamily: "Montserrat, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK, margin: "0 0 6px" }}>Покажи глазами клиента</h1>
      <p style={{ fontSize: 15, color: GRAY, margin: "0 0 24px", lineHeight: 1.55 }}>
        Узнай, как твоё предложение может восприниматься со стороны, до того как потратишь деньги на рекламу.
      </p>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 12, padding: "12px 16px", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {mode === "form" && <ClientViewForm loading={loading} onSubmit={v => submit(v)} />}

      {mode === "retest" && test && (
        <div>
          <div style={{ fontSize: 14, color: GRAY, marginBottom: 12 }}>
            Вставь исправленную версию. Я сравню её с предыдущей и покажу, что изменилось в восприятии.
          </div>
          <ClientViewForm
            loading={loading}
            initial={{ subject: test.subject, goal: test.goal, material: test.material }}
            submitLabel="Сравнить с предыдущей версией"
            onSubmit={v => submit(v, test.id)}
          />
          <button onClick={() => setMode("result")} style={{ marginTop: 12, background: "none", border: "none", color: GRAY, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
            Назад к результату
          </button>
        </div>
      )}

      {mode === "result" && test && (
        <ClientViewResult key={test.id} test={test} onRetest={() => setMode("retest")} onNew={() => { setTest(null); setMode("form"); }} />
      )}

      <ClientViewHistory items={history} activeId={test?.id} onOpen={open} />
    </div>
  );
}
