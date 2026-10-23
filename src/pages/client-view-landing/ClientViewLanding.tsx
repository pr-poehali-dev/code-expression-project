import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import ClientViewSeo from "./seo";
import Hero from "./Hero";
import { Pains, How, Example, Features, ForWhom } from "./Sections";
import { Faq, FinalCta } from "./FaqAndCta";

export default function ClientViewLanding() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <ClientViewSeo />
      <BizNavbar />
      <main>
        <Hero />
        <Pains />
        <How />
        <Example />
        <Features />
        <ForWhom />
        <Faq />
        <FinalCta />
      </main>
      <BizFooter />
      <style>{`
        .cvl-faq summary::-webkit-details-marker { display: none; }
        .cvl-faq[open] summary svg { transform: rotate(45deg); }
        .cvl-faq summary svg { transition: transform .2s; }
        @media (max-width: 960px) {
          .cvl-hero { grid-template-columns: 1fr !important; gap: 40px !important; padding: 64px 24px 72px !important; }
        }
        @media (max-width: 640px) {
          .cvl-hero-actions { flex-direction: column; align-items: stretch !important; }
          .cvl-hero-actions > a { width: 100%; box-sizing: border-box; }
          .cvl-cta { padding: 16px 20px !important; }
        }
      `}</style>
    </div>
  );
}
