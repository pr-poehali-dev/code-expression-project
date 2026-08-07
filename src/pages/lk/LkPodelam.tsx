import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { markPodelamSeen } from "./podelamNotice";
import SalonAIAgent from "./SalonAIAgent";
import { ACCENT, ACCENT_DARK, PODELAM_URL, sid, PodelamData, StatsData, fmt } from "./podelamShared";
import DiagnosticForm from "./PodelamDiagnosticForm";
import InfoModal from "./PodelamInfoModal";
import { DailyIncomeCard, StatsSection } from "./PodelamWidgets";
import { isPodelamTrial, getPodelamTrialData, clearPodelamTrial } from "@/lib/podelamTrial";

// ── Главный экран ПоДелам ──────────────────────────────────────────────────────
export function PodelamTab({ onNav }: { onNav: (t: string) => void }) {
  const { user } = useLkAuth();
  const [data, setData] = useState<PodelamData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const agentRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((target: string) => {
    if (target === "agent") {
      agentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    onNav(target);
  }, [onNav]);

  const loadStats = useCallback(() => {
    fetch(`${PODELAM_URL}?action=podelam_stats`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (d.week && d.month) setStats(d); })
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${PODELAM_URL}?action=podelam_get`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(async d => {
        // Данные с демо-формы на главной — сохраняем как настоящий профиль, чтобы не вводить заново
        if (!d?.has_profile && isPodelamTrial()) {
          const trial = getPodelamTrialData();
          clearPodelamTrial();
          if (trial) {
            await fetch(`${PODELAM_URL}?action=podelam_save_profile`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
              body: JSON.stringify(trial),
            }).catch(() => {});
            const res2 = await fetch(`${PODELAM_URL}?action=podelam_get`, { headers: { "X-Session-Id": sid() } });
            d = await res2.json();
          }
        }
        setData(d); if (d?.has_profile) markPodelamSeen();
      })
      .finally(() => setLoading(false));
    loadStats();
  }, [loadStats]);

  useEffect(() => { load(); }, [load]);

  const markDone = async (taskKey: string) => {
    setMarking(taskKey);
    try {
      await fetch(`${PODELAM_URL}?action=podelam_task_done`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ task_key: taskKey, done: true }),
      });
      load();
    } finally {
      setMarking(null);
    }
  };

  const saveIncome = async (amount: number) => {
    await fetch(`${PODELAM_URL}?action=podelam_set_income`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ amount }),
    });
    load();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, marginBottom: 20,
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "podelam-pulse 1.6s ease-in-out infinite",
        }}>
          <Icon name="Compass" size={26} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
          Собираем ваши данные…
        </div>
        <div style={{ fontSize: 13.5, color: "#64748B", maxWidth: 320, lineHeight: 1.6 }}>
          ИИ анализирует ваш доход, чек и базу клиентов и формирует шаги на сегодня. Обычно это занимает до минуты.
        </div>
        <style>{`
          @keyframes podelam-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  if (!data?.has_profile || editing) {
    return <DiagnosticForm onSaved={() => { setEditing(false); load(); }} />;
  }

  const { profile, growth_points = [], gap_amount = 0, plan, task_log = {} } = data;
  const progress = profile ? Math.min(100, Math.round((profile.current_revenue / profile.target_revenue) * 100)) : 0;
  const tasks = plan?.tasks || [];
  const mainTask = tasks[0];

  const podelamContext = profile ? [
    `Ниша: ${profile.niche || "не указана"}`,
    `Цель месяца: ${fmt(profile.target_revenue)} ₽`,
    `Доход сейчас: ${fmt(profile.current_revenue)} ₽`,
    `Не хватает до цели: ${fmt(Math.max(0, gap_amount))} ₽ (${progress}% от цели уже выполнено)`,
    profile.has_addon_services && profile.addon_services_text ? `Дополнительные услуги/пакеты: ${profile.addon_services_text}` : "",
    growth_points.length ? `Где лежат деньги: ${growth_points.map(p => `${p.title} — до ${fmt(p.potential)} ₽ (${p.action})`).join("; ")}` : "",
    tasks.length ? `План на сегодня: ${tasks.map(t => `${t.title}${task_log[t.key]?.done ? " [выполнено]" : ""} — ${t.action_text}`).join("; ")}` : "",
    mainTask ? `Главное дело дня: ${mainTask.title} — ${mainTask.action_text}` : "",
  ].filter(Boolean).join("\n") : "";

  const podelamGreeting = profile
    ? `Здравствуйте${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}! Вижу вашу цель — ${fmt(profile.target_revenue)} ₽ в месяц, сейчас у вас ${fmt(profile.current_revenue)} ₽, не хватает ${fmt(Math.max(0, gap_amount))} ₽.${mainTask ? ` Сегодня главное — «${mainTask.title.toLowerCase()}».` : ""}\n\nСпрашивайте, как быстрее закрыть разрыв в доходе — отвечу с учётом ваших цифр и плана на сегодня.`
    : undefined;

  return (
    <div>
      {/* Заголовок */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase" }}>
              ПоДелам · Промт Диалог
            </div>
            <button
              onClick={() => setShowInfo(true)}
              title="Как это работает?"
              style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${ACCENT}`, background: "transparent", color: ACCENT, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}
            >
              ?
            </button>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {user?.full_name ? `${user.full_name.split(" ")[0]}, ваш доход сегодня` : "Ваш доход сегодня"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowInfo(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
            <Icon name="Info" size={13} />
            Как это работает
          </button>
          <button onClick={() => setEditing(true)} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "hsl(185,85%,95%)", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
            Обновить диагностику
          </button>
        </div>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Экран 1: Цель и прогресс */}
      {profile && (
        <div style={{ background: "linear-gradient(135deg,#0F172A,#112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Цель месяца</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{fmt(profile.target_revenue)} ₽</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Сейчас</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2DD4BF" }}>{fmt(profile.current_revenue)} ₽</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Не хватает</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "hsl(40,90%,60%)" }}>{fmt(Math.max(0, gap_amount))} ₽</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: "linear-gradient(90deg,#2DD4BF,#14B8A6)" }} />
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{progress}% от цели</div>
        </div>
      )}

      {/* Доход за сегодня */}
      <DailyIncomeCard savedAmount={data.today_income} onSave={saveIncome} />

      {/* Экран 2: Главное дело дня */}
      {mainTask && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 24, marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Icon name="Target" size={16} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Сегодня главное</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{mainTask.title}</div>
          <div style={{ fontSize: 14, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>{mainTask.action_text}</div>
          {mainTask.potential > 0 && (
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(145,60%,35%)", marginBottom: 16 }}>
              Потенциал: до {fmt(mainTask.potential)} ₽
            </div>
          )}
          <button
            onClick={() => goTo(mainTask.nav)}
            style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            {mainTask.button}
          </button>
        </div>
      )}

      {/* Экран 3: План на день */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>План на сегодня</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((t, i) => {
            const done = task_log[t.key]?.done;
            return (
              <div key={t.key + i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, background: done ? "hsl(145,60%,97%)" : "#F8FAFC", border: `1px solid ${done ? "hsl(145,60%,85%)" : "#E8ECF0"}` }}>
                <button
                  onClick={() => !done && markDone(t.key)}
                  disabled={marking === t.key}
                  style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0, border: `2px solid ${done ? "hsl(145,60%,45%)" : "#CBD5E1"}`,
                    background: done ? "hsl(145,60%,45%)" : "#fff", cursor: done ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {done && <Icon name="Check" size={14} style={{ color: "#fff" }} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#64748B" : "#0F172A", textDecoration: done ? "line-through" : "none" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.action_text} · ~{t.minutes} мин{t.potential > 0 ? ` · до ${fmt(t.potential)} ₽` : ""}</div>
                </div>
                {!done && (
                  <button
                    onClick={() => goTo(t.nav)}
                    style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "hsl(185,85%,95%)", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
                  >
                    {t.button}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ИИ-Агент — общение по развитию бизнеса */}
      <div ref={agentRef} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)", scrollMarginTop: 20 }}>
        <SalonAIAgent onNavigateShop={() => onNav("shop")} podelamContext={podelamContext} podelamGreeting={podelamGreeting} />
      </div>

      {/* Статистика за неделю/месяц */}
      <StatsSection stats={stats} />

      {/* Экран 4: Точки роста / потери */}
      {growth_points.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Где лежат деньги</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {growth_points.map(p => (
              <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{p.action}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "hsl(145,60%,35%)", whiteSpace: "nowrap" }}>+{fmt(p.potential)} ₽</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#B0B8C1", marginTop: 12, lineHeight: 1.5 }}>
            Расчёт ориентировочный и основан на ваших данных. Реальный результат зависит от спроса, цены, качества услуг и выполнения действий.
          </div>
        </div>
      )}

      {/* Анонс на завтра */}
      {plan?.tomorrow_preview && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "hsl(185,85%,96%)", borderRadius: 14, padding: "16px 20px", marginTop: 20 }}>
          <Icon name="Sunrise" size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Завтра новые шаги</div>
            <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{plan.tomorrow_preview}</div>
          </div>
        </div>
      )}
    </div>
  );
}