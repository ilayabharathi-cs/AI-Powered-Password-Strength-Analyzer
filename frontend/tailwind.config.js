/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050510",
          card: "#0d0d1f",
          border: "#1f1f3a",
          neonGreen: "#00ff9d",
          neonPink: "#ff007f",
          neonBlue: "#00f0ff",
          neonPurple: "#b500ff"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
