import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#ECDFC0",
        card: "#F5EBD2",
        "graph-bg": "#FCF6E6",
        "butcher-red": "#A8321F",
        "red-pressed": "#6e1d12",
        "red-ink": "#7C2316",
        ink: "#2B1D10",
        "ink-brown": "#3A2817",
        brass: "#B8893C",
        "brass-light": "#fbf2db",
        "smoke-teal": "#3F6F7A",
        "teal-bg": "#eef0e6",
        "teal-border": "#a9c2c4",
        "meat-bg": "#f6e7e2",
        "meat-border": "#d8b3a6",
        cream: "#F2E7CC",
        border: "#cdb789",
        muted: "#8a7350",
        "muted-dark": "#5A4530",
        chevron: "#b09a6e",
        "ledger-rule": "#9bb0c4",
        "margin-rule": "#d08b7a",
      },
      fontFamily: {
        display: ["var(--font-ultra)", "Georgia", "serif"],
        body: ["var(--font-spectral)", "Georgia", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(43,29,16,.1)",
        panel: "0 2px 10px rgba(43,29,16,.12)",
        stamp: "0 2px 0 #6e1d12",
        "graph-inset": "inset 0 1px 4px rgba(43,29,16,.08)",
      },
      borderRadius: {
        hairline: "2px",
        standard: "3px",
        chip: "20px",
      },
      letterSpacing: {
        label: "0.2em",
        wide: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
