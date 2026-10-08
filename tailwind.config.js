/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tazku: {
          canvas: '#FBFBF9',
          card: '#FFFFFF',
          border: '#EBE5D8',
          sand: '#F3EFE6',
          sage: '#40916C',
          sageLight: '#E9F3ED',
          emerald: '#1B4332',
          emeraldDark: '#112A20',
          amber: '#D97706',
          muted: '#526059',
        }
      }
    }
  },
  plugins: [],
}
