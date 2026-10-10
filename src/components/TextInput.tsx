// Postponed past v1 — only non-v1 screens use this; see app/docs/v2_backlog.md
import React from "react";
import { TextInput as RNTextInput, View, Text } from "react-native";
import { styled } from "styled-components/native";
import {
  StyledProps,
  StyledPropsWithError,
  StyledPropsWithDisabled,
} from "../theme/styled-components";
import { theme } from "../theme/theme";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

interface StyledInputProps
  extends StyledPropsWithError, StyledPropsWithDisabled {
  hasError?: boolean;
  isDisabled?: boolean;
}

const InputContainer = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const Label = styled(Text)<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const StyledInput = styled(RNTextInput)<StyledInputProps>`
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.sm}px`};
  border-width: 1px;
  border-color: ${({ hasError, theme }: StyledInputProps) =>
    hasError ? theme.colors.functional.error : theme.colors.text.tertiary};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
  opacity: ${({ isDisabled }: StyledInputProps) => (isDisabled ? 0.5 : 1)};
`;

const ErrorText = styled(Text)<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.functional.error};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.disabled}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        hasError={!!error}
        isDisabled={disabled}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};
