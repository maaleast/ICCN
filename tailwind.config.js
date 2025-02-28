module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Aktifkan dark mode berdasarkan class
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Biru
          dark: '#2563EB', // Biru gelap
        },
        secondary: {
          DEFAULT: '#10B981', // Hijau
          dark: '#059669', // Hijau gelap
        },
        background: {
          light: '#FFFFFF', // Putih
          dark: '#1F2937', // Abu-abu gelap
        },
        text: {
          light: '#1F2937', // Abu-abu gelap
          dark: '#F9FAFB', // Putih
        },
      },
    },
  },
  plugins: [],
};