// Postponed past v1 — not in the v1 navigator; see docs/v2_backlog.md
import React from "react";
import { View, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<ProfileStackParamList>;

interface StyledProps {
  theme: DefaultTheme;
}

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const Header = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  align-items: center;
`;

const ProfileImage = styled(Image)<StyledProps>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const UserName = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const UserBio = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const StatsContainer = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const StatItem = styled(View)<StyledProps>`
  align-items: center;
`;

const StatValue = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const StatLabel = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
`;

const Section = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
`;

const SectionTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const MenuItem = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const MenuItemText = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  flex: 1;
`;

// Mock user data - replace with actual user data
const userData = {
  name: "John Doe",
  bio: "Coffee enthusiast | Home barista | Always exploring new brewing methods",
  profileImage: "https://example.com/profile.jpg",
  stats: {
    recipes: 15,
    followers: 234,
    following: 156,
  },
};

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <Container>
      <ScrollView>
        <Header>
          <ProfileImage source={{ uri: userData.profileImage }} />
          <UserName>{userData.name}</UserName>
          <UserBio>{userData.bio}</UserBio>
          <StatsContainer>
            <StatItem>
              <StatValue>{userData.stats.recipes}</StatValue>
              <StatLabel>Recipes</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.stats.followers}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.stats.following}</StatValue>
              <StatLabel>Following</StatLabel>
            </StatItem>
          </StatsContainer>
        </Header>

        <Section>
          <SectionTitle>My Activity</SectionTitle>
          <MenuItem onPress={() => navigation.navigate("MyRecipes")}>
            <MenuItemText>My Recipes</MenuItemText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate("SavedRecipes")}>
            <MenuItemText>Saved Recipes</MenuItemText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate("BrewingHistory")}>
            <MenuItemText>Brewing History</MenuItemText>
          </MenuItem>
        </Section>

        <Section>
          <SectionTitle>Settings</SectionTitle>
          <MenuItem onPress={() => navigation.navigate("AccountSettings")}>
            <MenuItemText>Account Settings</MenuItemText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate("Preferences")}>
            <MenuItemText>Preferences</MenuItemText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate("Notifications")}>
            <MenuItemText>Notifications</MenuItemText>
          </MenuItem>
        </Section>

        <Section>
          <Button
            title="Sign Out"
            onPress={() => {
              // Handle sign out
            }}
            variant="secondary"
          />
        </Section>
      </ScrollView>
    </Container>
  );
};
