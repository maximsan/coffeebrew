import type { DefaultTheme } from "styled-components/native";

/**
 * Theme numbers are plain numbers; styled-components/native feeds CSS through
 * css-to-react-native, which expects declarations like `16px`, not `16`.
 * Use these helpers in template literals, e.g. `padding: ${(p) => pxSp(p.theme, "md")};`
 */
export function pxSp(
  theme: DefaultTheme,
  key: keyof DefaultTheme["spacing"],
): string {
  return `${theme.spacing[key]}px`;
}

export function pxFs(
  theme: DefaultTheme,
  key: keyof DefaultTheme["typography"]["fontSize"],
): string {
  return `${theme.typography.fontSize[key]}px`;
}

export function pxRad(
  theme: DefaultTheme,
  key: keyof DefaultTheme["borderRadius"],
): string {
  return `${theme.borderRadius[key]}px`;
}
