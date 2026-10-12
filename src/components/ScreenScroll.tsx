import React from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { useTheme } from "styled-components/native";

/**
 * A screen's scrolling body with the standard side and top padding.
 * The padding sits on the content, not the scroll view: padding on the
 * scroll view itself insets its frame, and on web a RefreshControl applies it twice.
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
