/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        grave: {
          night: '#1A1423',
          earth: '#2D2420',
          stone: '#3E3633',
          bone: '#F4F1DE',
          ash: '#B5B0A3',
          etch: '#6B6560',
          ghost: '#57CC99',
          blood: '#E07A5F',
          candle: '#F2CC8F',
        },
        cause: {
          burnout: '#E63946',
          'no-pmf': '#6A994E',
          'too-early': '#457B9D',
          execution: '#E9C46A',
          competition: '#9B5DE5',
          regulation: '#F4A261',
          'acquired-killed': '#BC6C25',
          'pivot-failed': '#6C757D',
          'hype-crash': '#FF006E',
          unknown: '#ADB5BD',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"Pixelify Sans"', 'cursive'],
        sans: ['Inter', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
      },
      animation: {
        'tomb-shake': 'tombShake 0.4s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        tombShake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
