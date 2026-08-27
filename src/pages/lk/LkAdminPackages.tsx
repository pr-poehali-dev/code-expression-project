import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import func2url from "../../../backend/func2url.json";

const PACKAGES_URL = (func2url as Record<string, string>)["packages-api"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface PlanPrice { period_months: number; price_rub: number; }
interface Plan {
  code: string; name: string; description: string;
  daily_limit_per_tool: number; is_active: boolean; prices: PlanPrice[];
}
interface StatsByPlan { plan_code: string; purchases: number; revenue: number; }
interface Stats {
  by_plan: StatsByPlan[]; active_packages: number;
  total_users: number; ever_bought_package: number; conversion_pct: number;
}

const PERIODS = [1, 3, 6, 12];

export function PackagesSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedLimits, setEditedLimits] = useState<Record<string, string>>({});
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = () => {
    fetch(`${PACKAGES_URL}?action=admin_packages_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d.plans) && setPlans(d.plans))
      .catch(() => {}).finally(() => setLoading(false));
    fetch(`${PACKAGES_URL}?action=admin_packages_stats`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => d && setStats(d))
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const saveLimit = async (plan: Plan) => {
    const val = editedLimits[plan.code];
    if (val === undefined) return;
    setSaving(`limit_${plan.code}`);
    try {
      await fetch(`${PACKAGES_URL}?action=admin_package_update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ code: plan.code, daily_limit_per_tool: parseInt(val) }),
      });
      setPlans(p => p.map(pl => pl.code === plan.code ? { ...pl, daily_limit_per_tool: parseInt(val) } : pl));
      setSaved(`limit_${plan.code}`);
      setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  };

  const savePrice = async (planCode: string, periodMonths: number) => {
    const key = `${planCode}_${periodMonths}`;
    const val = editedPrices[key];
    if (val === undefined) return;
    setSaving(`price_${key}`);
    try {
      await fetch(`${PACKAGES_URL}?action=admin_package_price_update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ plan_code: planCode, period_months: periodMonths, price_rub: parseInt(val) }),
      });
      setPlans(p => p.map(pl => pl.code === planCode
        ? { ...pl, prices: pl.prices.map(pr => pr.period_months === periodMonths ? { ...pr, price_rub: parseInt(val) } : pr) }
        : pl));
      setSaved(`price_${key}`);
      setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  };

  const toggleActive = async (plan: Plan) => {
    setSaving(`active_${plan.code}`);
    try {
      await fetch(`${PACKAGES_URL}?action=admin_package_update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ code: plan.code, is_active: !plan.is_active }),
      });
      setPlans(p => p.map(pl => pl.code === plan.code ? { ...pl, is_active: !pl.is_active } : pl));
    } finally { setSaving(null); }
  };

  const inp: React.CSSProperties = { padding: "7px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff", color: "#0F172A", outline: "none", width: 90, textAlign: "center" };

  return (
    <div>
      {/* Статистика */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Активных пакетов", value: stats.active_packages },
            { label: "Всего пользователей", value: stats.total_users },
            { label: "Купили пакет хоть раз", value: stats.ever_bought_package },
            { label: "Конверсия в пакет", value: `${stats.conversion_pct}%` },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: "16px 18px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {stats && stats.by_plan.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "16px 22px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Продажи по тарифам</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.by_plan.map(p => (
              <div key={p.plan_code} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ color: "#334155" }}>{plans.find(pl => pl.code === p.plan_code)?.name || p.plan_code}</span>
                <span style={{ color: "#64748B" }}>{p.purchases} покупок · <b style={{ color: "#0F172A" }}>{p.revenue.toLocaleString("ru-RU")} ₽</b></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Тарифы */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Тарифные планы «Пакеты развития»</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Лимит — сколько раз в сутки можно использовать КАЖДЫЙ ИИ-инструмент в рамках пакета</div>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#bbb" }}>Загрузка...</div>
        ) : (
          plans.map(plan => {
            const limitVal = editedLimits[plan.code] ?? String(plan.daily_limit_per_tool);
            const limitChanged = limitVal !== String(plan.daily_limit_per_tool);
            return (
              <div key={plan.code} style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{plan.name}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 1 }}>{plan.code}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11.5, color: "#64748B" }}>Лимит/сутки:</span>
                    <input
                      style={{ ...inp, width: 60, borderColor: limitChanged ? ACCENT : "#E2E8F0" }}
                      type="number" min="1"
                      value={limitVal}
                      onChange={e => setEditedLimits(p => ({ ...p, [plan.code]: e.target.value }))}
                    />
                    {limitChanged && (
                      <button onClick={() => saveLimit(plan)} disabled={saving === `limit_${plan.code}`}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                        {saving === `limit_${plan.code}` ? "..." : "Сохранить"}
                      </button>
                    )}
                    {saved === `limit_${plan.code}` && <Icon name="Check" size={16} style={{ color: "hsl(145,60%,40%)" }} />}
                  </div>

                  <button
                    onClick={() => toggleActive(plan)}
                    disabled={saving === `active_${plan.code}`}
                    style={{
                      padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                      fontSize: 11.5, fontWeight: 700, fontFamily: "Montserrat,sans-serif",
                      background: plan.is_active ? "hsl(145,60%,94%)" : "#F1F5F9",
                      color: plan.is_active ? "hsl(145,60%,32%)" : "#94A3B8",
                    }}
                  >
                    {plan.is_active ? "Активен" : "Отключён"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {PERIODS.map(period => {
                    const priceRow = plan.prices.find(p => p.period_months === period);
                    const key = `${plan.code}_${period}`;
                    const val = editedPrices[key] ?? String(priceRow?.price_rub ?? "");
                    const changed = val !== String(priceRow?.price_rub ?? "");
                    return (
                      <div key={period} style={{ display: "flex", flexDirection: "column", gap: 4, background: "#F8FAFC", borderRadius: 10, padding: "8px 10px" }}>
                        <span style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {period === 1 ? "1 мес" : `${period} мес`}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input
                            style={{ ...inp, width: 80, borderColor: changed ? ACCENT : "#E2E8F0" }}
                            type="number" min="0"
                            value={val}
                            onChange={e => setEditedPrices(p => ({ ...p, [key]: e.target.value }))}
                          />
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>₽</span>
                        </div>
                        {changed && (
                          <button onClick={() => savePrice(plan.code, period)} disabled={saving === `price_${key}`}
                            style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                            {saving === `price_${key}` ? "..." : "Сохранить"}
                          </button>
                        )}
                        {saved === `price_${key}` && <Icon name="Check" size={13} style={{ color: "hsl(145,60%,40%)" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
