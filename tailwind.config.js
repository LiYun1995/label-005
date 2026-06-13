/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          50: "#f5f7fa",
          100: "#e8edf4",
          200: "#c9d4e3",
          300: "#9bb0cb",
          400: "#6686ac",
          500: "#42658f",
          600: "#2e4d74",
          700: "#1e3a5f",
          800: "#182f4c",
          900: "#14263e",
          950: "#0c1726",
        },
        paper: {
          50: "#fdfcfa",
          100: "#faf6f0",
          200: "#f3eadb",
          300: "#e9d9bf",
          400: "#dcc29c",
        },
        annotate: {
          error: "#e74c3c",
          format: "#f39c12",
          question: "#3498db",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        paper: "0 1px 3px rgba(30,58,95,0.06), 0 4px 16px rgba(30,58,95,0.04)",
        card: "0 2px 8px rgba(30,58,95,0.08), 0 8px 24px rgba(30,58,95,0.06)",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
