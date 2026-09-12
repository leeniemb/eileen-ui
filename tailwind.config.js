/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './dev/**/*.{html,tsx}'],
  theme: {
    // Root 8px scale: keeps Tailwind's default n*4px indexing (so p-6 is
    // still 24px, muscle memory carries over) but only exposes even
    // indices, plus a single odd one — `1` (4px) — as the sole exception.
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '4': '16px',
      '6': '24px',
      '8': '32px',
      '10': '40px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '40': '160px',
      '48': '192px',
      '56': '224px',
      '64': '256px',
    },
    fontSize: {
      // shared scale, used with either font-sans or font-mono
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['32px', { lineHeight: '40px' }],
      '4xl': ['40px', { lineHeight: '48px' }],
      '5xl': ['56px', { lineHeight: '64px' }],
      '6xl': ['72px', { lineHeight: '80px' }],
      // mono-specific micro sizes, meant for font-mono + uppercase
      micro: ['10px', { lineHeight: '16px', letterSpacing: '0.06em' }],
      label: ['12px', { lineHeight: '16px', letterSpacing: '0.04em' }],
    },
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        'coconut-milk': 'var(--eileen-coconut-milk)',
        meringue: 'var(--eileen-meringue)',
        truffle: 'var(--eileen-truffle)',
        'black-sesame': 'var(--eileen-black-sesame)',
      },
    },
  },
  plugins: [],
};
