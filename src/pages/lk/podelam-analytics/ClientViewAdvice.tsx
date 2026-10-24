import Icon from "@/components/ui/icon";

const DEFAULT_TEXT =
  "Предложение, которое понятно вам, не всегда понятно клиенту. Регулярно проигрывайте общение с разными клиентами: так вы готовитесь не только к разговору, но и понимаете, как продать и предложить услугу, исходя из потребностей клиента и его боли, и закрыть эту боль.";

export default function ClientViewAdvice({ text, onNav }: { text?: string | null; onNav: (t: string) => void }) {
  return (
    <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.28)", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <Icon name="Eye" size={14} style={{ color: "#2DD4BF" }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1 }}>Проверьте глазами клиента</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 12 }}>{text || DEFAULT_TEXT}</div>
      <button
        onClick={() => onNav("clientview")}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#0F172A", background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", border: "none", borderRadius: 9, padding: "10px 18px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
      >
        Проверить глазами клиента
        <Icon name="ArrowRight" size={13} />
      </button>
    </div>
  );
}
