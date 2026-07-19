import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fonds premium
        canvas: "#FAF8F4",      // blanc cassé très léger
        cream: "#F3EEE4",       // crème
        mist: "#EDEEF0",        // gris très clair
        sand: "#E7DCC7",        // beige sable
        // Contrastes / anthracite / noir
        ink: "#0E0F12",         // noir profond (contraste)
        anthracite: "#1C1F26",
        graphite: "#2A2E37",
        // Couleurs premium
        navy: {
          DEFAULT: "#12233B",   // bleu nuit
          deep: "#0B1626",
          soft: "#22405F",
        },
        emerald: {
          DEFAULT: "#1F6B54",   // vert émeraude
          deep: "#134A3A",
          soft: "#3E8E74",
        },
        gold: {
          DEFAULT: "#C9A25A",   // or léger
          soft: "#DDBE86",
          deep: "#A9853F",
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
        gold: "0 10px 40px -12px rgba(201,162,90,0.45)",
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
