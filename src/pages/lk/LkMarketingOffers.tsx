import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import LkMarketingAudience from "./LkMarketingAudience";

const ACCENT = "hsl(185,85%,32%)";
const API_URL = "https://functions.poehali.dev/62a82e41-522d-46c2-902b-4caeb0e47880";

// ── Типы ─────────────────────────────────────────────────────────────────────

interface Portrait {
  archetype: string;
  age_range: string;
  occupation: string;
  income: string;
  pains: string[];
  motivations: string[];
  services_interest: string[];
  channels: string[];
  hook: string;
}

interface Offer {
  type: "first_visit" | "promo" | "package";
  type_label: string;
  title: string;
  description: string;
  cta: string;
  mechanics: string;
}

interface SegmentOffers {
  segment_index: number;
  archetype: string;
  offers: Offer[];
}

// ── Цвета типов офферов ───────────────────────────────────────────────────────

const OFFER_TYPE_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  first_visit: { bg: "hsl(220,80%,95%)", color: "hsl(220,80%,45%)", icon: "UserPlus" },
  promo:       { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,38%)",  icon: "Zap" },
  package:     { bg: "hsl(280,60%,95%)", color: "hsl(280,60%,45%)", icon: "Package" },
};

const SEGMENT_COLORS = [
  { accent: "hsl(220,80%,50%)", bg: "hsl(220,80%,95%)" },
  { accent: "hsl(280,60%,52%)", bg: "hsl(280,60%,95%)" },
  { accent: "hsl(145,60%,38%)", bg: "hsl(145,60%,93%)" },
];

// ── Карточка одного оффера ────────────────────────────────────────────────────

function OfferCard({ offer, copied, onCopy }: { offer: Offer; copied: boolean; onCopy: (text: string) => void }) {
  const style = OFFER_TYPE_STYLE[offer.type] || OFFER_TYPE_STYLE.promo;
  const copyText = `${offer.title}\n\n${offer.description}\n\n${offer.mechanics}`;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 14, padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Тип */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: style.bg, borderRadius: 7, padding: "4px 10px" }}>
          <Icon name={style.icon} size={12} style={{ color: style.color }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: style.color, letterSpacing: 0.5, textTransform: "uppercase" }}>{offer.type_label}</span>
        </div>
        <button
          onClick={() => onCopy(copyText)}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: copied ? "hsl(145,60%,38%)" : "#94A3B8", fontSize: 11, fontWeight: 600, fontFamily: "Montserrat,sans-serif", padding: 0 }}
        >
          <Icon name={copied ? "Check" : "Copy"} size={13} />
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>

      {/* Заголовок */}
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{offer.title}</div>

      {/* Описание */}
      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{offer.description}</div>

      {/* Механика */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7, background: "#F8FAFC", borderRadius: 8, padding: "8px 12px" }}>
        <Icon name="Settings2" size={12} style={{ color: "#64748B", flexShrink: 0, marginTop: 2 }} />
        <span style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{offer.mechanics}</span>
      </div>

      {/* CTA */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: ACCENT, borderRadius: 8, padding: "7px 14px", alignSelf: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{offer.cta}</span>
      </div>
    </div>
  );
}

// ── Группа офферов по сегменту ────────────────────────────────────────────────

