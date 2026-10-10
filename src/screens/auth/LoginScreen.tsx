// Postponed past V1 — not in the V1 navigator; see docs/v2_backlog.md
import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { styled } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { Logo } from "../../components/Logo";
import { z } from "zod";
import { useAuth } from "../../store/AuthContext";
import { loginCredentialsSchema } from "../../services/auth";
import { StyledProps } from "../../theme/styled-components";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const LogoContainer = styled(View)<StyledProps>`
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Title = styled.Text<StyledProps>`
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h1}px`};
  font-weight: bold;
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Form = styled(View)`
  width: 100%;
`;

const ForgotPassword = styled(TouchableOpacity)`
  align-self: flex-end;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const ForgotPasswordText = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
`;

const SignUpContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const SignUpText = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
`;

const SignUpLink = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  font-weight: bold;
  margin-left: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const ErrorText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.functional.error};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
  text-align: center;
`;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, error: authError, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    try {
      loginCredentialsSchema.parse({ email, password });
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
  }, [email, password]);

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login({ email, password });
      // Navigation will be handled by the Navigation component based on auth state
    } catch (err) {
      Alert.alert(
        "Login Failed",
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <LogoContainer>
            <Logo size={120} />
          </LogoContainer>
          <Title>Welcome Back</Title>
          <Form>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              disabled={isLoading}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry
              error={errors.password}
              disabled={isLoading}
            />
            <ForgotPassword onPress={handleForgotPassword} disabled={isLoading}>
              <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
            </ForgotPassword>
            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              disabled={isLoading}
            />
            {authError && <ErrorText>{authError}</ErrorText>}
          </Form>
          <SignUpContainer>
            <SignUpText>{"Don't have an account?"}</SignUpText>
            <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
              <SignUpLink>Sign Up</SignUpLink>
            </TouchableOpacity>
          </SignUpContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
