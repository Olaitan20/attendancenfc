import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        bg:       '#070a10',
        surface:  '#0d1117',
        surface2: '#131820',
        surface3: '#1a2030',
        border1:  '#1e2535',
        border2:  '#2a3348',
        txt:      '#e2e8f5',
        muted:    '#64748b',
        muted2:   '#8896b3',
        student:  '#06b6d4',
        lecturer: '#f59e0b',
        adm:      '#a78bfa',
        ok:       '#10b981',
        danger:   '#f43f5e',
        warn:     '#f97316',
        info:     '#3b82f6',
      },
      borderRadius: {
        card: '0px',
        btn:  '0px',
      },
      animation: {
        'fade-up':  'fadeUp 0.25s ease both',
        'slide-in': 'slideIn 0.2s ease both',
      },
      keyframes: {
        fadeUp:  {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-6px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
