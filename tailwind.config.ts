import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        curve: "var(--color-curve)",
        "curve-2": "var(--color-curve-2)",
        ghost: "var(--color-ghost)",
        text: "var(--color-text)",
        accent: "var(--color-accent)",
        "btn-bg": "var(--color-btn-bg)",
        "btn-hover": "var(--color-btn-hover)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-serif)"],
      },
      transitionTimingFunction: {
        soft: "var(--ease-soft)",
        pop: "var(--ease-pop)",
      },
    },
  },
  plugins: [],
};

export default config;
