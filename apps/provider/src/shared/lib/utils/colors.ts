const staticColors = {
  white: "255 255 255",
  "slate.50": "248 250 252",
  "slate.200": "226 232 240",
  "slate.300": "203 213 225",
  "slate.400": "148 163 184",
  "slate.500": "100 116 139",
} as const;

const cssVariableColors = {
  "theme.1": "--color-theme-1",
  "theme.2": "--color-theme-2",
  primary: "--color-primary",
  secondary: "--color-secondary",
  success: "--color-success",
  info: "--color-info",
  warning: "--color-warning",
  pending: "--color-pending",
  danger: "--color-danger",
  light: "--color-light",
  dark: "--color-dark",
  "darkmode.50": "--color-darkmode-50",
  "darkmode.100": "--color-darkmode-100",
  "darkmode.200": "--color-darkmode-200",
  "darkmode.300": "--color-darkmode-300",
  "darkmode.400": "--color-darkmode-400",
  "darkmode.500": "--color-darkmode-500",
  "darkmode.600": "--color-darkmode-600",
  "darkmode.700": "--color-darkmode-700",
  "darkmode.800": "--color-darkmode-800",
  "darkmode.900": "--color-darkmode-900",
} as const;

type StaticColorKey = keyof typeof staticColors;
type CssVariableColorKey = keyof typeof cssVariableColors;

export type ColorKey = StaticColorKey | CssVariableColorKey;

const defaultCssVariableColors: Record<CssVariableColorKey, string> = {
  "theme.1": "15 23 42",
  "theme.2": "30 41 59",
  primary: "15 23 42",
  secondary: "226 232 240",
  success: "13 148 136",
  info: "8 145 178",
  warning: "202 138 4",
  pending: "194 65 12",
  danger: "185 28 28",
  light: "241 245 249",
  dark: "30 41 59",
  "darkmode.50": "87 103 132",
  "darkmode.100": "74 90 121",
  "darkmode.200": "65 81 114",
  "darkmode.300": "53 69 103",
  "darkmode.400": "48 61 93",
  "darkmode.500": "41 53 82",
  "darkmode.600": "40 51 78",
  "darkmode.700": "35 45 69",
  "darkmode.800": "27 37 59",
  "darkmode.900": "15 23 42",
};

let cachedRootClassName: string | null = null;
let cachedCssVariableColors: Partial<
  Record<CssVariableColorKey, string>
> = {};

const resolveCssVariableColor = (colorKey: CssVariableColorKey) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return defaultCssVariableColors[colorKey];
  }

  const root = document.documentElement;
  const rootClassName = root.getAttribute("class") ?? "";

  if (rootClassName !== cachedRootClassName) {
    const computedStyles = window.getComputedStyle(root);
    const resolvedColors: Partial<Record<CssVariableColorKey, string>> = {};

    for (const [key, variableName] of Object.entries(cssVariableColors) as Array<
      [CssVariableColorKey, string]
    >) {
      resolvedColors[key] =
        computedStyles.getPropertyValue(variableName).trim() ||
        defaultCssVariableColors[key];
    }

    cachedRootClassName = rootClassName;
    cachedCssVariableColors = resolvedColors;
  }

  return cachedCssVariableColors[colorKey] ?? defaultCssVariableColors[colorKey];
};

/** Resolve an exact design token to the RGB format expected by Chart.js. */
const getColor = (colorKey: ColorKey, opacity = 1) => {
  const rgb =
    colorKey in staticColors
      ? staticColors[colorKey as StaticColorKey]
      : resolveCssVariableColor(colorKey as CssVariableColorKey);

  return `rgb(${rgb} / ${opacity})`;
};

export { getColor };
