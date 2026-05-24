import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import { AI_URL, DiagResult, Symptom } from "./DiagnosticTypes";
import DiagnosticSearch from "./DiagnosticSearch";
import DiagnosticResult from "./DiagnosticResult";

interface Props {
  onBack: () => void;
}

export default function DiagnosticBot({ onBack }: Props) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Symptom[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagResult | null>(null);
  const [aiSections, setAiSections] = useState<Record<string, string> | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    lkApi.diagSymptoms().then(setSymptoms).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setFiltered([]); setShowDropdown(false); return; }
    const q = query.toLowerCase();
    const matches = symptoms.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.slug.includes(q)
    );
    setFiltered(matches);
    setShowDropdown(matches.length > 0);
  }, [query, symptoms]);

  const callAI = async (diagResult: DiagResult) => {
    setAiLoading(true);
    setAiSections(null);
    try {
      const session = localStorage.getItem("lk_session") || "";
      const card = diagResult.card;
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session },
        body: JSON.stringify({
          zone_name: card.zone_name,
          symptom: diagResult.matched_symptom || diagResult.query,
          possible_causes: card.possible_causes,
          compensation_zones: card.compensation_zones,
          check_visual: card.check_visual,
          check_tactile: card.check_tactile,
          emotional_factors: card.emotional_factors,
          red_flags: card.red_flags,
          recommendations: card.recommendations,
        }),
      });
      const json = await res.json();
      if (json.sections) setAiSections(json.sections);
    } catch {
      // AI недоступен — показываем только базовую карточку
    } finally {
      setAiLoading(false);
    }
  };

  const search = async (q: string, slug?: string) => {
    setShowDropdown(false);
    setLoading(true);
    setResult(null);
    setAiSections(null);
    setNotFound(false);
    try {
      const data = slug
        ? await lkApi.diagSearchBySlug(slug)
        : await lkApi.diagSearch(q);
      if (data.found) {
        setResult(data);
        callAI(data); // запускаем AI параллельно
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (s: Symptom) => {
    setQuery(s.name);
    search(s.name, s.slug);
  };

  const handleSearch = () => {
    if (query.trim()) search(query.trim());
  };

  const handleReset = () => {
    setResult(null);
    setQuery("");
  };

  if (result) {
    return (
      <DiagnosticResult
        result={result}
        aiSections={aiSections}
        aiLoading={aiLoading}
        onReset={handleReset}
      />
    );
  }

  return (
    <DiagnosticSearch
      onBack={onBack}
      query={query}
      setQuery={setQuery}
      filtered={filtered}
      showDropdown={showDropdown}
      setShowDropdown={setShowDropdown}
      symptoms={symptoms}
      loading={loading}
      notFound={notFound}
      onSearch={handleSearch}
      onSelect={handleSelect}
    />
  );
}