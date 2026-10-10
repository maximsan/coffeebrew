import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./src/theme/theme";
import { Navigation } from "./src/navigation/Navigation";
import { AuthProvider } from "./src/store/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { styled } from "styled-components/native";
import { useAuth } from "./src/store/AuthContext";
import { StyledProps } from "./src/theme/styled-components";

const LoadingContainer = styled(View)<StyledProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.accent.gold} />
      </LoadingContainer>
    );
  }

  return <Navigation />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="dark" />
        <AuthProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
