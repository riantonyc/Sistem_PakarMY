import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090A0D", // Base Canvas (Ring Mat Black)
        surface: {
          DEFAULT: "#111318", // Carbon Corner Surface
          elevated: "#191D24", // Active / Hover Surface
          dim: "#0D0F14",
        },
        border: {
          grid: "#262B36", // 1px Hairline Structural Grid
          focus: "#3F4756", // Active selection border
        },
        primary: {
          DEFAULT: "#F4F6F8", // High-Contrast Text
          muted: "#8A94A6", // Steel Silver Metadata
        },
        accent: {
          red: "#E61E4D", // Red Corner (Left HUD, Danger, Live Round)
          blue: "#008ED6", // Blue Corner (Right HUD, Active Status)
          gold: "#F5A623", // Mongkhon Amber (Champion, Warning, Ambang)
          green: "#009E52", // Ring Emerald (Valid Strike, Siap/Go, Locked)
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "'Teko'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
      },
      boxShadow: {
        // Anti-slop: strictly zero blurry multi-layer drop shadows
        none: "none",
        hairline: "0 0 0 1px #262B36",
        "red-glow": "0 0 12px rgba(230, 30, 77, 0.25)",
        "blue-glow": "0 0 12px rgba(0, 142, 214, 0.25)",
        "gold-glow": "0 0 12px rgba(245, 166, 35, 0.25)",
        "green-glow": "0 0 12px rgba(0, 158, 82, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

