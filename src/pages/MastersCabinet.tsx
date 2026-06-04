import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const DARK2 = "#080E1C";
const SERIF = "'Cormorant Garamond', serif";
const GOLD = "#C9A96E";
const AUTH_API = "https://functions.poehali.dev/2abd3fa5-1c57-42ac-80f2-040581a0423b";
const ACCRUAL_API = "https://functions.poehali.dev/2907ddb5-140b-429e-a5b0-30b5bd898074";

function getSession() { return localStorage.getItem("master_session") || ""; }
function clearSession() { localStorage.removeItem("master_session"); }
function fmt(n: number) { return Number(n).toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
function fmtDate(s: string) { return new Date(s).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" }); }

interface Master { id: string; email: string; full_name: string; phone?: string; ref_code: string; ref_url: string; created_at: string; }
interface Balance { pending_amount: number; available_amount: number; total_earned: number; total_withdrawn: number; }
interface Accrual { amount: number; source_amount: number; source_type: string; status: string; created_at: string; available_at: string; salon_name?: string; }
interface Withdrawal { id: string; amount: number; status: string; created_at: string; admin_comment?: string; }

function copyText(text: string, setCopied: (v: boolean) => void) {
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
    const el = document.createElement("textarea");
    el.value = text; el.style.cssText = "position:fixed;top:-9999px;opacity:0";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
  setCopied(true); setTimeout(() => setCopied(false), 2000);
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Ожидает 30 дней", color: "hsl(40,70%,38%)",  bg: "hsl(40,90%,93%)"  },
  credited:  { label: "Зачислено",        color: "hsl(145,60%,35%)", bg: "hsl(145,55%,93%)" },
  available: { label: "Доступно",         color: "hsl(145,60%,35%)", bg: "hsl(145,55%,93%)" },
};

const W_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: "На рассмотрении", color: GOLD },
  approved:  { label: "Одобрено",        color: TEAL },
  paid:      { label: "Выплачено",       color: TEAL },
  rejected:  { label: "Отклонено",       color: "hsl(0,70%,55%)" },
};

// ── Реф-ссылка ────────────────────────────────────────────────────────────────
function RefCard({ master }: { master: Master }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(45,212,191,0.08),rgba(20,184,166,0.04))", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Link" size={17} style={{ color: TEAL }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Ваша реферальная ссылка</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Поделитесь с владельцем салона</div>
        </div>
      </div>

      {/* Ссылка + кнопка копировать */}
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.8)", wordBreak: "break-all", lineHeight: 1.4 }}>{master.ref_url}</div>
        <button onClick={() => copyText(master.ref_url, setCopiedLink)} style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 9, border: "none", background: copiedLink ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.08)", color: copiedLink ? TEAL : "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          <Icon name={copiedLink ? "Check" : "Copy"} size={15} />
        </button>
      </div>
      {copiedLink && <div style={{ fontSize: 11, color: TEAL, marginBottom: 8, paddingLeft: 4 }}>Ссылка скопирована!</div>}

      {/* Код + шеринг */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => copyText(master.ref_code, setCopiedCode)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: copiedCode ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.05)", color: copiedCode ? TEAL : "#fff", cursor: "pointer", fontFamily: "monospace", fontSize: 15, fontWeight: 700, letterSpacing: 2, transition: "all 0.15s", flexShrink: 0 }}>
          {master.ref_code}
          <Icon name={copiedCode ? "Check" : "Copy"} size={12} style={{ opacity: 0.6 }} />
        </button>
        <a href={`https://max.ru/share?url=${encodeURIComponent(master.ref_url)}&text=${encodeURIComponent(`Нашла полезный инструмент для салона — попробуй бесплатно`)}`} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(45,212,191,0.25)", background: "rgba(45,212,191,0.08)", color: TEAL, textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="MessageCircle" size={14} /> Max
        </a>
      </div>
    </div>
  );
}

