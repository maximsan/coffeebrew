// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { z } from "zod";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

interface StyledProps {
  theme: DefaultTheme;
}

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Title = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h1}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
  text-align: center;
`;

const FormContainer = styled(View)<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
`;

const FooterContainer = styled(View)<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
  flex-direction: row;
  justify-content: center;
`;

const FooterText = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
`;

const FooterLink = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  margin-left: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      registerSchema.parse({ name, email, password, confirmPassword });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Navigate to main app
    } catch {
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <Container>
          <Title>Create Account</Title>
          <FormContainer>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              error={errors.name}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
            />
          </FormContainer>
          <FooterContainer>
            <FooterText>Already have an account?</FooterText>
            <FooterLink onPress={() => navigation.navigate("Login")}>
              Sign In
            </FooterLink>
          </FooterContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
