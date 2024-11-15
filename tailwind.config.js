/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {  colors: {
      'neon-orange': '#FF6D00', // Neon orange color
      'dark-bg': '#1B1B1B', // Darker background color
      'dark-panel': '#2A2A2A', // Slightly lighter for panels
    },},
  },
  plugins: [],
}