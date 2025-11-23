/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#3B82F6',
          dark: '#60A5FA',
        },
      },
    },
  },
  plugins: [],
}

