/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          bg: '#87CEEB',
          light: '#B0E0E6',
          card: 'rgba(255, 255, 255, 0.25)',
          border: 'rgba(255, 255, 255, 0.3)',
          dark: '#4A90C2',
        },
      },
    },
  },
  plugins: [],
}

