/** @type {import('tailwindcss').Config} */

// Every color resolves to a CSS variable defined in app/globals.css, so the
// light and dark themes share one set of class names.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sunken: token('sunken'),
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
        },
        fg: token('fg'),
        muted: token('muted'),
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          soft: token('accent-soft'),
        },
        'on-accent': token('on-accent'),
        success: { DEFAULT: token('success'), soft: token('success-soft') },
        warning: { DEFAULT: token('warning'), soft: token('warning-soft') },
        danger: { DEFAULT: token('danger'), soft: token('danger-soft') },
        info: { DEFAULT: token('info'), soft: token('info-soft') },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        display: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      // Type scale: 12 / 14 / 16 / 20 / 28 / 40. Larger steps are capped so
      // legacy classes cannot exceed the display size.
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.625rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.015em' }],
        '4xl': ['2.125rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '6xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '7xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
      },
      // Three radii: controls, cards, pills. The Tailwind names are remapped
      // so existing markup lands on the scale.
      borderRadius: {
        sm: '4px',
        DEFAULT: 'var(--radius-ctl)',
        md: 'var(--radius-ctl)',
        lg: 'var(--radius-ctl)',
        xl: 'var(--radius-ctl)',
        '2xl': 'var(--radius-card)',
        '3xl': 'var(--radius-card)',
        ctl: 'var(--radius-ctl)',
        card: 'var(--radius-card)',
      },
      // Shadows are reserved for things that float above the page.
      boxShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: '0 2px 8px -2px rgb(0 0 0 / 0.08)',
        lg: '0 8px 24px -8px rgb(0 0 0 / 0.18)',
        xl: '0 16px 40px -12px rgb(0 0 0 / 0.24)',
        '2xl': '0 24px 64px -16px rgb(0 0 0 / 0.32)',
        overlay: '0 16px 40px -12px rgb(0 0 0 / 0.24)',
      },
      transitionDuration: {
        DEFAULT: '120ms',
        fast: '120ms',
        base: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        enter: 'enter 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
