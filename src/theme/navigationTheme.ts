import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  type Theme as NavigationTheme,
} from "@react-navigation/native";
import { darkTheme, lightTheme } from "./theme";
import type { Theme } from "./types";

/** React Navigation paints screens, headers and the tab bar from its own theme. */
const toNavigationTheme = (
  theme: Theme,
  base: NavigationTheme,
): NavigationTheme => {
  const { text, textMedium } = theme.typography.fontFamily;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.accent.gold,
      background: theme.colors.background.primary,
      card: theme.colors.background.secondary,
      text: theme.colors.text.primary,
      border: theme.colors.functional.border,
      notification: theme.colors.functional.error,
    },
    /** Each weight is its own font file, so `fontWeight` stays normal to stop iOS faking a bolder one. */
    fonts: {
      regular: { fontFamily: text, fontWeight: "normal" },
      medium: { fontFamily: textMedium, fontWeight: "normal" },
      bold: { fontFamily: textMedium, fontWeight: "normal" },
      heavy: { fontFamily: textMedium, fontWeight: "normal" },
    },
  };
};

export const navigationThemes = {
  light: toNavigationTheme(lightTheme, NavigationLightTheme),
  dark: toNavigationTheme(darkTheme, NavigationDarkTheme),
};
