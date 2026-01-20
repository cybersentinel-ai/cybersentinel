/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        muted: {
          DEFAULT: '#71717a',
          dark: '#3f3f46',
        },
        card: {
          DEFAULT: '#18181b',
          border: '#27272a',
        }
      },
    },
  },
  plugins: [],
}
