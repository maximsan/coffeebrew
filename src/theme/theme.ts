import { Platform } from "react-native";
import { Theme } from "./types";

/** Warm parchment surfaces, terracotta accent, sage utilities — editorial serif headings. */
export const theme: Theme = {
  colors: {
    background: {
      primary: "#FAF6EF",
      secondary: "#F3EDE3",
      tertiary: "#EBE4D8",
      card: "#FFFCF8",
    },
    text: {
      primary: "#3D342B",
      secondary: "#6B5E54",
      tertiary: "#9A8B7E",
      disabled: "#C4B8AD",
      inverse: "#FFFBF7",
      onAccent: "#FFFBF7",
    },
    accent: {
      gold: "#C25730",
      goldLight: "#E8B596",
      goldDark: "#8B3D22",
    },
    functional: {
      water: "#5C7A6B",
      success: "#6B8E5E",
      error: "#C45C4A",
      warning: "#D9A441",
      border: "#E8DED0",
    },
  },
  typography: {
    fontFamily: {
      display:
        Platform.select({
          ios: "Georgia",
          android: "serif",
          default: "serif",
        }) ?? "serif",
      text:
        Platform.select({
          ios: "System",
          android: "sans-serif",
          default: "sans-serif",
        }) ?? "sans-serif",
      mono:
        Platform.select({
          ios: "Menlo",
          android: "monospace",
          default: "monospace",
        }) ?? "monospace",
    },
    fontSize: {
      h1: 32,
      h2: 24,
      h3: 20,
      body: 16,
      small: 14,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 20,
  },
  shadows: {
    small: "0 2px 8px rgba(61, 52, 43, 0.08)",
    medium: "0 4px 16px rgba(61, 52, 43, 0.1)",
    large: "0 8px 24px rgba(61, 52, 43, 0.12)",
  },
};

declare module "styled-components/native" {
  export interface DefaultTheme extends Theme {}
}
