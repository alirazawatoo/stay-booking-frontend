/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Deep pine for actions and navigation, brass for highlights, stone for paper.
      colors: {
        pine: {
          50: '#eef5f1',
          100: '#d5e8de',
          200: '#abd1bd',
          300: '#7cb59a',
          500: '#2f7a5c',
          600: '#23634a',
          700: '#1c4f3b',
          800: '#163f30',
          900: '#112f25',
          950: '#0b1f18',
        },
        brass: {
          100: '#f6ecd4',
          300: '#e3c27a',
          500: '#b8862b',
          700: '#7a5716',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}
