/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-background": "#e4e2e4",
        "on-secondary": "#263143",
        "on-surface-variant": "#c6c6cd",
        "secondary-fixed-dim": "#bcc7de",
        "surface-container": "#1f1f21",
        "primary-container": "#0f172a",
        "surface-container-high": "#2a2a2b",
        "on-tertiary-container": "#957d5a",
        "secondary-container": "#3e495d",
        "surface": "#131315",
        "surface-container-low": "#1b1b1d",
        "inverse-on-surface": "#303032",
        "surface-variant": "#353436",
        "on-primary-container": "#798098",
        "tertiary-fixed": "#fcdeb5",
        "surface-bright": "#39393b",
        "on-tertiary-fixed-variant": "#574425",
        "outline-variant": "#45464d",
        "inverse-surface": "#e4e2e4",
        "surface-tint": "#bec6e0",
        "on-primary-fixed": "#131b2e",
        "background": "#131315",
        "tertiary-container": "#231500",
        "on-secondary-container": "#aeb9d0",
        "secondary-fixed": "#d8e3fb",
        "on-tertiary": "#3e2d11",
        "on-secondary-fixed-variant": "#3c475a",
        "on-error-container": "#ffdad6",
        "secondary": "#bcc7de",
        "inverse-primary": "#565e74",
        "primary-fixed": "#dae2fd",
        "on-secondary-fixed": "#111c2d",
        "on-primary-fixed-variant": "#3f465c",
        "primary": "#bec6e0",
        "surface-dim": "#131315",
        "outline": "#909097",
        "on-primary": "#283044",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "primary-fixed-dim": "#bec6e0",
        "tertiary-fixed-dim": "#dec29a",
        "surface-container-highest": "#353436",
        "surface-container-lowest": "#0e0e10",
        "on-surface": "#e4e2e4",
        "tertiary": "#dec29a",
        "on-tertiary-fixed": "#271901",
        "on-error": "#690005"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "gutter": "12px",
        "density-scale": "compact",
        "container-padding": "16px",
        "component-gap": "8px",
        "unit": "4px"
      },
      "fontFamily": {
        "label-caps": ["Inter"],
        "data-tabular": ["JetBrains Mono"],
        "body-fixed": ["JetBrains Mono"],
        "display-md": ["Inter"],
        "body-ui": ["Inter"],
        "display-lg": ["Inter"]
      },
      "fontSize": {
        "label-caps": ["11px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700" }],
        "data-tabular": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "body-fixed": ["13px", { "lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-ui": ["14px", { "lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
