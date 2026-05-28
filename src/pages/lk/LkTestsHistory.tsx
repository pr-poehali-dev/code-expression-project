import React from "react";
import { ACCENT, MindsetHistoryItem, BarriersHistoryItem, FinanceHistoryItem, ProfileHistoryItem, SalonHistoryItem } from "./LkTestsTypes";
import { IndexMap } from "./MindsetResult";
import { BarrierIndexMap } from "./barriers.logic";
import { FinanceData } from "./finance.types";
import { formatMoney } from "./finance.logic";

interface Props {
  mindsetHistory: MindsetHistoryItem[];
  barriersHistory: BarriersHistoryItem[];
  financeHistory: FinanceHistoryItem[];
  profileHistory: ProfileHistoryItem[];
  salonHistory: SalonHistoryItem[];
  onViewMindset: (item: { idx: IndexMap; date: string }) => void;
  onViewBarriers: (item: { idx: BarrierIndexMap; date: string }) => void;
  onViewFinance: (item: { data: FinanceData; date: string }) => void;
  onViewProfile: (item: ProfileHistoryItem) => void;
  onRetakeMindset: () => void;
  onRetakeBarriers: () => void;
  onRetakeFinance: () => void;
  onRetakeProfile: () => void;
  onRetakeSalon: () => void;
  onDeleteMindset: () => void;
  onDeleteBarriers: () => void;
  onDeleteFinance: () => void;
  onDeleteProfile: () => void;
  onDeleteSalon: () => void;
}

// ─── Универсальная карточка истории ──────────────────────────────────────────

interface HistoryCardProps {
  score: number;
  scoreLabel: string;
  color: string;
  title: string;
  date: string;
  time: string;
  tags?: { label: string; val: string | number }[];
  primaryBtn?: { label: string; onClick: () => void; bg: string };
  secondaryBtn?: { label: string; onClick: () => void; color: string };
}

