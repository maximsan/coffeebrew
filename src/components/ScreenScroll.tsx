import React from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { useTheme } from "styled-components/native";

/**
 * A screen's scrolling body with the standard padding on every side.
 * The padding sits on the content. Padding on the scroll view itself shrinks
 * the scrolling area, and on web pull-to-refresh applies that padding twice.
 */
export const ScreenScroll: React.FC<ScrollViewProps> = ({
  contentContainerStyle,
  style,
  ...props
}) => {
  const theme = useTheme();
  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[
        { padding: theme.spacing.lg },
        contentContainerStyle,
      ]}
      {...props}
    />
  );
};
