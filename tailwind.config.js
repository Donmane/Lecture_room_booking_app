/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        branddark: {
          bg: '#0a0d16',      // Very deep tech dark blue-gray
          card: '#121824',    // Dark card background
          input: '#1a202c',   // Input field background
          border: '#1f293d',  // Subtle borders
          muted: '#8e9bb0',   // Muted text
        },
        brandpurple: {
          light: '#a78bfa',
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
        },
        brandgold: {
          light: '#fcd34d',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        }
      }
    },
  },
  plugins: [],
}