// Postponed past v1 — only non-v1 screens use this; see app/docs/v2_backlog.md
import React, { useState } from "react";

import { styled, DefaultTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
  onValueChange?: (value: number) => void;
  readonly?: boolean;
}

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarButton = styled.TouchableOpacity`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.xs}px`};
`;

const StarIcon = styled(Ionicons)<{ size: number }>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
`;

export const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 24,
  onValueChange,
  readonly = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handlePress = (newValue: number) => {
    if (!readonly && onValueChange) {
      onValueChange(newValue);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayValue = hoverValue !== null ? hoverValue : value;

    for (let i = 1; i <= maxValue; i++) {
      const isFilled = i <= displayValue;
      const iconName = isFilled ? "star" : "star-outline";

      stars.push(
        <StarButton
          key={i}
          onPress={() => handlePress(i)}
          onPressIn={() => !readonly && setHoverValue(i)}
          onPressOut={() => !readonly && setHoverValue(null)}
          disabled={readonly}
        >
          <StarIcon name={iconName} size={size} />
        </StarButton>,
      );
    }

    return stars;
  };

  return <RatingContainer>{renderStars()}</RatingContainer>;
};
