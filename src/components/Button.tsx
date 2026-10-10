import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  type AccessibilityRole,
} from "react-native";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import {
  StyledPropsWithVariant,
  StyledPropsWithSize,
  StyledPropsWithFullWidth,
} from "../theme/styled-components";

const MIN_TAP_HEIGHT = 44;

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  /** Defaults to `title` — set for clearer VoiceOver text. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

interface StyledButtonProps
  extends
    StyledPropsWithVariant,
    StyledPropsWithSize,
    StyledPropsWithFullWidth {
  disabled?: boolean;
}

const StyledButton = styled(TouchableOpacity)<StyledButtonProps>`
  background-color: ${({
    theme,
    variant,
  }: {
    theme: DefaultTheme;
    variant?: string;
  }) =>
    variant === "outline"
      ? "transparent"
      : variant === "secondary"
        ? theme.colors.background.tertiary
        : theme.colors.accent.gold};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  align-items: center;
  justify-content: center;
  width: ${({ fullWidth }: { fullWidth?: boolean }) =>
    fullWidth ? "100%" : "auto"};
  border-width: ${({ variant }: { variant?: string }) =>
    variant === "outline" ? 1 : 0}px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
`;

const ButtonText = styled(Text)<StyledPropsWithVariant>`
  color: ${({ theme, variant }: { theme: DefaultTheme; variant?: string }) =>
    variant === "outline"
      ? theme.colors.accent.gold
      : variant === "secondary"
        ? theme.colors.text.primary
        : theme.colors.text.onAccent};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.textMedium};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
}) => {
  const theme = useTheme();
  const spinnerColor =
    variant === "outline"
      ? theme.colors.accent.gold
      : variant === "secondary"
        ? theme.colors.text.primary
        : theme.colors.text.onAccent;

  const a11yLabel =
    accessibilityLabel ?? (loading ? `${title}, loading` : title);

  return (
    <StyledButton
      onPress={onPress}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      style={[{ minHeight: MIN_TAP_HEIGHT }, style]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={a11yLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={spinnerColor}
          accessibilityLabel={`Loading: ${title}`}
        />
      ) : (
        <ButtonText variant={variant} maxFontSizeMultiplier={1.35}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};
