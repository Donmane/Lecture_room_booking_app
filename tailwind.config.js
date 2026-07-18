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
          bg: '#000000',      // Pure black background
          card: '#0a0a0a',    // Clean dark grey card background
          input: '#0e0e11',   // Input field background
          border: '#1e1e22',  // Minimal border color
          muted: '#71717a',   // Muted text
        },
        brandpurple: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        brandgold: {
          light: '#fbbf24',
          DEFAULT: '#d97706',
          dark: '#b45309',
        }
      }
    },
  },
  plugins: [],
}