import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLkAuth } from "./LkAuthContext";
import func2url from "../../backend/func2url.json";

const PACKAGES_URL = (func2url as Record<string, string>)["packages-api"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface ToolUsage { tool_key: string; name: string; used: number; limit: number; }

interface PackageUsageCtx {
  hasPackage: boolean;
  usageByTool: Record<string, ToolUsage>;
  loading: boolean;
  refresh: () => void;
}

const Ctx = createContext<PackageUsageCtx>({ hasPackage: false, usageByTool: {}, loading: true, refresh: () => {} });

export function PackageUsageProvider({ children }: { children: ReactNode }) {
  const { user } = useLkAuth();
  const [hasPackage, setHasPackage] = useState(false);
  const [usageByTool, setUsageByTool] = useState<Record<string, ToolUsage>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!user?.id || !PACKAGES_URL) { setLoading(false); return; }
    setLoading(true);
    fetch(`${PACKAGES_URL}?action=package_status`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        if (d.has_package) {
          setHasPackage(true);
          const map: Record<string, ToolUsage> = {};
          (d.usage || []).forEach((u: ToolUsage) => { map[u.tool_key] = u; });
          setUsageByTool(map);
        } else {
          setHasPackage(false);
          setUsageByTool({});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  return <Ctx.Provider value={{ hasPackage, usageByTool, loading, refresh }}>{children}</Ctx.Provider>;
}

export function usePackageUsage() { return useContext(Ctx); }
