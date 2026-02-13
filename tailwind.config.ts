import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // HEEN∧ Phase Colors
        phase: {
          1: "#A78BFA", // Awareness - Purple
          2: "#6366F1", // Discipline - Indigo
          3: "#14B8A6", // Momentum - Teal
          4: "#EC4899", // Mastery - Pink
          5: "#F59E0B", // Ascension - Amber (with Teal gradient)
        },
        // Path Colors
        path: {
          focus: "#6366F1",    // Indigo
          health: "#EF4444",   // Red
          knowledge: "#14B8A6", // Teal
          creativity: "#EC4899", // Pink
        },
        // Status Colors
        success: "#10B981",
        warning: "#F97316",
        danger: "#EF4444",
        // UI Utilities
        xp: "hsl(var(--xp-bar))",
        "xp-bg": "hsl(var(--xp-bar-bg))",
        "surface-hover": "hsl(var(--surface-hover))",
        "surface-active": "hsl(var(--surface-active))",
        "phase-text": "hsl(var(--phase-text))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "xp-fill": {
          from: { width: "0%" },
          to: { width: "var(--xp-width)" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        // HEEN∧ Custom Animations
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "particle-float": {
          "0%": { transform: "translateY(0px) translateX(0px)", opacity: "1" },
          "100%": { transform: "translateY(-30px) translateX(10px)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
        },
        "peak-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "grain": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100px 100px" },
        },
        "level-up": {
          "0%": { transform: "scale(0.8) rotate(-10deg)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "streak-flame": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "xp-fill": "xp-fill 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "subtle-pulse": "subtle-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "particle-float": "particle-float 1s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "peak-bounce": "peak-bounce 1s ease-in-out infinite",
        grain: "grain 8s linear infinite",
        "level-up": "level-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "streak-flame": "streak-flame 0.8s ease-in-out infinite",
      },
      backgroundImage: {
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        "grain-pattern": "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /></filter><rect width=\"100\" height=\"100\" fill=\"%23000\" filter=\"url(%23noise)\" opacity=\"0.03\"/></svg>')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
