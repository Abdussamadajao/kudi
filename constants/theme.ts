import { Platform } from "react-native";

export type ColorScheme = "light" | "dark";

/** Shared KeyboardAvoidingView defaults (see app.json softwareKeyboardLayoutMode on Android). */
export const keyboardAvoiding = {
  behavior: Platform.select<"padding" | "height" | undefined>({
    ios: "padding",
    default: undefined,
  }),
  defaultVerticalOffset: 0,
} as const;

export type Scale = {
  [key: number]: string;
};

export interface ThemePalette {
  // --- Brand ---
  primary: string;
  primaryGradient: readonly [string, string];
  secondary: string;

  // --- Semantic States ---
  income: string;
  expense: string;
  warning: string;
  danger: string;

  // --- Surface Hierarchy (The Emerald Vault Layering) ---
  surface: string; // Level 0 — foundational canvas
  surfaceContainerLowest: string; // Input field backgrounds
  surfaceContainerLow: string; // Level 1 — section separation
  surfaceContainer: string; // Level 1.5 — general containers
  surfaceVariant: string; // Level 2 — cards / modules
  surfaceContainerHigh: string; // Level 2.5 — focused/active inputs
  surfaceContainerHighest: string; // Level 3 — elevated cards
  surfaceBright: string; // Level 3 — floating / active
  surfaceTint: string; // Glass overlay tint (use at 5–10% opacity)

  // --- Legacy aliases (kept for backward compat) ---
  background: string; // → surface
  cardBackground: string; // → surfaceVariant
  elevatedCard?: string; // → surfaceBright

  // --- Outline / Border ---
  border: string; // Ghost border base (use at ≤20% opacity)
  outlineVariant: string; // #3c4a42 — ghost border token

  // --- Text / On-Surface ---
  onSurface: string; // Primary text (no pure white)
  onSurfaceVariant: string; // Secondary text (green-tinted)
  textPrimary: string; // → onSurface
  textSecondary: string; // → onSurfaceVariant
  onPrimary: string; // Text on primary buttons
  onSecondaryContainer: string; // Text on secondary buttons

  // --- Icons ---
  icons: string;

  // --- Chart ---
  chart: {
    incomeBar: string;
    expenseBar: string;
  };

  // --- Scale tokens (kept as-is) ---
  slate: Scale;
  gray: Scale;
}

