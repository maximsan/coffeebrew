// Postponed past v1 — only non-v1 screens use this; see docs/v2_backlog.md
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import { StyledProps } from "../theme/styled-components";

interface LogoProps {
  size?: number;
  color?: string;
}

interface StyledLogoProps extends StyledProps {
  size: number;
  theme: DefaultTheme;
}

const LogoContainer = styled(View)<StyledLogoProps>`
  width: ${({ size }: StyledLogoProps) => size}px;
  height: ${({ size }: StyledLogoProps) => size}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: StyledLogoProps) =>
    theme.colors.background.card};
  border-radius: ${({ size }: StyledLogoProps) => size / 2}px;
  border-width: 2px;
  border-color: ${({ theme }: StyledLogoProps) => theme.colors.accent.gold};
`;

const LogoText = styled(Text)<StyledLogoProps>`
  font-family: ${({ theme }: StyledLogoProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ size }: StyledLogoProps) => size * 0.4}px;
  color: ${({ theme }: StyledLogoProps) => theme.colors.accent.gold};
  font-weight: bold;
`;

export const Logo: React.FC<LogoProps> = ({ size = 120, color }) => {
  const theme = useTheme();
  const iconColor = color ?? theme.colors.accent.gold;
  return (
    <LogoContainer size={size}>
      <Ionicons name="cafe" size={size * 0.6} color={iconColor} />
      <LogoText size={size}>Coffee</LogoText>
    </LogoContainer>
  );
};
