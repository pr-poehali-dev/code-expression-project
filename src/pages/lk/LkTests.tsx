import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import { useLkAuth } from "@/contexts/LkAuthContext";
import DiagnosticBot from "./DiagnosticBot";
import MindsetSpecialistBot from "./MindsetSpecialistBot";
import MindsetBot from "./MindsetBot";
import MindsetResult, { IndexMap } from "./MindsetResult";
import BarriersBot from "./BarriersBot";
import BarriersResult from "./BarriersResult";
import FinanceBot from "./FinanceBot";
import FinanceResult from "./FinanceResult";
import ProfileBot from "./ProfileBot";
import ProfileResult from "./ProfileResult";
import SalonBot from "./SalonBot";
import { BarrierIndexMap } from "./barriers.logic";
import { FinanceData } from "./finance.types";
import { PROFILE_QUESTIONS } from "./profile.types";
import { calcProfile } from "./profile.logic";
import { Spinner, Test, TestDetail, TestResult, MindsetHistoryItem, BarriersHistoryItem, FinanceHistoryItem, ProfileHistoryItem, SalonHistoryItem } from "./LkTestsTypes";
import LkTestQuiz from "./LkTestQuiz";
import LkTestsList from "./LkTestsList";
import LkTestsHistory from "./LkTestsHistory";
import LkBodyMap from "./LkBodyMap";

