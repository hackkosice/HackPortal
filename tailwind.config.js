import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        primaryTitle: "#5E2137",
        primaryButton: "#EF611E",
        hkOrange: "#EF611E",
        hkGray: "#F4F4F4",
        hkLightGray: "#F9FAFD",
      },
      fontFamily: {
        default: ["var(--font-roboto)", ...fontFamily.mono],
        title: ["var(--font-league-spartan)", ...fontFamily.mono],
      },
      spacing: {
        navbarHeight: "90px",
        navbarHeightMobile: "70px",
        navbarHeightOffset: "120px",
        navbarHeightOffsetMobile: "90px",
      },
      fontSize: {
        sm: "0.9rem",
        base: "1rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
