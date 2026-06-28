module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        /* base */
        background: "var(--background)",
        foreground: "var(--foreground)",

        /* card */
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        /* popover */
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        /* primary */
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "var(--primary-foreground)",

        /* secondary */
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",

        /* muted */
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        /* accent */
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

        /* destructive */
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",

        /* borders / inputs */
        border: "var(--border)",
        input: "var(--input)",
        "input-background": "var(--input-background)",

        /* UI extras */
        ring: "var(--ring)",
        switch: "var(--switch-background)",

        /* sidebar */
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",

        /* charts */
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },

      fontSize: {
        base: "var(--font-size)",
      },

      fontFamily: {
        sans: ["var(--font-family)"],
      },

      fontWeight: {
        medium: "var(--font-weight-medium)",
        normal: "var(--font-weight-normal)",
      },

      borderRadius: {
        md: "var(--radius)",
      },

      ringColor: {
        DEFAULT: "var(--ring)",
      },
    },
  },
  plugins: [],
};