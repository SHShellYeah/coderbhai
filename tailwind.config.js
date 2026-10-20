/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        nunito: ['"Inter"', '"Nunito"', 'sans-serif'],
        bangla: ['"Hind Siliguri"', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          'primary-dark': 'var(--brand-primary-dark)',
          'primary-light': 'var(--brand-primary-light)',
          accent: 'var(--brand-accent)',
          secondary: 'var(--brand-secondary)',
          // Backward-compat aliases mapped to theme variables so entire app transforms
          green: 'var(--brand-primary)',
          'green-dark': 'var(--brand-primary-dark)',
          'green-light': 'var(--brand-primary-light)',
          blue: '#0EA5E9',
          'blue-dark': '#0284C7',
          gold: '#F59E0B',
          'gold-dark': '#D97706',
          rose: '#F43F5E',
          'rose-dark': '#E11D48',
          purple: '#8B5CF6',
          'purple-dark': '#7C3AED',
          orange: '#F97316',
          'orange-dark': '#EA580C',
          dark: '#090D16',
          'dark-card': '#111622',
          'dark-border': '#1E2638',
          'dark-hover': '#182030'
        }
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        '3d-primary': '0 2px 0 var(--brand-primary-dark)',
        '3d-green': '0 2px 0 var(--brand-primary-dark)',
        '3d-blue': '0 2px 0 #0284C7',
        '3d-gold': '0 2px 0 #D97706',
        '3d-rose': '0 2px 0 #E11D48',
        '3d-purple': '0 2px 0 #7C3AED',
        '3d-gray': '0 1px 2px rgba(0,0,0,0.06)',
        '3d-dark': '0 1px 2px rgba(0,0,0,0.4)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        bounceShort: 'bounceShort 1.5s infinite ease-in-out',
        pop: 'pop 0.25s ease-out',
      }
    },
  },
  plugins: [],
}
