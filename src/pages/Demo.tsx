import { useState } from "react";
import { AlreadyUsedModal } from "./demo/DemoModals";
import DemoToolsPage from "./demo/DemoToolsPage";
import { ActiveTool, TOOLS, DEMO_NOTIFY_URL, getUsedTools, markToolUsed } from "./demo/DemoShared";
import BarriersBot from "./lk/BarriersBot";
import MindsetSpecialistBot from "./lk/MindsetSpecialistBot";

export default function Demo() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [emailModal, setEmailModal] = useState<{ id: string; title: string } | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState<{ title: string } | null>(null);

  function handleToolClick(id: string, title: string, free: boolean) {
    if (!free) return;
    const used = getUsedTools();
    if (used[id]) {
      setAlreadyUsed({ title });
      return;
    }
    setEmailModal({ id, title });
  }

  function handleEmailConfirm(email: string, name: string) {
    if (!emailModal) return;
    markToolUsed(emailModal.id, email);
    const { id, title } = emailModal;
    setEmailModal(null);
    setActiveTool(id as ActiveTool);
    fetch(DEMO_NOTIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, tool: title }),
    }).catch(() => {});
  }

  if (activeTool === "barriers") {
    const title = TOOLS.find(t => t.id === "barriers")!.title;
    return (
      <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
        {alreadyUsed && <AlreadyUsedModal toolTitle={alreadyUsed.title} onClose={() => { setAlreadyUsed(null); setActiveTool(null); }} />}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          <BarriersBot
            onBack={() => setActiveTool(null)}
            onRetake={() => setAlreadyUsed({ title })}
          />
        </div>
      </div>
    );
  }

  if (activeTool === "mindset-spec") {
    const title = TOOLS.find(t => t.id === "mindset-spec")!.title;
    return (
      <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
        {alreadyUsed && <AlreadyUsedModal toolTitle={alreadyUsed.title} onClose={() => { setAlreadyUsed(null); setActiveTool(null); }} />}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          <MindsetSpecialistBot
            onBack={() => setActiveTool(null)}
            onRetake={() => setAlreadyUsed({ title })}
          />
        </div>
      </div>
    );
  }

  return (
    <DemoToolsPage
      emailModal={emailModal}
      alreadyUsed={alreadyUsed}
      onToolClick={handleToolClick}
      onEmailConfirm={handleEmailConfirm}
      onEmailClose={() => setEmailModal(null)}
      onAlreadyUsedClose={() => setAlreadyUsed(null)}
    />
  );
}
