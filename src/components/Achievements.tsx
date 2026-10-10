// Postponed past v1 — not wired in v1 navigator; see docs/v2_backlog.md
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  achievementService,
  Achievement,
  Badge,
} from "../services/achievements";

interface AchievementsProps {
  onClose?: () => void;
}

const Container = styled(View)`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.lg}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  margin: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const Title = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const CloseButton = styled(TouchableOpacity)`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.sm}px`};
`;

const TabsContainer = styled(View)`
  flex-direction: row;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const Tab = styled(TouchableOpacity)<{ isActive: boolean }>`
  padding: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px ${theme.spacing.md}px`};
  border-bottom-width: 2px;
  border-bottom-color: ${({
    theme,
    isActive,
  }: {
    theme: DefaultTheme;
    isActive: boolean;
  }) => (isActive ? theme.colors.accent.gold : "transparent")};
`;

const TabText = styled(Text)<{ isActive: boolean }>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme, isActive }: { theme: DefaultTheme; isActive: boolean }) =>
    isActive ? theme.colors.text.primary : theme.colors.text.secondary};
`;

const Section = styled(View)`
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const SectionTitle = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const StatsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
`;

const StatLabel = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const AchievementItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
`;

const AchievementIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const AchievementInfo = styled.View`
  flex: 1;
`;

const AchievementTitle = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const AchievementDescription = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const ProgressContainer = styled.View`
  height: 4px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
  border-radius: 2px;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
  overflow: hidden;
`;

const ProgressBar = styled.View<{ progress: number }>`
  height: 100%;
  width: ${(props: { progress: number }) => props.progress}%;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
`;

const AchievementPoints = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const BadgeItem = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
`;

const BadgeIcon = styled.View<{ level: string }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({
    theme,
    level,
  }: {
    theme: DefaultTheme;
    level: string;
  }) => {
    switch (level) {
      case "bronze":
        return "#CD7F32";
      case "silver":
        return "#C0C0C0";
      case "gold":
        return theme.colors.accent.gold;
      case "platinum":
        return "#E5E4E2";
      default:
        return theme.colors.accent.gold;
    }
  }};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const BadgeTitle = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
  text-align: center;
`;

const BadgeDescription = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.xl}px`};
`;

const EmptyStateText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

export const Achievements: React.FC<AchievementsProps> = ({ onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<"achievements" | "badges">(
    "achievements",
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await achievementService.initialize();
        const allAchievements = achievementService.getAchievements();
        const allBadges = achievementService.getBadges();
        const points = achievementService.getTotalPoints();
        const unlocked = achievementService.getUnlockedAchievements().length;

        setAchievements(allAchievements);
        setBadges(allBadges);
        setTotalPoints(points);
        setUnlockedCount(unlocked);
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderAchievementItem = (achievement: Achievement) => {
    return (
      <AchievementItem key={achievement.id}>
        <AchievementIcon>
          <Ionicons name={achievement.icon as any} size={24} color="#FFFFFF" />
        </AchievementIcon>
        <AchievementInfo>
          <AchievementTitle>{achievement.title}</AchievementTitle>
          <AchievementDescription>
            {achievement.description}
          </AchievementDescription>
          <ProgressContainer>
            <ProgressBar progress={achievement.progress} />
          </ProgressContainer>
        </AchievementInfo>
        <AchievementPoints>{achievement.points} pts</AchievementPoints>
      </AchievementItem>
    );
  };

  const renderBadgeItem = (badge: Badge) => {
    return (
      <BadgeItem key={badge.id}>
        <BadgeIcon level={badge.level}>
          <Ionicons
            name={badge.icon as any}
            size={30}
            color={badge.isUnlocked ? "#FFFFFF" : "#CCCCCC"}
          />
        </BadgeIcon>
        <BadgeTitle>{badge.title}</BadgeTitle>
        <BadgeDescription>{badge.description}</BadgeDescription>
      </BadgeItem>
    );
  };

  const renderAchievementsContent = () => {
    if (loading) {
      return (
        <View style={{ alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="large" color={theme.colors.accent.gold} />
        </View>
      );
    }

    if (achievements.length === 0) {
      return (
        <EmptyState>
          <Ionicons name="trophy-outline" size={48} color="#CCCCCC" />
          <EmptyStateText>
            No achievements available yet. Start brewing to earn achievements!
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <ScrollView>
        <StatsContainer>
          <StatItem>
            <StatValue>{totalPoints}</StatValue>
            <StatLabel>Total Points</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{unlockedCount}</StatValue>
            <StatLabel>Achievements</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>
              {badges.filter((badge) => badge.isUnlocked).length}
            </StatValue>
            <StatLabel>Badges</StatLabel>
          </StatItem>
        </StatsContainer>

        <Section>
          <SectionTitle>Brewing</SectionTitle>
          {achievements
            .filter((a) => a.category === "brewing")
            .map(renderAchievementItem)}
        </Section>

        <Section>
          <SectionTitle>Exploration</SectionTitle>
          {achievements
            .filter((a) => a.category === "exploration")
            .map(renderAchievementItem)}
        </Section>

        <Section>
          <SectionTitle>Social</SectionTitle>
          {achievements
            .filter((a) => a.category === "social")
            .map(renderAchievementItem)}
        </Section>

        <Section>
          <SectionTitle>Mastery</SectionTitle>
          {achievements
            .filter((a) => a.category === "mastery")
            .map(renderAchievementItem)}
        </Section>
      </ScrollView>
    );
  };

  const renderBadgesContent = () => {
    if (loading) {
      return (
        <View style={{ alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="large" color={theme.colors.accent.gold} />
        </View>
      );
    }

    if (badges.length === 0) {
      return (
        <EmptyState>
          <Ionicons name="ribbon-outline" size={48} color="#CCCCCC" />
          <EmptyStateText>
            No badges available yet. Complete achievements to earn badges!
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {badges.map(renderBadgeItem)}
        </View>
      </ScrollView>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Achievements</Title>
        {onClose && (
          <CloseButton onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.primary}
            />
          </CloseButton>
        )}
      </Header>

      <TabsContainer>
        <Tab
          isActive={activeTab === "achievements"}
          onPress={() => setActiveTab("achievements")}
        >
          <TabText isActive={activeTab === "achievements"}>
            Achievements
          </TabText>
        </Tab>
        <Tab
          isActive={activeTab === "badges"}
          onPress={() => setActiveTab("badges")}
        >
          <TabText isActive={activeTab === "badges"}>Badges</TabText>
        </Tab>
      </TabsContainer>

      {activeTab === "achievements"
        ? renderAchievementsContent()
        : renderBadgesContent()}
    </Container>
  );
};
