import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styled, useTheme } from "styled-components/native";
import { StyledProps } from "../theme/styled-components";

const Row = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const Label = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
`;

/** A recipe's total brew time with a clock icon, for a row of recipe facts. */
export const BrewTimeMeta: React.FC<{ brewTime: string }> = ({ brewTime }) => {
  const theme = useTheme();
  return (
    <Row>
      <Ionicons
        name="time-outline"
        size={theme.typography.fontSize.small}
        color={theme.colors.text.tertiary}
      />
      <Label>{brewTime}</Label>
    </Row>
  );
};
