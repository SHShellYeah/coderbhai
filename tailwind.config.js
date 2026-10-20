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
          // Canonical Duolingo palette
          green: '#58CC02',
          'green-dark': '#46A302',
          'green-light': '#7CE01E',
          blue: '#1CB0F6',
          'blue-dark': '#1899D6',
          gold: '#FFC800',
          'gold-dark': '#E5A100',
          rose: '#FF4B4B',
          'rose-dark': '#EA2B2B',
          purple: '#CE82FF',
          'purple-dark': '#A549E0',
          orange: '#FF9600',
          'orange-dark': '#E07D00',
          // Duolingo Dark Theme Canvas
          dark: '#131F24',
          'dark-card': '#18252D',
          'dark-border': '#263843',
          'dark-hover': '#20313B'
        }
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        '3d-primary': '0 4px 0 var(--brand-primary-dark)',
        '3d-green': '0 4px 0 #46A302',
        '3d-blue': '0 4px 0 #1899D6',
        '3d-gold': '0 4px 0 #E5A100',
        '3d-rose': '0 4px 0 #EA2B2B',
        '3d-purple': '0 4px 0 #A549E0',
        '3d-gray': '0 4px 0 #CBD5E1',
        '3d-dark': '0 4px 0 #1E2C33',
        '3d-node-gold': '0 6px 0 #E5A100',
        '3d-node-blue': '0 6px 0 #1899D6',
        '3d-node-locked': '0 6px 0 #1E2C33',
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
