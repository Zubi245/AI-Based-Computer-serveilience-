/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020817',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#172554',
          600: '#1e3a5f',
          500: '#2563eb',
        },
        surface: {
          DEFAULT: '#0f1729',
          light: '#162032',
          card: 'rgba(15,23,42,0.85)',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
          light: '#fca5a5',
          glow: 'rgba(239,68,68,0.3)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#b45309',
          light: '#fcd34d',
          glow: 'rgba(245,158,11,0.3)',
        },
        success: {
          DEFAULT: '#22c55e',
          dark: '#15803d',
          light: '#86efac',
          glow: 'rgba(34,197,94,0.3)',
        },
        info: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          light: '#93c5fd',
          glow: 'rgba(59,130,246,0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.1)',
        'glow-green': '0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.1)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.4), 0 0 40px rgba(245,158,11,0.1)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'flicker': 'flicker 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
