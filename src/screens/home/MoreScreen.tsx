import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StyledProps } from "../../theme/styled-components";
import { MainTabParamList } from "../../navigation/types";

const Container = styled(SafeAreaView).attrs({
  edges: ["top", "left", "right"],
})<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const Content = styled(ScrollView)<StyledProps>`
  flex: 1;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
`;

const Title = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const Body = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  line-height: 22px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xl}px`};
`;

const LinkRow = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const LinkRowLeft = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 12px;
`;

const LinkTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.serifText};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const LinkSubtitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

export const MoreScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  const openHistory = () => {
    navigation.navigate("Home", { screen: "History" });
  };

  return (
    <Container>
      <Content>
        <Title>More</Title>
        <Body>Your brew history stays on this device.</Body>

        <LinkRow
          onPress={openHistory}
          accessibilityRole="button"
          accessibilityLabel="Open brew history"
        >
          <LinkRowLeft>
            <Ionicons
              name="time-outline"
              size={22}
              color={theme.colors.accent.gold}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <LinkTitle>Brew history</LinkTitle>
              <LinkSubtitle>On-device log of completed sessions</LinkSubtitle>
            </View>
          </LinkRowLeft>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text.tertiary}
          />
        </LinkRow>
      </Content>
    </Container>
  );
};
