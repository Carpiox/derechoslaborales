import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15212f",
        paper: "#f7f5ef",
        accent: "#0f766e"
      }
    }
  },
  plugins: [typography]
} satisfies Config;

export default config;
