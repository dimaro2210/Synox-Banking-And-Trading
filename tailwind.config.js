/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synox: {
          blue: '#002d72',
          gold: '#C5A572',
        }
      }
    },
  },
  plugins: [],
}
