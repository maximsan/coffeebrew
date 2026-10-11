// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, Text } from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RecipeAnalysis } from "../../components/RecipeAnalysis";
import { BeanRecognition } from "../../components/BeanRecognition";
import { PersonalizedRecommendations } from "../../components/PersonalizedRecommendations";
import { BrewingHistory } from "../../components/BrewingHistory";
import { recipeService, Recipe } from "../../services/recipes";
import { authService } from "../../services/auth";

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const Header = styled(View)`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.text.tertiary};
`;

const Title = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const Subtitle = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
`;

const Section = styled(View)`
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xl}px`};
`;

const SectionTitle = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const FeatureCard = styled(TouchableOpacity)`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.lg}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  flex-direction: row;
  align-items: center;
`;

const FeatureIcon = styled(View)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const FeatureContent = styled(View)`
  flex: 1;
`;

const FeatureTitle = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const FeatureDescription = styled(Text)`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  left: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  z-index: 1;
`;

export const AIScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const currentUser = authService.getCurrentUser();

  const handleFeatureSelect = async (feature: string) => {
    setSelectedFeature(feature);

    if (feature === "recipe-analysis") {
      try {
        // Get a random recipe for analysis
        const recipes = await recipeService.getAllRecipes();
        if (recipes.length > 0) {
          const randomIndex = Math.floor(Math.random() * recipes.length);
          setSelectedRecipe(recipes[randomIndex]);
        } else {
          Alert.alert(
            "No Recipes",
            "There are no recipes available for analysis.",
          );
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        Alert.alert("Error", "Failed to fetch recipes for analysis.");
      }
    }
  };

  const handleCloseFeature = () => {
    setSelectedFeature(null);
    setSelectedRecipe(null);
  };

  return (
    <Container>
      <Header>
        <Title>AI Features</Title>
        <Subtitle>Discover the power of AI in coffee brewing</Subtitle>
      </Header>

      <BackButton onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.colors.text.primary}
        />
      </BackButton>

      <Content>
        {selectedFeature === "recipe-analysis" && selectedRecipe ? (
          <RecipeAnalysis
            recipeId={selectedRecipe.id}
            onClose={handleCloseFeature}
          />
        ) : selectedFeature === "bean-recognition" ? (
          <BeanRecognition onAnalysisComplete={handleCloseFeature} />
        ) : selectedFeature === "personalized-recommendations" &&
          currentUser ? (
          <PersonalizedRecommendations
            userId={currentUser.id}
            onClose={handleCloseFeature}
          />
        ) : selectedFeature === "brewing-history" && currentUser ? (
          <BrewingHistory
            userId={currentUser.id}
            onClose={handleCloseFeature}
          />
        ) : (
          <>
            <Section>
              <SectionTitle>Recipe Analysis</SectionTitle>
              <FeatureCard
                onPress={() => handleFeatureSelect("recipe-analysis")}
              >
                <FeatureIcon>
                  <Ionicons
                    name="analytics-outline"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Recipe Analysis</FeatureTitle>
                  <FeatureDescription>
                    Get AI-powered analysis of your coffee recipes, including
                    flavor profiles, brewing parameter suggestions, and
                    improvement tips.
                  </FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            </Section>

            <Section>
              <SectionTitle>Bean Recognition</SectionTitle>
              <FeatureCard
                onPress={() => handleFeatureSelect("bean-recognition")}
              >
                <FeatureIcon>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Bean Recognition</FeatureTitle>
                  <FeatureDescription>
                    Take a photo of your coffee beans to identify their type,
                    roast level, origin, flavor notes, and get brewing
                    recommendations.
                  </FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            </Section>

            <Section>
              <SectionTitle>Personalized Recommendations</SectionTitle>
              <FeatureCard
                onPress={() =>
                  handleFeatureSelect("personalized-recommendations")
                }
                disabled={!currentUser}
              >
                <FeatureIcon>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={
                      currentUser
                        ? theme.colors.text.primary
                        : theme.colors.text.tertiary
                    }
                  />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Personalized Recommendations</FeatureTitle>
                  <FeatureDescription>
                    Get personalized recipe recommendations based on your taste
                    preferences, available beans, and brewing equipment.
                    {!currentUser && " (Sign in required)"}
                  </FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            </Section>

            <Section>
              <SectionTitle>Brewing History</SectionTitle>
              <FeatureCard
                onPress={() => handleFeatureSelect("brewing-history")}
                disabled={!currentUser}
              >
                <FeatureIcon>
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>Brewing History</FeatureTitle>
                  <FeatureDescription>
                    Analyze your brewing history and get personalized insights
                  </FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            </Section>
          </>
        )}
      </Content>
    </Container>
  );
};
