// Modernist design tokens, ported from the Claude Design handoff
// (_ds/modernist-.../styles.css). Keep in sync by hand — there is no CSS
// build step in React Native, so this file IS the source of truth here.

export const color = {
  bg: "#f3f2f2",
  surface: "#eae9e9",
  text: "#201e1d",
  accent: "#ec3013",
  divider: "rgba(32, 30, 29, 0.4)",

  neutral100: "#f8f4f4",
  neutral200: "#eae7e7",
  neutral300: "#d7d3d3",
  neutral400: "#bab6b6",
  neutral500: "#9b9797",
  neutral600: "#7d7979",
  neutral700: "#605d5d",
  neutral800: "#444141",
  neutral900: "#2d2b2b",

  accent100: "#fff2ef",
  accent200: "#ffe0d9",
  accent300: "#ffc4b8",
  accent400: "#ff9783",
  accent500: "#ff563c",
  accent600: "#dd2b0f",
  accent700: "#ae1800",
  accent800: "#7c1405",
  accent900: "#4d170e",
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
} as const;

// --radius-* are 0 in Modernist by design — flat, architectural, no rounded
// corners anywhere in the UI chrome. Widget/system-chrome exceptions (iOS
// widget corner radius, share-sheet handle) are noted where used.
export const radius = { none: 0 } as const;

export const fontFamily = {
  // Loaded via @expo-google-fonts/archivo + @expo-google-fonts/kalam in App.tsx.
  headingRegular: "Archivo_600SemiBold",
  headingBold: "Archivo_800ExtraBold",
  body: "Archivo_400Regular",
  bodyMedium: "Archivo_600SemiBold",
  quote: "Kalam_700Bold",
} as const;

export const fontSizeScale = {
  S: 0.88,
  M: 1,
  L: 1.16,
} as const;

export type FontSizeKey = keyof typeof fontSizeScale;

export const shadow = {
  sm: {
    shadowColor: color.neutral900,
    shadowOpacity: 0.14,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: color.neutral900,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
} as const;
