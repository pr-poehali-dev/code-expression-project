import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, PodelamData, PodelamTerms } from "../podelamShared";

export function PodelamLoading({ isPsych, terms }: { isPsych: boolean; terms: PodelamTerms }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, marginBottom: 20,
        background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "podelam-pulse 1.6s ease-in-out infinite",
      }}>
        <Icon name="Compass" size={26} style={{ color: "#fff" }} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
        Собираем ваши данные…
      </div>
      <div style={{ fontSize: 13.5, color: "#64748B", maxWidth: 320, lineHeight: 1.6 }}>
        ИИ анализирует ваш доход, {isPsych ? "стоимость консультации" : "чек"} и базу {terms.baseWordGen} и формирует шаги на сегодня. Обычно это занимает до минуты.
      </div>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        marginTop: 18, padding: "10px 14px", maxWidth: 360,
        background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
        textAlign: "left",
      }}>
        <Icon name="WifiOff" size={15} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.55 }}>
          Включённый VPN или нестабильный интернет могут замедлить загрузку. Если результат долго не появляется — отключите VPN и обновите страницу.
        </div>
      </div>
      <style>{`
        @keyframes podelam-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export function PodelamTrialExpired({ onNav }: { onNav: (t: string) => void }) {
  return (
    <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Icon name="CalendarClock" size={26} style={{ color: "#fff" }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
        Бесплатный период ПоДелам закончился
      </div>
      <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
        30 дней бесплатного доступа к ежедневным шагам истекли. Оформите тариф «Шаги ПоДелам» за 1 290 ₽/мес,
        чтобы продолжить получать план на день, — вся история и прогресс сохранены и не потеряются.
      </div>
      <button
        onClick={() => onNav("packages")}
        style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
      >
        Оформить тариф
      </button>
    </div>
  );
}

export function PodelamNoEnergy({ data, onNav }: { data: PodelamData; onNav: (t: string) => void }) {
  return (
    <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Icon name="Zap" size={26} style={{ color: "#fff" }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Недостаточно энергии для нового плана</div>
      <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
        Построение нового плана на день стоит {data.energy_needed ?? ""} ⚡, доступно {data.energy_balance ?? 0} ⚡. Пополните баланс, чтобы ИИ собрал сегодняшние шаги.
      </div>
      <button
        onClick={() => onNav("shop")}
        style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
      >
        Пополнить энергию
      </button>
    </div>
  );
}
