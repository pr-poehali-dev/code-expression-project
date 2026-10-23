export const TEAL = "#2DD4BF";
export const TEAL2 = "#14B8A6";
export const DARK = "#0F172A";
export const GRAY = "#64748B";
export const SERIF = "'Cormorant Garamond', serif";

export interface IconItem {
  icon: string;
  title: string;
  text: string;
}

export interface TextItem {
  title: string;
  text: string;
}

export interface MockRow {
  k: string;
  v: string;
}

export type Section =
  | { type: "moments"; eyebrow: string; title: string; items: IconItem[] }
  | { type: "versus"; title: string; without: string[]; with: string[] }
  | { type: "steps"; layout: "row" | "timeline"; eyebrow: string; title: string; items: TextItem[] }
  | { type: "bento"; eyebrow: string; title: string; items: IconItem[] }
  | { type: "example"; title: string; lead: string; label: string; lines: string[] }
  | { type: "strip"; title: string; items: { value: string; label: string }[] }
  | { type: "faq"; title: string; items: { q: string; a: string }[] };

export interface ToolConfig {
  slug: string;
  name: string;
  seo: { title: string; description: string; keywords: string };
  hero: {
    variant: "split" | "center" | "mockup";
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    facts: string[];
    mock?: { icon: string; title: string; rows: MockRow[]; badge: string };
  };
  sections: Section[];
  cta: { title: string; text: string };
}
