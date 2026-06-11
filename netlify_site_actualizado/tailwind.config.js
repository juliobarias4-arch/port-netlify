/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // shadcn semantic tokens driven by CSS variables (light/dark via .dark)
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // surfaces
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-sunken": "var(--surface-sunken)",
        // sidebar
        sidebar: "var(--sidebar)",
        "sidebar-hover": "var(--sidebar-hover)",
        "sidebar-active": "var(--sidebar-active)",
        "sidebar-icon": "var(--sidebar-icon)",
        // status families (theme-aware via vars)
        success: {
          DEFAULT: "var(--success-500)",
          50: "var(--success-50)",
          100: "var(--success-100)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
        },
        danger: {
          DEFAULT: "var(--danger-500)",
          50: "var(--danger-50)",
          100: "var(--danger-100)",
          500: "var(--danger-500)",
          600: "var(--danger-600)",
          700: "var(--danger-700)",
        },
        warning: {
          DEFAULT: "var(--warning-500)",
          50: "var(--warning-50)",
          100: "var(--warning-100)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
          700: "var(--warning-700)",
        },
        info: {
          DEFAULT: "var(--info-500)",
          50: "var(--info-50)",
          500: "var(--info-500)",
          600: "var(--info-600)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h1: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-medium": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        small: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        micro: ["11px", { lineHeight: "14px", fontWeight: "600" }],
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,78,.06)",
        "card-hover": "0 4px 12px rgba(15,23,78,.08)",
      },
      keyframes: {
        "view-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        shake: {
          "10%, 90%": { transform: "translateX(-1px)" },
          "20%, 80%": { transform: "translateX(2px)" },
          "30%, 50%, 70%": { transform: "translateX(-4px)" },
          "40%, 60%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "view-in": "view-in 220ms ease-out",
        shimmer: "shimmer 1.4s infinite",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
