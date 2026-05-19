import { DefaultTheme } from "styled-components/native";

/** Safe `px` strings for styled CSS (see `cssPx.ts`). */
export { pxFs, pxRad, pxSp } from "./cssPx";

export interface StyledProps {
  theme: DefaultTheme;
}

export interface StyledPropsWithVariant extends StyledProps {
  variant?: "primary" | "secondary" | "outline";
}

export interface StyledPropsWithSize extends StyledProps {
  size?: "small" | "medium" | "large";
}

export interface StyledPropsWithError extends StyledProps {
  hasError?: boolean;
}

export interface StyledPropsWithDisabled extends StyledProps {
  isDisabled?: boolean;
}

export interface StyledPropsWithLoading extends StyledProps {
  loading?: boolean;
}

export interface StyledPropsWithFullWidth extends StyledProps {
  fullWidth?: boolean;
}

export interface StyledPropsWithImage extends StyledProps {
  hasImage?: boolean;
}

// Helper function to ensure type safety when using theme properties
export const getThemeValue = <T extends keyof DefaultTheme>(
  theme: DefaultTheme,
  property: T,
  ...path: string[]
): unknown => {
  let result: any = theme[property];
  for (const key of path) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
};
