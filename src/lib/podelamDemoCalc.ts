// Локальный расчёт точек роста для демо-формы на лендинге — БЕЗ обращения к ИИ (чтобы не тратить деньги).
// Формулы полностью повторяют fallback-логику backend/masters-accrual/index.py (build_growth_points),
// поэтому цифры в демо и в реальном плане после регистрации совпадают.

export interface DemoProfile {
  avg_check: number;
  current_revenue: number;
  target_revenue: number;
  base_size: number;
  repeat_rate: number;
  free_slots_per_week: number;
  has_addon_services: boolean;
}

export interface DemoGrowthPoint {
  key: string;
  title: string;
  action: string;
  potential: number;
}

export function calcGapAmount(profile: DemoProfile): number {
  return profile.target_revenue - profile.current_revenue;
}

export function calcGrowthPoints(profile: DemoProfile): DemoGrowthPoint[] {
  const { avg_check, base_size, repeat_rate, free_slots_per_week, has_addon_services } = profile;
  const points: DemoGrowthPoint[] = [];

  const inactive = Math.max(0, Math.round(base_size * (1 - repeat_rate / 100)));
  const toReturn = Math.min(inactive, Math.max(5, Math.round(inactive * 0.3)));
  if (toReturn > 0) {
    points.push({
      key: "return_clients",
      title: "Вернуть клиентов из базы",
      action: `Написать ${toReturn} клиентам, которые давно не были`,
      potential: Math.round(toReturn * avg_check * 0.7),
    });
  }

  const slotsMonth = free_slots_per_week * 4;
  const toFill = Math.min(slotsMonth, Math.max(2, Math.round(slotsMonth * 0.6)));
  if (toFill > 0) {
    points.push({
      key: "fill_slots",
      title: "Заполнить свободные окна",
      action: `Заполнить ${toFill} окон в этом месяце спецпредложением`,
      potential: Math.round(toFill * avg_check),
    });
  }

  const addonCount = has_addon_services ? Math.max(5, Math.round(base_size * 0.15)) : Math.max(3, Math.round(base_size * 0.08));
  const addonCheck = Math.round(avg_check * 0.3);
  points.push({
    key: "upsell",
    title: "Поднять средний чек",
    action: `Предложить допуслугу ${addonCount} клиентам`,
    potential: addonCount * addonCheck,
  });

  return points;
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString("ru-RU");
}
