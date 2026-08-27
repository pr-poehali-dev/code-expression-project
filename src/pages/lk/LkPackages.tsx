import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const PACKAGES_URL = (func2url as Record<string, string>)["packages-api"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface PlanPrice { period_months: number; price_rub: number; }
interface Plan { code: string; name: string; description: string; daily_limit_per_tool: number; prices: PlanPrice[]; }
interface ActivePackage { plan_code: string; period_months: number; expires_at: string; auto_renew: boolean }

const PERIOD_LABELS: Record<number, string> = { 1: "1 месяц", 3: "3 месяца", 6: "6 месяцев", 12: "12 месяцев" };

const PLAN_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  start:  { color: "hsl(185,85%,32%)", bg: "hsl(185,85%,96%)", border: "hsl(185,85%,80%)" },
  growth: { color: "hsl(280,60%,50%)", bg: "hsl(280,60%,96%)", border: "hsl(280,60%,80%)" },
  pro:    { color: "hsl(40,90%,42%)",  bg: "hsl(40,90%,96%)",  border: "hsl(40,90%,78%)" },
  max:    { color: "hsl(0,75%,50%)",   bg: "hsl(0,75%,97%)",   border: "hsl(0,75%,82%)" },
};

const FEATURES = [
  "Ежедневный ИИ-анализ (Пульс бизнеса)",
  "Прогноз и уровень уверенности",
  "Анализ динамики за 7/14/30/90 дней",
  "Персональные рекомендации",
  "Все ИИ-инструменты платформы",
];

