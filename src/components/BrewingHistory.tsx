// Postponed past V1 — only non-V1 screens use this; see docs/v2_backlog.md
import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { aiService } from "../services/ai";

interface BrewingHistoryProps {
  userId: string;
  onClose?: () => void;
}

const Container = styled.View`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.lg}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  margin: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const Title = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.sm}px`};
`;

const Section = styled.View`
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const SectionTitle = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const InsightItem = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const InsightIcon = styled.View`
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const InsightText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const StrengthItem = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const StrengthIcon = styled.View`
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const StrengthText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const ImprovementItem = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const ImprovementIcon = styled.View`
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const ImprovementText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

export const BrewingHistory: React.FC<BrewingHistoryProps> = ({
  userId,
  onClose,
}) => {
  const theme = useTheme();
  const [analysis, setAnalysis] = useState<{
    insights: string[];
    improvementAreas: string[];
    strengths: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await aiService.analyzeBrewingHistory(userId);
        setAnalysis(result);
      } catch (error) {
        console.error("Failed to analyze brewing history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userId]);

  if (loading || !analysis) {
    return (
      <Container>
        <Header>
          <Title>Brewing History Analysis</Title>
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
        <View style={{ alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="large" color={theme.colors.accent.gold} />
          <InsightText>Analyzing your brewing history...</InsightText>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Brewing History Analysis</Title>
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

      <ScrollView>
        <Section>
          <SectionTitle>Insights</SectionTitle>
          {analysis.insights.map((insight, index) => (
            <InsightItem key={index}>
              <InsightIcon>
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color={theme.colors.accent.gold}
                />
              </InsightIcon>
              <InsightText>{insight}</InsightText>
            </InsightItem>
          ))}
        </Section>

        <Section>
          <SectionTitle>Your Strengths</SectionTitle>
          {analysis.strengths.map((strength, index) => (
            <StrengthItem key={index}>
              <StrengthIcon>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={theme.colors.functional.success}
                />
              </StrengthIcon>
              <StrengthText>{strength}</StrengthText>
            </StrengthItem>
          ))}
        </Section>

        <Section>
          <SectionTitle>Areas for Improvement</SectionTitle>
          {analysis.improvementAreas.map((area, index) => (
            <ImprovementItem key={index}>
              <ImprovementIcon>
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={20}
                  color="#2196F3"
                />
              </ImprovementIcon>
              <ImprovementText>{area}</ImprovementText>
            </ImprovementItem>
          ))}
        </Section>
      </ScrollView>
    </Container>
  );
};
