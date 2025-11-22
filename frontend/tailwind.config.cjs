module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          primary: '#0f5132',
          light: '#198754',
          dark: '#0a3622'
        },
        navy: {
          primary: '#0f172a',
          light: '#1e293b',
          dark: '#020617'
        },
        gold: {
          primary: '#D4AF37',
          light: '#F4E5A1',
          dark: '#B8941F'
        },
        pearl: '#F5F5F5',
        softGrey: '#ECECEC'
      },
      fontFamily: {
        arabic: ['Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'serif'],
        quran: ['Scheherazade New', 'Amiri Quran', 'Noto Naskh Arabic', 'Amiri', 'serif'],
        amiri: ['Amiri', 'serif'],
        sans: ['Inter', 'Poppins', 'Nunito', 'sans-serif']
      },
      fontSize: {
        'h1': '32px',
        'h2': '26px'
      },
      backdropBlur: {
        'glass': '12px'
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
