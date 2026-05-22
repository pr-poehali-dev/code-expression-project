import { useState } from "react";
import {
  FinanceData, FinanceStep, LifeItem,
  FinanceGoals, CurrentModel, Expenses, EnergyData, MoneyMindset,
} from "./finance.types";
import { calcAll } from "./finance.logic";
import { lkApi } from "@/lib/lkApi";
import FinanceResult from "./FinanceResult";
import { defaultData } from "./FinanceBotShared";
import { Step1Life, Step2Goals, Step3Model, Step4Expenses } from "./FinanceBotSteps1to4";
import { FinanceIntro, Step5Energy, Step6Ceiling, Step7Gap, Step8Mindset } from "./FinanceBotSteps5to8";

interface Props {
  onBack: () => void;
}

const STORAGE_KEY = "lk_finance_progress";

function loadProgress(): { step: FinanceStep; data: FinanceData; started: boolean } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveProgress(step: FinanceStep, data: FinanceData, started: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data, started }));
  } catch { /* ignore */ }
}

function clearProgress() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export default function FinanceBot({ onBack }: Props) {
  const saved = loadProgress();
  const [step, setStep] = useState<FinanceStep>(saved?.step ?? 1);
  const [data, setData] = useState<FinanceData>(saved?.data ?? defaultData());
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(saved?.started ?? false);

  function persist(newStep: FinanceStep, newData: FinanceData, newStarted: boolean) {
    saveProgress(newStep, newData, newStarted);
  }

  function setLife(items: LifeItem[])    { setData(d => { const n = { ...d, lifeItems: items }; persist(step, n, started); return n; }); }
  function setGoals(g: FinanceGoals)     { setData(d => { const n = { ...d, goals: g }; persist(step, n, started); return n; }); }
  function setModel(m: CurrentModel)     { setData(d => { const n = { ...d, currentModel: m }; persist(step, n, started); return n; }); }
  function setExp(e: Expenses)           { setData(d => { const n = { ...d, expenses: e }; persist(step, n, started); return n; }); }
  function setEnergy(en: EnergyData)     { setData(d => { const n = { ...d, energy: en }; persist(step, n, started); return n; }); }
  function setMindset(ms: MoneyMindset)  { setData(d => { const n = { ...d, mindset: ms }; persist(step, n, started); return n; }); }

  function goBack() {
    if (step === 1) { onBack(); return; }
    const s = (step - 1) as FinanceStep;
    setStep(s);
    persist(s, data, started);
  }
  function goNext() {
    const s = (step + 1) as FinanceStep;
    setStep(s);
    persist(s, data, started);
  }

  async function handleFinish() {
    setSaving(true);
    const result = calcAll(data);
    try {
      await lkApi.financeSave({
        ifr: result.ifr,
        indexes: { ifj: result.ifj, ifu: result.ifu, ipn: result.ipn, idm: result.idm, ifp: result.ifp },
        summary: { jlj: result.jlj, fr: result.fr, mpd: result.mpd, nsc: result.nsc, nck: result.nck },
        data,
      });
    } catch (_) { /* silent */ }
    setSaving(false);
    clearProgress();
    setShowResult(true);
  }

  if (showResult) {
    return (
      <FinanceResult
        data={data}
        onRetake={() => { clearProgress(); setShowResult(false); setStep(1); setData(defaultData()); setStarted(false); }}
        onBack={onBack}
      />
    );
  }

  const stepProps = { step, data, goBack, goNext, setLife, setGoals, setModel, setExp, setEnergy, setMindset, handleFinish, saving };

  // Intro — показываем до нажатия "Начать расчёт"
  if (!started) {
    return <FinanceIntro onBack={onBack} onStart={() => { setStarted(true); persist(step, data, true); }} />;
  }

  if (step === 1) return <Step1Life {...stepProps} />;
  if (step === 2) return <Step2Goals {...stepProps} />;
  if (step === 3) return <Step3Model {...stepProps} />;
  if (step === 4) return <Step4Expenses {...stepProps} />;
  if (step === 5) return <Step5Energy {...stepProps} />;
  if (step === 6) return <Step6Ceiling {...stepProps} />;
  if (step === 7) return <Step7Gap {...stepProps} />;
  if (step === 8) return <Step8Mindset {...stepProps} />;

  return null;
}