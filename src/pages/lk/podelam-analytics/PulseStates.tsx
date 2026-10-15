import Icon from "@/components/ui/icon";

export function PulseLoading() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)", textAlign: "center" }}>
      <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 12 }}>Загружаем расширенный анализ…</div>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        padding: "10px 14px", maxWidth: 420, margin: "0 auto",
        background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
        textAlign: "left",
      }}>
        <Icon name="WifiOff" size={15} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.55 }}>
          Включённый VPN или нестабильный интернет могут замедлить загрузку. Если результат долго не появляется — отключите VPN и обновите страницу.
        </div>
      </div>
    </div>
  );
}

export function PulsePaywall({ onNav }: { onNav: (t: string) => void }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#0F172A,#112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon name="Activity" size={16} style={{ color: "#2DD4BF" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1 }}>Пульс бизнеса</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.5 }}>
        ИИ уже видит дополнительные возможности в ваших данных
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 14, maxWidth: 480 }}>
        В расширенном анализе вы увидите: что сейчас тормозит развитие, где вы теряете клиентов и деньги, где находится
        ближайшая точка роста, прогноз достижения цели — и что делать дальше.
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 18, maxWidth: 480 }}>
        <Icon name="Compass" size={16} style={{ color: "#2DD4BF", flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Новое: карта привлечения клиентов</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
            ИИ определит портрет вашей ЦА и покажет, на каких площадках её искать и что именно там разместить.
          </div>
        </div>
      </div>
      <button
        onClick={() => onNav("packages")}
        style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <Icon name="Sparkles" size={15} />
        Открыть расширенный анализ
      </button>
    </div>
  );
}
