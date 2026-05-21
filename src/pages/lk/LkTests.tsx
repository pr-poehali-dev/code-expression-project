import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import MindsetBot from "./MindsetBot";
import MindsetResult, { IndexMap } from "./MindsetResult";
import BarriersBot from "./BarriersBot";
import BarriersResult from "./BarriersResult";
import FinanceBot from "./FinanceBot";
import FinanceResult from "./FinanceResult";
import { BarrierIndexMap } from "./barriers.logic";
import { FinanceData } from "./finance.types";
import { Spinner, Test, TestDetail, TestResult, MindsetHistoryItem, BarriersHistoryItem, FinanceHistoryItem } from "./LkTestsTypes";
import LkTestQuiz from "./LkTestQuiz";
import LkTestsList from "./LkTestsList";
import LkTestsHistory from "./LkTestsHistory";

export default function LkTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<TestDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; result: TestResult | null } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [openMindset, setOpenMindset] = useState(false);
  const [mindsetHistory, setMindsetHistory] = useState<MindsetHistoryItem[]>([]);
  const [viewingResult, setViewingResult] = useState<{ idx: IndexMap; date: string } | null>(null);

  const [openBarriers, setOpenBarriers] = useState(false);
  const [barriersHistory, setBarriersHistory] = useState<BarriersHistoryItem[]>([]);
  const [viewingBarriers, setViewingBarriers] = useState<{ idx: BarrierIndexMap; date: string } | null>(null);

  const [openFinance, setOpenFinance] = useState(false);
  const [financeHistory, setFinanceHistory] = useState<FinanceHistoryItem[]>([]);
  const [viewingFinance, setViewingFinance] = useState<{ data: FinanceData; date: string } | null>(null);

  useEffect(() => {
    lkApi.tests().then(setTests).finally(() => setLoading(false));
    lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {});
    lkApi.barriersHistory().then(setBarriersHistory).catch(() => {});
    lkApi.financeHistory().then(setFinanceHistory).catch(() => {});
  }, []);

  if (openMindset) {
    return <MindsetBot onBack={() => {
      setOpenMindset(false);
      lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {});
    }} />;
  }

  if (viewingResult) {
    return (
      <MindsetResult
        idx={viewingResult.idx}
        date={viewingResult.date}
        onRetake={() => { setViewingResult(null); setOpenMindset(true); }}
        onBack={() => setViewingResult(null)}
        backLabel="← К истории"
      />
    );
  }

  if (openBarriers) {
    return <BarriersBot onBack={() => {
      setOpenBarriers(false);
      lkApi.barriersHistory().then(setBarriersHistory).catch(() => {});
    }} />;
  }

  if (viewingBarriers) {
    return (
      <BarriersResult
        idx={viewingBarriers.idx}
        date={viewingBarriers.date}
        onRetake={() => { setViewingBarriers(null); setOpenBarriers(true); }}
        onBack={() => setViewingBarriers(null)}
        backLabel="← К истории"
      />
    );
  }

  if (openFinance) {
    return <FinanceBot onBack={() => {
      setOpenFinance(false);
      lkApi.financeHistory().then(setFinanceHistory).catch(() => {});
    }} />;
  }

  if (viewingFinance) {
    return (
      <FinanceResult
        data={viewingFinance.data}
        onRetake={() => { setViewingFinance(null); setOpenFinance(true); }}
        onBack={() => setViewingFinance(null)}
        backLabel="← К истории"
      />
    );
  }

  const openTest = async (slug: string) => {
    setResult(null);
    setAnswers({});
    const data = await lkApi.testDetail(slug);
    setActiveTest(data);
  };

  const handleAnswer = (qId: number, optId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    if (!activeTest) return;
    const total = activeTest.questions.length;
    const answered = Object.keys(answers).length;
    if (answered < total) {
      alert(`Ответьте на все вопросы (осталось ${total - answered})`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await lkApi.submitTest(activeTest.test.id, answers as Record<string, number>);
      setResult(res);
      setTests(prev => prev.map(t =>
        t.id === activeTest.test.id ? { ...t, completed: true, score: res.score } : t
      ));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  if (activeTest) {
    return (
      <LkTestQuiz
        activeTest={activeTest}
        answers={answers}
        result={result}
        submitting={submitting}
        onAnswer={handleAnswer}
        onSubmit={handleSubmit}
        onBack={() => setActiveTest(null)}
        onBackFromResult={() => { setActiveTest(null); setResult(null); }}
      />
    );
  }

  return (
    <div>
      <LkTestsList
        tests={tests}
        barriersHistory={barriersHistory}
        financeHistory={financeHistory}
        onOpenMindset={() => setOpenMindset(true)}
        onOpenBarriers={() => setOpenBarriers(true)}
        onOpenFinance={() => setOpenFinance(true)}
        onOpenTest={openTest}
      />
      <LkTestsHistory
        mindsetHistory={mindsetHistory}
        barriersHistory={barriersHistory}
        financeHistory={financeHistory}
        onViewMindset={setViewingResult}
        onViewBarriers={setViewingBarriers}
        onViewFinance={setViewingFinance}
        onRetakeMindset={() => setOpenMindset(true)}
        onRetakeBarriers={() => setOpenBarriers(true)}
        onRetakeFinance={() => setOpenFinance(true)}
      />
    </div>
  );
}
