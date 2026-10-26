import { useEffect, createContext, useContext } from "react";

const Ctx = createContext<null>(null);

export function HelmetProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={null}>{children}</Ctx.Provider>;
}

interface HelmetProps {
  children?: React.ReactNode;
}

export function Helmet({ children }: HelmetProps) {
  useContext(Ctx);

  useEffect(() => {
    if (!children) return;
    const nodes = Array.isArray(children) ? children : [children];
    const cleanups: (() => void)[] = [];

    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const el = node as React.ReactElement;

      if (el.type === "title") {
        const prev = document.title;
        document.title = el.props?.children ?? "";
        cleanups.push(() => { document.title = prev; });
        continue;
      }

      if (el.type === "link" && el.props?.rel === "canonical") {
        let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const isNew = !link;
        if (!link) {
          link = document.createElement("link");
          link.rel = "canonical";
          document.head.appendChild(link);
        }
        const prevHref = link.getAttribute("href") ?? "";
        link.setAttribute("href", el.props.href ?? "");
        link.dataset.pageSet = "1";
        const captured = link;
        cleanups.push(() => {
          delete captured.dataset.pageSet;
          if (isNew) captured.remove();
          else captured.setAttribute("href", prevHref);
        });
        continue;
      }

      if (el.type === "script" && el.props?.type === "application/ld+json") {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-helmet", "1");
        script.text = typeof el.props.children === "string" ? el.props.children : JSON.stringify(el.props.children ?? {});
        document.head.appendChild(script);
        cleanups.push(() => script.remove());
        continue;
      }

      if (el.type === "meta") {
        const attrs: Record<string, string> = el.props ?? {};
        const selector = attrs.name
          ? `meta[name="${attrs.name}"]`
          : attrs.property
          ? `meta[property="${attrs.property}"]`
          : null;

        if (!selector) continue;

        let tag = document.querySelector<HTMLMetaElement>(selector);
        const isNew = !tag;
        if (!tag) {
          tag = document.createElement("meta");
          document.head.appendChild(tag);
        }
        const prevContent = tag.getAttribute("content") ?? "";
        if (attrs.name) tag.setAttribute("name", attrs.name);
        if (attrs.property) tag.setAttribute("property", attrs.property);
        tag.setAttribute("content", attrs.content ?? "");
        const captured = tag;
        cleanups.push(() => {
          if (isNew) captured.remove();
          else captured.setAttribute("content", prevContent);
        });
      }
    }

    return () => cleanups.forEach(fn => fn());
  });

  return null;
}
