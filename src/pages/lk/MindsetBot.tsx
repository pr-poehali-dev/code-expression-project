import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import Icon from "@/components/ui/icon";

// ─── ТИПЫ ────────────────────────────────────────────────────────────────────

type IndexKey = "IU" | "IPM" | "IDO" | "IPG" | "ICS" | "ISD" | "IZK";

interface Option {
  text: string;
  scores: Partial<Record<IndexKey, number>>;
}

interface Question {
  id: number;
  block: number;
  blockTitle: string;
  text: string;
  options: Option[];
}

// ─── ДАННЫЕ ──────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // БЛОК 1: Самооценка и деньги
  {
    id: 1, block: 1, blockTitle: "Самооценка и деньги",
    text: "Что вы чувствуете, когда называете высокий чек?",
    options: [
      { text: "Неловкость", scores: { IU: 0, ISD: 3 } },
      { text: "Страх отказа", scores: { IU: 1, ISD: 2 } },
      { text: "Спокойствие, но есть напряжение", scores: { IU: 2, ISD: 1 } },
      { text: "Спокойствие и уверенность", scores: { IU: 3, ISD: 0 } },
    ],
  },
  {
    id: 2, block: 1, blockTitle: "Самооценка и деньги",
    text: "Если клиент говорит «дорого»:",
    options: [
      { text: "Сразу начинаю оправдываться", scores: { IU: 0, ICS: 0 } },
      { text: "Предлагаю скидку", scores: { IU: 1, IPG: 0 } },
      { text: "Спокойно объясняю ценность", scores: { IU: 2, ICS: 2 } },
      { text: "Понимаю, что клиент может быть не мой", scores: { IU: 3, IPG: 3 } },
    ],
  },
  {
    id: 3, block: 1, blockTitle: "Самооценка и деньги",
    text: "Какой доход вам кажется «слишком большим» для вашей профессии?",
    options: [
      { text: "Уже текущий", scores: { ISD: 3 } },
      { text: "В 2 раза больше текущего", scores: { ISD: 2 } },
      { text: "В 5 раз больше", scores: { ISD: 1 } },
      { text: "Ограничений почти нет", scores: { ISD: 0, IPM: 3 } },
    ],
  },
  // БЛОК 2: Зависимость от оценки
  {
    id: 4, block: 2, blockTitle: "Зависимость от оценки",
    text: "Если клиент недоволен:",
    options: [
      { text: "Думаю об этом несколько дней", scores: { IDO: 3 } },
      { text: "Сильно переживаю", scores: { IDO: 2 } },
      { text: "Анализирую ситуацию", scores: { IZK: 2 } },
      { text: "Разделяю эмоции и работу", scores: { IZK: 3, IU: 2 } },
    ],
  },
  {
    id: 5, block: 2, blockTitle: "Зависимость от оценки",
    text: "Вам важно нравиться клиенту?",
    options: [
      { text: "Очень важно", scores: { IDO: 3 } },
      { text: "Да, важно", scores: { IDO: 2 } },
      { text: "Частично", scores: { IDO: 1 } },
      { text: "Главное — результат работы", scores: { IDO: 0, IPM: 2 } },
    ],
  },
  // БЛОК 3: Коммуникация с премиум-клиентом
  {
    id: 6, block: 3, blockTitle: "Коммуникация с премиум-клиентом",
    text: "Клиент ведёт себя высокомерно:",
    options: [
      { text: "Теряюсь", scores: { IU: 0 } },
      { text: "Пытаюсь понравиться", scores: { IDO: 2 } },
      { text: "Сохраняю профессионализм", scores: { IZK: 2 } },
      { text: "Спокойно удерживаю позицию", scores: { IPG: 3, IU: 3 } },
    ],
  },
  {
    id: 7, block: 3, blockTitle: "Коммуникация с премиум-клиентом",
    text: "Клиент просит больше, чем входит в услугу:",
    options: [
      { text: "Соглашаюсь", scores: { IPG: 0 } },
      { text: "Неудобно отказать", scores: { IPG: 1 } },
      { text: "Объясняю рамки", scores: { IPG: 2 } },
      { text: "Спокойно обозначаю условия", scores: { IPG: 3, IPM: 2 } },
    ],
  },
  // БЛОК 4: Границы
  {
    id: 8, block: 4, blockTitle: "Границы",
    text: "Клиент пишет ночью:",
    options: [
      { text: "Отвечаю сразу", scores: { IPG: 0 } },
      { text: "Переживаю, если не отвечу", scores: { IDO: 2 } },
      { text: "Отвечаю в рабочее время", scores: { IPG: 2 } },
      { text: "У меня есть правила коммуникации", scores: { IPG: 3, IPM: 2 } },
    ],
  },
  {
    id: 9, block: 4, blockTitle: "Границы",
    text: "Если клиент отменяет запись:",
    options: [
      { text: "Чувствую тревогу", scores: { IU: 0 } },
      { text: "Боюсь потерять клиента", scores: { IDO: 2 } },
      { text: "Есть правила отмены", scores: { IPG: 2 } },
      { text: "Работаю по системе предоплаты", scores: { IPM: 3, IPG: 3 } },
    ],
  },
  // БЛОК 5: Ценность себя
  {
    id: 10, block: 5, blockTitle: "Ценность себя",
    text: "Как вы воспринимаете свой опыт?",
    options: [
      { text: "Я недостаточно хорош", scores: { ICS: 0 } },
      { text: "Мне ещё нужно доказать ценность", scores: { ICS: 1 } },
      { text: "У меня хороший уровень", scores: { ICS: 2 } },
      { text: "Я эксперт со своей ценностью", scores: { ICS: 3, IU: 2 } },
    ],
  },
  // БЛОК 6: Продажа без давления
  {
    id: 11, block: 6, blockTitle: "Продажа без давления",
    text: "Вам сложно продавать услуги?",
    options: [
      { text: "Очень сложно", scores: { IU: 0 } },
      { text: "Иногда сложно", scores: { IU: 1 } },
      { text: "Если понимаю ценность — нет", scores: { ICS: 2 } },
      { text: "Продажа = помощь клиенту", scores: { IPM: 3 } },
    ],
  },
  // БЛОК 7: Позиционирование
  {
    id: 12, block: 7, blockTitle: "Позиционирование",
    text: "Кто ваш клиент?",
    options: [
      { text: "Любой", scores: { IPM: 0 } },
      { text: "Кто придёт", scores: { IPM: 1 } },
      { text: "Люди, ценящие качество", scores: { IPM: 2 } },
      { text: "Осознанные клиенты высокого уровня", scores: { IPM: 3 } },
    ],
  },
];

