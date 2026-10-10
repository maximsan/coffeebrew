// Postponed past V1 — only non-V1 screens use this; see docs/v2_backlog.md
import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  aiService,
  RecipeAnalysis as RecipeAnalysisType,
} from "../services/ai";
import { recipeService } from "../services/recipes";
import { StyledProps } from "../theme/styled-components";

interface RecipeAnalysisProps {
  recipeId: string;
  onClose?: () => void;
}

interface FlavorBarProps extends StyledProps {
  width: number;
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

const Section = styled.View<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
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

const ScoreContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const ScoreCircle = styled.View<{ score: number }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({
    theme,
    score,
  }: {
    theme: DefaultTheme;
    score: number;
  }) => {
    if (score >= 8) return theme.colors.functional.success;
    if (score >= 6) return theme.colors.functional.warning;
    return theme.colors.functional.error;
  }};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const ScoreText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.inverse};
`;

const SuggestionItem = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const SuggestionIcon = styled.View`
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const SuggestionText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const FlavorProfileContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FlavorItem = styled.View`
  width: 48%;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const FlavorLabel = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const FlavorBarContainer = styled.View`
  height: 8px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-radius: 4px;
  overflow: hidden;
`;

const FlavorBar = styled.View<FlavorBarProps>`
  height: ${({ theme }: FlavorBarProps) => `${theme.spacing.sm}px`};
  width: ${({ width }: FlavorBarProps) => `${width}%`};
  background-color: ${({ theme }: FlavorBarProps) => theme.colors.accent.gold};
  border-radius: ${({ theme }: FlavorBarProps) => `${theme.borderRadius.sm}px`};
`;

const FlavorValue = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: right;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const ParameterItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const ParameterLabel = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const ParameterValue = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-weight: bold;
`;

export const RecipeAnalysis: React.FC<RecipeAnalysisProps> = ({
  recipeId,
  onClose,
}) => {
  const theme = useTheme();
  const [analysis, setAnalysis] = useState<RecipeAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const recipe = await recipeService.getRecipeById(recipeId);
        if (recipe) {
          const result = await aiService.analyzeRecipe(recipe);
          setAnalysis(result);
        }
      } catch (error) {
        console.error("Failed to analyze recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [recipeId]);

  if (loading || !analysis) {
    return (
      <Container>
        <Header>
          <Title>Recipe Analysis</Title>
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
          <SuggestionText>Analyzing your recipe...</SuggestionText>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Recipe Analysis</Title>
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
          <SectionTitle>Overall Score</SectionTitle>
          <ScoreContainer>
            <ScoreCircle score={analysis.score}>
              <ScoreText>{analysis.score.toFixed(1)}</ScoreText>
            </ScoreCircle>
            <SuggestionText>
              {analysis.score >= 8
                ? "Excellent recipe! Keep up the good work."
                : analysis.score >= 6
                  ? "Good recipe with room for improvement."
                  : "Consider making some adjustments to enhance your recipe."}
            </SuggestionText>
          </ScoreContainer>
        </Section>

        <Section>
          <SectionTitle>Improvement Suggestions</SectionTitle>
          {analysis.suggestions.map((suggestion, index) => (
            <SuggestionItem key={index}>
              <SuggestionIcon>
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color={theme.colors.accent.gold}
                />
              </SuggestionIcon>
              <SuggestionText>{suggestion}</SuggestionText>
            </SuggestionItem>
          ))}
        </Section>

        <Section>
          <SectionTitle>Flavor Profile</SectionTitle>
          <FlavorProfileContainer>
            <FlavorItem>
              <FlavorLabel>Acidity</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar width={analysis.flavorProfile.acidity * 10} />
              </FlavorBarContainer>
              <FlavorValue>
                {analysis.flavorProfile.acidity.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Body</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar width={analysis.flavorProfile.body * 10} />
              </FlavorBarContainer>
              <FlavorValue>
                {analysis.flavorProfile.body.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Sweetness</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar width={analysis.flavorProfile.sweetness * 10} />
              </FlavorBarContainer>
              <FlavorValue>
                {analysis.flavorProfile.sweetness.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Bitterness</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar width={analysis.flavorProfile.bitterness * 10} />
              </FlavorBarContainer>
              <FlavorValue>
                {analysis.flavorProfile.bitterness.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Complexity</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar width={analysis.flavorProfile.complexity * 10} />
              </FlavorBarContainer>
              <FlavorValue>
                {analysis.flavorProfile.complexity.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
          </FlavorProfileContainer>
        </Section>

        <Section>
          <SectionTitle>Brewing Parameters</SectionTitle>
          <ParameterItem>
            <ParameterLabel>Grind Size</ParameterLabel>
            <ParameterValue>
              {analysis.brewingParameterSuggestions.grindSize}
            </ParameterValue>
          </ParameterItem>
          <ParameterItem>
            <ParameterLabel>Water Temperature</ParameterLabel>
            <ParameterValue>
              {analysis.brewingParameterSuggestions.waterTemperature}
            </ParameterValue>
          </ParameterItem>
          <ParameterItem>
            <ParameterLabel>Brew Ratio</ParameterLabel>
            <ParameterValue>
              {analysis.brewingParameterSuggestions.brewRatio}
            </ParameterValue>
          </ParameterItem>
          <ParameterItem>
            <ParameterLabel>Brew Time</ParameterLabel>
            <ParameterValue>
              {analysis.brewingParameterSuggestions.brewTime}
            </ParameterValue>
          </ParameterItem>
        </Section>
      </ScrollView>
    </Container>
  );
};
