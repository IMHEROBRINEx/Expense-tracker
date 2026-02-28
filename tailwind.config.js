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
          DEFAULT: '#3b82f6', // Bright Blue
          dark: '#2563eb',
          light: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.3)',
        },
        positive: {
          DEFAULT: '#10b981', // Emerald
          glow: 'rgba(16, 185, 129, 0.3)',
        },
        negative: {
          DEFAULT: '#f43f5e', // Rose
          glow: 'rgba(244, 63, 94, 0.3)',
        },
        background: '#0B0D11', // Darker background
        surface: {
          DEFAULT: '#13161C', // Secondary Background
          card: '#181B23', // Card Background
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
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
