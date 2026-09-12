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
        background: "var(--background)",
        foreground: "var(--foreground)",
        leetcode: {
          easy: "#00b8a3",
          medium: "#ffc01e",
          hard: "#ff375f",
          dark: "#1a1a1a",
          card: "#282828",
          border: "#3e3e3e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
