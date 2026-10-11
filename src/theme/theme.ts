import { Theme } from "./types";

/**
 * Brew-path's design system in two modes: Cupping (light) and Dark Roast (dark).
 * Values come from brew-path's running prototype (`prototype/index.html`),
 * which wins over its app code where the two disagree.
 */
const shared: Omit<Theme, "colors"> = {
  typography: {
    fontFamily: {
      /** Fraunces cut at optical size 24, for headings (19–30px). */
      heading: "Fraunces-24pt",
      /** Fraunces at its default optical size 9, for body and small text. */
      serifText: "Fraunces",
      text: "IBMPlexSans-Regular",
      textMedium: "IBMPlexSans-Medium",
      mono: "IBMPlexMono-Medium",
    },
    fontSize: {
      h1: 30,
      h2: 26,
      h3: 19,
      body: 15,
      small: 13,
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
  overlays: {
    /** Brew-path's modal dim: #0E0A07 at 62%. */
    modalDim: "rgba(14, 10, 7, 0.62)",
    /** Brew-path draws every shadow in black; each component sets its own opacity. */
    shadow: "#000000",
  },
};

/** Brew-path has no third background or text level, so each `tertiary` repeats `secondary`. */
export const lightTheme: Theme = {
  ...shared,
  colors: {
    background: {
      primary: "#F4EFE6",
      secondary: "#EFE8DA",
      tertiary: "#EFE8DA",
      card: "#FBF7EE",
    },
    text: {
      primary: "#1B1614",
      secondary: "#6B5F54",
      tertiary: "#6B5F54",
      disabled: "#D8CFBF",
      inverse: "#FBF7EE",
      onAccent: "#FBF7EE",
    },
    accent: {
      gold: "#A6462F",
    },
    functional: {
      water: "#5C93B8",
      success: "#5F6E55",
      error: "#A8362A",
      warning: "#9A5F1C",
      border: "#D8CFBF",
    },
  },
};

export const darkTheme: Theme = {
  ...shared,
  colors: {
    background: {
      primary: "#1A130E",
      secondary: "#30231A",
      tertiary: "#30231A",
      card: "#251B14",
    },
    text: {
      primary: "#F3E7D2",
      secondary: "#B59E84",
      tertiary: "#B59E84",
      disabled: "#44321E",
      inverse: "#1A130E",
      onAccent: "#1A130E",
    },
    accent: {
      gold: "#E07A4F",
    },
    functional: {
      water: "#7FB4D6",
      success: "#97A285",
      error: "#C75450",
      warning: "#E6A35C",
      border: "#44321E",
    },
  },
};

declare module "styled-components/native" {
  export interface DefaultTheme extends Theme {}
}
