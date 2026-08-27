import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { lkApi } from "@/lib/lkApi";

const ACCENT = "hsl(185,85%,32%)";

interface InvitedUser {
  full_name: string;
  registered_at: string;
  paid: boolean;
  amount_rub: number | null;
  bonus_energy: number | null;
  paid_at: string | null;
}

interface ReferralData {
  ref_code: string;
  ref_link: string;
  bonus_per_referral: number;
  invited: InvitedUser[];
  total_invited: number;
  total_paid: number;
  total_earned_energy: number;
}

export default function LkReferral() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    lkApi.referralInfo().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.ref_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #E2E8F0", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
        Не удалось загрузить данные. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>
          Личный кабинет
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,34px)", fontWeight: 700, color: "#0F172A", margin: "0 0 4px", lineHeight: 1.1 }}>
          Партнёрская программа
        </h2>
        <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 400 }}>
          Приглашайте коллег — получайте энергию на инструменты платформы
        </div>
      </div>

      {/* Баннер со ссылкой */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        borderRadius: 20, padding: "28px 32px", marginBottom: 20,
        color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `${ACCENT}18`, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Gift" size={17} style={{ color: "#2DD4BF" }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            +{data.bonus_per_referral} энергии за каждого друга
          </div>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 18px", maxWidth: 480 }}>
          Отправьте свою ссылку коллегам. Как только приглашённый впервые оплатит что-либо на платформе — вам разово начислится {data.bonus_per_referral} энергии на баланс. Энергию можно потратить на любые инструменты платформы — вывод недоступен.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.ref_link}
          </div>
          <button
            onClick={copyLink}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
              border: "none", background: copied ? "hsl(145,60%,38%)" : "linear-gradient(135deg,#2DD4BF,#14B8A6)",
              color: "#0F172A", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} style={{ color: copied ? "#fff" : "#0F172A" }} />
            <span style={{ color: copied ? "#fff" : "#0F172A" }}>{copied ? "Скопировано" : "Скопировать"}</span>
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }} className="referral-stats-grid">
        {[
          { label: "Приглашено всего", value: data.total_invited, icon: "Users" },
          { label: "Оплатили", value: data.total_paid, icon: "CheckCircle2" },
          { label: "Заработано энергии", value: data.total_earned_energy, icon: "Zap" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "16px 18px" }}>
            <Icon name={s.icon} size={16} style={{ color: ACCENT, marginBottom: 8 }} />
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Список приглашённых */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 10 }}>Приглашённые вами</div>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
        {data.invited.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
            <div style={{ fontSize: 14, color: "#aaa" }}>Пока никто не зарегистрировался по вашей ссылке</div>
          </div>
        ) : (
          <div>
            {data.invited.map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < data.invited.length - 1 ? "1px solid #f5f5f2" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: u.paid ? "hsl(145,60%,96%)" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={u.paid ? "CheckCircle2" : "Clock"} size={16} style={{ color: u.paid ? "hsl(145,60%,35%)" : "#94A3B8" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name || "Без имени"}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                    Регистрация: {new Date(u.registered_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                    {u.paid && u.paid_at && <> · оплатил {new Date(u.paid_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</>}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: u.paid ? "hsl(145,60%,35%)" : "#cbd5e1", flexShrink: 0 }}>
                  {u.paid ? `+${u.bonus_energy} ⚡` : "Ждём оплату"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, background: "hsl(185,85%,96%)", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10 }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
          Бонус начисляется один раз за каждого приглашённого — за его первую оплату (пополнение энергии или покупку пакета). Энергию можно использовать только внутри платформы для оплаты инструментов — вывод в деньги не предусмотрен.
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .referral-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
