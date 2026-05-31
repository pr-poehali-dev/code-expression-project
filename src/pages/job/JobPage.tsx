import { useState, useEffect } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import JobHero from "./JobHero";
import JobAbout from "./JobAbout";
import JobWhoWeNeed from "./JobWhoWeNeed";
import JobDuties from "./JobDuties";
import JobConditions from "./JobConditions";
import JobWhyUs from "./JobWhyUs";
import JobInterview from "./JobInterview";

export default function JobPage() {
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    if (showInterview) {
      document.body.classList.add("hide-chat-widget");
    } else {
      document.body.classList.remove("hide-chat-widget");
    }
    return () => { document.body.classList.remove("hide-chat-widget"); };
  }, [showInterview]);

  return (
    <div style={{ fontFamily: "'Cormorant', 'Georgia', serif", background: "#faf9f6", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .job-section { padding: 80px 24px; max-width: 900px; margin: 0 auto; }
        .job-section-wide { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
        .job-divider { width: 48px; height: 1px; background: #c9a96e; margin: 20px auto; }
        .job-tag { display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #c9a96e; margin-bottom: 16px; }
        .job-h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: #1a1a1a; margin: 0 0 24px; line-height: 1.2; }
        .job-h2 em { font-style: italic; color: #c9a96e; }
        .job-p { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 400; line-height: 1.8; color: #444; }
        .job-card { background: #fff; border: 1px solid #ede8df; border-radius: 20px; padding: 32px; }
        .job-btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #c9a96e, #a8834a);
          color: #fff; border: none; border-radius: 50px;
          padding: 16px 40px; font-family: 'Montserrat', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 1px;
          cursor: pointer; text-transform: uppercase;
          box-shadow: 0 8px 32px rgba(201,169,110,0.35);
          transition: all 0.3s;
        }
        .job-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(201,169,110,0.45); }
        .job-list { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 400; color: #444; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .job-list li { display: flex; align-items: flex-start; gap: 12px; line-height: 1.6; }
        .job-list li::before { content: '—'; color: #c9a96e; flex-shrink: 0; font-weight: 500; margin-top: 1px; }
        @media (max-width: 640px) {
          .job-section { padding: 56px 16px; }
          .job-section-wide { padding: 56px 16px; }
          .job-card { padding: 20px 16px; }
          .job-h2 { font-size: 26px; margin-bottom: 16px; }
          .job-btn-gold { padding: 14px 28px; font-size: 13px; width: 100%; justify-content: center; }
        }
      `}</style>

      <DokNavbar />

      {!showInterview ? (
        <>
          <JobHero onApply={() => setShowInterview(true)} />
          <JobAbout />
          <JobWhoWeNeed />
          <JobDuties />
          <JobConditions />
          <JobWhyUs onApply={() => setShowInterview(true)} />
          <DokFooter />
        </>
      ) : (
        <JobInterview onBack={() => setShowInterview(false)} />
      )}
    </div>
  );
}