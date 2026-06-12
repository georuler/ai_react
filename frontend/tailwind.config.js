/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f1119',
        'bg-secondary': '#161822',
        'bg-tertiary': '#1c1f2e',
        'bg-hover': '#2a2d3e',
        'bg-surface': '#222639',
        'accent': '#6c5ce7',
        'accent-light': '#a29bfe',
        'border-color': '#2a2d3e',
        'border-light': '#353849',
      },
    },
  },
  plugins: [],
};
