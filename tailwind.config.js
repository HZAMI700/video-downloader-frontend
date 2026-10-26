/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        skywork: {
          bg: '#0F131A',
          card: '#181D24',
          'card-hover': '#1F242D',
          border: '#263241',
          'border-light': 'rgba(255, 255, 255, 0.08)',
          cyan: '#00A9C0',
          teal: '#00c9a7',
          blue: '#2495ff',
          emerald: '#29CC5F',
        },
        background: '#0F131A',
        card: '#181D24',
        brand: {
          purple: '#8B5CF6',
          cyan: '#00A9C0',
          blue: '#2495ff',
          teal: '#00c9a7',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(0, 201, 167, 0.3), 0 0 25px -5px rgba(36, 149, 255, 0.3)',
        'cyan-glow': '0 0 30px rgba(0, 201, 167, 0.25)',
        'skywork-card': '0 12px 36px -8px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
