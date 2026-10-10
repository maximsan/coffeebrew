import type { FontName } from "./fonts";

export interface Theme {
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
      onAccent: string;
    };
    accent: {
      gold: string;
    };
    functional: {
      water: string;
      success: string;
      error: string;
      warning: string;
      border: string;
      shadow: string;
    };
  };
  typography: {
    fontFamily: {
      display: FontName;
      text: FontName;
      textMedium: FontName;
      mono: FontName;
    };
    fontSize: {
      h1: number;
      h2: number;
      h3: number;
      body: number;
      small: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}
