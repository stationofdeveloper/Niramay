/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f2',
          100: '#dceee2',
          200: '#bcdec9',
          300: '#91c7a9',
          400: '#63a883',
          500: '#3f8b62',
          600: '#2d6e4e',
          700: '#245840',
          800: '#1e4634',
          900: '#183a2b',
          950: '#0c2019',
        },
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#f5c842',
          500: '#d4a017',
          600: '#b97d0e',
          700: '#925e10',
          800: '#784a15',
          900: '#663d16',
        },
        cream: {
          50:  '#fdfaf4',
          100: '#faf3e4',
          200: '#f5e7c8',
          300: '#eed5a0',
          400: '#e4bc72',
          500: '#daa54f',
        },
        bark: {
          800: '#3d2b1f',
          900: '#2a1d14',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}