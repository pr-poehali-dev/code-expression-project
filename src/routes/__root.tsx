import {useEffect, type ReactNode} from "react";
import {HeadContent, Outlet, Scripts, createRootRoute, redirect, useLocation} from "@tanstack/react-router";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {LkAuthProvider} from "@/contexts/LkAuthContext";
import {EnergyProvider} from "@/contexts/EnergyContext";
import {PackageUsageProvider} from "@/contexts/PackageUsageContext";
import EnergyGate from "@/components/EnergyGate";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import ChatWidget from "@/components/ChatWidget";
import NotFoundPage from "@/pages/NotFoundPage";
import {PLATFORM_META, PLATFORM_SCRIPTS} from "@/platform/scripts.gen";
import {HMR_CLIENT} from "@/platform/dev-hmr";
import appCss from "@/index.css?url";

const SITE = "https://promtdialog.ru";
const TITLE = "Развивайте свое дело уверенно | Промт Диалог";
const DESCRIPTION =
    "Разберитесь, что мешает развитию бизнеса, найдите возможности для привлечения клиентов и получите конкретные шаги. Бесплатная диагностика.";
const OG_IMAGE = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/og-image-1792772179107.jpg";
const FONTS =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&display=swap";

const ORG_LD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://promtdialog.ru/#org",
            name: "Промт Диалог",
            url: "https://promtdialog.ru/",
            logo: "https://promtdialog.ru/icon-512.svg",
            email: "massopro@mail.ru",
            telephone: "+7 902 900-74-74",
            sameAs: ["https://t.me/prodialog"],
        },
        {
            "@type": "WebSite",
            "@id": "https://promtdialog.ru/#site",
            url: "https://promtdialog.ru/",
            name: "Промт Диалог",
            inLanguage: "ru-RU",
            publisher: {"@id": "https://promtdialog.ru/#org"},
        },
    ],
};

const METRIKA = `(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109646142', 'ym');
ym(109646142, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`;

function canonicalFor(pathname: string) {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    return `${SITE}${path === "/" ? "/" : path}`;
}

// Старые адреса, переехавшие на новые (раньше — <Navigate> в App.tsx).
const REDIRECTS: Record<string, string> = {
    "/tarify": "/tseny",
};

export const Route = createRootRoute({
    beforeLoad: ({location}) => {
        const path = location.pathname.length > 1 ? location.pathname.replace(/\/+$/, "") : location.pathname;
        const target = REDIRECTS[path];
        if (target) throw redirect({href: target, statusCode: 301});
    },
    head: ({matches}) => {
        const pathname = matches[matches.length - 1]?.pathname ?? "/";
        return {
            meta: [
                {charSet: "utf-8"},
                {name: "viewport", content: "width=device-width, initial-scale=1.0"},
                {title: TITLE},
                {name: "description", content: DESCRIPTION},
                {name: "author", content: "poehali.dev"},
                {name: "theme-color", content: "#0F172A"},
                {name: "mobile-web-app-capable", content: "yes"},
                {name: "apple-mobile-web-app-capable", content: "yes"},
                {name: "apple-mobile-web-app-status-bar-style", content: "black-translucent"},
                {name: "apple-mobile-web-app-title", content: "Про Диалог"},
                {name: "application-name", content: "Про Диалог"},
                {name: "msapplication-TileColor", content: "#0F172A"},
                {property: "og:title", content: TITLE},
                {property: "og:description", content: DESCRIPTION},
                {property: "og:image", content: OG_IMAGE},
                {property: "og:image:width", content: "1512"},
                {property: "og:image:height", content: "757"},
                {property: "og:image:alt", content: "Про Диалог — Платформа роста салона"},
                {property: "og:type", content: "website"},
                {property: "og:url", content: "https://promtdialog.ru"},
                {name: "twitter:card", content: "summary_large_image"},
                {name: "twitter:title", content: TITLE},
                {name: "twitter:description", content: DESCRIPTION},
                {name: "twitter:image", content: OG_IMAGE},
                {name: "keywords", content: "доход для салона красоты, клиенты салону красоты, маркетинг для салонов красоты"},
                {name: "yandex-verification", content: "73acce66cc6ab9c2"},
                ...PLATFORM_META,
            ],
            links: [
                {rel: "stylesheet", href: appCss},
                {rel: "preconnect", href: "https://fonts.googleapis.com"},
                {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
                {rel: "stylesheet", href: FONTS},
                {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"},
                {rel: "icon", type: "image/svg+xml", sizes: "32x32", href: "/favicon.svg"},
                {rel: "apple-touch-icon", sizes: "180x180", href: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/pwa-icons/icon-192-v2.png"},
                {rel: "apple-touch-icon", sizes: "512x512", href: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/pwa-icons/icon-512-v2.png"},
                {rel: "manifest", href: "/manifest.json"},
                {rel: "canonical", href: canonicalFor(pathname)},
            ],
            // IMPORTANT: DO NOT REMOVE PLATFORM SCRIPTS AND THE DEV HMR CLIENT!
            scripts: [
                ...(import.meta.env.DEV ? [{children: HMR_CLIENT}] : []),
                ...PLATFORM_SCRIPTS,
                {type: "application/ld+json", children: JSON.stringify(ORG_LD)},
                {children: METRIKA},
            ],
        };
    },
    component: RootComponent,
    notFoundComponent: NotFoundPage,
});

function ChatWidgetConditional() {
    const {pathname} = useLocation();
    if (pathname.startsWith("/cabinet")) return null;
    return <ChatWidget/>;
}

// Service worker и автоперезагрузка при устаревших чанках (раньше — в main.tsx).
function useClientBootstrap() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        }

        function reloadOnceForStaleChunk() {
            const key = "chunk_reload_at";
            const last = Number(sessionStorage.getItem(key) || 0);
            if (Date.now() - last < 10000) return;
            sessionStorage.setItem(key, String(Date.now()));
            window.location.reload();
        }
        const onError = (e: ErrorEvent) => {
            if (e.message && e.message.includes("Failed to fetch dynamically imported module")) {
                reloadOnceForStaleChunk();
            }
        };
        const onRejection = (e: PromiseRejectionEvent) => {
            const reason = e?.reason as {message?: string} | string | undefined;
            const msg = String((typeof reason === "object" && reason?.message) || reason || "");
            if (msg.includes("Failed to fetch dynamically imported module") || msg.includes("Importing a module script failed")) {
                reloadOnceForStaleChunk();
            }
        };
        window.addEventListener("vite:preloadError", reloadOnceForStaleChunk);
        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("vite:preloadError", reloadOnceForStaleChunk);
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, []);
}

function RootComponent() {
    useClientBootstrap();
    return (
        <RootDocument>
            <LkAuthProvider>
                <EnergyProvider>
                    <PackageUsageProvider>
                        <TooltipProvider>
                            <Toaster/>
                            <Sonner/>
                            <CookieBanner/>
                            <EnergyGate/>
                            <ChatWidgetConditional/>
                            <ScrollToTop/>
                            <Outlet/>
                        </TooltipProvider>
                    </PackageUsageProvider>
                </EnergyProvider>
            </LkAuthProvider>
        </RootDocument>
    );
}

function RootDocument({children}: { children: ReactNode }) {
    return (
        <html lang="ru" translate="no">
        <head>
            <HeadContent/>
        </head>
        <body>
        {children}
        <noscript>
            <div><img src="https://mc.yandex.ru/watch/109646142" style={{position: "absolute", left: "-9999px"}} alt=""/></div>
        </noscript>
        <Scripts/>
        </body>
        </html>
    );
}
