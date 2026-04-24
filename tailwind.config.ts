import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        drc: {
          deep: "#2E3192",
          light: "#299FDA",
        },
        accent: {
          DEFAULT: "#43AA8B",
          dark: "#35866E",
          light: "#E9F5F1",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          400: "#94A3B8",
          600: "#606060",
          900: "#0F172A",
        },
        success: { DEFAULT: "#10B981", light: "#ECFDF5" },
        warning: { DEFAULT: "#F59E0B", light: "#FFFBEB" },
        danger: { DEFAULT: "#EF4444", light: "#FEF2F2" },
        info: { DEFAULT: "#3B82F6", light: "#EFF6FF" },
      },
      fontFamily: {
        heading: ["NEXT ART", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
    },
  },
  plugins: [],
};
export default config;
