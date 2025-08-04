/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'indigo': '#6366f1',
        'purple': '#8E44AD',
        'purple-alt': 'rgb(140, 82, 255)',
        'tab-watchlist': '#E50914',
        'tab-watchlist-alt': 'rgb(255, 107, 107)',
        'tab-search': 'rgb(52, 152, 219)',
        'tab-watched': 'rgb(140, 82, 255)',
      },
    },
  },
  plugins: [],
}; 