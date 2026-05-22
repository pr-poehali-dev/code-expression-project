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

export default function FinanceBot({ onBack }: Props) {
  const [step, setStep] = useState<FinanceStep>(1);
  const [data, setData] = useState<FinanceData>(defaultData());
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);

  function setLife(items: LifeItem[])    { setData(d => ({ ...d, lifeItems: items })); }
  function setGoals(g: FinanceGoals)     { setData(d => ({ ...d, goals: g })); }
  function setModel(m: CurrentModel)     { setData(d => ({ ...d, currentModel: m })); }
  function setExp(e: Expenses)           { setData(d => ({ ...d, expenses: e })); }
  function setEnergy(en: EnergyData)     { setData(d => ({ ...d, energy: en })); }
  function setMindset(ms: MoneyMindset)  { setData(d => ({ ...d, mindset: ms })); }

  function goBack() {
    if (step === 1) { onBack(); return; }
    setStep(s => (s - 1) as FinanceStep);
  }
  function goNext() { setStep(s => (s + 1) as FinanceStep); }

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
    setShowResult(true);
  }

  if (showResult) {
    return (
      <FinanceResult
        data={data}
        onRetake={() => { setShowResult(false); setStep(1); setData(defaultData()); setStarted(false); }}
        onBack={onBack}
      />
    );
  }

  const stepProps = { step, data, goBack, goNext, setLife, setGoals, setModel, setExp, setEnergy, setMindset, handleFinish, saving };

  // Intro — показываем до нажатия "Начать расчёт"
  if (!started) {
    return <FinanceIntro onBack={onBack} onStart={() => setStarted(true)} />;
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