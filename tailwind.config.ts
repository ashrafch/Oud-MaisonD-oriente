import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171412',
        oud: '#741d12',
        saffron: '#c99b45',
        cream: '#fbf5ec',
        mist: '#f4efe6',
        bark: '#4e3427',
        sage: '#78866b'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 24px 70px rgba(23, 20, 18, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
