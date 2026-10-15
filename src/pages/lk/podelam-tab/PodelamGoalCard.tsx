import Icon from "@/components/ui/icon";
import { fmt, Profile } from "../podelamShared";

export default function PodelamGoalCard({ profile, gap_amount, progress }: { profile: Profile; gap_amount: number; progress: number }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#0F172A,#112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Цель месяца</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{fmt(profile.target_revenue)} ₽</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Сейчас</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#2DD4BF" }}>{fmt(profile.current_revenue)} ₽</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Не хватает</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "hsl(40,90%,60%)" }}>{fmt(Math.max(0, gap_amount))} ₽</div>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: "linear-gradient(90deg,#2DD4BF,#14B8A6)" }} />
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{progress}% от цели</div>

      {/* Промежуточные цели по неделям */}
      {gap_amount > 0 && (
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Промежуточные цели на неделю
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }} className="podelam-weeks-grid">
            {[1, 2, 3, 4].map(week => {
              const weekTarget = profile.current_revenue + (gap_amount * week) / 4;
              const reached = profile.current_revenue >= weekTarget;
              return (
                <div key={week} style={{
                  background: reached ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${reached ? "rgba(45,212,191,0.35)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "10px 12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    {reached && <Icon name="CheckCircle2" size={12} style={{ color: "#2DD4BF" }} />}
                    <div style={{ fontSize: 10.5, color: reached ? "#2DD4BF" : "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                      Неделя {week}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{fmt(weekTarget)} ₽</div>
                </div>
              );
            })}
          </div>
          <style>{`
            @media (max-width: 640px) {
              .podelam-weeks-grid { grid-template-columns: repeat(2,1fr) !important; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
