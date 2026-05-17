/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        content: "1280px",
      },
      colors: {
        background: "#0d0d0d",
        surface: "#161616",
        "surface-deep": "#101010",
        "surface-inset": "#0d0d0d",
        border: "#262626",
        "border-hover": "#363636",
        "border-focus": "#404040",
        "text-primary": "#f0f0f0",
        "text-secondary": "#a0a0a0",
        "text-muted": "#606060",
        accent: "#00c896",
        "accent-dim": "#00a87e",
        "accent-glow": "rgba(0,200,150,0.15)",
        "accent-surface": "rgba(0,200,150,0.08)",
        warn: "#f59e0b",
        "warn-surface": "rgba(245,158,11,0.08)",
        "status-active": "#00c896",
        "status-inactive": "#6b7280",
        "status-struck": "#ef4444",
        "status-dissolved": "#f59e0b",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        blink: "blink 1.2s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 1.5s infinite",
        "float-delayed-2": "float 6s ease-in-out 3s infinite",
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", maxHeight: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", maxHeight: "400px", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
