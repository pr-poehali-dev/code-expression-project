import { ACCENT, MindsetHistoryItem, BarriersHistoryItem, FinanceHistoryItem } from "./LkTestsTypes";
import { IndexMap } from "./MindsetResult";
import { BarrierIndexMap } from "./barriers.logic";
import { FinanceData } from "./finance.types";
import { formatMoney } from "./finance.logic";

interface Props {
  mindsetHistory: MindsetHistoryItem[];
  barriersHistory: BarriersHistoryItem[];
  financeHistory: FinanceHistoryItem[];
  onViewMindset: (item: { idx: IndexMap; date: string }) => void;
  onViewBarriers: (item: { idx: BarrierIndexMap; date: string }) => void;
  onViewFinance: (item: { data: FinanceData; date: string }) => void;
  onRetakeMindset: () => void;
  onRetakeBarriers: () => void;
  onRetakeFinance: () => void;
}

export default function LkTestsHistory({ mindsetHistory, barriersHistory, financeHistory, onViewMindset, onViewBarriers, onViewFinance, onRetakeMindset, onRetakeBarriers, onRetakeFinance }: Props) {
  return (
    <>
      {/* История прохождений mindset */}
      {mindsetHistory.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
            История · Мышление с премиум-клиентами
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mindsetHistory.map((item, i) => {
              const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const pct = item.igp;
              const color = pct >= 85 ? "#14b8a6" : pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : pct >= 30 ? "#f97316" : "#ef4444";
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${color}18`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
                    <span style={{ fontSize: 9, color, fontWeight: 600 }}>IGP</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      {item.type_title}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
                    {i === 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {[
                          { label: "Уверен.", val: item.iu },
                          { label: "Границы", val: item.ipg },
                          { label: "Ценность", val: item.ics },
                          { label: "Коммун.", val: item.izk },
                        ].map(idx => (
                          <span key={idx.label} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "#f4f4f0", color: "#666",
                          }}>
                            {idx.label}: <b>{idx.val}%</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const idx: IndexMap = { IU: item.iu, IPM: item.ipm, IDO: item.ido, IPG: item.ipg, ICS: item.ics, ISD: item.isd, IZK: item.izk };
                        const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                        onViewMindset({ idx, date: dateStr });
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "none",
                        background: ACCENT, color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Смотреть
                    </button>
                    <button
                      onClick={onRetakeMindset}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: `1.5px solid ${ACCENT}`,
                        background: "transparent", color: ACCENT,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Пройти снова
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* История прохождений: Внутренние барьеры */}
      {barriersHistory.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
            История · Внутренние барьеры
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {barriersHistory.map((item, i) => {
              const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const pct = item.iib;
              const color = pct <= 30 ? "#14b8a6" : pct <= 50 ? "#22c55e" : pct <= 70 ? "#eab308" : pct <= 85 ? "#f97316" : "#ef4444";
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${color}18`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
                    <span style={{ fontSize: 9, color, fontWeight: 600 }}>IIB</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      {item.type_title}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
                    {i === 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {[
                          { label: "Опора", val: item.ivo },
                          { label: "Самозв.", val: item.iss },
                          { label: "Деньги", val: item.isd },
                          { label: "Выгор.", val: item.iei },
                        ].map(b => (
                          <span key={b.label} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "#f4f4f0", color: "#666",
                          }}>
                            {b.label}: <b>{b.val}%</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const idx: BarrierIndexMap = {
                          IVO: item.ivo, ISS: item.iss, ISD: item.isd,
                          IDO: item.ido, IIR: item.iir, IEI: item.iei,
                          ISP: item.isp, IPZ_raw: 0,
                        };
                        const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                        onViewBarriers({ idx, date: dateStr });
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "none",
                        background: "hsl(20,85%,50%)", color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Смотреть
                    </button>
                    <button
                      onClick={onRetakeBarriers}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "1.5px solid hsl(20,85%,50%)",
                        background: "transparent", color: "hsl(20,85%,50%)",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Пройти снова
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* История прохождений: Финансовая грамотность */}
      {financeHistory.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 16px" }}>
            История · Финансовая грамотность PRO
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {financeHistory.map((item, i) => {
              const date = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const time = new Date(item.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const pct = item.ifr;
              const color = pct >= 85 ? "#14b8a6" : pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : pct >= 30 ? "#f97316" : "#ef4444";
              return (
                <div key={item.id} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `${color}18`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
                    <span style={{ fontSize: 9, color, fontWeight: 600 }}>IFR</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      Разрыв: {formatMoney(item.fr)}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{date} · {time}</div>
                    {i === 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {[
                          { label: "Потолок", val: formatMoney(item.mpd) },
                          { label: "Нужный чек", val: formatMoney(item.nsc) },
                          { label: "Нужно клиентов", val: `${item.nck}` },
                        ].map(b => (
                          <span key={b.label} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "#f4f4f0", color: "#666",
                          }}>
                            {b.label}: <b>{b.val}</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const dateStr = new Date(item.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                        onViewFinance({ data: item.data as FinanceData, date: dateStr });
                      }}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "none",
                        background: "hsl(145,60%,40%)", color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Смотреть
                    </button>
                    <button
                      onClick={onRetakeFinance}
                      style={{
                        padding: "7px 14px", borderRadius: 10, border: "1.5px solid hsl(145,60%,40%)",
                        background: "transparent", color: "hsl(145,60%,40%)",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Пересчитать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}