// ── Баланс ────────────────────────────────────────────────────────────────────
function BalanceCard({ balance, referralCount, onWithdraw }: { balance: Balance; referralCount: number; onWithdraw: () => void }) {
  const canWithdraw = balance.available_amount >= 5000;
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Wallet" size={17} style={{ color: GOLD }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Баланс</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="Users" size={12} /> {referralCount} {referralCount === 1 ? "салон" : referralCount < 5 ? "салона" : "салонов"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Доступно к выводу</div>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: canWithdraw ? TEAL : "#fff" }}>{fmt(balance.available_amount)} ₽</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>мин. 5 000 ₽</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Ожидает (30 дн.)</div>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>{fmt(balance.pending_amount)} ₽</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[{ label: "Всего заработано", value: `${fmt(balance.total_earned)} ₽` }, { label: "Выведено", value: `${fmt(balance.total_withdrawn)} ₽` }].map((r, i) => (
          <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{r.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{r.value}</div>
          </div>
        ))}
      </div>

      {canWithdraw ? (
        <button onClick={onWithdraw} style={{ width: "100%", padding: "13px", borderRadius: 10, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, border: "none", color: DARK, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <Icon name="CreditCard" size={15} /> Запросить вывод {fmt(balance.available_amount)} ₽
        </button>
      ) : (
        <div style={{ padding: "11px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
          До вывода не хватает <strong style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(5000 - balance.available_amount)} ₽</strong> — минимум 5 000 ₽
        </div>
      )}
    </div>
  );
}

// ── История начислений ────────────────────────────────────────────────────────
function AccrualsCard({ accruals }: { accruals: Accrual[] }) {
  if (accruals.length === 0) return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px", marginBottom: 16, textAlign: "center" }}>
      <Icon name="Clock" size={28} style={{ color: "rgba(255,255,255,0.15)", marginBottom: 10 }} />
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
        Начислений пока нет.<br />Пригласите первый салон — и доход начнёт копиться.
      </div>
    </div>
  );
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
        <Icon name="History" size={14} style={{ color: TEAL }} /> История начислений
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {accruals.map((a, i) => {
          const st = STATUS_MAP[a.status] || STATUS_MAP.pending;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < accruals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>
                  {a.salon_name ? `Салон «${a.salon_name}»` : "Салон"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                  {fmtDate(a.created_at)}
                  {a.status === "pending" && <> · доступно {fmtDate(a.available_at)}</>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, borderRadius: 5, padding: "2px 7px" }}>{st.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: TEAL }}>+{fmt(a.amount)} ₽</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── История выводов ───────────────────────────────────────────────────────────
function WithdrawalsCard({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (withdrawals.length === 0) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
        <Icon name="ArrowUpRight" size={14} style={{ color: GOLD }} /> Запросы на вывод
      </div>
      {withdrawals.map((w, i) => {
        const st = W_STATUS_MAP[w.status] || W_STATUS_MAP.pending;
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < withdrawals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{fmt(w.amount)} ₽</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{fmtDate(w.created_at)}{w.admin_comment ? ` · ${w.admin_comment}` : ""}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{st.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Форма вывода ──────────────────────────────────────────────────────────────
function WithdrawModal({ balance, onClose, onSuccess }: { balance: Balance; onClose: () => void; onSuccess: () => void }) {
  const [inn, setInn] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!inn || inn.length < 10) return setError("Введите ИНН (10 или 12 цифр)");
    if (!bank.trim()) return setError("Укажите банковские реквизиты");
    setLoading(true); setError(null);
    try {
      const sid = getSession();
      const res = await fetch(ACCRUAL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Master-Session": sid },
        body: JSON.stringify({ action: "withdraw", inn, bank_details: bank, amount: balance.available_amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      onSuccess();
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка"); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Inter,sans-serif", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0F1A2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Запрос вывода</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4 }}><Icon name="X" size={18} /></button>
        </div>
        <div style={{ padding: "12px 16px", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, marginBottom: 4 }}>СУММА К ВЫВОДУ</div>
          <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(balance.available_amount)} ₽</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Перевод в течение 5 рабочих дней</div>
        </div>
        {error && <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, fontSize: 13, color: "#FCA5A5" }}>{error}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>ИНН (самозанятый или ИП) *</label>
            <input value={inn} onChange={e => setInn(e.target.value.replace(/\D/g, ""))} placeholder="123456789012" maxLength={12} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Реквизиты для перевода *</label>
            <textarea value={bank} onChange={e => setBank(e.target.value)} placeholder="Банк, номер счёта / карты, ФИО получателя" rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? "rgba(45,212,191,0.4)" : `linear-gradient(135deg,${TEAL},${TEAL2})`, border: "none", color: DARK, fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            {loading ? <><Icon name="Loader2" size={15} style={{ animation: "spin 1s linear infinite" }} /> Отправляем...</> : "Отправить запрос"}
          </button>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6 }}>
            Нажимая кнопку, вы подтверждаете статус самозанятого или ИП
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Инструкция ────────────────────────────────────────────────────────────────
function InstructionCard() {
  const steps = [
    { icon: "Send", title: "Поделитесь ссылкой", desc: "Отправьте реферальную ссылку владельцу салона — в личном сообщении, по WhatsApp или email. Представьте как «полезный инструмент для салона»." },
    { icon: "UserCheck", title: "Владелец регистрируется", desc: "Он переходит по ссылке и создаёт аккаунт на «Про Диалог». Привязка происходит автоматически — вы нигде не упоминаетесь." },
    { icon: "Banknote", title: "Получаете 10% от энергий", desc: "Когда салон покупает энергию — вам начисляется 10% от купленного количества в рублях. 100 энергий = 10 ₽. Бонусы и ручные пополнения не считаются." },
    { icon: "CreditCard", title: "Выводите деньги", desc: "Как только накопится 5 000 ₽ — запросите вывод. Укажите ИНН (самозанятый или ИП). Перевод в течение 5 рабочих дней." },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="BookOpen" size={17} style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Как приглашать и зарабатывать</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={15} style={{ color: TEAL }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Главный кабинет ───────────────────────────────────────────────────────────
export default function MastersCabinet() {
  const navigate = useNavigate();
  const [master, setMaster] = useState<Master | null>(null);
  const [balance, setBalance] = useState<Balance>({ pending_amount: 0, available_amount: 0, total_earned: 0, total_withdrawn: 0 });
  const [accruals, setAccruals] = useState<Accrual[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"main" | "history" | "instruction" | "settings">("main");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const loadBalance = useCallback(async (sid: string) => {
    try {
      const res = await fetch(ACCRUAL_API, { headers: { "X-Master-Session": sid } });
      const data = await res.json();
      if (data.balance) setBalance(data.balance);
      if (data.accruals) setAccruals(data.accruals);
      if (data.withdrawals) setWithdrawals(data.withdrawals);
      if (typeof data.referral_count === "number") setReferralCount(data.referral_count);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const sid = getSession();
    if (!sid) { navigate("/masters/login"); return; }
    Promise.all([
      fetch(AUTH_API, { headers: { "X-Master-Session": sid } }).then(r => r.json()),
      loadBalance(sid),
    ]).then(([authData]) => {
      if (authData.master) setMaster(authData.master);
      else { clearSession(); navigate("/masters/login"); }
    }).catch(() => { clearSession(); navigate("/masters/login"); })
      .finally(() => setLoading(false));
  }, [navigate, loadBalance]);

  const logout = async () => {
    const sid = getSession();
    await fetch(AUTH_API, { method: "POST", headers: { "Content-Type": "application/json", "X-Master-Session": sid }, body: JSON.stringify({ action: "logout" }) }).catch(() => {});
    clearSession(); navigate("/masters");
  };

  if (loading) return (
    <div style={{ background: DARK2, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="Loader2" size={32} style={{ color: TEAL, animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!master) return null;

  const tabs = [
    { id: "main",        label: "Главная",    icon: "LayoutDashboard" },
    { id: "history",     label: "История",    icon: "History" },
    { id: "instruction", label: "Инструкция", icon: "BookOpen" },
    { id: "settings",    label: "Профиль",    icon: "User" },
  ] as const;

  return (
    <div style={{ fontFamily: "Inter,sans-serif", background: DARK2, minHeight: "100vh", color: "#fff" }}>

      {showWithdraw && (
        <WithdrawModal balance={balance} onClose={() => setShowWithdraw(false)} onSuccess={() => {
          setShowWithdraw(false); setWithdrawSuccess(true);
          loadBalance(getSession());
          setTimeout(() => setWithdrawSuccess(false), 5000);
        }} />
      )}

      {/* Шапка */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: "rgba(8,14,28,0.96)", backdropFilter: "blur(16px)" }}>
        <Link to="/masters" style={{ textDecoration: "none" }}><BrandLogo variant="light" size="md" /></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: DARK }}>
              {master.full_name.charAt(0).toUpperCase()}
            </div>
            <span className="m-cab-name">{master.full_name}</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 12, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="LogOut" size={13} /> Выйти
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>

        {/* Приветствие */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 100, padding: "4px 12px", marginBottom: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 10, color: GOLD, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Партнёрский кабинет</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px,4vw,32px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
            Привет, {master.full_name.split(" ")[0]}!
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "5px 0 0" }}>
            Код: <span style={{ color: TEAL, fontWeight: 600 }}>{master.ref_code}</span> · {master.email}
          </p>
        </div>

        {/* Успешный вывод */}
        {withdrawSuccess && (
          <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, fontSize: 13, color: TEAL, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={16} /> Запрос отправлен! Обработаем в течение 5 рабочих дней.
          </div>
        )}

        {/* Табы */}
        <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: "none", background: activeTab === t.id ? "rgba(255,255,255,0.09)" : "transparent", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: "clamp(11px,1.5vw,13px)", fontWeight: activeTab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.15s" }}>
              <Icon name={t.icon} size={13} />
              <span className="m-tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Контент */}
        {activeTab === "main" && (
          <>
            <RefCard master={master} />
            <BalanceCard balance={balance} referralCount={referralCount} onWithdraw={() => setShowWithdraw(true)} />
          </>
        )}

        {activeTab === "history" && (
          <>
            <AccrualsCard accruals={accruals} />
            <WithdrawalsCard withdrawals={withdrawals} />
          </>
        )}

        {activeTab === "instruction" && <InstructionCard />}

        {activeTab === "settings" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Профиль</div>
            {[
              { label: "Имя и фамилия", value: master.full_name },
              { label: "Email", value: master.email },
              { label: "Телефон", value: master.phone || "—" },
              { label: "Дата регистрации", value: fmtDate(master.created_at) },
            ].map((row, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{row.label}</span>
                <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "11px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
              Для изменения данных или вопросов — напишите на{" "}
              <a href="mailto:info@promtdialog.ru" style={{ color: TEAL, textDecoration: "none" }}>info@promtdialog.ru</a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 420px) {
          .m-cab-name { display: none; }
          .m-tab-label { display: none; }
        }
      `}</style>
    </div>
  );
}