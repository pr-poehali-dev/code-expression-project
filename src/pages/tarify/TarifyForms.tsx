import { useEffect, useRef, useState } from "react";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, ACCENT_SHADOW_HOVER, SEND_URL } from "./constants";

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left" as const, background: "none", border: "none",
          padding: "18px 20px", fontSize: 15, fontWeight: 600, color: "#1a1a1a",
          cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}
      >
        <span>{q}</span>
        <span style={{ color: ACCENT, fontSize: 20, lineHeight: 1, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#5a5a5a", lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  );
}

export function ConsultForm({ initialPlan = "" }: { initialPlan?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState(initialPlan);
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !plan) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phone,
          message: `Тариф: ${plan}\nТелефон: ${phone}`,
        }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Заявка принята!</div>
        <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>Мы свяжемся с вами в течение рабочего дня и расскажем всё о доступе к платформе.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Мария Иванова" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif" }}
          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
          onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Интересующий тариф</label>
        <select value={plan} onChange={e => setPlan(e.target.value)} required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", color: plan ? "#1a1a1a" : "#999" }}
        >
          <option value="" disabled>Выберите тариф</option>
          <option value="Базовый">Базовый — 150 000 ₽</option>
          <option value="Расширенный">Расширенный — 250 000 ₽</option>
          <option value="Полный">Полный — по запросу</option>
        </select>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          Я согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
        </span>
      </label>
      <button type="submit"
        style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
      >
        {loading ? "Отправляем..." : "Оставить заявку на консультацию"}
      </button>
      {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
    </form>
  );
}
