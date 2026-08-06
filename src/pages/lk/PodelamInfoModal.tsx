import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK } from "./podelamShared";

// ── Модалка «Как это работает» ─────────────────────────────────────────────────
export default function InfoModal({ onClose }: { onClose: () => void }) {
  const items: { icon: string; title: string; text: string }[] = [
    {
      icon: "Compass",
      title: "Что такое «ПоДелам»",
      text: "Это ИИ-навигатор дохода. Он не заменяет остальные инструменты платформы, а объясняет, какой из них использовать сегодня и в какой последовательности, чтобы доход рос, а не просто «что-то делалось».",
    },
    {
      icon: "Calculator",
      title: "Откуда берутся цифры",
      text: "На основе вашей диагностики (средний чек, доход, база клиентов, свободные окна) ИИ считает разрыв между текущим и желаемым доходом и раскладывает его на понятные точки роста — сколько клиентов вернуть, сколько окон заполнить, кому предложить допуслугу.",
    },
    {
      icon: "RefreshCw",
      title: "Когда обновляются задания",
      text: "Новый план на день формируется автоматически раз в сутки. Если хотите пересчитать план сразу — например, изменился доход или база клиентов — нажмите «Обновить диагностику» и заполните форму заново.",
    },
    {
      icon: "CheckCircle2",
      title: "Как выполнять дела",
      text: "У каждого дела есть кнопка, которая сразу открывает нужный инструмент (сообщения клиентам, офферы, скрипты, Reels) с уже подготовленным контекстом. Сделали — отметьте кружок галочкой, чтобы дело ушло в выполненные и не мешало на завтра.",
    },
    {
      icon: "Wallet",
      title: "Как указать доход за день",
      text: "В блоке «Доход за сегодня» впишите сумму, которую фактически заработали, и нажмите «Сохранить». Эти данные попадают в статистику и показывают, насколько факт совпадает с потенциалом плана.",
    },
    {
      icon: "Info",
      title: "Важно",
      text: "Суммы потенциала — это ориентир, а не гарантия. Реальный результат зависит от спроса, цены, качества услуг и того, выполните ли вы предложенные действия.",
    },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Compass" size={18} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Как работает «ПоДелам»</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "#F1F5F9", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="X" size={16} />
          </button>
        </div>
        <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={16} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{it.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{it.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
