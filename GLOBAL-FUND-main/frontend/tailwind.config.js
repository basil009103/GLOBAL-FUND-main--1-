/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans all JS/TS/JSX/TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // Ensure DaisyUI is included
};
