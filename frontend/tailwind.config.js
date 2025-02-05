/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
import { addIconSelectors } from '@iconify/tailwind'

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    addIconSelectors(['mingcute']),
  ],
  daisyui: {
    themes: false,
    darkTheme: "dark",
  },
}

