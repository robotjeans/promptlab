/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(237, 116, 90)", // #ED745A
          light: "rgb(245, 158, 140)", // #F59E8C
          dark: "rgb(221, 89, 66)", // #DD5942
        },
        secondary: {
          DEFAULT: "rgb(94, 145, 226)", // #5E91E2
          light: "rgb(115, 165, 239)", // #73A5EF
          dark: "rgb(76, 119, 197)", // #4C77C5
        },
        background: {
          DEFAULT: "rgb(238, 243, 251)", // #EEF3FB
          surface: "rgb(255, 255, 255)", // #FFFFFF
          success: "rgb(237, 249, 242)", // #EDF9F2
        },
        text: {
          primary: "rgb(0, 0, 0)", // #000000
          secondary: "rgb(107, 114, 128)", // #6B7280
          disabled: "rgb(156, 163, 175)", // #9CA3AF
        },
      },
    },
  },
  plugins: [],
};
