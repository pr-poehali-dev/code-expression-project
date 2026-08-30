import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { PodelamAnalyticsResponse, AudienceSegment, TrafficChannel, TOPIC_KEY_BY_NAV } from "./podelamShared";
import func2url from "../../../backend/func2url.json";

const PODELAM_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

const TREND_ICON: Record<string, { icon: string; color: string }> = {
  up: { icon: "TrendingUp", color: "hsl(145,60%,40%)" },
  down: { icon: "TrendingDown", color: "hsl(0,75%,55%)" },
  flat: { icon: "Minus", color: "#94A3B8" },
};

const ROLE_TYPE_LABEL: Record<string, { label: string; color: string }> = {
  primary: { label: "Основная ЦА", color: "#2DD4BF" },
  secondary: { label: "Вторичная ЦА", color: "hsl(260,70%,70%)" },
  potential: { label: "Перспективная ЦА", color: "hsl(40,90%,60%)" },
};

const PRIORITY_LABEL: Record<string, { label: string; color: string }> = {
  high: { label: "Высокий приоритет", color: "hsl(145,60%,45%)" },
  medium: { label: "Средний приоритет", color: "hsl(40,90%,55%)" },
  low: { label: "Низкий приоритет", color: "#94A3B8" },
};

// Формирует готовую тему для генератора контента на основе профиля сегмента ЦА —
// подставляется в поле ввода поста/сценария через тот же sessionStorage-механизм,
// что и темы из ежедневных шагов ПоДелам (см. TOPIC_KEY_BY_NAV).
function segmentToTopic(s: AudienceSegment): string {
  const parts = [`Аудитория: ${s.name}`];
  if (s.who) parts.push(`Кто это: ${s.who}`);
  if (s.problem) parts.push(`Проблема: ${s.problem}`);
  if (s.offer) parts.push(`Предложение: ${s.offer}`);
  return parts.join(". ");
}

function SegmentCard({ s, onNav }: { s: AudienceSegment; onNav?: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const rt = ROLE_TYPE_LABEL[s.role_type] || ROLE_TYPE_LABEL.secondary;

  const openGenerator = (nav: "marketing:post-gen" | "marketing:reel-script") => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onNav) return;
    const key = TOPIC_KEY_BY_NAV[nav];
    if (key) sessionStorage.setItem(key, segmentToTopic(s));
    onNav(nav);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: rt.color, background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "2px 8px", flexShrink: 0, whiteSpace: "nowrap" }}>{rt.label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={14} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
      </div>
      {!open && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{s.problem}</div>}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
          {[
            ["Кто", s.who], ["Проблема", s.problem], ["Хочет получить", s.desired_result],
            ["Почему выбирает", s.why_chooses], ["Что останавливает", s.objections],
            ["Где ищет решение", s.where_looks], ["Интересный контент", s.content_interest],
            ["Предложение", s.offer],
          ].map(([label, value]) => value ? (
            <div key={label}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{value}</div>
            </div>
          ) : null)}
          {s.data_basis === "inference" && (
            <div style={{ fontSize: 10.5, color: "hsl(40,80%,60%)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <Icon name="Info" size={11} /> Гипотеза ИИ — стоит проверить на практике
            </div>
          )}
          {onNav && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={openGenerator("marketing:post-gen")}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#2DD4BF", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="FileText" size={12} /> Сгенерировать пост
              </button>
              <button
                onClick={openGenerator("marketing:reel-script")}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#2DD4BF", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Clapperboard" size={12} /> Сценарий рилса
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChannelRow({ c }: { c: TrafficChannel }) {
  const pr = PRIORITY_LABEL[c.priority] || PRIORITY_LABEL.medium;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{c.source_name}</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: pr.color, whiteSpace: "nowrap" }}>{pr.label}</span>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 4 }}>{c.why_fits}</div>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
        <b style={{ color: "rgba(255,255,255,0.7)" }}>Что разместить:</b> {c.what_to_post}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, fontStyle: "italic" }}>{c.expected_result}</div>
    </div>
  );
}

// ── Платная карточка «Пульс бизнеса» — расширенный ИИ-анализ (только с активным пакетом) ──
export function PodelamAnalyticsCard({ onNav }: { onNav: (t: string) => void }) {
  const [data, setData] = useState<PodelamAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    fetch(`${PODELAM_URL}?action=podelam_analytics${refresh ? "&refresh=1" : ""}`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
        Загружаем расширенный анализ…
      </div>
    );
  }

  if (!data || !data.has_package) {
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

      <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "14px 16px", marginBottom: a.audience_map ? 18 : 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Главное действие сегодня</div>
        <div style={{ fontSize: 13.5, color: "#fff", fontWeight: 600, lineHeight: 1.5 }}>{a.main_action}</div>
        {a.extra_actions.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {a.extra_actions.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", display: "flex", gap: 6 }}>
                <span>·</span><span>{e}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {a.audience_map && <AudienceMapBlock map={a.audience_map} onNav={onNav} />}

      <style>{`@keyframes podelam-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Карта привлечения клиентов ──────────────────────────────────────────────
function AudienceMapBlock({ map, onNav }: { map: NonNullable<PodelamAnalyticsResponse["analysis"]>["audience_map"]; onNav: (t: string) => void }) {
  const [open, setOpen] = useState(true);
  if (!map) return null;
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: open ? 14 : 0 }}
      >
        <Icon name="Compass" size={15} style={{ color: "#2DD4BF" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1, flex: 1, textAlign: "left" }}>Карта привлечения клиентов</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
      </button>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {map.top3_channels_today.length > 0 && (
            <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>ТОП-3 канала на сейчас</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {map.top3_channels_today.map((c, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", display: "flex", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#2DD4BF" }}>{i + 1}.</span><span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {map.segments.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>МОЯ ЦА</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {map.segments.map((s, i) => <SegmentCard key={i} s={s} onNav={onNav} />)}
              </div>
            </div>
          )}

          {map.traffic_channels.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>ГДЕ НАХОДЯТСЯ МОИ КЛИЕНТЫ</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {map.traffic_channels.map((c, i) => <ChannelRow key={i} c={c} />)}
              </div>
            </div>
          )}

          {map.own_resources_note && (
            <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.22)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Icon name="Sparkles" size={13} style={{ color: "hsl(260,70%,70%)", flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(260,70%,75%)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Недоиспользуемый ресурс</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{map.own_resources_note}</div>
              </div>
            </div>
          )}

          {map.what_not_to_do && (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Icon name="Ban" size={13} style={{ color: "hsl(40,90%,55%)", flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "hsl(40,90%,60%)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Что делать не нужно</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{map.what_not_to_do}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}