const BLOCK_COMMENTS: Record<number, string> = {
  1: "Отношение к деньгам — фундамент работы с премиум-клиентами. Это не про жадность, а про внутреннее разрешение получать соразмерно своей ценности.",
  2: "Зависимость от оценки — одна из главных ловушек специалиста. Премиум-клиент чувствует, когда вы работаете из страха, а не из силы.",
  3: "Коммуникация с сильными людьми требует устойчивости. Это не жёсткость, а внутренняя опора.",
  4: "Границы — это уважение к себе и к клиенту. Без границ нет профессиональных отношений.",
  5: "Ваша ценность не определяется реакцией клиента. Она строится изнутри.",
  6: "Продажа без давления возможна только когда вы верите в то, что продаёте.",
  7: "Чёткое позиционирование притягивает правильных клиентов и отсекает лишнее.",
};

// ─── МАКСИМУМЫ ПО ИНДЕКСАМ ───────────────────────────────────────────────────
// Считаем максимально возможные баллы по каждому индексу
const MAX: Record<IndexKey, number> = {
  IU: 3 + 3 + 2 + 3 + 3, // вопросы 1,2,4,6,10
  IPM: 3 + 3 + 2 + 2 + 3 + 3, // вопросы 3,7,8,9,11,12
  IDO: 3 + 3 + 2, // вопросы 4,5,6,8,9
  IPG: 3 + 3 + 3 + 3 + 2, // вопросы 2,6,7,8,9
  ICS: 3 + 3 + 2, // вопросы 2,10,11
  ISD: 3 + 2 + 1, // вопросы 1,2,3
  IZK: 3 + 2, // вопросы 4,6
};

