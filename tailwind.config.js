/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0A1628', light: '#1B2A4A', medium: '#132035' },
        accent: { DEFAULT: '#C9A84C', light: '#E8D48B' },
        surface: { DEFAULT: '#0F172A', card: '#1E293B', hover: '#263348' },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '10px',
      }
    },
  },
  plugins: [],
}