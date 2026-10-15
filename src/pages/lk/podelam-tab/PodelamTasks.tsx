import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, fmt, Task, SalonFocusStaff } from "../podelamShared";

type SetSelectedTopic = React.Dispatch<React.SetStateAction<Record<string, string>>>;
type GoTo = (target: string, topic?: string) => void;

export function PodelamMainTask({ mainTask, selectedTopic, setSelectedTopic, goTo }: {
  mainTask: Task;
  selectedTopic: Record<string, string>;
  setSelectedTopic: SetSelectedTopic;
  goTo: GoTo;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 24, marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name="Target" size={16} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Сегодня главное</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{mainTask.title}</div>
      <div style={{ fontSize: 14, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>{mainTask.action_text}</div>
      {mainTask.why && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,88%)", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
          <Icon name="Lightbulb" size={14} style={{ color: "hsl(40,90%,40%)", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12.5, color: "#78350F", lineHeight: 1.55 }}>{mainTask.why}</div>
        </div>
      )}
      {mainTask.topic_options && mainTask.topic_options.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Готовые темы на выбор</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {mainTask.topic_options.map((topic, i) => {
              const active = selectedTopic[mainTask.key] === topic;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedTopic(p => ({ ...p, [mainTask.key]: topic }))}
                  style={{
                    textAlign: "left", padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                    border: `1.5px solid ${active ? ACCENT : "#E2E8F0"}`,
                    background: active ? "hsl(185,85%,96%)" : "#fff",
                    color: active ? ACCENT_DARK : "#334155",
                    fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "Montserrat,sans-serif",
                  }}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {mainTask.potential > 0 && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(145,60%,35%)", marginBottom: 16 }}>
          Потенциал: до {fmt(mainTask.potential)} ₽
        </div>
      )}
      <button
        onClick={() => goTo(mainTask.nav, selectedTopic[mainTask.key])}
        style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
      >
        {mainTask.button}
      </button>
    </div>
  );
}

export function PodelamDayPlan({ tasks, salonFocus, task_log, marking, markDone, selectedTopic, setSelectedTopic, goTo }: {
  tasks: Task[];
  salonFocus: SalonFocusStaff | null | undefined;
  task_log: Record<string, { done: boolean; actual_amount: number | null }>;
  marking: string | null;
  markDone: (taskKey: string) => void;
  selectedTopic: Record<string, string>;
  setSelectedTopic: SetSelectedTopic;
  goTo: GoTo;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase" }}>План на сегодня</div>
        {salonFocus && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "hsl(185,85%,96%)", borderRadius: 20 }}>
            <Icon name="UserRound" size={13} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>Фокус дня: {salonFocus.name}</span>
            <span style={{ fontSize: 11, color: "#64748B" }}>· {salonFocus.role}</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((t, i) => {
          const done = task_log[t.key]?.done;
          const hasTopics = !done && t.topic_options && t.topic_options.length > 0;
          return (
            <div key={t.key + i} className="podelam-task-card" style={{ padding: "14px 16px", borderRadius: 12, background: done ? "hsl(145,60%,97%)" : "#F8FAFC", border: `1px solid ${done ? "hsl(145,60%,85%)" : "#E8ECF0"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <button
                  onClick={() => !done && markDone(t.key)}
                  disabled={marking === t.key}
                  style={{
                    width: 26, height: 26, marginTop: 1, borderRadius: "50%", flexShrink: 0, border: `2px solid ${done ? "hsl(145,60%,45%)" : "#CBD5E1"}`,
                    background: done ? "hsl(145,60%,45%)" : "#fff", cursor: done ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {done && <Icon name="Check" size={14} style={{ color: "#fff" }} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: done ? "#64748B" : "#0F172A", textDecoration: done ? "line-through" : "none", marginBottom: 5 }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{t.action_text}</div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 600, marginTop: 6 }}>~{t.minutes} мин{t.potential > 0 ? ` · до ${fmt(t.potential)} ₽` : ""}</div>

                  {!done && t.why && (
                    <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 10, background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,88%)", borderRadius: 9, padding: "8px 10px" }}>
                      <Icon name="Lightbulb" size={12} style={{ color: "hsl(40,90%,40%)", flexShrink: 0, marginTop: 2 }} />
                      <div style={{ fontSize: 11.5, color: "#78350F", lineHeight: 1.5 }}>{t.why}</div>
                    </div>
                  )}
                  {hasTopics && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                      {t.topic_options!.map((topic, ti) => {
                        const active = selectedTopic[t.key] === topic;
                        return (
                          <button
                            key={ti}
                            onClick={() => setSelectedTopic(p => ({ ...p, [t.key]: topic }))}
                            style={{
                              textAlign: "left", padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                              border: `1.5px solid ${active ? ACCENT : "#E2E8F0"}`,
                              background: active ? "hsl(185,85%,96%)" : "#fff",
                              color: active ? ACCENT_DARK : "#475569",
                              fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: "Montserrat,sans-serif",
                            }}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!done && (
                    <button
                      onClick={() => goTo(t.nav, selectedTopic[t.key])}
                      className="podelam-task-btn"
                      style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      {t.button}
                      <Icon name="ArrowRight" size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 480px) {
          .podelam-task-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