export const colors: Record<ColorScheme, ThemePalette> = {
  light: {
    // Brand
    primary: "#10B981",
    primaryGradient: ["#10B981", "#059669"],
    secondary: "#bcc7de",

    // Semantic
    income: "#22C55E",
    expense: "#EF4444",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Surface hierarchy — light mode uses bright equivalents
    surface: "#F5F7FA",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#EFF2F6",
    surfaceContainer: "#E8ECF2",
    surfaceVariant: "#DDE3ED",
    surfaceContainerHigh: "#D2DAE6",
    surfaceContainerHighest: "#C7D0DF",
    surfaceBright: "#FFFFFF",
    surfaceTint: "#10B981",

    // Legacy aliases
    background: "#F5F7FA",
    cardBackground: "#FFFFFF",

    // Outline
    border: "#E2E8F0",
    outlineVariant: "#C8D4CC",

    // Text
    onSurface: "#0F172A",
    onSurfaceVariant: "#475569",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    onPrimary: "#FFFFFF",
    onSecondaryContainer: "#0F172A",

    // Icons
    icons: "#64748B",

    // Chart
    chart: {
      incomeBar: "#22C55E",
      expenseBar: "#CBD5F5",
    },

    slate: {
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    gray: {
      100: "#f8fafc",
      200: "#f1f5f9",
      300: "#e2e8f0",
      400: "#cbd5e1",
      500: "#94a3b8",
      600: "#64748b",
      700: "#475569",
      800: "#334155",
      900: "#0f172a",
    },
  },

  dark: {
    // Brand — "The Glow"
    primary: "#4edea3",
    primaryGradient: ["#10B981", "#059669"],
    secondary: "#bcc7de",

    // Semantic
    income: "#4ADE80",
    expense: "#F87171",
    warning: "#F59E0B",
    danger: "#F87171",

    // Surface hierarchy — The Emerald Vault layers
    surface: "#0c1324",
    surfaceContainerLowest: "#080e1a",
    surfaceContainerLow: "#151b2d",
    surfaceContainer: "#1a2236",
    surfaceVariant: "#2e3447",
    surfaceContainerHigh: "#353c50",
    surfaceContainerHighest: "#3c4459",
    surfaceBright: "#33394c",
    surfaceTint: "#10B981",

    // Legacy aliases
    background: "#0c1324",
    cardBackground: "#2e3447",
    elevatedCard: "#33394c",

    // Outline — Ghost Border token
    border: "#3c4a42", // Use at ≤20% opacity per spec
    outlineVariant: "#3c4a42",

    // Text — no pure white, green-tinted neutrals
    onSurface: "#dce1fb", // Primary text
    onSurfaceVariant: "#bbcabf", // Secondary text — green-tinted
    textPrimary: "#dce1fb",
    textSecondary: "#bbcabf",
    onPrimary: "#0c1324", // Dark text on bright primary buttons
    onSecondaryContainer: "#dce1fb",

    // Icons
    icons: "#bbcabf",

    // Chart
    chart: {
      incomeBar: "#4ADE80",
      expenseBar: "#F87171",
    },

    slate: {
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    gray: {
      100: "#f8fafc",
      200: "#f1f5f9",
      300: "#e2e8f0",
      400: "#cbd5e1",
      500: "#94a3b8",
      600: "#64748b",
      700: "#475569",
      800: "#334155",
      900: "#0f172a",
    },
  },
};

export const border = {
  borderRadius: {
    DEFAULT: 8, // base
    lg: 16, // nested card items
    xl: 24, // main containers — spec: 1.5rem
    full: 999, // pill buttons
  },
} as const;

export const fonts = {
  Manrope: {
    ExtraLight: "Manrope-ExtraLight",
    Light: "Manrope-Light",
    Regular: "Manrope-Regular",
    Medium: "Manrope-Medium",
    SemiBold: "Manrope-SemiBold",
    Bold: "Manrope-Bold",
    ExtraBold: "Manrope-ExtraBold",
  },
  Inter: {
    Light: "Inter-Light",
    Regular: "Inter-Regular",
    Medium: "Inter-Medium",
    SemiBold: "Inter-SemiBold",
    Bold: "Inter-Bold",
  },
} as const;

// --- Typography scale mapped to spec roles ---
// Display (Manrope Bold): account balances, "Big Wins"
// Headline (Manrope Bold): screen titles
// Body / Label (Inter): financial figures, metadata
export const fontSize = {
  xs: 12, // label-sm  — metadata
  sm: 14, // label-md  — 0.75rem equivalent
  md: 16, // body-lg   — primary data (Inter)
  lg: 18,
  xl: 20, // title-md  — input text
  "2xl": 24,
  "3xl": 28,
  "4xl": 32, // headline-lg — screen titles (2rem)
  "5xl": 36,
  "6xl": 40,
  "7xl": 44, // display-md  — ~2.75rem
  "8xl": 48,
  "9xl": 52,
  "10xl": 56, // display-lg — ~3.5rem, balances
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24, // internal card element separation (spec: Spacing 6)
  8: 32,
  10: 40, // minimum clear space around display-lg balances
  12: 48,
  16: 64, // editorial top-margin for headlines
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
  72: 288,
  80: 320,
  88: 352,
  96: 384,
  104: 416,
} as const;

export const elevation = {
  // Ambient Glow — use instead of system shadows
  // box-shadow: 0 0 {blur}px {spread}px rgba(16,185,129,0.08)
  glow: {
    color: "rgba(16, 185, 129, 0.08)", // primary at 8% opacity
    blurMin: 40,
    blurMax: 60,
    spread: -5,
  },
} as const;

export const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvwwnvvx0jNPrD5keawPt_qipFpkx7loar5aGtGjLJWyQDZgEffNnnRJ0kcHDJQC-fu8enjp2M912JarWfX1LWWA8kUwjNpR0kPWwa4Vi7kX0kJMExVb1h1yhQ5qIwmNQJJGGfQzfVz8ot8vVfjuMdvMuf8HtmSxNQW7WXQgqVqaXIedKtAkeI7YkFebUN4teRom9GhaW7YFaVzOI9hgmTIYt168Rhsur0DxHmlYP5mkAuCu1kRXAsHFU_hAY_lXSlaHEn6CyVdQ6N";
