import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner } from "./LkAdminShared";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

interface DayPoint { date: string; count: number; energy: number; }
interface TopSchool { id: number; name: string; promo_code: string; is_active: boolean; usages_count: number; total_energy: number; }
interface StatsData {
  days: number;
  by_day: DayPoint[];
  totals: { registrations: number; energy: number };
  totals_period: { registrations: number; energy: number };
  top_schools: TopSchool[];
  schools_count: number;
}

const PERIODS = [
  { value: 14, label: "14 дней" },
  { value: 30, label: "30 дней" },
  { value: 90, label: "90 дней" },
];

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export function SchoolsStats() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    lkApi.adminSchoolsStats(days).then(setData).finally(() => setLoading(false));
  }, [days]);

  if (loading && !data) return <Spinner />;
  if (!data) return null;

  const chartData = data.by_day.map(d => ({ ...d, label: formatDay(d.date) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
        {PERIODS.map(p => (
          <button key={p.value} onClick={() => setDays(p.value)} style={{
            padding: "6px 14px", borderRadius: 8, border: "1.5px solid", cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600,
            borderColor: days === p.value ? ACCENT : "#e8e8e4",
            background: days === p.value ? "hsl(185,85%,95%)" : "#fff",
            color: days === p.value ? ACCENT : "#666",
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Итоговые карточки */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard icon="Users" label="Всего учеников" value={data.totals.registrations} />
        <StatCard icon="Zap" label="Всего начислено ⚡" value={data.totals.energy} />
        <StatCard icon="TrendingUp" label={`Регистраций за ${data.days} дн.`} value={data.totals_period.registrations} />
        <StatCard icon="School" label="Школ-партнёров" value={data.schools_count} />
      </div>

      {/* График регистраций по дням */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
          Регистрации по дням
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 12 }}>
          Количество учеников, зарегистрировавшихся по промокодам школ, за последние {data.days} дней
        </div>
        {chartData.every(d => d.count === 0) ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 13 }}>
            За этот период регистраций по промокодам не было
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#aaa", fontFamily: "Montserrat, sans-serif" }} interval={data.days > 30 ? Math.floor(data.days / 15) : 0} />
              <YAxis tick={{ fontSize: 10, fill: "#aaa" }} allowDecimals={false} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name === "count" ? "Регистраций" : "Энергии начислено"]}
                labelFormatter={(label: string) => `Дата: ${label}`}
                contentStyle={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Топ школ */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
          Топ школ по числу приведённых учеников
        </div>
        {data.top_schools.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#aaa", fontSize: 13 }}>
            Школ-партнёров пока нет
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {data.top_schools.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: i === 0 ? "hsl(185,85%,97%)" : "#f8f8f5", borderRadius: 9 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  background: i === 0 ? "hsl(38,90%,55%)" : i === 1 ? "#c0c0c8" : i === 2 ? "hsl(25,60%,55%)" : "#e8e8e4",
                  color: i < 3 ? "#fff" : "#999",
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {s.name}
                    {!s.is_active && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: "#f0f0ec", color: "#aaa" }}>ОТКЛЮЧЕНА</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>{s.promo_code}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: ACCENT }}>{s.usages_count}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{s.total_energy} ⚡</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8e8e4", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={16} style={{ color: ACCENT }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}>{value.toLocaleString("ru-RU")}</div>
        <div style={{ fontSize: 11, color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
      </div>
    </div>
  );
}