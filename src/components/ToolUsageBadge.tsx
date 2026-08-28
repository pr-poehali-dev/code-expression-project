import Icon from "@/components/ui/icon";
import { usePackageUsage } from "@/contexts/PackageUsageContext";

const ACCENT = "hsl(185,85%,32%)";

/** Мини-счётчик оставшихся бесплатных использований инструмента по пакету на сегодня.
 * Рендерится только если у пользователя есть активный платный пакет — иначе ничего не показывает. */
export default function ToolUsageBadge({ toolKey, style }: { toolKey: string; style?: React.CSSProperties }) {
  const { hasPackage, usageByTool, loading } = usePackageUsage();
  if (loading || !hasPackage) return null;
  const u = usageByTool[toolKey];
  if (!u) return null;

  const left = Math.max(0, u.limit - u.used);
  const exhausted = left === 0;

  return (
    <div
      title={`По пакету бесплатно ${u.limit} раз(а) в сутки. Использовано сегодня: ${u.used}.`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700,
        padding: "5px 10px", borderRadius: 20, flexShrink: 0,
        color: exhausted ? "hsl(0,70%,50%)" : ACCENT,
        background: exhausted ? "hsl(0,70%,97%)" : "hsl(185,85%,96%)",
        border: `1px solid ${exhausted ? "hsl(0,70%,85%)" : "hsl(185,85%,82%)"}`,
        fontFamily: "Montserrat,sans-serif",
        ...style,
      }}
    >
      <Icon name="Gauge" size={12} />
      {exhausted ? "Бесплатный лимит исчерпан" : `${left} из ${u.limit} бесплатно сегодня`}
    </div>
  );
}
