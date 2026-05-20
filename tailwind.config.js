/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          950: '#080c10',
          900: '#0d1117',
          800: '#141c24',
          700: '#1c2836',
          600: '#243347',
        },
        accent: {
          cyan:    '#00d4ff',
          orange:  '#ff6b2b',
          gold:    '#c8a951',
          silver:  '#9eafc2',
        },
      },
      fontFamily: {
        mono:  ['JetBrains Mono', 'monospace'],
        sans:  ['Space Grotesk', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
      backgroundImage: {
        'blueprint': `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-40': '40px 40px',
        'grid-80': '80px 80px',
      },
      animation: {
        'scan':        'scan 3s linear infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':   'spin 12s linear infinite',
        'blink':       'blink 1.2s step-end infinite',
        'flicker':     'flicker 0.15s infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%':       { opacity: 0 },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%':       { opacity: 0.97 },
        },
      },
    },
  },
  plugins: [],
}
