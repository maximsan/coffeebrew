import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "styled-components/native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from "@react-navigation/native";
import { darkTheme, lightTheme } from "./src/theme/theme";
import type { Theme } from "./src/theme/types";
import { Navigation } from "./src/navigation/Navigation";
import { AuthProvider } from "./src/store/AuthContext";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { useAuth } from "./src/store/AuthContext";
import { StyledProps } from "./src/theme/styled-components";

SplashScreen.preventAutoHideAsync();

const { fontFamily } = lightTheme.typography;

const LoadingContainer = styled(View)<StyledProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

/** React Navigation paints screen and header backgrounds from its own theme. */
const toNavigationTheme = (theme: Theme, isDark: boolean): NavigationTheme => {
  const base = isDark ? NavigationDarkTheme : NavigationLightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.accent.gold,
      background: theme.colors.background.primary,
      card: theme.colors.background.secondary,
      text: theme.colors.text.primary,
      border: theme.colors.functional.border,
      notification: theme.colors.functional.error,
    },
  };
};

const AppContent = () => {
  const { isLoading } = useAuth();
  const theme = useTheme();

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
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.display]: require("./assets/fonts/Fraunces-Variable.ttf"),
    [fontFamily.text]: require("./assets/fonts/IBMPlexSans-Regular.ttf"),
    [fontFamily.textMedium]: require("./assets/fonts/IBMPlexSans-Medium.ttf"),
    [fontFamily.mono]: require("./assets/fonts/IBMPlexMono-Medium.ttf"),
  });
  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <AuthProvider>
          <NavigationContainer theme={toNavigationTheme(theme, isDark)}>
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
