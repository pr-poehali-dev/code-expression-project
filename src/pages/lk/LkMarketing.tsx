import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import { showEnergyGate } from "@/components/EnergyGate";
import LkMarketingAudience from "./LkMarketingAudience";
import LkMarketingOffers from "./LkMarketingOffers";
import LkMarketingSemantics from "./LkMarketingSemantics";
import LkMarketingDirect from "./LkMarketingDirect";
import LkPostGen from "./LkPostGen";
import LkAiImageGen from "./LkAiImageGen";
import LkReelScript from "./LkReelScript";
import LkAiVideoGen from "./LkAiVideoGen";
import LkMarketingBudget from "./LkMarketingBudget";
import LkMarketingSeo from "./LkMarketingSeo";
import { AudienceData, SemanticGroups, CHAIN_PREREQ, TOOLS_DIRECT, TOOLS_CONTENT } from "./LkMarketingTypes";
import { ComingSoonPlaceholder, StepBlocker, hasCachedResult } from "./LkMarketingShared";
import LkMarketingDashboard from "./LkMarketingDashboard";

export default function LkMarketing({ initialTool }: { initialTool?: string } = {}) {
  const [active, setActive] = useState<string | null>(initialTool || null);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [semanticData, setSemanticData] = useState<SemanticGroups | null>(null);
  const [videoInitialPrompt, setVideoInitialPrompt] = useState<string>("");
  const { hasPaid } = useEnergy();
  const { user } = useLkAuth();
  const salonId = user?.salon_id ?? "";
  const websiteUrl = (user as unknown as Record<string, unknown>)?.website_url as string | undefined;
  const ALL_TOOLS = [...TOOLS_DIRECT, ...TOOLS_CONTENT];
  const activeTool = ALL_TOOLS.find(t => t.id === active);

  const openTool = (id: string) => {
    if (!hasPaid) {
      showEnergyGate({ message: "Пополните баланс, чтобы открыть инструменты маркетинга" });
      return;
    }
    setActive(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeTool = () => {
    setActive(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Проверка цепочки — показываем заглушку если предыдущий шаг не выполнен
  if (hasPaid && active && CHAIN_PREREQ[active]) {
    const prereq = CHAIN_PREREQ[active];
    if (!hasCachedResult(prereq.key + salonId)) {
      return (
        <StepBlocker
          missing={prereq}
          onGoTo={() => { setActive(prereq.toolId); window.scrollTo({ top: 0, behavior: "instant" }); }}
          onBack={closeTool}
        />
      );
    }
  }

  if (hasPaid && active === "audience") {
    return (
      <LkMarketingAudience
        onBack={closeTool}
        onGoToOffers={(portraits, salonName) => {
          setAudienceData({ portraits, salonName });
          setActive("offers");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  if (hasPaid && active === "offers") {
    return (
      <LkMarketingOffers
        onBack={closeTool}
        initialPortraits={audienceData?.portraits}
        initialSalonName={audienceData?.salonName}
        onGoToSemantics={() => { setActive("semantics"); window.scrollTo({ top: 0, behavior: "instant" }); }}
      />
    );
  }

  if (hasPaid && active === "semantics") {
    return (
      <LkMarketingSemantics
        onBack={closeTool}
        onGoToDirect={(groups) => {
          setSemanticData({ groups });
          setActive("direct");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  if (hasPaid && active === "direct") {
    return (
      <LkMarketingDirect
        onBack={closeTool}
        initialGroups={semanticData?.groups}
      />
    );
  }

  if (hasPaid && active === "post-gen") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkPostGen />
      </div>
    );
  }

  if (hasPaid && active === "image-gen") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkAiImageGen />
      </div>
    );
  }

  if (hasPaid && active === "reel-script") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkReelScript
          onGoToVideoGen={(videoPrompt) => {
            setVideoInitialPrompt(videoPrompt);
            setActive("video-gen");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      </div>
    );
  }

  if (hasPaid && active === "video-gen") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkAiVideoGen initialPrompt={videoInitialPrompt} />
      </div>
    );
  }

  if (hasPaid && active === "budget") {
    return <LkMarketingBudget onBack={closeTool} />;
  }

  if (hasPaid && active === "seo") {
    return <LkMarketingSeo onBack={closeTool} initialUrl={websiteUrl} />;
  }

  if (hasPaid && activeTool) {
    return <ComingSoonPlaceholder tool={activeTool} onBack={closeTool} />;
  }

  return <LkMarketingDashboard salonId={salonId} onOpenTool={openTool} />;
}