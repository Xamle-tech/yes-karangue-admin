/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#305669',
          600: '#1F3A4A',
          700: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}
