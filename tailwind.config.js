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
        nunito: ['"Nunito"', '"Hind Siliguri"', 'sans-serif'],
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
          blue: '#06B6D4',
          'blue-dark': '#0891B2',
          gold: '#F59E0B',
          'gold-dark': '#D97706',
          rose: '#F43F5E',
          'rose-dark': '#E11D48',
          purple: '#A855F7',
          'purple-dark': '#9333EA',
          orange: '#FF6B00',
          'orange-dark': '#E55A00',
          dark: '#0B0F19',
          'dark-card': '#111827',
          'dark-border': '#1E293B',
          'dark-hover': '#1F2937'
        }
      },
      boxShadow: {
        '3d-primary': '0 4px 0 var(--brand-primary-dark)',
        '3d-green': '0 4px 0 var(--brand-primary-dark)',
        '3d-blue': '0 4px 0 #0891B2',
        '3d-gold': '0 4px 0 #D97706',
        '3d-rose': '0 4px 0 #E11D48',
        '3d-purple': '0 4px 0 #9333EA',
        '3d-gray': '0 4px 0 #CBD5E1',
        '3d-dark': '0 4px 0 #090D16',
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
