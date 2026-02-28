/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F8CFF',
          dark: '#3A68C9',
          light: '#7AA9FF',
          glow: 'rgba(79, 140, 255, 0.25)',
        },
        positive: {
          DEFAULT: '#22C55E',
          glow: 'rgba(34, 197, 94, 0.2)',
        },
        negative: {
          DEFAULT: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.2)',
        },
        background: '#0F1115',
        surface: {
          DEFAULT: '#1A1D24', // Secondary Background
          card: '#1E222B', // Card Background
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
