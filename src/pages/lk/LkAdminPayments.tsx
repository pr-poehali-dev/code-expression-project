import { useEffect, useState } from "react";
import lkApi from "@/lib/lkApi";
import { ACCENT, Spinner } from "./LkAdminShared";

interface Payment {
  id: number;
  amount_rub: number;
  energy_amount: number;
  package_code: string;
  status: string;
  yookassa_id: string;
  created_at: string;
  user_name: string;
  user_email: string;
  salon_name: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  succeeded: { label: "Оплачен",  color: "#16a34a" },
  pending:   { label: "Ожидание", color: "#d97706" },
  canceled:  { label: "Отменён",  color: "#dc2626" },
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRub, setTotalRub] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    lkApi.adminPayments().then((d: { payments: Payment[]; total_rub: number; total_energy: number }) => {
      setPayments(d.payments || []);
      setTotalRub(d.total_rub || 0);
      setTotalEnergy(d.total_energy || 0);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.user_name.toLowerCase().includes(q) || p.user_email.toLowerCase().includes(q) || p.salon_name.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Итоги */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Всего платежей", value: payments.length, icon: "📋" },
          { label: "Успешных", value: payments.filter(p => p.status === "succeeded").length, icon: "✅" },
          { label: "Выручка", value: `${totalRub.toLocaleString("ru-RU")} ₽`, icon: "💰" },
          { label: "Энергии продано", value: `${totalEnergy.toLocaleString("ru-RU")} ⚡`, icon: "⚡" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "16px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", minWidth: 160, flex: "1 1 160px"
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Поиск по имени, email, салону..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: "1 1 220px", padding: "8px 14px", borderRadius: 8,
            border: "1px solid #e0e0e0", fontSize: 14, outline: "none", fontFamily: "Montserrat, sans-serif"
          }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0",
            fontSize: 14, fontFamily: "Montserrat, sans-serif", cursor: "pointer", background: "#fff"
          }}
        >
          <option value="all">Все статусы</option>
          <option value="succeeded">Оплачен</option>
          <option value="pending">Ожидание</option>
          <option value="canceled">Отменён</option>
        </select>
      </div>

      {/* Таблица */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: "Montserrat, sans-serif" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f0f0f0" }}>
                {["Дата", "Пользователь", "Салон", "Пакет", "Сумма", "Энергия", "Статус", "ID ЮКассы"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#444", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#aaa" }}>Платежи не найдены</td></tr>
              )}
              {filtered.map((p, i) => {
                const st = STATUS_LABEL[p.status] || { label: p.status, color: "#888" };
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap", color: "#555" }}>{formatDate(p.created_at)}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{p.user_name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{p.user_email}</div>
                    </td>
                    <td style={{ padding: "11px 14px", color: "#555" }}>{p.salon_name}</td>
                    <td style={{ padding: "11px 14px", color: "#555", whiteSpace: "nowrap" }}>{p.package_code}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>{p.amount_rub.toLocaleString("ru-RU")} ₽</td>
                    <td style={{ padding: "11px 14px", fontWeight: 600, color: ACCENT, whiteSpace: "nowrap" }}>+{p.energy_amount} ⚡</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20,
                        background: st.color + "18", color: st.color, fontWeight: 600, fontSize: 12
                      }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>
                      {p.yookassa_id ? p.yookassa_id.slice(0, 8) + "…" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 13, color: "#888", textAlign: "right" }}>
          Показано {filtered.length} из {payments.length}
        </div>
      )}
    </div>
  );
}