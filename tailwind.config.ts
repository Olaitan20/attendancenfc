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
        // ── Backgrounds (light → slightly tinted whites) ──────────────
        bg:       '#f5f5f5',   // page canvas — warm off-white
        surface:  '#ffffff',   // primary card / panel — pure white
        surface2: '#f0f0f0',   // secondary surface — light gray
        surface3: '#e8e8e8',   // tertiary / inset surface

        // ── Borders ───────────────────────────────────────────────────
        border1:  '#dcdcdc',   // subtle dividers
        border2:  '#c8c8c8',   // prominent borders / separators

        // ── Typography ────────────────────────────────────────────────
        txt:      '#0a0a0a',   // primary text — near black
        muted:    '#525252',   // secondary / label text
        muted2:   '#8a8a8a',   // placeholder / hint text

        // ── Role badges (high-contrast grayscale spread) ──────────────
        student:  '#111111',   // darkest — near black pill
        lecturer: '#3a3a3a',   // dark charcoal
        adm:      '#5e5e5e',   // mid gray

        // ── Status / alert (use fill + text combos for badges) ────────
        ok:       '#0a0a0a',   // black  → success (decisive, solid)
        danger:   '#1a1a1a',   // near-black → error (use red-tinted bg if needed)
        warn:     '#4a4a4a',   // dark gray → warning
        info:     '#787878',   // medium gray → informational
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