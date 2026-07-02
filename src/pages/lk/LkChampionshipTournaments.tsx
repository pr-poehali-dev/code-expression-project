import { useState } from "react";
import {
  Tournament, MyTournament,
  STATUS_LABELS, STATUS_COLORS, WORK_STATUS,
  apiPost, ACCENT,
  Fact, ActionBtn, ProgressSteps,
} from "./LkChampionshipShared";

// ── Список турниров ───────────────────────────────────────────────────────────
export function TournamentsView({ tournaments, myTournaments, onApplied, onOpenWork, onShare }:
  { tournaments: Tournament[]; myTournaments: MyTournament[]; onApplied: () => void;
    onOpenWork: (t: Tournament, my: MyTournament) => void;
    onShare: (t: Tournament, my: MyTournament) => void }) {

  const [applying, setApplying] = useState<number | null>(null);
  const [msg, setMsg] = useState<Record<number, string>>({});

  const apply = async (t: Tournament) => {
    setApplying(t.id);
    const r = await apiPost("apply", { tournament_id: t.id, notify_email: "" });
    setApplying(null);
    if (r.ok || r.already_applied) {
      setMsg(p => ({ ...p, [t.id]: r.already_applied ? "Заявка уже подана" : "✓ Заявка подана! Ждите подтверждения." }));
      onApplied();
    } else {
      setMsg(p => ({ ...p, [t.id]: r.error || "Ошибка" }));
    }
  };

  const myIds = new Set(myTournaments.map(m => m.id));

  if (tournaments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Нет активных турниров</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Следите за анонсами — мы сообщим о новых соревнованиях</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {tournaments.map(t => {
        const isRegistration = t.status === "registration";
        const isActive = t.status === "active";
        const isVoting = t.status === "voting";
        const isMy = myIds.has(t.id);
        const my = myTournaments.find(m => m.id === t.id);
        const statusColor = STATUS_COLORS[t.status] || "#64748b";

        return (
          <div key={t.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
            {/* Заголовок */}
            <div style={{ padding: "18px 20px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 30, flexShrink: 0 }}>{t.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{t.name}</span>
                    <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                      {STATUS_LABELS[t.status]}
                    </span>
                    {isMy && <span style={{ background: "#f0fdf4", color: "#059669", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>✓ Участвую</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{t.description}</p>
                </div>
              </div>

              {/* Ключевые факты */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                {t.prize_energy > 0 && <Fact icon="⚡" text={`${t.prize_energy} энергии победителю`} accent />}
                {t.applications_count > 0 && <Fact icon="👥" text={`${t.applications_count} участников`} />}
                {t.works_count > 0 && <Fact icon="🖼" text={`${t.works_count} работ`} />}
                {t.registration_ends && isRegistration && (
                  <Fact icon="📅" text={`Регистрация до ${new Date(t.registration_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
                )}
                {t.work_deadline && isActive && (
                  <Fact icon="⏰" text={`Дедлайн ${new Date(t.work_deadline).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} warn />
                )}
                {t.voting_ends && isVoting && (
                  <Fact icon="🗳" text={`Голосование до ${new Date(t.voting_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
                )}
              </div>

              {/* Задание */}
              {t.task_text && (
                <div style={{ background: "#eef2ff", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #c7d2fe" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 4 }}>🎯 ЗАДАНИЕ ТУРНИРА</div>
                  <div style={{ fontSize: 13, color: "#3730a3", lineHeight: 1.6 }}>{t.task_text}</div>
                </div>
              )}

              {msg[t.id] && (
                <div style={{ fontSize: 13, color: msg[t.id].startsWith("✓") ? "#059669" : "#ef4444", marginBottom: 10 }}>
                  {msg[t.id]}
                </div>
              )}

              {/* Действия */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!isMy && isRegistration && (
                  <ActionBtn onClick={() => apply(t)} loading={applying === t.id} icon="UserPlus">
                    Подать заявку
                  </ActionBtn>
                )}
                {isMy && isActive && my && (
                  <ActionBtn onClick={() => onOpenWork(t, my)} icon="Upload" color="#6366f1">
                    {my.work_id ? "Редактировать работу" : "Загрузить работу"}
                  </ActionBtn>
                )}
                {isMy && isVoting && my && (
                  <ActionBtn onClick={() => onShare(t, my)} icon="Share2" color="#f59e0b">
                    Собрать голоса
                  </ActionBtn>
                )}
                {isMy && my?.work_status && (
                  <div style={{
                    padding: "9px 14px", borderRadius: 9, background: `${WORK_STATUS[my.work_status]?.color || "#94a3b8"}15`,
                    color: WORK_STATUS[my.work_status]?.color || "#64748b", fontSize: 13, fontWeight: 700,
                  }}>
                    Работа: {WORK_STATUS[my.work_status]?.label || my.work_status}
                  </div>
                )}
                {isMy && my?.real_votes > 0 && (
                  <div style={{ padding: "9px 14px", borderRadius: 9, background: "#fff7ed", color: "#c2410c", fontSize: 13, fontWeight: 700 }}>
                    ❤️ {my.real_votes} голосов
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Мои заявки ────────────────────────────────────────────────────────────────
export function MyTournamentsView({ myTournaments, tournaments, onOpenWork, onShare }:
  { myTournaments: MyTournament[]; tournaments: Tournament[];
    onOpenWork: (t: Tournament, my: MyTournament) => void;
    onShare: (t: Tournament, my: MyTournament) => void }) {

  if (myTournaments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Нет заявок</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Подайте заявку на турнир во вкладке «Турниры»</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {myTournaments.map(my => {
        const t = tournaments.find(t => t.id === my.id);
        const statusColor = STATUS_COLORS[my.status] || "#64748b";
        const canUploadWork = ["registration", "active"].includes(my.status);
        const isVoting = my.status === "voting";
        const isFinished = ["finished_pending", "finished"].includes(my.status);

        return (
          <div key={my.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px" }}>
            {/* Заголовок */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{my.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{my.name}</span>
                  <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                    {STATUS_LABELS[my.status]}
                  </span>
                </div>
                <ProgressSteps my={my} />
              </div>
            </div>

            {/* Задание — видно сразу после подачи заявки */}
            {my.task_text && (
              <div style={{ background: "#eef2ff", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #c7d2fe" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 4 }}>🎯 ЗАДАНИЕ ТУРНИРА</div>
                <div style={{ fontSize: 13, color: "#3730a3", lineHeight: 1.6 }}>{my.task_text}</div>
                {my.work_deadline && (
                  <div style={{ fontSize: 12, color: "#6366f1", marginTop: 8, fontWeight: 600 }}>
                    ⏰ Дедлайн: {new Date(my.work_deadline).toLocaleDateString("ru", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            )}

            {/* Факты */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              {my.voting_ends && isVoting && (
                <Fact icon="🗳" text={`Голосование до: ${new Date(my.voting_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
              )}
              {my.real_votes > 0 && (
                <Fact icon="❤️" text={`${my.real_votes} голосов за вашу работу`} accent />
              )}
              {my.final_place && (
                <Fact icon={["🥇","🥈","🥉"][my.final_place - 1] || "🎖"} text={`${my.final_place} место`} accent />
              )}
            </div>

            {/* Подсказка: голосование скоро */}
            {my.work_id && canUploadWork && my.voting_starts && (
              <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "10px 14px", marginTop: 8, border: "1px solid #bae6fd" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 2 }}>⏳ Голосование начнётся {new Date(my.voting_starts).toLocaleDateString("ru", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</div>
                <div style={{ fontSize: 12, color: "#0284c7", lineHeight: 1.5 }}>
                  Подготовьте текст для рассылки клиентам — в начале голосования придёт письмо со ссылкой
                </div>
              </div>
            )}

            {/* Действия */}
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {canUploadWork && t && (
                <ActionBtn onClick={() => onOpenWork(t, my)} icon="Upload" color="#6366f1">
                  {my.work_id ? "Редактировать работу" : "Загрузить работу"}
                </ActionBtn>
              )}
              {isVoting && t && (
                <ActionBtn onClick={() => onShare(t, my)} icon="Share2" color="#f59e0b">
                  Собрать голоса
                </ActionBtn>
              )}
              {isFinished && my.final_place && (
                <div style={{ padding: "9px 14px", borderRadius: 9, background: "#f0fdf4", color: "#059669", fontSize: 13, fontWeight: 700 }}>
                  {["🥇","🥈","🥉"][my.final_place - 1] || "🎖"} {my.final_place} место — турнир завершён
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}