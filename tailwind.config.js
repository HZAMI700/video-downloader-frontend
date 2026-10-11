/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        brand: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          blue: '#3B82F6',
        },
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(139, 92, 246, 0.3), 0 0 25px -5px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
};
