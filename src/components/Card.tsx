import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  type ImageSourcePropType,
} from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { StyledProps } from "../theme/styled-components";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  /** Bundled `require()` or `{ uri }` for remote / file URIs */
  imageSource?: ImageSourcePropType;
  style?: ViewStyle;
}

const CardContainer = styled(TouchableOpacity)<StyledProps>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
  shadow-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.overlays.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 3;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  overflow: hidden;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const CardImage = styled(Image)<StyledProps>`
  width: 100%;
  height: 200px;
`;

const CardContent = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
`;

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  imageSource,
  style,
}) => {
  return (
    <CardContainer
      onPress={onPress}
      disabled={!onPress}
      style={style}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityHint={onPress ? "Opens recipe details" : undefined}
    >
      {imageSource != null ? (
        <CardImage source={imageSource} resizeMode="cover" />
      ) : null}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};
