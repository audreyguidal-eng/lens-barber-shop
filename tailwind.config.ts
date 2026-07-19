import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fonds premium chaleureux (crème / sable)
        canvas: "#F7F2E9",      // blanc cassé chaud
        cream: "#EFE6D5",       // crème
        mist: "#ECE6DB",        // beige très clair
        sand: "#E3D4BB",        // beige sable
        // Contrastes / espresso / noir chaud
        ink: "#1A120B",         // noir espresso (contraste)
        anthracite: "#241811",
        graphite: "#3A2A1E",
        // "navy" -> désormais ESPRESSO (dark premium chaud)
        navy: {
          DEFAULT: "#2A1C11",   // espresso profond
          deep: "#160E07",
          soft: "#4A3524",
        },
        // "emerald" -> désormais CUIVRE / terracotta (accent chaud)
        emerald: {
          DEFAULT: "#B15C34",   // cuivre
          deep: "#8A4526",
          soft: "#CA7A50",
        },
        // "gold" -> LAITON / or chaud
        gold: {
          DEFAULT: "#C79A4E",   // laiton
          soft: "#E0C079",
          deep: "#A67C34",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        container: "1240px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,15,18,0.04), 0 8px 30px rgba(14,15,18,0.06)",
        lift: "0 20px 60px -20px rgba(14,15,18,0.25)",
        glass: "0 8px 32px rgba(14,15,18,0.08)",
        gold: "0 10px 40px -12px rgba(199,154,78,0.5)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
