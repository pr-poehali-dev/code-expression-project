import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { markPodelamSeen } from "./podelamNotice";
import SalonAIAgent from "./SalonAIAgent";
import { ACCENT, PODELAM_URL, PODELAM_FAST_URL, sid, PodelamData, StatsData, fmt, TOPIC_KEY_BY_NAV, getPodelamTerms, isPsychSpecialization } from "./podelamShared";
import DiagnosticForm from "./PodelamDiagnosticForm";
import InfoModal from "./PodelamInfoModal";
import { DailyIncomeCard, StatsSection, SalonGoalsCard } from "./PodelamWidgets";
import { PodelamAnalyticsCard } from "./PodelamAnalyticsCard";
import { isPodelamTrial, getPodelamTrialData, clearPodelamTrial } from "@/lib/podelamTrial";
import { PodelamLoading, PodelamTrialExpired, PodelamNoEnergy } from "./podelam-tab/PodelamStates";
import PodelamGoalCard from "./podelam-tab/PodelamGoalCard";
import { PodelamMainTask, PodelamDayPlan } from "./podelam-tab/PodelamTasks";
import { PodelamGrowthPoints, PodelamTomorrowPreview } from "./podelam-tab/PodelamGrowth";

// ── Главный экран ПоДелам ──────────────────────────────────────────────────────
export function PodelamTab({ onNav }: { onNav: (t: string) => void }) {
  const { user } = useLkAuth();
  const isPsych = isPsychSpecialization(user?.specialization);
  const terms = getPodelamTerms(user?.specialization);
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
    fetch(`${PODELAM_FAST_URL}?action=podelam_stats`, { headers: { "X-Session-Id": sid() } })
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
            await fetch(`${PODELAM_FAST_URL}?action=podelam_save_profile`, {
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
      await fetch(`${PODELAM_FAST_URL}?action=podelam_task_done`, {
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
    await fetch(`${PODELAM_FAST_URL}?action=podelam_set_income`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ amount, new_clients: newClients, returned_clients: returnedClients }),
    });
    load();
  };

  if (loading) {
    return <PodelamLoading isPsych={isPsych} terms={terms} />;
  }

  if (!data?.has_profile || editing) {
    return <DiagnosticForm onSaved={() => { setEditing(false); load(); }} />;
  }

  if (data.trial_expired) {
    return <PodelamTrialExpired onNav={onNav} />;
  }

  if (data.energy_insufficient) {
    return <PodelamNoEnergy data={data} onNav={onNav} />;
  }

  const { profile, growth_points = [], gap_amount = 0, plan, task_log = {}, salon_profile_filled, salon_goals, goals_progress } = data;
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

      {/* Платная расширенная аналитика — Пульс бизнеса, прогноз, точки роста */}
      <PodelamAnalyticsCard onNav={onNav} />

      {/* Экран 1: Цель и прогресс */}
      {profile && (
        <PodelamGoalCard profile={profile} gap_amount={gap_amount} progress={progress} />
      )}

      {/* Цели салона и прогресс по ним */}
      {salon_goals && salon_goals.length > 0 && (
        <SalonGoalsCard
          goals={salon_goals}
          progress={goals_progress}
          addressedToday={plan?.addressed_goals || []}
          onNav={onNav}
        />
      )}

      {/* Доход за сегодня */}
      <DailyIncomeCard
        savedAmount={data.today_income}
        savedNewClients={data.today_new_clients}
        savedReturnedClients={data.today_returned_clients}
        onSave={saveIncome}
        terms={terms}
      />

      {/* Экран 2: Главное дело дня */}
      {mainTask && (
        <PodelamMainTask mainTask={mainTask} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} goTo={goTo} />
      )}

      {/* Экран 3: План на день */}
      <PodelamDayPlan
        tasks={tasks}
        salonFocus={salonFocus}
        task_log={task_log}
        marking={marking}
        markDone={markDone}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        goTo={goTo}
      />

      {/* ИИ-Агент — общение по развитию бизнеса */}
      <div ref={agentRef} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)", scrollMarginTop: 20 }}>
        <SalonAIAgent onNavigateShop={() => onNav("shop")} podelamContext={podelamContext} podelamGreeting={podelamGreeting} />
      </div>

      {/* Статистика за неделю/месяц */}
      <StatsSection stats={stats} terms={terms} />

      {/* Экран 4: Точки роста / потери */}
      {growth_points.length > 0 && (
        <PodelamGrowthPoints growth_points={growth_points} />
      )}

      {/* Анонс на завтра */}
      {plan?.tomorrow_preview && (
        <PodelamTomorrowPreview text={plan.tomorrow_preview} />
      )}
    </div>
  );
}
