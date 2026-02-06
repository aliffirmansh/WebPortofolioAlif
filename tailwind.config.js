/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-yellow-500',
    'text-blue-500',
    'text-orange-500',
    'text-blue-400',
    'text-green-500',
    'text-cyan-500',
    'text-purple-500',
    'text-gray-800',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}