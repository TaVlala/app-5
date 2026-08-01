/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0F172A',
        surface: '#1E293B',
        surfaceAlt: '#262F3F',
        accent: '#FF2D55',
        accentGlow: 'rgba(255, 45, 85, 0.35)',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        borderDark: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(255, 45, 85, 0.3)',
        glowPulse: '0 0 35px rgba(255, 45, 85, 0.5)',
      }
    },
  },
  plugins: [],
}
