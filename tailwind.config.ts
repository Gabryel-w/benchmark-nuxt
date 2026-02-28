import type { Config } from 'tailwindcss'

export default {
  content: ['./pages/**/*.vue', './components/**/*.vue', './layouts/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
