export const COLOR = "hsl(210,85%,45%)";
export const COLOR_BG = "hsl(210,85%,96%)";
export const AI_URL = "https://functions.poehali.dev/b06e0f0c-66c4-443f-aae0-beeab4c022ac";

export interface Symptom {
  id: number;
  slug: string;
  name: string;
  zone_slug: string;
}

export interface Technique {
  title: string;
  description: string;
  video_url: string;
}

export interface TechniqueZone {
  zone_name: string;
  techniques: Technique[];
}

export interface DiagCard {
  zone_name: string;
  possible_causes: string;
  compensation_zones: string;
  compensation_slugs: string[];
  check_visual: string;
  check_tactile: string;
  emotional_factors: string;
  red_flags: string;
  recommendations: string;
  client_explanation: string;
}

export interface DiagResult {
  found: boolean;
  query: string;
  matched_symptom: string;
  zone_slug: string;
  card: DiagCard;
  techniques_by_zone: Record<string, TechniqueZone>;
}

export function getKinescopeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}
