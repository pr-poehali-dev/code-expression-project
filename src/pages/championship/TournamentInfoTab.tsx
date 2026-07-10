import { Tournament } from "./tournamentTypes";

export default function TournamentInfoTab({ t }: { t: Tournament }) {
  return (
    <div className="ct-info-grid">
      <div>
        {t.description && (
          <div className="ct-section">
            <h3 className="ct-section-title">Описание</h3>
            <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.7 }}>{t.description}</p>
          </div>
        )}
        {t.task_text && (
          <div className="ct-section">
            <h3 className="ct-section-title">🎯 Задание</h3>
            <div style={{ background: "#eef2ff", borderRadius: 10, padding: "16px", border: "1.5px solid #c7d2fe" }}>
              <p style={{ margin: 0, fontSize: 14, color: "#3730a3", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.task_text}</p>
            </div>
          </div>
        )}
        {!t.task_text && ["announced", "registration", "registration_closed"].includes(t.status) && (
          <div className="ct-section">
            <h3 className="ct-section-title">🎯 Задание</h3>
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px", border: "1.5px dashed #cbd5e1", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Задание откроется в момент старта турнира</div>
            </div>
          </div>
        )}
        {t.rules && (
          <div className="ct-section">
            <h3 className="ct-section-title">Правила</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{t.rules}</p>
          </div>
        )}
      </div>

      {/* Сайдбар */}
      <div>
        <div className="ct-sidebar-card">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>📅 Сроки</div>
          {[
            { label: "Регистрация до", date: t.registration_ends },
            { label: "Старт турнира",  date: t.task_opens_at },
            { label: "Дедлайн работ",  date: t.work_deadline },
            { label: "Голосование до", date: t.voting_ends },
          ].filter(r => r.date).map(r => (
            <div key={r.label} className="ct-sidebar-row">
              <span className="ct-sidebar-label">{r.label}</span>
              <span className="ct-sidebar-val">{new Date(r.date!).toLocaleDateString("ru", { day: "numeric", month: "short" })}</span>
            </div>
          ))}
          <div className="ct-sidebar-row" style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9", marginBottom: 0 }}>
            <span className="ct-sidebar-label">Мин. участников</span>
            <span className="ct-sidebar-val">{t.min_participants}</span>
          </div>
        </div>

        {(t.prize_energy > 0 || t.prizes?.length > 0) && (
          <div className="ct-sidebar-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>🏅 Призы</div>
            {t.prize_energy > 0 && (
              <div className="ct-sidebar-row">
                <span>🥇 1 место</span>
                <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_energy} ⚡</span>
              </div>
            )}
            {t.prize_2nd > 0 && (
              <div className="ct-sidebar-row">
                <span>🥈 2 место</span>
                <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_2nd} ⚡</span>
              </div>
            )}
            {t.prize_3rd > 0 && (
              <div className="ct-sidebar-row">
                <span>🥉 3 место</span>
                <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_3rd} ⚡</span>
              </div>
            )}
            {t.prizes?.map(p => (
              <div key={p.id} style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
                  {["🥇","🥈","🥉","4️⃣","5️⃣"][p.place - 1] || `${p.place} место`} от {p.partner_name}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.title}</div>
                {p.value && <div style={{ fontSize: 12, color: "#14B8A6", fontWeight: 600 }}>{p.value}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
