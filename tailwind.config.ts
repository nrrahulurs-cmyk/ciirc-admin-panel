import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ciirc: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fc",
          400: "#38a9f8",
          500: "#0284c7",
          600: "#0066cc", // Primary CIIRC Blue
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        slate: {
          25: "#fbfcfd",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          750: "#283548",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#090d16",
        },
      },
      boxShadow: {
        shell: "0 10px 35px rgba(30, 60, 120, 0.05)",
        card: "0 2px 8px rgba(15, 23, 42, 0.03)",
        "card-hover": "0 6px 16px rgba(15, 23, 42, 0.06)",
        dropdown: "0 10px 30px -4px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "title-app": ["25px", { lineHeight: "32px", letterSpacing: "-0.022em", fontWeight: "700" }],
        "title-section": ["15px", { lineHeight: "20px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "kpi-num": ["26px", { lineHeight: "30px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "body-ui": ["13.5px", { lineHeight: "19px", letterSpacing: "-0.006em", fontWeight: "400" }],
        "nav-ui": ["12.5px", { lineHeight: "17px", letterSpacing: "-0.005em", fontWeight: "500" }],
        "meta-ui": ["11.5px", { lineHeight: "15px", letterSpacing: "0em", fontWeight: "500" }],
        "btn-ui": ["12.5px", { lineHeight: "16px", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