// ─── РАСЧЁТ ИНДЕКСОВ ─────────────────────────────────────────────────────────

function calcIndexes(answers: Record<number, number>): Record<IndexKey, number> {
  const raw: Record<IndexKey, number> = { IU: 0, IPM: 0, IDO: 0, IPG: 0, ICS: 0, ISD: 0, IZK: 0 };

  QUESTIONS.forEach(q => {
    const optIdx = answers[q.id];
    if (optIdx === undefined) return;
    const scores = q.options[optIdx].scores;
    (Object.keys(scores) as IndexKey[]).forEach(k => {
      raw[k] += scores[k] ?? 0;
    });
  });

  // Нормализуем в 0–100
  const pct = {} as Record<IndexKey, number>;
  (Object.keys(raw) as IndexKey[]).forEach(k => {
    pct[k] = MAX[k] > 0 ? Math.round((raw[k] / MAX[k]) * 100) : 0;
  });

  return pct;
}

function calcIGP(idx: Record<IndexKey, number>): number {
  const raw = (idx.IPM + idx.IU + idx.IPG + idx.ICS + idx.IZK - idx.IDO - idx.ISD) / 5;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function getScaleLabel(igp: number): { label: string; color: string } {
  if (igp < 30) return { label: "Мышление дефицита", color: "#ef4444" };
  if (igp < 50) return { label: "Зависимость от одобрения", color: "#f97316" };
  if (igp < 70) return { label: "Нестабильная уверенность", color: "#eab308" };
  if (igp < 85) return { label: "Профессиональная зрелость", color: "#22c55e" };
  return { label: "Премиальное мышление", color: "#14b8a6" };
}

function getType(idx: Record<IndexKey, number>): { title: string; desc: string; weakZones: string[]; recs: string[] } {
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

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";
const BG = "#f4f4f0";

// ─── КОМПОНЕНТ ───────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

type Phase = "intro" | "quiz" | "block-end" | "result";

export default function MindsetBot({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0); // индекс вопроса
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [blockEndData, setBlockEndData] = useState<{ block: number; blockTitle: string } | null>(null);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = Math.round((current / total) * 100);

  const handleSelect = (optIdx: number) => {
    if (animating) return;
    setSelected(optIdx);
  };

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);

    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);

    const nextIdx = current + 1;

    setTimeout(() => {
      setSelected(null);
      setAnimating(false);

      // Проверяем — конец блока?
      const isLastInBlock = nextIdx >= total || QUESTIONS[nextIdx].block !== q.block;

      if (nextIdx >= total) {
        setPhase("result");
      } else if (isLastInBlock) {
        setBlockEndData({ block: q.block, blockTitle: q.blockTitle });
        setCurrent(nextIdx);
        setPhase("block-end");
      } else {
        setCurrent(nextIdx);
      }
    }, 300);
  };

  if (phase === "intro") {
    return (
      <BotShell onBack={onBack} progress={0} step={0} total={total}>
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", padding: "20px 0" }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: `0 12px 36px hsla(185,85%,32%,0.3)`,
          }}>
            <Icon name="Brain" size={36} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
            Мышление с премиум-клиентами
          </h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, marginBottom: 32 }}>
            12 вопросов · 7 блоков · ~5 минут<br />
            Вы получите индексы, тип мышления и конкретные рекомендации
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
            {[
              { icon: "TrendingUp", label: "7 индексов" },
              { icon: "Target", label: "Радар-график" },
              { icon: "Lightbulb", label: "Рекомендации" },
            ].map(item => (
              <div key={item.label} style={{
                background: "#fff", borderRadius: 14, padding: "16px 10px", textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <Icon name={item.icon} size={22} style={{ color: ACCENT, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("quiz")}
            style={{
              padding: "14px 48px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 16, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              boxShadow: `0 8px 28px hsla(185,85%,32%,0.3)`,
              letterSpacing: 0.5,
            }}
          >
            Начать диагностику
          </button>
        </div>
      </BotShell>
    );
  }

  if (phase === "block-end" && blockEndData) {
    const partialAnswers = { ...answers };
    const partialIdx = calcIndexes(partialAnswers);
    const completedBlock = blockEndData.block;

    return (
      <BotShell onBack={onBack} progress={progress} step={current} total={total}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "10px 0" }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Блок {completedBlock} завершён
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
              {blockEndData.blockTitle}
            </h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "0 0 20px" }}>
              {BLOCK_COMMENTS[completedBlock]}
            </p>
            {/* Мини-индексы по текущему блоку */}
            <MiniIndexBar label="Уверенность" value={partialIdx.IU} color="hsl(280,60%,55%)" />
            <MiniIndexBar label="Границы" value={partialIdx.IPG} color={ACCENT} />
            <MiniIndexBar label="Самоценность" value={partialIdx.ICS} color="hsl(145,60%,40%)" />
          </div>
          <button
            onClick={() => setPhase("quiz")}
            style={{
              width: "100%", padding: "13px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: "pointer",
            }}
          >
            Продолжить →
          </button>
        </div>
      </BotShell>
    );
  }

  if (phase === "result") {
    const idx = calcIndexes(answers);
    const igp = calcIGP(idx);
    const scale = getScaleLabel(igp);
    const type = getType(idx);

    const radarData = [
      { subject: "Уверенность", value: idx.IU, fullMark: 100 },
      { subject: "Границы", value: idx.IPG, fullMark: 100 },
      { subject: "Самоценность", value: idx.ICS, fullMark: 100 },
      { subject: "Коммуникация", value: idx.IZK, fullMark: 100 },
      { subject: "Премиальность", value: idx.IPM, fullMark: 100 },
      { subject: "Независимость", value: 100 - idx.IDO, fullMark: 100 },
    ];

    const allIndexes: { key: IndexKey; label: string; color: string; invert?: boolean }[] = [
      { key: "IU",  label: "Уверенность",              color: "hsl(280,60%,55%)" },
      { key: "IPM", label: "Премиальное мышление",      color: ACCENT },
      { key: "IPG", label: "Профессиональные границы",  color: "hsl(145,60%,40%)" },
      { key: "ICS", label: "Ценность себя",             color: "hsl(35,85%,52%)" },
      { key: "IZK", label: "Зрелость коммуникации",     color: "hsl(210,70%,50%)" },
      { key: "IDO", label: "Зависимость от одобрения",  color: "#f97316", invert: true },
      { key: "ISD", label: "Страх денег",               color: "#ef4444", invert: true },
    ];

    return (
      <BotShell onBack={onBack} progress={100} step={total} total={total}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Главный результат */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,20%))`,
            borderRadius: 20, padding: "28px 28px", marginBottom: 20, color: "#fff",
            boxShadow: `0 12px 40px hsla(185,85%,32%,0.35)`,
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
              Индекс готовности к премиум-клиентам
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
              <div style={{ fontSize: "clamp(52px,6vw,72px)", fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
                {igp}
              </div>
              <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 8 }}>/100</div>
            </div>
            <div style={{
              display: "inline-block", background: "rgba(255,255,255,0.2)",
              borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16,
            }}>
              {scale.label}
            </div>
            {/* Прогресс-бар IGP */}
            <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
              <div style={{ width: `${igp}%`, height: "100%", background: "#fff", borderRadius: 3, transition: "width 1s ease" }} />
            </div>
          </div>

          {/* Тип */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Ваш тип
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
              {type.title}
            </h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}>{type.desc}</p>
          </div>

          {/* Радар-график */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Профиль мышления</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#f0f0ec" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
                <Radar
                  name="Профиль"
                  dataKey="value"
                  stroke={ACCENT}
                  fill={ACCENT}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Все индексы */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 }}>Детальные индексы</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {allIndexes.map(item => {
                const val = item.invert ? 100 - idx[item.key] : idx[item.key];
                const rawVal = idx[item.key];
                return (
                  <div key={item.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                        {rawVal}%
                        {item.invert && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>(инв. {val}%)</span>}
                      </span>
                    </div>
                    <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${rawVal}%`, height: "100%",
                        background: item.color, borderRadius: 3,
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Слабые зоны */}
          {type.weakZones.length > 0 && (
            <div style={{
              background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16,
              borderLeft: "4px solid #f97316", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Icon name="AlertTriangle" size={18} style={{ color: "#f97316" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Что мешает работать с премиум-клиентами</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {type.weakZones.map(z => (
                  <span key={z} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 13,
                    background: "hsl(20,85%,96%)", color: "#f97316", fontWeight: 600,
                    border: "1px solid hsl(20,85%,88%)",
                  }}>{z}</span>
                ))}
              </div>
            </div>
          )}

          {/* Рекомендации */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Icon name="Lightbulb" size={18} style={{ color: ACCENT }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Рекомендации</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {type.recs.map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 8, background: ACCENT_LIGHT,
                    color: ACCENT, fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => { setPhase("intro"); setCurrent(0); setAnswers({}); setSelected(null); }}
              style={{
                flex: 1, padding: "13px", borderRadius: 14,
                border: `1.5px solid ${ACCENT}`, background: "transparent",
                color: ACCENT, fontSize: 14, fontWeight: 700,
                fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              }}
            >
              Пройти снова
            </button>
            <button
              onClick={onBack}
              style={{
                flex: 1, padding: "13px", borderRadius: 14, border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
                color: "#fff", fontSize: 14, fontWeight: 700,
                fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              }}
            >
              К инструментам
            </button>
          </div>
        </div>
      </BotShell>
    );
  }

  // ─── ВОПРОС ────────────────────────────────────────────────────────────────
  return (
    <BotShell onBack={onBack} progress={progress} step={current + 1} total={total}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Блок */}
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          Блок {q.block} · {q.blockTitle}
        </div>

        {/* Вопрос */}
        <h2 style={{
          fontFamily: "Cormorant, serif", fontSize: "clamp(20px,2.5vw,28px)",
          fontWeight: 700, color: "#1a1a1a", margin: "0 0 28px", lineHeight: 1.3,
        }}>
          {q.text}
        </h2>

        {/* Варианты */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  padding: "16px 20px", borderRadius: 14, textAlign: "left",
                  border: isSelected ? `2px solid ${ACCENT}` : "1.5px solid #e8e8e0",
                  background: isSelected ? ACCENT_LIGHT : "#fff",
                  color: isSelected ? ACCENT : "#333",
                  fontSize: 15, fontWeight: isSelected ? 700 : 400,
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.15s",
                  boxShadow: isSelected ? `0 4px 16px hsla(185,85%,32%,0.15)` : "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isSelected ? ACCENT : "#f4f4f0",
                  color: isSelected ? "#fff" : "#999",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.15s",
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Кнопка далее */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: selected !== null
              ? `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`
              : "#e8e8e0",
            color: selected !== null ? "#fff" : "#bbb",
            fontSize: 15, fontWeight: 700,
            fontFamily: "Montserrat, sans-serif",
            cursor: selected !== null ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: selected !== null ? `0 8px 24px hsla(185,85%,32%,0.25)` : "none",
          }}
        >
          {current + 1 === total ? "Получить результат" : "Следующий вопрос →"}
        </button>
      </div>
    </BotShell>
  );
}

// ─── SHELL (обёртка с прогрессом) ────────────────────────────────────────────

function BotShell({ onBack, progress, step, total, children }: {
  onBack: () => void;
  progress: number;
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100%", fontFamily: "Montserrat, sans-serif" }}>
      {/* Шапка */}
      <div style={{ marginBottom: 28 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#888",
          fontSize: 13, cursor: "pointer", padding: "0 0 16px",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> К инструментам
        </button>

        {/* Прогресс */}
        {step > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>
                {step >= total ? "Завершено" : `Вопрос ${step} из ${total}`}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: `linear-gradient(90deg, ${ACCENT}, hsl(185,85%,22%))`,
                borderRadius: 2, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── МИНИ-ПОЛОСКА ─────────────────────────────────────────────────────────────

function MiniIndexBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "#f0f0ec", borderRadius: 2 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}
