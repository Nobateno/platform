const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      screens: {
        "3xl": "1600px",
      },
      colors: {
        m3: {
          primary: "rgb(var(--md-sys-color-primary) / <alpha-value>)",
          "on-primary":
            "rgb(var(--md-sys-color-on-primary) / <alpha-value>)",
          "primary-container":
            "rgb(var(--md-sys-color-primary-container) / <alpha-value>)",
          "on-primary-container":
            "rgb(var(--md-sys-color-on-primary-container) / <alpha-value>)",
          secondary: "rgb(var(--md-sys-color-secondary) / <alpha-value>)",
          "on-secondary":
            "rgb(var(--md-sys-color-on-secondary) / <alpha-value>)",
          "secondary-container":
            "rgb(var(--md-sys-color-secondary-container) / <alpha-value>)",
          "on-secondary-container":
            "rgb(var(--md-sys-color-on-secondary-container) / <alpha-value>)",
          tertiary: "rgb(var(--md-sys-color-tertiary) / <alpha-value>)",
          error: "rgb(var(--md-sys-color-error) / <alpha-value>)",
          "on-error": "rgb(var(--md-sys-color-on-error) / <alpha-value>)",
          "error-container":
            "rgb(var(--md-sys-color-error-container) / <alpha-value>)",
          background: "rgb(var(--md-sys-color-background) / <alpha-value>)",
          "on-background":
            "rgb(var(--md-sys-color-on-background) / <alpha-value>)",
          surface: "rgb(var(--md-sys-color-surface) / <alpha-value>)",
          "on-surface":
            "rgb(var(--md-sys-color-on-surface) / <alpha-value>)",
          "surface-variant":
            "rgb(var(--md-sys-color-surface-variant) / <alpha-value>)",
          "on-surface-variant":
            "rgb(var(--md-sys-color-on-surface-variant) / <alpha-value>)",
          "surface-container-low":
            "rgb(var(--md-sys-color-surface-container-low) / <alpha-value>)",
          "surface-container":
            "rgb(var(--md-sys-color-surface-container) / <alpha-value>)",
          "surface-container-high":
            "rgb(var(--md-sys-color-surface-container-high) / <alpha-value>)",
          "surface-container-highest":
            "rgb(var(--md-sys-color-surface-container-highest) / <alpha-value>)",
          outline: "rgb(var(--md-sys-color-outline) / <alpha-value>)",
          "outline-variant":
            "rgb(var(--md-sys-color-outline-variant) / <alpha-value>)",
          success: "rgb(var(--md-sys-color-success) / <alpha-value>)",
          warning: "rgb(var(--md-sys-color-warning) / <alpha-value>)",
          info: "rgb(var(--md-sys-color-info) / <alpha-value>)",
        },
        theme: {
          1: "rgb(var(--color-theme-1) / <alpha-value>)",
          2: "rgb(var(--color-theme-2) / <alpha-value>)",
        },
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        pending: "rgb(var(--color-pending) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        dark: "rgb(var(--color-dark) / <alpha-value>)",
        darkmode: {
          50: "rgb(var(--color-darkmode-50) / <alpha-value>)",
          100: "rgb(var(--color-darkmode-100) / <alpha-value>)",
          200: "rgb(var(--color-darkmode-200) / <alpha-value>)",
          300: "rgb(var(--color-darkmode-300) / <alpha-value>)",
          400: "rgb(var(--color-darkmode-400) / <alpha-value>)",
          500: "rgb(var(--color-darkmode-500) / <alpha-value>)",
          600: "rgb(var(--color-darkmode-600) / <alpha-value>)",
          700: "rgb(var(--color-darkmode-700) / <alpha-value>)",
          800: "rgb(var(--color-darkmode-800) / <alpha-value>)",
          900: "rgb(var(--color-darkmode-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        "public-sans": ["Public Sans", "system-ui", "sans-serif"],
        "dm-sans": ["DM Sans"],
        "vazirmatn": ["Vazirmatn"],
        "vazirmatn-fd": ["Vazirmatn FD"],
        dana: ["Dana", "Tahoma", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        "m3-xs": "4px",
        "m3-sm": "8px",
        "m3-md": "12px",
        "m3-lg": "16px",
        "m3-xl": "28px",
      },
      boxShadow: {
        "m3-1": "0 1px 2px rgb(var(--md-sys-color-shadow) / 0.3), 0 1px 3px 1px rgb(var(--md-sys-color-shadow) / 0.15)",
        "m3-2": "0 1px 2px rgb(var(--md-sys-color-shadow) / 0.3), 0 2px 6px 2px rgb(var(--md-sys-color-shadow) / 0.15)",
        "m3-3": "0 1px 3px rgb(var(--md-sys-color-shadow) / 0.3), 0 4px 8px 3px rgb(var(--md-sys-color-shadow) / 0.15)",
      },
      backgroundImage: {
        "texture-black":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2346.899' height='1200.894' viewBox='0 0 2346.899 1200.894'%3E%3Cg id='Group_369' data-name='Group 369' transform='translate(-33.74 508.575)'%3E%3Cg id='Group_366' data-name='Group 366' transform='translate(33.74 -458.541)'%3E%3Crect id='Rectangle_492' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3Cg id='Group_367' data-name='Group 367' transform='translate(1647.456 1026.688) rotate(-128)'%3E%3Crect id='Rectangle_492-2' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491-2' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3Cg id='Group_368' data-name='Group 368' transform='matrix(-0.656, -0.755, 0.755, -0.656, 1017.824, 1042.94)'%3E%3Crect id='Rectangle_492-3' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491-3' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\")",
        "texture-white":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2346.899' height='1200.894' viewBox='0 0 2346.899 1200.894'%3E%3Cg id='Group_369' data-name='Group 369' transform='translate(-33.74 508.575)'%3E%3Cg id='Group_366' data-name='Group 366' transform='translate(33.74 -458.541)'%3E%3Crect id='Rectangle_492' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.014)'/%3E%3Crect id='Rectangle_491' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.014)'/%3E%3C/g%3E%3Cg id='Group_367' data-name='Group 367' transform='translate(1647.456 1026.688) rotate(-128)'%3E%3Crect id='Rectangle_492-2' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.014)'/%3E%3Crect id='Rectangle_491-2' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.014)'/%3E%3C/g%3E%3Cg id='Group_368' data-name='Group 368' transform='matrix(-0.656, -0.755, 0.755, -0.656, 1017.824, 1042.94)'%3E%3Crect id='Rectangle_492-3' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.014)'/%3E%3Crect id='Rectangle_491-3' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.014)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\")",
        "chevron-white":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff95' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        "chevron-black":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300000095' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addBase }) {
      addBase({
        // Default colors
        ":root": {
          "--md-sys-color-primary": "83 101 216",
          "--md-sys-color-on-primary": "255 255 255",
          "--md-sys-color-primary-container": "222 225 255",
          "--md-sys-color-on-primary-container": "17 25 76",
          "--md-sys-color-secondary": "93 96 117",
          "--md-sys-color-on-secondary": "255 255 255",
          "--md-sys-color-secondary-container": "225 226 249",
          "--md-sys-color-on-secondary-container": "26 28 48",
          "--md-sys-color-tertiary": "109 91 127",
          "--md-sys-color-error": "186 26 26",
          "--md-sys-color-on-error": "255 255 255",
          "--md-sys-color-error-container": "255 218 214",
          "--md-sys-color-background": "248 248 255",
          "--md-sys-color-on-background": "21 23 36",
          "--md-sys-color-surface": "255 255 255",
          "--md-sys-color-on-surface": "21 23 36",
          "--md-sys-color-surface-variant": "228 230 242",
          "--md-sys-color-on-surface-variant": "103 106 125",
          "--md-sys-color-surface-container-low": "246 247 255",
          "--md-sys-color-surface-container": "240 241 250",
          "--md-sys-color-surface-container-high": "234 234 246",
          "--md-sys-color-surface-container-highest": "228 230 242",
          "--md-sys-color-outline": "196 197 211",
          "--md-sys-color-outline-variant": "224 225 236",
          "--md-sys-color-shadow": "0 0 0",
          "--md-sys-color-success": "31 122 95",
          "--md-sys-color-warning": "138 90 0",
          "--md-sys-color-info": "37 109 171",
          "--color-theme-1": "59 71 144",
          "--color-theme-2": "69 70 93",
          "--color-primary": "83 101 216",
          "--color-secondary": "225 226 249",
          "--color-success": "31 122 95",
          "--color-info": "37 109 171",
          "--color-warning": "138 90 0",
          "--color-pending": "138 90 0",
          "--color-danger": "186 26 26",
          "--color-light": "240 241 250",
          "--color-dark": "42 43 55",
        },
        // Default dark-mode colors
        ".dark": {
          "--md-sys-color-primary": "190 194 255",
          "--md-sys-color-on-primary": "34 42 115",
          "--md-sys-color-primary-container": "59 71 144",
          "--md-sys-color-on-primary-container": "222 225 255",
          "--md-sys-color-secondary": "197 198 221",
          "--md-sys-color-on-secondary": "47 48 70",
          "--md-sys-color-secondary-container": "69 70 93",
          "--md-sys-color-on-secondary-container": "225 226 249",
          "--md-sys-color-tertiary": "218 189 240",
          "--md-sys-color-error": "255 180 171",
          "--md-sys-color-on-error": "105 0 5",
          "--md-sys-color-error-container": "147 0 10",
          "--md-sys-color-background": "16 17 27",
          "--md-sys-color-on-background": "229 230 242",
          "--md-sys-color-surface": "21 22 32",
          "--md-sys-color-on-surface": "229 230 242",
          "--md-sys-color-surface-variant": "77 78 96",
          "--md-sys-color-on-surface-variant": "183 184 201",
          "--md-sys-color-surface-container-low": "26 27 38",
          "--md-sys-color-surface-container": "31 32 43",
          "--md-sys-color-surface-container-high": "42 43 55",
          "--md-sys-color-surface-container-highest": "52 53 66",
          "--md-sys-color-outline": "77 78 96",
          "--md-sys-color-outline-variant": "56 58 74",
          "--md-sys-color-success": "135 216 185",
          "--md-sys-color-warning": "255 203 112",
          "--md-sys-color-info": "155 203 255",
          "--color-primary": "190 194 255",
          "--color-secondary": "69 70 93",
          "--color-success": "135 216 185",
          "--color-info": "155 203 255",
          "--color-warning": "255 203 112",
          "--color-pending": "255 203 112",
          "--color-danger": "255 180 171",
          "--color-light": "31 32 43",
          "--color-dark": "229 230 242",
          "--color-darkmode-50": "77 78 96",
          "--color-darkmode-100": "69 70 85",
          "--color-darkmode-200": "61 62 78",
          "--color-darkmode-300": "52 53 66",
          "--color-darkmode-400": "47 48 61",
          "--color-darkmode-500": "42 43 55",
          "--color-darkmode-600": "31 32 43",
          "--color-darkmode-700": "26 27 38",
          "--color-darkmode-800": "21 22 32",
          "--color-darkmode-900": "16 17 27",
        },
      });
    }),
  ],
};
