import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PodelamAnalyticsResponse, AudienceSegment, TrafficChannel, TOPIC_KEY_BY_NAV, OFFERS_SEGMENT_PENDING_KEY, OffersPendingPortrait, hashActionText } from "../podelamShared";
import MarkActionDoneButton from "./MarkActionDoneButton";

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

// Генератор офферов (LkMarketingOffers) ждёт «портрет» ЦА в своём формате (archetype, pains,
// motivations и т.д.) — переупаковываем поля сегмента карты привлечения клиентов в этот формат,
// не теряя смысл: наши текстовые поля превращаются в односоставные списки там, где ожидается массив.
function segmentToOffersPortrait(s: AudienceSegment): OffersPendingPortrait {
  return {
    archetype: s.name,
    age_range: s.who,
    occupation: "",
    income: "",
    pains: [s.problem, s.objections].filter(Boolean),
    motivations: [s.desired_result].filter(Boolean),
    services_interest: [],
    channels: [s.where_looks].filter(Boolean),
    hook: s.offer,
  };
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

  const openOffers = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onNav) return;
    sessionStorage.setItem(OFFERS_SEGMENT_PENDING_KEY, JSON.stringify(segmentToOffersPortrait(s)));
    onNav("marketing:offers");
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
              <button
                onClick={openOffers}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.35)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "hsl(260,70%,75%)", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Gift" size={12} /> Оффер под сегмент
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Формирует тему поста-приглашения под конкретный канал трафика — что разместить и почему
// это подходит именно этой площадке, подставляется в генератор постов через sessionStorage.
function channelToTopic(c: TrafficChannel): string {
  const parts = [`Площадка: ${c.source_name}`, `Что разместить: ${c.what_to_post}`];
  if (c.why_fits) parts.push(`Почему подходит: ${c.why_fits}`);
  return parts.join(". ");
}

function ChannelRow({ c, onNav, done, onToggleDone }: { c: TrafficChannel; onNav?: (t: string) => void; done?: boolean; onToggleDone?: (key: string, text: string, done: boolean) => void }) {
  const pr = PRIORITY_LABEL[c.priority] || PRIORITY_LABEL.medium;

  const openPostGen = () => {
    if (!onNav) return;
    const key = TOPIC_KEY_BY_NAV["marketing:post-gen"];
    if (key) sessionStorage.setItem(key, channelToTopic(c));
    onNav("marketing:post-gen");
  };

  const actionText = `Канал: ${c.source_name} — ${c.what_to_post}`;

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
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, fontStyle: "italic", marginBottom: (onNav || onToggleDone) ? 8 : 0 }}>{c.expected_result}</div>
      {(onNav || onToggleDone) && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {onNav && (
            <button
              onClick={openPostGen}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#2DD4BF", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="FileText" size={12} /> Пост-приглашение для «{c.source_name}»
            </button>
          )}
          {onToggleDone && (
            <MarkActionDoneButton text={actionText} done={!!done} onToggle={onToggleDone} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Карта привлечения клиентов ──────────────────────────────────────────────
export default function AudienceMapBlock({ map, onNav, doneActions, onToggleDone }: { map: NonNullable<PodelamAnalyticsResponse["analysis"]>["audience_map"]; onNav: (t: string) => void; doneActions: Record<string, boolean>; onToggleDone: (key: string, text: string, done: boolean) => void }) {
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
                {map.traffic_channels.map((c, i) => {
                  const actionText = `Канал: ${c.source_name} — ${c.what_to_post}`;
                  return <ChannelRow key={i} c={c} onNav={onNav} done={!!doneActions[hashActionText(actionText)]} onToggleDone={onToggleDone} />;
                })}
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