export default function LkTests() {
  const { user } = useLkAuth();
  const isSalon = user?.segment === "salon";
  const BODY_TOOLS_COURSE_ID = 1;
  const hasCourseAccess = user?.is_admin || (user?.course_ids ?? []).includes(BODY_TOOLS_COURSE_ID);
  const isBodySpec = (user?.role === "body_specialist" || user?.is_admin) && hasCourseAccess;
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

  const [openProfile, setOpenProfile] = useState(false);
  const [profileHistory, setProfileHistory] = useState<ProfileHistoryItem[]>([]);
  const [viewingProfile, setViewingProfile] = useState<ProfileHistoryItem | null>(null);

  const [openSalon, setOpenSalon] = useState(false);
  const [salonHistory, setSalonHistory] = useState<SalonHistoryItem[]>([]);
  const [openDiag, setOpenDiag] = useState(false);
  const [openMindsetSpec, setOpenMindsetSpec] = useState(false);
  const [openBodyMap, setOpenBodyMap] = useState(false);

  // Безлимитный доступ: access_expires_at === null
  const hasUnlimited = user?.access_expires_at === null;

  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    lkApi.tests().then(setTests).finally(() => setLoading(false));
  }, []);

  // Загружаем историю один раз — только когда показывается список (нет открытых тестов)
  const anyOpen = openMindset || openBarriers || openFinance || openProfile || openSalon
    || !!viewingResult || !!viewingBarriers || !!viewingFinance || !!viewingProfile;

  useEffect(() => {
    if (anyOpen || historyLoaded) return;
    setHistoryLoaded(true);
    lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {});
    lkApi.barriersHistory().then(setBarriersHistory).catch(() => {});
    lkApi.financeHistory().then(setFinanceHistory).catch(() => {});
    lkApi.profileHistory().then(setProfileHistory).catch(() => {});
    lkApi.salonHistory().then(setSalonHistory).catch(() => {});
  }, [anyOpen]);

  if (openMindset) {
    return <MindsetBot onBack={() => { setOpenMindset(false); lkApi.mindsetHistory().then(setMindsetHistory).catch(() => {}); }} />;
  }
  if (viewingResult) {
    return (
      <MindsetResult idx={viewingResult.idx} date={viewingResult.date}
        onRetake={() => { setViewingResult(null); setOpenMindset(true); }}
        onBack={() => setViewingResult(null)} backLabel="← К истории" />
    );
  }

  if (openBarriers) {
    return <BarriersBot onBack={() => { setOpenBarriers(false); lkApi.barriersHistory().then(setBarriersHistory).catch(() => {}); }} />;
  }
  if (viewingBarriers) {
    return (
      <BarriersResult idx={viewingBarriers.idx} date={viewingBarriers.date}
        onRetake={() => { setViewingBarriers(null); setOpenBarriers(true); }}
        onBack={() => setViewingBarriers(null)} backLabel="← К истории" />
    );
  }

  if (openFinance) {
    return <FinanceBot onBack={() => { setOpenFinance(false); setHistoryLoaded(false); }} />;
  }
  if (viewingFinance) {
    return (
      <FinanceResult data={viewingFinance.data}
        onRetake={() => { setViewingFinance(null); setOpenFinance(true); }}
        onBack={() => setViewingFinance(null)} backLabel="← К истории" />
    );
  }

  if (openProfile) {
    return <ProfileBot onBack={() => { setOpenProfile(false); lkApi.profileHistory().then(setProfileHistory).catch(() => {}); }} />;
  }
  if (viewingProfile) {
    const reconstructedAnswers = viewingProfile.answers as Record<number, number>;
    const profileResult = calcProfile(PROFILE_QUESTIONS, reconstructedAnswers);
    const dateStr = new Date(viewingProfile.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    return (
      <ProfileResult result={profileResult} answers={reconstructedAnswers}
        onRetake={() => { setViewingProfile(null); setOpenProfile(true); }}
        onBack={() => setViewingProfile(null)} backLabel="← К истории" date={dateStr} />
    );
  }

  if (openDiag) {
    return <DiagnosticBot onBack={() => setOpenDiag(false)} />;
  }

  if (openMindsetSpec) {
    return <MindsetSpecialistBot onBack={() => setOpenMindsetSpec(false)} />;
  }

  if (openBodyMap) {
    return <LkBodyMap onBack={() => setOpenBodyMap(false)} />;
  }

  if (openSalon) {
    return (
      <SalonBot
        previousResult={salonHistory[0] ?? undefined}
        onBack={() => { setOpenSalon(false); lkApi.salonHistory().then(setSalonHistory).catch(() => {}); }}
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
      setTests(prev => prev.map(t => t.id === activeTest.test.id ? { ...t, completed: true, score: res.score } : t));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  if (activeTest) {
    return (
      <LkTestQuiz activeTest={activeTest} answers={answers} result={result} submitting={submitting}
        onAnswer={handleAnswer} onSubmit={handleSubmit}
        onBack={() => setActiveTest(null)}
        onBackFromResult={() => { setActiveTest(null); setResult(null); }} />
    );
  }

  return (
    <div>
      <LkTestsList
        tests={tests}
        barriersHistory={barriersHistory}
        financeHistory={financeHistory}
        profileHistory={profileHistory}
        salonHistory={salonHistory}
        showSalon={isSalon}
        hasUnlimited={hasUnlimited}
        showBodyTools={isBodySpec}
        onOpenDiag={() => setOpenDiag(true)}
        onOpenMindsetSpec={() => setOpenMindsetSpec(true)}
        onOpenMindset={() => setOpenMindset(true)}
        onOpenBarriers={() => setOpenBarriers(true)}
        onOpenFinance={() => setOpenFinance(true)}
        onOpenProfile={() => setOpenProfile(true)}
        onOpenSalon={() => setOpenSalon(true)}
        onOpenBodyMap={() => setOpenBodyMap(true)}
        onOpenTest={openTest}
      />
      <LkTestsHistory
        mindsetHistory={mindsetHistory}
        barriersHistory={barriersHistory}
        financeHistory={financeHistory}
        profileHistory={profileHistory}
        salonHistory={salonHistory}
        onViewMindset={setViewingResult}
        onViewBarriers={setViewingBarriers}
        onViewFinance={setViewingFinance}
        onViewProfile={setViewingProfile}
        onRetakeMindset={() => setOpenMindset(true)}
        onRetakeBarriers={() => setOpenBarriers(true)}
        onRetakeFinance={() => setOpenFinance(true)}
        onRetakeProfile={() => setOpenProfile(true)}
        onRetakeSalon={() => setOpenSalon(true)}
        onDeleteMindset={() => lkApi.mindsetDelete().then(() => setMindsetHistory([])).catch(() => {})}
        onDeleteBarriers={() => lkApi.barriersDelete().then(() => setBarriersHistory([])).catch(() => {})}
        onDeleteFinance={() => lkApi.financeDelete().then(() => setFinanceHistory([])).catch(() => {})}
        onDeleteProfile={() => lkApi.profileDelete().then(() => setProfileHistory([])).catch(() => {})}
        onDeleteSalon={() => lkApi.salonDelete().then(() => setSalonHistory([])).catch(() => {})}
      />
    </div>
  );
}