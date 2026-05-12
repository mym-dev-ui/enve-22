import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2332",
          dark: "#0f1419",
          medium: "#1e2d3d",
          light: "#2d3a4f",
        },
        blue: {
          accent: "#4A7FFF",
          hover: "#3a6fee",
        },
        border: "#4a5568",
        textSecondary: "#a0aec0",
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
