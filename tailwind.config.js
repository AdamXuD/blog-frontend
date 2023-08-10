/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      app: "var(--color-app)",
      primary: "var(--color-primary)",
      regular: "var(--color-regular)",
      secondary: "var(--color-secondary)",
      "dark-app": "var(--color-dark-app)",
      "dark-primary": "var(--color-dark-primary)",
      "dark-regular": "var(--color-dark-regular)",
      "dark-secondary": "var(--color-dark-secondary)",
      black: "var(--color-black)",
      white: "var(--color-white)",
      "black-mask": "var(--color-black-mask)",
      "white-mask": "var(--color-white-mask)",
      transparent: "var(--color-transparent)",
      "element-primary": "var(--color-element-primary)",
      "element-success": "var(--color-element-success)",
      "element-warning": "var(--color-element-warning)",
      "element-danger": "var(--color-element-danger)",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