function SegmentOffersCard({ segment, index }: { segment: SegmentOffers; index: number }) {
  const [open, setOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const col = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 18, overflow: "hidden" }}>
      {/* Шапка сегмента */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{ background: col.bg, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: col.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Users" size={17} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: col.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 }}>Сегмент {index + 1}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{segment.archetype}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: col.accent }}>
          {segment.offers.length} оффера
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={15} />
        </div>
      </div>

      {/* Офферы */}
      {open && (
        <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {segment.offers.map((offer, i) => (
            <OfferCard
              key={i}
              offer={offer}
              copied={copiedKey === `${index}-${i}`}
              onCopy={(text) => handleCopy(`${index}-${i}`, text)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  initialPortraits?: Portrait[];
  initialSalonName?: string;
}

export default function LkMarketingOffers({ onBack, initialPortraits, initialSalonName }: Props) {
  const [step, setStep] = useState<"choose" | "loading" | "result">("choose");
  const [portraits, setPortraits] = useState<Portrait[] | null>(initialPortraits || null);
  const [offers, setOffers] = useState<SegmentOffers[] | null>(null);
  const [salonName, setSalonName] = useState(initialSalonName || "");
  const [error, setError] = useState<string | null>(null);
  const [showAudience, setShowAudience] = useState(false);
  const [autoStarted, setAutoStarted] = useState(false);

  const sessionId = localStorage.getItem("lk_session") || "";

  async function generateOffers(portraitsList: Portrait[]) {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ portraits: portraitsList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setOffers(data.offers);
      setSalonName(prev => data.salon_name || prev);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setStep("choose");
    }
  }

  // Автозапуск если портреты переданы снаружи
  useEffect(() => {
    if (initialPortraits && !autoStarted) {
      setAutoStarted(true);
      generateOffers(initialPortraits);
    }
  }, []);

  return (
    <div>
      {/* Навигация */}
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Офферы · Бесплатно
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Офферы под целевую аудиторию
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          ИИ создаст по 3 оффера для каждого сегмента ЦА — на первый визит, акцию и пакет услуг. Готово для использования в рекламе.
        </p>
      </div>

      {/* Шаг выбора ЦА */}
      {step === "choose" && !offers && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Вариант 1: уже есть портреты */}
          {portraits && (
            <div style={{ background: "hsl(145,60%,97%)", border: "1.5px solid hsl(145,60%,80%)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(145,60%,88%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="CheckCircle" size={20} style={{ color: "hsl(145,60%,38%)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Портреты ЦА уже готовы</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{portraits.length} сегмента · {salonName}</div>
                </div>
              </div>
              <button
                onClick={() => generateOffers(portraits)}
                style={{ display: "flex", alignItems: "center", gap: 7, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Sparkles" size={15} />
                Создать офферы
              </button>
            </div>
          )}

          {/* Вариант: нужны портреты */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "hsl(280,60%,95%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Gift" size={28} style={{ color: "hsl(280,60%,52%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                {portraits ? "Или создайте новые портреты ЦА" : "Сначала нужны портреты ЦА"}
              </div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 360 }}>
                Офферы создаются на основе анализа вашей аудитории. Сначала запустите инструмент «Портрет ЦА» — это займёт несколько секунд.
              </div>
            </div>
            <button
              onClick={() => setShowAudience(true)}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "hsl(280,60%,52%)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="Users" size={15} />
              Создать портреты ЦА → Офферы
            </button>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Загрузка */}
      {step === "loading" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "48px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "hsl(280,60%,95%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Loader2" size={26} style={{ color: "hsl(280,60%,52%)", animation: "spin 1s linear infinite" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Создаю офферы...</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>ИИ разрабатывает предложения под каждый сегмент</div>
          </div>
        </div>
      )}

      {/* Результаты */}
      {step === "result" && offers && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>{offers.length * 3} оффера</span> для «{salonName}»
            </div>
            <button
              onClick={() => { setStep("choose"); setOffers(null); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="RefreshCw" size={13} />
              Создать заново
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {offers.map((segment, i) => (
              <SegmentOffersCard key={i} segment={segment} index={i} />
            ))}
          </div>

          {/* Следующий шаг */}
          <div style={{ marginTop: 24, background: "linear-gradient(135deg,hsl(145,60%,38%),hsl(145,60%,28%))", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="ArrowRight" size={20} style={{ color: "#fff", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Следующий шаг</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Перейдите в «Семантическое ядро» — ИИ подберёт поисковые запросы для продвижения этих офферов в Яндекс.Директ.</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}