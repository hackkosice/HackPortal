/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        hkPurple: "#5E2137",
        hkOrange: "#EF611E",
        hkGray: "#F4F4F4",
        hkLightGray: "#F9FAFD",
      },
      fontFamily: {
        default: ["var(--font-roboto)", ...fontFamily.mono],
        title: ["var(--font-league-spartan)", ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};
