import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: "#030712",
          surface: "#0b0f19",
          card: "#111827",
          border: "#1f293d",
          cyan: "#00f0ff",
          emerald: "#10b981",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          crimson: "#ef4444",
          neonPink: "#ff007f",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 8s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        glow: {
          "0%": { filter: "drop-shadow(0 0 4px rgba(0,240,255,0.4))" },
          "100%": { filter: "drop-shadow(0 0 16px rgba(0,240,255,0.8))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;