interface BrandLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const SERIF = "'Cormorant Garamond', serif";

export default function BrandLogo({ variant = "light", size = "md", showText = true }: BrandLogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "#FFFFFF" : "#0F172A";
  const subColor = isLight ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.5)";

  const dims = size === "sm" ? 32 : size === "lg" ? 52 : 40;
  const titleSize = size === "sm" ? 16 : size === "lg" ? 26 : 19;
  const subSize = size === "sm" ? 8 : size === "lg" ? 11 : 9.5;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "lg" ? 14 : 11 }}>
      {/* Mark */}
      <svg width={dims} height={dims} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2DD4BF" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="24" cy="24" r="22.5" stroke="url(#logoGrad)" strokeWidth="1.5" />
        {/* Inner thin ring */}
        <circle cx="24" cy="24" r="18" stroke="url(#logoGrad)" strokeWidth="0.75" opacity="0.4" />
        {/* Serif monogram П */}
        <text x="24" y="33" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="26" fontWeight="600" fill="url(#logoGrad)">П</text>
      </svg>

      {showText && (
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontFamily: SERIF, fontSize: titleSize, fontWeight: 600, color: textColor, letterSpacing: "0.5px" }}>
            ПРО ДИАЛОГ
          </div>
          <div style={{ fontSize: subSize, color: subColor, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, marginTop: 2 }}>
            Платформа роста салона
          </div>
        </div>
      )}
    </div>
  );
}
