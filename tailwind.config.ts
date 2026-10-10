import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#176B45",
          deep: "#104B35",
          accent: "#72B85A",
          light: "#EAF5EE",
          surface: "#FFFFFF",
          warmBg: "#F7F8F2",
          border: "#E4E8E1",
          textPrimary: "#1F2933",
          textSecondary: "#667085",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Noto Sans Telugu",
          "sans-serif",
        ],
        telugu: ["Noto Sans Telugu", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px -1px rgba(23, 107, 69, 0.06), 0 2px 4px -2px rgba(23, 107, 69, 0.04)",
        elevated: "0 10px 15px -3px rgba(23, 107, 69, 0.08), 0 4px 6px -4px rgba(23, 107, 69, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
