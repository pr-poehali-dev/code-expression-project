import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface Package { code: string; name: string; price_rub: number; energy_amount: number; }
interface Transaction { id: number; type: string; action: string; amount: number; tool_key: string | null; created_at: string; full_name: string | null; }

const PKG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  start:   { color: "hsl(185,85%,32%)", bg: "hsl(185,85%,96%)", border: "hsl(185,85%,80%)" },
  business:{ color: "hsl(280,60%,50%)", bg: "hsl(280,60%,96%)", border: "hsl(280,60%,80%)" },
  growth:  { color: "hsl(40,90%,42%)",  bg: "hsl(40,90%,96%)",  border: "hsl(40,90%,78%)" },
  premium: { color: "hsl(0,75%,50%)",   bg: "hsl(0,75%,97%)",   border: "hsl(0,75%,82%)" },
};

export default function LkEnergy() {
  const { user } = useLkAuth();
  const { balance, refresh } = useEnergy();
  const isOwner = user?.role === "owner" || user?.is_admin;

  const [packages, setPackages]       = useState<Package[]>([]);
  const [transactions, setTx]         = useState<Transaction[]>([]);
  const [tab, setTab]                 = useState<"buy" | "history">("buy");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetch(`${LK_URL}?action=energy_balance`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => { if (d.packages) setPackages(d.packages); })
      .catch(() => {}).finally(() => setLoading(false));

    if (isOwner) {
      fetch(`${LK_URL}?action=energy_history`, { headers: { "X-Session-Id": sid() } })
        .then(r => r.json()).then(d => { if (d.transactions) setTx(d.transactions); })
        .catch(() => {});
    }
  }, [isOwner]);

  const lowBalance = balance < 50 && balance > 0;
  const noBalance = balance === 0;

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20 }}>⚡</span>
        </div>
        <div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Энергия</h2>
          <div style={{ fontSize: 12, color: "#aaa" }}>Внутренняя валюта платформы</div>
        </div>
      </div>

      {/* Баннер баланса */}
      <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, borderRadius: 20, padding: "24px 28px", marginBottom: 16, color: "#fff", animation: "fadeIn 0.4s ease" }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Баланс салона</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "clamp(40px,7vw,60px)", fontWeight: 800, lineHeight: 1 }}>⚡ {balance.toLocaleString()}</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>энергий доступно команде</div>
          </div>
        </div>
        {lowBalance && (
          <div style={{ marginTop: 14, background: "rgba(255,200,0,0.2)", border: "1px solid rgba(255,200,0,0.4)", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600 }}>
            ⚠️ Баланс заканчивается. Рекомендуем пополнить счёт.
          </div>
        )}
        {noBalance && (
          <div style={{ marginTop: 14, background: "rgba(255,80,80,0.2)", border: "1px solid rgba(255,80,80,0.4)", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600 }}>
            🚫 Энергия закончилась. Пополните баланс для использования ИИ-инструментов.
          </div>
        )}
      </div>

      {!isOwner ? (
        /* Не владелец — просто показываем баланс */
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="Info" size={20} style={{ color: ACCENT, flexShrink: 0 }} />
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
            Пополнение баланса доступно владельцу салона. При нехватке энергии обратитесь к нему.
          </div>
        </div>
      ) : (
        <>
          {/* Табы */}
          <div style={{ display: "flex", gap: 4, background: "#f0f0ec", borderRadius: 11, padding: 4, marginBottom: 20 }}>
            {([{ id: "buy", label: "Пакеты энергии" }, { id: "history", label: "История" }] as { id: typeof tab; label: string }[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "buy" ? (
            /* Пакеты */
            <div>
              <div style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>
                Выберите пакет энергии. Оплата через ЮKassa — будет доступна в ближайшее время.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                {packages.map((pkg, idx) => {
                  const c = PKG_COLORS[pkg.code] || PKG_COLORS.start;
                  const baseRate = packages[0] ? packages[0].energy_amount / packages[0].price_rub : 1;
                  const thisRate = pkg.energy_amount / pkg.price_rub;
                  const savePct  = idx > 0 ? Math.round((thisRate / baseRate - 1) * 100) : 0;
                  return (
                    <div key={pkg.code} style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${c.border}`, padding: "20px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{pkg.name}</div>
                        {savePct > 0 && (
                          <div style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px" }}>
                            Выгоднее на {savePct}%
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "clamp(28px,5vw,36px)", fontWeight: 800, color: c.color, lineHeight: 1, marginBottom: 4 }}>
                        ⚡ {pkg.energy_amount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>энергий</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
                        {pkg.price_rub.toLocaleString()} ₽
                      </div>
                      <div style={{ fontSize: 11, color: "#bbb", marginBottom: 14 }}>
                        {Math.round(pkg.price_rub / pkg.energy_amount * 10) / 10} ₽ за энергию
                      </div>
                      <button
                        disabled
                        style={{ width: "100%", padding: "12px", borderRadius: 11, border: "none", background: `linear-gradient(135deg,${c.color},${c.color}cc)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "not-allowed", fontFamily: "Montserrat,sans-serif", opacity: 0.6 }}>
                        Купить · Скоро
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, background: "hsl(185,85%,96%)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="Info" size={15} style={{ color: ACCENT, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#555" }}>Оплата через ЮKassa подключается. До этого момента энергия начисляется вручную администратором.</div>
              </div>
            </div>
          ) : (
            /* История */
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
              {transactions.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
                  <div style={{ fontSize: 14, color: "#aaa" }}>Операций пока нет</div>
                </div>
              ) : (
                <div>
                  {transactions.map((tx, i) => (
                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < transactions.length - 1 ? "1px solid #f5f5f2" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === "credit" ? "hsl(145,60%,96%)" : "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name={tx.type === "credit" ? "Plus" : "Minus"} size={16} style={{ color: tx.type === "credit" ? "hsl(145,60%,35%)" : "hsl(0,75%,55%)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.action}</div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                          {tx.full_name && <span>{tx.full_name} · </span>}
                          {new Date(tx.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: tx.type === "credit" ? "hsl(145,60%,35%)" : "hsl(0,75%,55%)", flexShrink: 0 }}>
                        {tx.type === "credit" ? "+" : "−"}{tx.amount} ⚡
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}