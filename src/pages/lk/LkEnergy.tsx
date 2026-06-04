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
  const [historyPage, setHistoryPage] = useState(1);
  const [paying, setPaying]           = useState<string | null>(null);
  const PAGE_SIZE = 20;

  const handleBuy = async (code: string) => {
    setPaying(code);
    try {
      const res = await fetch(`${LK_URL}?action=payment_create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ package_code: code, return_url: window.location.href }),
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
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        borderRadius: 20, padding: "28px 32px", marginBottom: 20,
        color: "#fff", animation: "fadeIn 0.4s ease", position: "relative", overflow: "hidden",
      }}>
        {/* Декоративный круг */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `${ACCENT}18`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 100, height: 100, borderRadius: "50%", background: `${ACCENT}10`, pointerEvents: "none" }} />

        <div style={{ fontSize: 10, fontWeight: 700, color: `${ACCENT}`, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
          Баланс салона
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,8vw,72px)", fontWeight: 700, lineHeight: 1, color: "#fff" }}>
            {balance.toLocaleString()}
          </div>
          <div style={{ paddingBottom: 10, fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
            единиц
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.5px" }}>
          доступно для использования командой
        </div>

        {lowBalance && (
          <div style={{ marginTop: 18, background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "hsl(40,90%,70%)", fontWeight: 500 }}>
            Баланс заканчивается — рекомендуем пополнить счёт
          </div>
        )}
        {noBalance && (
          <div style={{ marginTop: 18, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "hsl(0,85%,70%)", fontWeight: 500 }}>
            Баланс исчерпан — пополните счёт для продолжения работы
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
              <button key={t.id} onClick={() => { setTab(t.id); setHistoryPage(1); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "buy" ? (
            /* Пакеты */
            <div>
              <div style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>
                Выберите пакет энергии. Оплата через ЮКассу — безопасно, зачисление сразу после оплаты.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
                {packages.map((pkg, idx) => {
                  const c = PKG_COLORS[pkg.code] || PKG_COLORS.start;
                  const baseRate = packages[0] ? packages[0].energy_amount / packages[0].price_rub : 1;
                  const thisRate = pkg.energy_amount / pkg.price_rub;
                  const savePct  = idx > 0 ? Math.round((thisRate / baseRate - 1) * 100) : 0;
                  const isPopular = pkg.code === "business";
                  return (
                    <div key={pkg.code} style={{
                      background: isPopular ? `linear-gradient(160deg, ${c.bg}, #fff)` : "#fff",
                      borderRadius: 16,
                      border: `1.5px solid ${isPopular ? c.border : "#E8ECF0"}`,
                      padding: "22px 20px",
                      display: "flex", flexDirection: "column",
                      position: "relative",
                      boxShadow: isPopular ? `0 4px 20px ${c.color}22` : "0 1px 4px rgba(0,0,0,0.04)",
                    }}>
                      {isPopular && (
                        <div style={{ position: "absolute", top: -1, left: 20, background: c.color, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                          Популярный
                        </div>
                      )}
                      {savePct > 0 && (
                        <div style={{ position: "absolute", top: 16, right: 16, background: c.bg, color: c.color, fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px" }}>
                          +{savePct}% выгоды
                        </div>
                      )}
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10, marginTop: isPopular ? 10 : 0 }}>
                        {pkg.name}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,42px)", fontWeight: 700, color: "#0F172A", lineHeight: 1, marginBottom: 2 }}>
                        {pkg.price_rub.toLocaleString()} <span style={{ fontSize: "0.5em", fontWeight: 400, color: "#64748B" }}>₽</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>
                        {Math.round(pkg.price_rub / pkg.energy_amount * 10) / 10} ₽ за единицу
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="Zap" size={14} style={{ color: c.color }} />
                        </div>
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{pkg.energy_amount.toLocaleString()}</span>
                          <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 4 }}>единиц энергии</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { if (!paying) handleBuy(pkg.code); }}
                        style={{
                          width: "100%", padding: "12px", borderRadius: 10, border: "none",
                          background: isPopular ? c.color : "#0F172A",
                          color: "#fff",
                          fontSize: 13, fontWeight: 700, cursor: paying ? "wait" : "pointer",
                          fontFamily: "Montserrat, sans-serif", letterSpacing: "0.5px",
                          opacity: paying && paying !== pkg.code ? 0.5 : 1,
                          transition: "all 0.2s", marginTop: "auto",
                        }}>
                        {paying === pkg.code ? "Переход к оплате…" : "Пополнить баланс"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, background: "hsl(185,85%,96%)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <Icon name="ShieldCheck" size={15} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12, color: "#555" }}>Безопасная оплата через ЮКассу. Энергия зачисляется на баланс салона сразу после подтверждения платежа.</div>
                </div>
                <div style={{ borderTop: "1px solid hsl(185,85%,85%)", paddingTop: 12, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                  Нажимая «Купить», вы подтверждаете согласие с условиями{" "}
                  <a href="/offer" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, fontWeight: 600, textDecoration: "underline" }}>
                    Публичной оферты
                  </a>
                  , в том числе с разделом 7 о внутренней расчётной единице «Энергия»: порядок начисления, расходования, курс к рублю и условия возврата.
                </div>
              </div>
            </div>
          ) : (
            /* История */
            (() => {
              const visible = transactions.slice(0, historyPage * PAGE_SIZE);
              const hasMore = transactions.length > visible.length;
              return (
                <div>
                  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
                    {transactions.length === 0 ? (
                      <div style={{ padding: "40px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
                        <div style={{ fontSize: 14, color: "#aaa" }}>Операций пока нет</div>
                      </div>
                    ) : (
                      <div>
                        {visible.map((tx, i) => (
                          <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < visible.length - 1 ? "1px solid #f5f5f2" : "none" }}>
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
                  {hasMore && (
                    <button
                      onClick={() => setHistoryPage(p => p + 1)}
                      style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                    >
                      Показать ещё ({transactions.length - visible.length})
                    </button>
                  )}
                  {transactions.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#bbb", textAlign: "center" }}>
                      Показано {visible.length} из {transactions.length} операций
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </>
      )}
    </div>
  );
}