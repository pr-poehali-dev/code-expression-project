import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { markPodelamSeen } from "./podelamNotice";
import SalonAIAgent from "./SalonAIAgent";
import { ACCENT, ACCENT_DARK, PODELAM_URL, sid, PodelamData, StatsData, fmt, TOPIC_KEY_BY_NAV } from "./podelamShared";
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
  const [selectedTopic, setSelectedTopic] = useState<Record<string, string>>({});
  const agentRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((target: string, topic?: string) => {
    if (target === "agent") {
      agentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (topic) {
      const key = TOPIC_KEY_BY_NAV[target];
      if (key) sessionStorage.setItem(key, topic);
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

  const saveIncome = async (amount: number, newClients: number, returnedClients: number) => {
    await fetch(`${PODELAM_URL}?action=podelam_set_income`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ amount, new_clients: newClients, returned_clients: returnedClients }),
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

  if (data.energy_insufficient) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="Zap" size={26} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Недостаточно энергии для нового плана</div>
        <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
          Построение нового плана на день стоит {data.energy_needed ?? ""} ⚡, доступно {data.energy_balance ?? 0} ⚡. Пополните баланс, чтобы ИИ собрал сегодняшние шаги.
        </div>
        <button
          onClick={() => onNav("shop")}
          style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          Пополнить энергию
        </button>
      </div>
    );
  }

  const { profile, growth_points = [], gap_amount = 0, plan, task_log = {}, salon_profile_filled } = data;
  const showSalonReminder = salon_profile_filled === false;
  const progress = profile ? Math.min(100, Math.round((profile.current_revenue / profile.target_revenue) * 100)) : 0;
  const tasks = plan?.tasks || [];
  const mainTask = tasks[0];
  const salonFocus = plan?.salon_focus;

  const podelamContext = profile ? [
    `Ниша: ${profile.niche || "не указана"}`,
    `Цель месяца: ${fmt(profile.target_revenue)} ₽`,
    `Доход сейчас: ${fmt(profile.current_revenue)} ₽`,
    `Не хватает до цели: ${fmt(Math.max(0, gap_amount))} ₽ (${progress}% от цели уже выполнено)`,
    profile.has_addon_services && profile.addon_services_text ? `Дополнительные услуги/пакеты: ${profile.addon_services_text}` : "",
    salonFocus ? `Фокус-сотрудник сегодня: ${salonFocus.name} (${salonFocus.role})` : "",
    growth_points.length ? `Где лежат деньги: ${growth_points.map(p => `${p.title} — до ${fmt(p.potential)} ₽ (${p.action})`).join("; ")}` : "",
    tasks.length ? `План на сегодня: ${tasks.map(t => `${t.title}${task_log[t.key]?.done ? " [выполнено]" : ""} — ${t.action_text}`).join("; ")}` : "",
    mainTask ? `Главное дело дня: ${mainTask.title} — ${mainTask.action_text}` : "",
  ].filter(Boolean).join("\n") : "";

  const podelamGreeting = profile
    ? `Здравствуйте${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}! Вижу вашу цель — ${fmt(profile.target_revenue)} ₽ в месяц, сейчас у вас ${fmt(profile.current_revenue)} ₽, не хватает ${fmt(Math.max(0, gap_amount))} ₽.${mainTask ? ` Сегодня главное — «${mainTask.title.toLowerCase()}».` : ""}\n\nСпрашивайте, как быстрее закрыть разрыв в доходе — отвечу с учётом ваших цифр и плана на сегодня.`
    : undefined;

  return (
    <div>
      {showSalonReminder && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: "hsl(40,90%,96%)", border: "1.5px solid hsl(40,90%,80%)", marginBottom: 20 }}>
          <Icon name="Building2" size={20} style={{ color: "hsl(30,95%,40%)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Заполните «Мой салон» для более точного плана</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Пока профиль салона не заполнен, план строится по данным диагностики ниже. Добавьте показатели салона и сотрудников — ИИ будет учитывать каждого специалиста по очереди.</div>
          </div>
          <button
            onClick={() => onNav("salon")}
            style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: "hsl(30,95%,45%)", border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
          >
            Заполнить
          </button>
        </div>
      )}

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

          {/* Промежуточные цели по неделям */}
          {gap_amount > 0 && (
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                Промежуточные цели на неделю
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }} className="podelam-weeks-grid">
                {[1, 2, 3, 4].map(week => {
                  const weekTarget = profile.current_revenue + (gap_amount * week) / 4;
                  const reached = profile.current_revenue >= weekTarget;
                  return (
                    <div key={week} style={{
                      background: reached ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${reached ? "rgba(45,212,191,0.35)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 10, padding: "10px 12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        {reached && <Icon name="CheckCircle2" size={12} style={{ color: "#2DD4BF" }} />}
                        <div style={{ fontSize: 10.5, color: reached ? "#2DD4BF" : "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                          Неделя {week}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{fmt(weekTarget)} ₽</div>
                    </div>
                  );
                })}
              </div>
              <style>{`
                @media (max-width: 640px) {
                  .podelam-weeks-grid { grid-template-columns: repeat(2,1fr) !important; }
                }
              `}</style>
            </div>
          )}
        </div>
      )}

      {/* Доход за сегодня */}
      <DailyIncomeCard
        savedAmount={data.today_income}
        savedNewClients={data.today_new_clients}
        savedReturnedClients={data.today_returned_clients}
        onSave={saveIncome}
      />

      {/* Экран 2: Главное дело дня */}
      {mainTask && (
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
      )}

      {/* Экран 3: План на день */}
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