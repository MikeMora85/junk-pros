import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-green": "hsl(var(--brand-green))",
        "deep-forest": "hsl(var(--deep-forest))",
        "sage-green": "hsl(var(--sage-green))",
        "yellow-highlight": "hsl(var(--yellow-highlight))",
        "trust-blue": "hsl(var(--trust-blue))",
        "rating-gold": "hsl(var(--rating-gold))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