function HistoryCard({ score, scoreLabel, color, title, date, time, tags, primaryBtn, secondaryBtn }: HistoryCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "16px 18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
    }}>
      {/* Верхняя часть: иконка + текст */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `${color}18`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 15, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 9, color, fontWeight: 600 }}>{scoreLabel}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2, lineHeight: 1.3 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
          {tags && tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {tags.map(tag => (
                <span key={tag.label} style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 20,
                  background: "#f4f4f0", color: "#666",
                }}>
                  {tag.label}: <b>{tag.val}</b>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Кнопки всегда снизу, на всю ширину */}
      {(primaryBtn || secondaryBtn) && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {primaryBtn && (
            <button onClick={primaryBtn.onClick} style={{
              flex: 1, padding: "9px", borderRadius: 10, border: "none",
              background: primaryBtn.bg, color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}>
              {primaryBtn.label}
            </button>
          )}
          {secondaryBtn && (
            <button onClick={secondaryBtn.onClick} style={{
              flex: 1, padding: "9px", borderRadius: 10,
              border: `1.5px solid ${secondaryBtn.color}`,
              background: "transparent", color: secondaryBtn.color,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}>
              {secondaryBtn.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Заголовок секции ────────────────────────────────────────────────────────

function HistorySection({ title, children, onDelete }: { title: string; children: React.ReactNode; onDelete?: () => void }) {
  const [confirm, setConfirm] = React.useState(false);

  const handleDelete = () => {
    if (!confirm) { setConfirm(true); return; }
    onDelete?.();
    setConfirm(false);
  };

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>
          {title}
        </h2>
        {onDelete && (
          <button
            onClick={handleDelete}
            onBlur={() => setConfirm(false)}
            style={{
              fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: confirm ? "#fee2e2" : "transparent",
              color: confirm ? "#ef4444" : "#ccc",
              padding: "4px 10px", borderRadius: 8,
              fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
            }}
          >
            {confirm ? "Подтвердить удаление" : "Удалить историю"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function LkTestsHistory({ mindsetHistory, barriersHistory, financeHistory, profileHistory, salonHistory, onViewMindset, onViewBarriers, onViewFinance, onViewProfile, onRetakeMindset, onRetakeBarriers, onRetakeFinance, onRetakeProfile, onRetakeSalon, onDeleteMindset, onDeleteBarriers, onDeleteFinance, onDeleteProfile, onDeleteSalon }: Props) {
  return (
    <>
      {/* Мышление с премиум-клиентами */}
      {mindsetHistory.length > 0 && (
        <HistorySection title="История · Мышление с премиум-клиентами" onDelete={onDeleteMindset}>
          {mindsetHistory.map((item, i) => {
            const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const color = item.igp >= 85 ? "#14b8a6" : item.igp >= 70 ? "#22c55e" : item.igp >= 50 ? "#eab308" : item.igp >= 30 ? "#f97316" : "#ef4444";
            return (
              <HistoryCard
                key={item.id}
                score={item.igp} scoreLabel="IGP" color={color}
                title={item.type_title} date={date} time={time}
                tags={i === 0 ? [
                  { label: "Уверен.", val: `${item.iu}%` },
                  { label: "Границы", val: `${item.ipg}%` },
                  { label: "Ценность", val: `${item.ics}%` },
                  { label: "Коммун.", val: `${item.izk}%` },
                ] : undefined}
                primaryBtn={{
                  label: "Смотреть",
                  bg: ACCENT,
                  onClick: () => {
                    const idx: IndexMap = { IU: item.iu, IPM: item.ipm, IDO: item.ido, IPG: item.ipg, ICS: item.ics, ISD: item.isd, IZK: item.izk };
                    const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                    onViewMindset({ idx, date: dateStr });
                  },
                }}
                secondaryBtn={{ label: "Пройти снова", color: ACCENT, onClick: onRetakeMindset }}
              />
            );
          })}
        </HistorySection>
      )}

      {/* Внутренние барьеры */}
      {barriersHistory.length > 0 && (
        <HistorySection title="История · Внутренние барьеры" onDelete={onDeleteBarriers}>
          {barriersHistory.map((item, i) => {
            const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const color = item.iib <= 30 ? "#14b8a6" : item.iib <= 50 ? "#22c55e" : item.iib <= 70 ? "#eab308" : item.iib <= 85 ? "#f97316" : "#ef4444";
            const ac = "hsl(20,85%,50%)";
            return (
              <HistoryCard
                key={item.id}
                score={item.iib} scoreLabel="IIB" color={color}
                title={item.type_title} date={date} time={time}
                tags={i === 0 ? [
                  { label: "Опора",   val: `${item.ivo}%` },
                  { label: "Самозв.", val: `${item.iss}%` },
                  { label: "Деньги",  val: `${item.isd}%` },
                  { label: "Выгор.",  val: `${item.iei}%` },
                ] : undefined}
                primaryBtn={{
                  label: "Смотреть",
                  bg: ac,
                  onClick: () => {
                    const idx: BarrierIndexMap = { IVO: item.ivo, ISS: item.iss, ISD: item.isd, IDO: item.ido, IIR: item.iir, IEI: item.iei, ISP: item.isp, IPZ_raw: 0 };
                    const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                    onViewBarriers({ idx, date: dateStr });
                  },
                }}
                secondaryBtn={{ label: "Пройти снова", color: ac, onClick: onRetakeBarriers }}
              />
            );
          })}
        </HistorySection>
      )}

      {/* Финансовая грамотность PRO */}
      {financeHistory.length > 0 && (
        <HistorySection title="История · Финансовая грамотность PRO" onDelete={onDeleteFinance}>
          {financeHistory.map((item, i) => {
            const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const color = item.ifr >= 85 ? "#14b8a6" : item.ifr >= 70 ? "#22c55e" : item.ifr >= 50 ? "#eab308" : item.ifr >= 30 ? "#f97316" : "#ef4444";
            const ac = "hsl(145,60%,40%)";
            return (
              <HistoryCard
                key={item.id}
                score={item.ifr} scoreLabel="IFR" color={color}
                title={`Разрыв: ${formatMoney(item.fr)}`} date={date} time={time}
                tags={i === 0 ? [
                  { label: "Потолок",         val: formatMoney(item.mpd) },
                  { label: "Нужный чек",      val: formatMoney(item.nsc) },
                  { label: "Нужно клиентов",  val: item.nck },
                ] : undefined}
                primaryBtn={{
                  label: "Смотреть",
                  bg: ac,
                  onClick: () => {
                    const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                    onViewFinance({ data: item.data as FinanceData, date: dateStr });
                  },
                }}
                secondaryBtn={{ label: "Пересчитать", color: ac, onClick: onRetakeFinance }}
              />
            );
          })}
        </HistorySection>
      )}

      {/* Финансовый профиль PRO */}
      {profileHistory.length > 0 && (
        <HistorySection title="История · Финансовый профиль PRO" onDelete={onDeleteProfile}>
          {profileHistory.map((item, i) => {
            const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const color = item.ifl >= 85 ? "#14b8a6" : item.ifl >= 70 ? "#22c55e" : item.ifl >= 50 ? "#eab308" : item.ifl >= 30 ? "#f97316" : "#ef4444";
            const ac = "hsl(240,70%,55%)";
            return (
              <HistoryCard
                key={item.id}
                score={item.ifl} scoreLabel="IFL" color={color}
                title={item.type_title} date={date} time={time}
                tags={i === 0 ? [
                  { label: "Зрелость",  val: `${item.ifz}%` },
                  { label: "Дисципл.", val: `${item.ifd}%` },
                  { label: "Самооцен.", val: `${item.ids}%` },
                  { label: "Тревога",  val: `${item.idt}%` },
                ] : undefined}
                primaryBtn={{ label: "Смотреть", bg: ac, onClick: () => onViewProfile(item) }}
                secondaryBtn={{ label: "Пройти снова", color: ac, onClick: onRetakeProfile }}
              />
            );
          })}
        </HistorySection>
      )}

      {/* Диагностика роста салона PRO */}
      {salonHistory.length > 0 && (
        <HistorySection title="История · Диагностика роста салона PRO" onDelete={onDeleteSalon}>
          {salonHistory.map((item, i) => {
            const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const color = item.ips >= 85 ? "#14b8a6" : item.ips >= 70 ? "#22c55e" : item.ips >= 50 ? "#eab308" : item.ips >= 30 ? "#f97316" : "#ef4444";
            const hiddenStr = item.hidden_money >= 1000 ? `+${Math.round(item.hidden_money / 1000)} тыс ₽` : `+${item.hidden_money} ₽`;
            const ac = "hsl(335,80%,50%)";
            return (
              <HistoryCard
                key={item.id}
                score={item.ips} scoreLabel="IPS" color={color}
                title={item.type_title} date={date} time={time}
                tags={i === 0 ? [
                  { label: "Возврат",   val: `${item.ivk}%` },
                  { label: "Чек",       val: `${item.isc}%` },
                  { label: "Продажи",   val: `${item.ipu}%` },
                  { label: "Потенциал", val: hiddenStr },
                ] : undefined}
                secondaryBtn={{ label: "Пройти снова", color: ac, onClick: onRetakeSalon }}
              />
            );
          })}
        </HistorySection>
      )}
    </>
  );
}