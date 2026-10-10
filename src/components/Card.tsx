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

const CARD_ELEVATION: ViewStyle = {
  shadowColor: "rgb(61, 52, 43)",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 3,
  borderWidth: 1,
  borderColor: "rgba(232, 222, 208, 0.9)",
};

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
      style={[CARD_ELEVATION, style]}
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
