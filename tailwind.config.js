/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ITC Avant Garde Gothic Std', 'Inter', 'system-ui', 'sans-serif'],
        'avant-garde': ['ITC Avant Garde Gothic Std', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: 'rgba(54, 129, 222, 0.1)',
          100: 'rgba(54, 129, 222, 0.2)',
          200: 'rgba(54, 129, 222, 0.3)',
          300: 'rgba(54, 129, 222, 0.4)',
          400: 'rgba(54, 129, 222, 0.5)',
          500: 'rgba(54, 129, 222, 0.6)',
          600: '#3681DE',
          700: '#2B6BC7',
          800: '#1E5BB0',
          900: '#124B99',
        }
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'fadeIn': 'fadeIn 1s ease-out',
        'fadeOut': 'fadeOut 1s ease-out',
        'slideInLeft': 'slideInLeft 1s ease-out',
        'slideOutRight': 'slideOutRight 1s ease-out',
        'zoomIn': 'zoomIn 1s ease-out',
        'zoomOut': 'zoomOut 1s ease-out',
        'tada': 'tada 1s ease-out',
        'flash': 'flash 1s ease-out',
        'jiggle': 'jiggle 0.6s ease-out',
        'shake': 'shake 0.6s ease-out',
        'wiggle': 'wiggle 0.6s ease-out',
        'flip': 'flip 1s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(50px)', opacity: '0' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        tada: {
          '0%': { transform: 'scale(1)' },
          '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
          '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        flash: {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' },
        },
        jiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotateY(0)' },
          '100%': { transform: 'perspective(400px) rotateY(360deg)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(54, 129, 222, 0.3)',
            textShadow: '0 0 5px rgba(54, 129, 222, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(54, 129, 222, 0.6)',
            textShadow: '0 0 20px rgba(54, 129, 222, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}