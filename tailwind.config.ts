import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card-background)",
          foreground: "var(--card-foreground)",
        },
        input: {
          DEFAULT: "var(--input-background)",
          foreground: "var(--input-foreground)",
          border: "var(--input-border)",
        },
        success: {
          DEFAULT: "var(--success-foreground)",
          background: "var(--success-background)",
          border: "var(--success-border)",
        },
        error: {
          DEFAULT: "var(--error-foreground)",
          background: "var(--error-background)",
          border: "var(--error-border)",
        },
        secondary: "var(--secondary-text)",
        button: {
          primary: "var(--button-primary)",
          primaryHover: "var(--button-primary-hover)",
          secondary: "var(--button-secondary)",
          secondaryHover: "var(--button-secondary-hover)",
          back: "var(--back-button)",
        },
      },
      fontFamily: {
        'pixelify': ['var(--font-pixelify-sans)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