export default function LkPackages({ onNav }: { onNav?: (t: string) => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [active, setActive] = useState<ActivePackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<number>(1);
  const [autorenew, setAutorenew] = useState<Record<string, boolean>>({});
  const [paying, setPaying] = useState<string | null>(null);

  const load = () => {
    fetch(`${PACKAGES_URL}?action=packages_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { setPlans(d.plans || []); setActive(d.active_package || null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleBuy = async (code: string) => {
    setPaying(code);
    try {
      const res = await fetch(`${PACKAGES_URL}?action=package_create_payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          plan_code: code,
          period_months: period,
          enable_autorenew: !!autorenew[code],
          return_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        alert(data.error || "Ошибка создания платежа");
      }
    } catch {
      alert("Не удалось подключиться к платёжной системе");
    } finally {
      setPaying(null);
    }
  };

  const priceFor = (plan: Plan) => plan.prices.find(p => p.period_months === period);

  if (loading) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", color: "#94A3B8" }}>Загружаем тарифы…</div>
    );
  }

  return (
    <div style={{ maxWidth: 1080 }}>
      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase" }}>
        ПоДелам · Пакеты развития
      </div>
      <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#0F172A", margin: "0 0 10px" }}>
        Получайте не просто инструменты
      </h1>
      <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: "0 0 28px", maxWidth: 640 }}>
        Понимайте, что происходит с вашим бизнесом каждый день: ежедневный ИИ-анализ, прогноз, поиск потерь и точек роста —
        плюс все ИИ-инструменты платформы с увеличенным лимитом использований в сутки.
      </p>

      {active && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 14, background: "hsl(185,85%,96%)", border: "1.5px solid hsl(185,85%,80%)", marginBottom: 28 }}>
          <Icon name="BadgeCheck" size={22} style={{ color: ACCENT, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
              У вас активен пакет «{plans.find(p => p.code === active.plan_code)?.name || active.plan_code}»
            </div>
            <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
              Действует до {new Date(active.expires_at).toLocaleDateString("ru-RU")}
              {active.auto_renew ? " · автопродление включено" : ""}
            </div>
          </div>
        </div>
      )}

      {/* Переключатель периода */}
      <div style={{ display: "inline-flex", gap: 4, background: "#F1F5F9", borderRadius: 10, padding: 3, marginBottom: 24 }}>
        {[1, 3, 6, 12].map(m => (
          <button
            key={m}
            onClick={() => setPeriod(m)}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "Montserrat,sans-serif",
              background: period === m ? "#fff" : "transparent",
              color: period === m ? ACCENT : "#64748B",
              boxShadow: period === m ? "0 1px 3px rgba(15,23,42,0.08)" : "none",
            }}
          >
            {PERIOD_LABELS[m]}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 32 }}>
        {plans.map((plan) => {
          const c = PLAN_COLORS[plan.code] || PLAN_COLORS.start;
          const price = priceFor(plan);
          const isPopular = plan.code === "growth";
          const isActivePlan = active?.plan_code === plan.code;
          const monthlyEq = price ? Math.round(price.price_rub / period) : 0;
          return (
            <div key={plan.code} style={{
              background: isPopular ? `linear-gradient(160deg, ${c.bg}, #fff)` : "#fff",
              borderRadius: 16, border: `1.5px solid ${isActivePlan ? c.color : isPopular ? c.border : "#E8ECF0"}`,
              padding: "24px 22px", display: "flex", flexDirection: "column", position: "relative",
              boxShadow: isPopular ? `0 4px 20px ${c.color}22` : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              {isPopular && (
                <div style={{ position: "absolute", top: -1, left: 20, background: c.color, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Популярный
                </div>
              )}
              {isActivePlan && (
                <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: c.color }}>
                  <Icon name="CheckCircle2" size={13} /> Активен
                </div>
              )}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, marginTop: isPopular ? 10 : 0 }}>
                {plan.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                  {price ? price.price_rub.toLocaleString("ru-RU") : "—"} <span style={{ fontSize: 15, fontWeight: 500, color: "#64748B" }}>₽</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>
                {period === 1 ? "в месяц" : `за ${PERIOD_LABELS[period].toLowerCase()} · ≈${monthlyEq.toLocaleString("ru-RU")} ₽/мес`}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 10px", background: c.bg, borderRadius: 9 }}>
                <Icon name="Zap" size={14} style={{ color: c.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{plan.daily_limit_per_tool}×</span>
                <span style={{ fontSize: 11.5, color: "#64748B" }}>каждый инструмент в сутки</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, flex: 1 }}>
                {FEATURES.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <Icon name="Check" size={13} style={{ color: c.color, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, cursor: "pointer", userSelect: "none" }}>
                <div
                  onClick={() => setAutorenew(p => ({ ...p, [plan.code]: !p[plan.code] }))}
                  style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${autorenew[plan.code] ? c.color : "#CBD5E1"}`,
                    background: autorenew[plan.code] ? c.color : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {autorenew[plan.code] && <Icon name="Check" size={10} style={{ color: "#fff" }} />}
                </div>
                <span style={{ fontSize: 11.5, color: "#64748B" }}>Автопродление</span>
              </label>

              <button
                onClick={() => handleBuy(plan.code)}
                disabled={!!paying}
                style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: isActivePlan ? "#E2E8F0" : c.color,
                  color: isActivePlan ? "#64748B" : "#fff",
                  fontSize: 13, fontWeight: 700, cursor: paying ? "wait" : "pointer",
                  fontFamily: "Montserrat,sans-serif", opacity: paying && paying !== plan.code ? 0.5 : 1,
                }}
              >
                {paying === plan.code ? "Переход к оплате…" : isActivePlan ? "Продлить" : "Выбрать"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "16px 20px", fontSize: 12.5, color: "#64748B", lineHeight: 1.7 }}>
        <Icon name="Info" size={14} style={{ color: ACCENT, verticalAlign: "middle", marginRight: 6 }} />
        Пакет — это не замена энергии, а дополнительный слой: расширенная аналитика + лимит использований каждого
        инструмента в сутки. Если лимит пакета исчерпан — можно продолжить пользоваться инструментами за счёт баланса
        энергии, как раньше.
        {onNav && (
          <button onClick={() => onNav("shop")} style={{ marginLeft: 6, background: "none", border: "none", color: ACCENT, fontWeight: 700, cursor: "pointer", fontSize: 12.5, textDecoration: "underline", fontFamily: "Montserrat,sans-serif" }}>
            Перейти к энергии
          </button>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export { ACCENT, ACCENT_DARK };