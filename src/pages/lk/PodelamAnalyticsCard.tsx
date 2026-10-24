import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { PodelamAnalyticsResponse, PodelamResource, hashActionText } from "./podelamShared";
import func2url from "../../../backend/func2url.json";
import MarkActionDoneButton from "./podelam-analytics/MarkActionDoneButton";
import ResourcesChecklist from "./podelam-analytics/ResourcesChecklist";
import AudienceMapBlock from "./podelam-analytics/AudienceMapBlock";
import { PulseLoading, PulsePaywall } from "./podelam-analytics/PulseStates";
import ClientViewAdvice from "./podelam-analytics/ClientViewAdvice";

const PODELAM_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
const PODELAM_FAST_URL = (func2url as Record<string, string>)["podelam-fast"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

const TREND_ICON: Record<string, { icon: string; color: string }> = {
  up: { icon: "TrendingUp", color: "hsl(145,60%,40%)" },
  down: { icon: "TrendingDown", color: "hsl(0,75%,55%)" },
  flat: { icon: "Minus", color: "#94A3B8" },
};

// ── Платная карточка «Пульс бизнеса» — расширенный ИИ-анализ (только с активным пакетом) ──
export function PodelamAnalyticsCard({ onNav }: { onNav: (t: string) => void }) {
  const [data, setData] = useState<PodelamAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resources, setResources] = useState<PodelamResource[]>([]);
  const [doneActions, setDoneActions] = useState<Record<string, boolean>>({});

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    fetch(`${PODELAM_URL}?action=podelam_analytics${refresh ? "&refresh=1" : ""}`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  const loadResources = useCallback(() => {
    if (!PODELAM_FAST_URL) return;
    fetch(`${PODELAM_FAST_URL}?action=podelam_resources_get`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => setResources(d.resources || []))
      .catch(() => {});
  }, []);

  const loadDoneActions = useCallback(() => {
    if (!PODELAM_FAST_URL) return;
    fetch(`${PODELAM_FAST_URL}?action=podelam_pulse_actions_done`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        const map: Record<string, boolean> = {};
        (d.done_keys || []).forEach((k: string) => { map[k] = true; });
        setDoneActions(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { load(); loadResources(); loadDoneActions(); }, [load, loadResources, loadDoneActions]);

  const saveResource = (key: string, connected: boolean, url: string) => {
    setResources(prev => prev.map(r => r.key === key ? { ...r, connected, url: url || null } : r));
    fetch(`${PODELAM_FAST_URL}?action=podelam_resources_save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ resource_key: key, connected, url }),
    }).catch(() => {});
  };

  const toggleActionDone = (key: string, text: string, done: boolean) => {
    setDoneActions(prev => ({ ...prev, [key]: done }));
    fetch(`${PODELAM_FAST_URL}?action=podelam_pulse_action_done`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ action_key: key, action_text: text, done }),
    }).catch(() => {});
  };

  if (loading) {
    return <PulseLoading />;
  }

  if (!data || !data.has_package) {
    return <PulsePaywall onNav={onNav} />;
  }

  if (data.has_profile === false) {
    return null; // Пакет есть, но диагностика ПоДелам ещё не заполнена — ниже покажется DiagnosticForm
  }

  const a = data.analysis;
  if (!a) return null;
  const trend = TREND_ICON[a.pulse_trend] || TREND_ICON.flat;
  const pulseColor = a.pulse_score >= 70 ? "hsl(145,60%,45%)" : a.pulse_score >= 40 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)";

  return (
    <div style={{ background: "linear-gradient(135deg,#0F172A,#112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Activity" size={16} style={{ color: "#2DD4BF" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1 }}>Пульс бизнеса</span>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: refreshing ? "default" : "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          <Icon name="RefreshCw" size={12} style={{ animation: refreshing ? "podelam-spin 1s linear infinite" : "none" }} />
          {refreshing ? "Обновляем…" : "Обновить"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="27" fill="none" stroke={pulseColor} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(a.pulse_score / 100) * 170} 170`}
                transform="rotate(-90 32 32)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>
              {a.pulse_score}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Индекс здоровья</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name={trend.icon} size={13} style={{ color: trend.color }} />
              <span style={{ fontSize: 12.5, color: trend.color, fontWeight: 600 }}>
                {a.pulse_trend === "up" ? "Растёт" : a.pulse_trend === "down" ? "Снижается" : "Стабильно"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: 18 }}>{a.summary}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 18 }}>
        {a.main_problem && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon name="AlertTriangle" size={12} style={{ color: "hsl(0,75%,60%)" }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(0,75%,65%)", textTransform: "uppercase", letterSpacing: 0.5 }}>Главная проблема</span>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{a.main_problem}</div>
          </div>
        )}
        {a.main_opportunity && (
          <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.22)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon name="Rocket" size={12} style={{ color: "#2DD4BF" }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 0.5 }}>Главная возможность</span>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{a.main_opportunity}</div>
          </div>
        )}
        {a.losses_estimate && (
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon name="TrendingDown" size={12} style={{ color: "hsl(40,90%,55%)" }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(40,90%,60%)", textTransform: "uppercase", letterSpacing: 0.5 }}>Что вы теряете</span>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{a.losses_estimate}</div>
          </div>
        )}
        {a.forecast && (
          <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.22)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon name="LineChart" size={12} style={{ color: "hsl(260,70%,70%)" }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(260,70%,75%)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Прогноз{a.forecast_confidence ? ` · уверенность ${a.forecast_confidence}` : ""}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{a.forecast}</div>
          </div>
        )}
      </div>

      <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Главное действие сегодня</div>
        <div style={{ fontSize: 13.5, color: "#fff", fontWeight: 600, lineHeight: 1.5 }}>{a.main_action}</div>
        <MarkActionDoneButton text={a.main_action} done={!!doneActions[hashActionText(a.main_action)]} onToggle={toggleActionDone} />
        {a.extra_actions.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {a.extra_actions.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                <div style={{ display: "flex", gap: 6 }}><span>·</span><span>{e}</span></div>
                <div style={{ marginLeft: 14 }}>
                  <MarkActionDoneButton text={e} done={!!doneActions[hashActionText(e)]} onToggle={toggleActionDone} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClientViewAdvice text={a.client_view_advice} onNav={onNav} />

      {a.audience_map && <AudienceMapBlock map={a.audience_map} onNav={onNav} doneActions={doneActions} onToggleDone={toggleActionDone} />}

      {resources.length > 0 && <ResourcesChecklist resources={resources} onSave={saveResource} />}

      <style>{`@keyframes podelam-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
