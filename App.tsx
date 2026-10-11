import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { darkTheme, lightTheme } from "./src/theme/theme";
import { fontFiles } from "./src/theme/fonts";
import { navigationThemes } from "./src/theme/navigationTheme";
import { Navigation } from "./src/navigation/Navigation";
import { AuthProvider } from "./src/store/AuthContext";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { useAuth } from "./src/store/AuthContext";
import { StyledProps } from "./src/theme/styled-components";

SplashScreen.preventAutoHideAsync();

const LoadingContainer = styled(View)<StyledProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

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
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (fontError) {
      console.warn("Fonts failed to load; using system fonts.", fontError);
    }
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady, fontError]);

  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <AuthProvider>
          <NavigationContainer
            theme={isDark ? navigationThemes.dark : navigationThemes.light}
          >
            <AppContent />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
