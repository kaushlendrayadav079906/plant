/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'plant-primary': '#2d6a4f',
        'plant-secondary': '#40916c',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}