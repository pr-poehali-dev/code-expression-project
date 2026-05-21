import { IndexKey, QUESTIONS, MAX } from "./mindset.types";

export function calcIndexes(answers: Record<number, number>): Record<IndexKey, number> {
  const raw: Record<IndexKey, number> = { IU: 0, IPM: 0, IDO: 0, IPG: 0, ICS: 0, ISD: 0, IZK: 0 };

  QUESTIONS.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const scores = q.options[optIdx].scores;
    (Object.keys(scores) as IndexKey[]).forEach(k => {
      raw[k] += scores[k] ?? 0;
    });
  });

  const pct = {} as Record<IndexKey, number>;
  (Object.keys(raw) as IndexKey[]).forEach(k => {
    pct[k] = MAX[k] > 0 ? Math.round((raw[k] / MAX[k]) * 100) : 0;
  });

  return pct;
}

export function calcIGP(idx: Record<IndexKey, number>): number {
  const raw = (idx.IPM + idx.IU + idx.IPG + idx.ICS + idx.IZK - idx.IDO - idx.ISD) / 5;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function getScaleLabel(igp: number): { label: string; color: string } {
  if (igp < 30) return { label: "Мышление дефицита", color: "#ef4444" };
  if (igp < 50) return { label: "Зависимость от одобрения", color: "#f97316" };
  if (igp < 70) return { label: "Нестабильная уверенность", color: "#eab308" };
  if (igp < 85) return { label: "Профессиональная зрелость", color: "#22c55e" };
  return { label: "Премиальное мышление", color: "#14b8a6" };
}

export function getType(idx: Record<IndexKey, number>): {
  title: string;
  desc: string;
  weakZones: string[];
  recs: string[];
} {
  const igp = calcIGP(idx);
  if (igp < 40) return {
    title: "«Удобный специалист»",
    desc: "Вы боитесь потерять клиента и часто уступаете в ущерб себе. Ваша экспертиза реальна, но страх отталкивает от высокого чека.",
    weakZones: ["Страх денег", "Зависимость от одобрения", "Слабые границы"],
    recs: [
      "Начни с простого: перестань оправдываться, когда называешь цену",
      "Практикуй паузу после озвучивания чека — не заполняй тишину",
      "Запиши 5 результатов, которые дала твоя работа клиентам",
      "Введи одно правило границ и держи его неделю",
    ],
  };
  if (igp < 60) return {
    title: "«Эмоционально зависимый»",
    desc: "Вы глубоко переживаете реакцию клиентов. Это делает вас чутким специалистом, но мешает удерживать профессиональную дистанцию.",
    weakZones: ["Эмоциональная зависимость", "Коммуникация под давлением"],
    recs: [
      "Разделяй: есть рабочее время, есть личное — и они не смешиваются",
      "После сессии с трудным клиентом делай 'дебриф' письменно, не в голове",
      "Создай скрипт ответа на недовольство — чтобы не реагировать эмоционально",
      "Работай с установкой: одобрение клиента ≠ качество твоей работы",
    ],
  };
  if (igp < 75) return {
    title: "«Сильный эксперт без системы»",
    desc: "У вас есть ценность и экспертиза, но границы и позиционирование пока не выстроены в систему. Вы близко — нужен следующий шаг.",
    weakZones: ["Системность границ", "Чёткое позиционирование"],
    recs: [
      "Пропиши правила работы с клиентами в документе и придерживайся их",
      "Опредли своего идеального клиента — и откажись от одного 'не своего'",
      "Введи предоплату хотя бы на 50% — это фильтр серьёзности",
      "Сформулируй свою специализацию в одном предложении",
    ],
  };
  return {
    title: "«Премиальный профессионал»",
    desc: "Вы сочетаете уверенность, профессиональные границы и ясное ощущение своей ценности. Это основа работы с клиентами высокого сегмента.",
    weakZones: [],
    recs: [
      "Масштабируйся: групповые форматы, VIP-пакеты, партнёрства",
      "Работай над личным брендом — ваш уровень требует видимости",
      "Создай реферальную систему среди текущих клиентов",
      "Документируй кейсы — это ваш актив для позиционирования",
    ],
  };
}
