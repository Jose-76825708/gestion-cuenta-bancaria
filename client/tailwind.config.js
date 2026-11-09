/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Paleta principal inspirada en banca peruana (BCP / Interbank)
        brand: {
          50: '#fff5f5',
          100: '#ffe8e9',
          200: '#ffd2d5',
          300: '#ffadb3',
          400: '#ff7a85',
          500: '#f8445a',
          600: '#e4002b',
          700: '#c10024',
          800: '#96001c',
          900: '#6b0014',
        },
        // Acento estilo Interbank para detalles
        grape: {
          500: '#8b2fc9',
          600: '#7323ab',
        },
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(15, 23, 42, 0.15)',
        brand: '0 12px 30px -10px rgba(228, 0, 43, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
