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
        "bg-mid": "var(--color-bg-mid)",
        "bg-deep": "var(--color-bg-deep)",
        curve: "var(--color-curve)",
        "curve-2": "var(--color-curve-2)",
        ghost: "var(--color-ghost)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.5" }],
        md: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.4" }],
        xl: ["24px", { lineHeight: "1.3" }],
      },
      transitionTimingFunction: {
        soft: "var(--ease-soft)",
        pop: "var(--ease-pop)",
      },
      boxShadow: {
        glass: "0 8px 32px var(--color-glass-shadow)",
        character: "0 12px 40px rgba(91, 77, 122, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
