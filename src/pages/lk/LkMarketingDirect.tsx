import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { ACCENT, DIRECT_COLOR, API_URL, CACHE_VERSION, AdGroup, KeywordGroup } from "./LkMarketingDirect.types";
import { AdGroupCard, CampaignMinusBlock } from "./LkMarketingDirectGroupCard";
import { EnergyComplexityNote } from "./LkMarketingShared";
import ToolUsageBadge from "@/components/ToolUsageBadge";

interface Props {
  onBack: () => void;
  initialGroups?: KeywordGroup[];
}

export default function LkMarketingDirect({ onBack, initialGroups }: Props) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";
  const cacheKey = `mkt_direct_${CACHE_VERSION}_${user?.salon_id ?? ""}`;

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw) as { ads: AdGroup[]; salonName: string };
    } catch { /* ignore */ }
    return null;
  };

  const cached = loadCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ads, setAds] = useState<AdGroup[] | null>(cached?.ads ?? null);
  const [salonName, setSalonName] = useState(cached?.salonName ?? "");
  const [autoStarted, setAutoStarted] = useState(false);

  const saveCache = (a: AdGroup[], name: string) => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ ads: a, salonName: name })); } catch { /* ignore */ }
  };

  const resetCache = () => { localStorage.removeItem(cacheKey); setAds(null); };

  const generate = async (groups: KeywordGroup[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ groups }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setAds(data.ads);
      setSalonName(data.salon_name || "");
      saveCache(data.ads, data.salon_name || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialGroups && !autoStarted && !cached) {
      setAutoStarted(true);
      generate(initialGroups);
    }
  }, []);

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Директ
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Объявления для Яндекс.Директ
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6, maxWidth: 520 }}>
          Готовые объявления по требованиям Яндекса: заголовок 1 (≤35 симв.), заголовок 2 (≤30 симв.), текст (≤81 симв.).
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(25,90%,97%)", borderRadius: 12, border: "1px solid hsl(25,90%,87%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться и почему это выгодно</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Выберите услугу, укажите аудиторию — ИИ сразу напишет несколько вариантов объявлений, соответствующих техническим требованиям Яндекса.<br />
            Копирайтер или агентство берут за это деньги и время. Здесь вы получаете профессиональные тексты объявлений за минуту и можете сразу загружать их в рекламный кабинет.
          </div>
        </div>
        <EnergyComplexityNote />
      </div>

      {/* Загрузка */}
      {loading && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "48px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "hsl(25,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Loader2" size={26} style={{ color: DIRECT_COLOR, animation: "spin 1s linear infinite" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Пишу объявления...</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>ИИ составляет тексты под каждую группу запросов</div>
          </div>
        </div>
      )}

      {/* Нет данных */}
      {!loading && !ads && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "hsl(25,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="MousePointerClick" size={28} style={{ color: DIRECT_COLOR }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Нужно семантическое ядро</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 360 }}>
              Объявления создаются на основе групп из семантического ядра. Сначала перейдите в «Семантическое ядро» и вернитесь сюда через кнопку «Следующий шаг».
            </div>
          </div>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 400 }}>
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Результаты */}
      {!loading && ads && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>{ads.length * 2} объявления</span> · {ads.length} групп · «{salonName}»
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {initialGroups && (
                <button
                  onClick={() => generate(initialGroups)}
                  style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1.5px solid ${DIRECT_COLOR}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: DIRECT_COLOR, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                >
                  <Icon name="RefreshCw" size={13} />
                  Создать заново
                </button>
              )}
              <button
                onClick={resetCache}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#94A3B8", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Trash2" size={13} />
                Сбросить
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <ToolUsageBadge toolKey="mkt_direct" />
          </div>

          {/* Легенда символов */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { dot: "hsl(145,60%,45%)", label: "Норма" },
              { dot: "hsl(40,80%,50%)",  label: "Близко к лимиту" },
              { dot: "#DC2626",           label: "Превышен лимит" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.dot }} />
                <span style={{ fontSize: 11, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ads.map((group, i) => {
              const srcGroup = initialGroups?.find(g => g.group === group.group || g.service_tag === group.service_tag);
              const srcKeywords = srcGroup?.keywords.map(k => k.query) ?? [];
              return <AdGroupCard key={i} group={group} index={i} salonName={salonName} sourceKeywords={srcKeywords} />;
            })}
          </div>

          {/* Общие минус-слова кампании */}
          {(() => {
            const allMinus = Array.from(new Set(ads.flatMap(g => g.minus_words ?? [])));
            if (!allMinus.length) return null;
            return <CampaignMinusBlock minusWords={allMinus} />;
          })()}

          {/* Итоговая плашка */}
          <div style={{ marginTop: 16, background: "#F8FAFC", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #E8ECF0" }}>
            <Icon name="CheckCircle" size={20} style={{ color: "hsl(145,60%,38%)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>Готово к загрузке в Яндекс.Директ</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Скопируйте тексты в интерфейс Директа или выгрузите через Excel-шаблон вручную.</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}