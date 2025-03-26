/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4F6D7A',
        secondary: '#86BBD8',
        accent: '#F26419',
        background: '#F5F5F5',
        danger: '#E63946',
        success: '#2A9D8F',
        text: '#333333',
        textLight: '#666666',
      },
    },
  },
  plugins: [],
}
