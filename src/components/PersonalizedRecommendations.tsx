// Postponed past v1 — only non-v1 screens use this; see app/docs/v2_backlog.md
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  aiService,
  PersonalizedRecommendations as PersonalizedRecommendationsType,
} from "../services/ai";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { recipeImageSource } from "../utils/recipeImages";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface PersonalizedRecommendationsProps {
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

const RecipeCard = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  overflow: hidden;
`;

const RecipeImage = styled.Image`
  width: 100%;
  height: 150px;
  resize-mode: cover;
`;

const RecipeContent = styled.View`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
`;

const RecipeTitle = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const RecipeDescription = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const RecipeMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RecipeMetaItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RecipeMetaText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const MatchScore = styled.View`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
  padding: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.sm}px`};
`;

const MatchScoreText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
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

const FlavorBar = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => props.width}%;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
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

export const PersonalizedRecommendations: React.FC<
  PersonalizedRecommendationsProps
> = ({ userId, onClose }) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [recommendations, setRecommendations] =
    useState<PersonalizedRecommendationsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // In a real app, we would get these preferences from the user's profile
        const preferences = {
          preferredMethods: ["Pour Over", "Aeropress"],
          preferredFlavors: ["Fruity", "Floral", "Chocolate"],
          preferredStrength: "medium" as const,
          roastPreference: "light" as const,
        };

        const result = await aiService.getPersonalizedRecommendations(
          userId,
          preferences,
        );
        setRecommendations(result);
      } catch (error) {
        console.error("Failed to fetch personalized recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  const handleRecipePress = (recipeId: string) => {
    navigation.navigate("RecipeDetails", { recipeId });
  };

  if (loading || !recommendations) {
    return (
      <Container>
        <Header>
          <Title>Personalized Recommendations</Title>
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
          <InsightText>Generating personalized recommendations...</InsightText>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Personalized Recommendations</Title>
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
          <SectionTitle>Recommended for You</SectionTitle>
          {recommendations.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onPress={() => handleRecipePress(recipe.id)}
            >
              <RecipeImage
                source={recipeImageSource(recipe.id, recipe.imageUrl)}
              />
              <RecipeContent>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeDescription>{recipe.description}</RecipeDescription>
                <RecipeMeta>
                  <View style={{ flexDirection: "row" }}>
                    <RecipeMetaItem>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <RecipeMetaText>{recipe.brewTime}s</RecipeMetaText>
                    </RecipeMetaItem>
                    <RecipeMetaItem style={{ marginLeft: 12 }}>
                      <Ionicons name="cafe-outline" size={16} color="#666" />
                      <RecipeMetaText>{recipe.brewMethod}</RecipeMetaText>
                    </RecipeMetaItem>
                    <RecipeMetaItem style={{ marginLeft: 12 }}>
                      <Ionicons
                        name="speedometer-outline"
                        size={16}
                        color="#666"
                      />
                      <RecipeMetaText>{recipe.difficulty}</RecipeMetaText>
                    </RecipeMetaItem>
                  </View>
                  <MatchScore>
                    <MatchScoreText>{recipe.matchScore}% Match</MatchScoreText>
                  </MatchScore>
                </RecipeMeta>
              </RecipeContent>
            </RecipeCard>
          ))}
        </Section>

        <Section>
          <SectionTitle>Your Flavor Profile</SectionTitle>
          <FlavorProfileContainer>
            <FlavorItem>
              <FlavorLabel>Acidity</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar
                  width={recommendations.flavorPreferences.acidity * 10}
                />
              </FlavorBarContainer>
              <FlavorValue>
                {recommendations.flavorPreferences.acidity.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Body</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar
                  width={recommendations.flavorPreferences.body * 10}
                />
              </FlavorBarContainer>
              <FlavorValue>
                {recommendations.flavorPreferences.body.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Sweetness</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar
                  width={recommendations.flavorPreferences.sweetness * 10}
                />
              </FlavorBarContainer>
              <FlavorValue>
                {recommendations.flavorPreferences.sweetness.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
            <FlavorItem>
              <FlavorLabel>Bitterness</FlavorLabel>
              <FlavorBarContainer>
                <FlavorBar
                  width={recommendations.flavorPreferences.bitterness * 10}
                />
              </FlavorBarContainer>
              <FlavorValue>
                {recommendations.flavorPreferences.bitterness.toFixed(1)}
              </FlavorValue>
            </FlavorItem>
          </FlavorProfileContainer>
        </Section>

        <Section>
          <SectionTitle>Insights</SectionTitle>
          {recommendations.insights.map((insight, index) => (
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
      </ScrollView>
    </Container>
  );
};
