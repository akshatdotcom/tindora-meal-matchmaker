/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': {
          DEFAULT: '#F4D9D0',
          '100': '#D9ABAB',
          '200': '#C75B7A',
          '300': '#921A40',
        },

        'custom-white': {
          DEFAULT: '#FAF9F6',
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}