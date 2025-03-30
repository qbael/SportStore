/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'drop-down': {
          '0%': { top: '0px', opacity: '0' },
          '100%': { top: '70px', opacity: '1' },
        },
        'drop-up': {
          '0%': { top: '70px', opacity: '1' },
          '100%': { top: '0px', opacity: '0' },
        },
      },
      animation: {
        'drop-down': 'drop-down 0.8s ease-out forwards',
        'drop-up': 'drop-up 0.8s ease-out forwards',
      },
    },
    plugins: [],
  }
}
