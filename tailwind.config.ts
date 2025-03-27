import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGreen: '#A6FCB0',
        customPurple: '#B5A7F7',
        secondary: '#1E1E1E',
        primary: '#121212',
        customBasewhite: {
          DEFAULT: '#FFFFFF',
          '30': 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
