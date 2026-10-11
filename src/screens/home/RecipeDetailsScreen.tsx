import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import { styled, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { Button } from "../../components/Button";
import { StyledProps } from "../../theme/styled-components";
import { recipeService, Recipe } from "../../services/recipes";
import { recipeImageSource } from "../../utils/recipeImages";
import {
  formatRatioParts,
  getRecipeDose,
  liquidLabelForMethod,
} from "../../services/recipeDose";
import { Image } from "expo-image";

type RecipeDetailsRouteProp = RouteProp<HomeStackParamList, "RecipeDetails">;
type RecipeDetailsNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "RecipeDetails"
>;

const Container = styled.View<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const Content = styled.ScrollView<StyledProps>`
  flex: 1;
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const HeaderImage = styled(Image)<StyledProps>`
  width: 100%;
  height: 200px;
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
`;

const DetailsContainer = styled(View)<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Title = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const Description = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const MetaRow = styled.View<StyledProps>`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  gap: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const MetaText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
`;

const Section = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
`;

const StepsHeader = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const StepsHeaderLeft = styled(View)`
  flex: 1;
  padding-right: 12px;
`;

const StepsHeaderTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const StepsHeaderHint = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const StepContainer = styled.View<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const StepTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const StepDescription = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const DoseCard = styled(View)<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.lg}px`};
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: StyledProps) => theme.colors.functional.border};
`;

const DoseHeading = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const DoseRow = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const DoseLabel = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
`;

const DoseValue = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.displaySmall};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const DoseAccent = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
`;

const DoseCaption = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  line-height: 20px;
`;

export const RecipeDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<RecipeDetailsRouteProp>();
  const navigation = useNavigation<RecipeDetailsNavigationProp>();
  const { recipeId, sessionCoffee, sessionWater } = route.params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepsExpanded, setStepsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await recipeService.init();
        const r = await recipeService.getRecipeById(recipeId);
        if (!cancelled) {
          if (r) {
            setRecipe(r);
          } else {
            setError("Recipe not found.");
          }
        }
      } catch {
        if (!cancelled) {
          setError("Could not load recipe.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  const effectiveDose = useMemo(() => {
    if (!recipe) {
      return null;
    }
    const base = getRecipeDose(recipe);
    return {
      coffeeGrams: sessionCoffee ?? base.coffeeGrams,
      waterGrams: sessionWater ?? base.waterGrams,
    };
  }, [recipe, sessionCoffee, sessionWater]);

  if (error) {
    return (
      <Container>
        <Content contentContainerStyle={{ padding: 24 }}>
          <Title accessibilityRole="header">Something went wrong</Title>
          <Description accessibilityRole="alert">{error}</Description>
          <Button
            title="Go back"
            onPress={() => navigation.goBack()}
            accessibilityHint="Returns to the previous screen"
          />
        </Content>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container>
        <Content
          contentContainerStyle={{ paddingTop: 48 }}
          accessibilityLabel="Loading recipe"
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.accent.gold}
            accessibilityLabel="Loading"
          />
        </Content>
      </Container>
    );
  }

  const ratioParts = effectiveDose
    ? formatRatioParts(effectiveDose.coffeeGrams, effectiveDose.waterGrams)
    : null;
  const liquidLabel = liquidLabelForMethod(recipe.brewMethod);

  return (
    <Container>
      <Content>
        <HeaderImage
          source={recipeImageSource(recipe.id, recipe.imageUrl)}
          contentFit="cover"
          transition={200}
        />
        <DetailsContainer>
          <Title>{recipe.title}</Title>
          <Description>{recipe.description}</Description>
          <MetaRow>
            <MetaText>⏱ {recipe.brewTime}</MetaText>
            <MetaText>{recipe.difficulty}</MetaText>
            <MetaText>{recipe.brewMethod}</MetaText>
          </MetaRow>

          {effectiveDose && ratioParts ? (
            <DoseCard>
              <DoseHeading>Brew dose</DoseHeading>
              <DoseRow>
                <DoseLabel>Coffee</DoseLabel>
                <DoseValue>{effectiveDose.coffeeGrams} g</DoseValue>
              </DoseRow>
              <DoseRow>
                <DoseLabel>{liquidLabel}</DoseLabel>
                <DoseValue>{effectiveDose.waterGrams} g</DoseValue>
              </DoseRow>
              <DoseRow>
                <DoseLabel>Ratio</DoseLabel>
                <DoseAccent>
                  {ratioParts.left} : {ratioParts.right}
                </DoseAccent>
              </DoseRow>
              <DoseCaption>
                Optional: tune coffee and yield before you start — your session
                uses these numbers on the summary screen.
              </DoseCaption>
            </DoseCard>
          ) : null}

          <Button
            title="Adjust dose"
            onPress={() =>
              navigation.navigate("EditDose", {
                recipeId: recipe.id,
                coffeeGrams: effectiveDose?.coffeeGrams ?? 15,
                waterGrams: effectiveDose?.waterGrams ?? 250,
                brewMethod: recipe.brewMethod,
              })
            }
            variant="outline"
            fullWidth
            style={{ marginTop: 20 }}
            accessibilityHint="Change coffee and water amounts for this session"
          />

          <Button
            title="Start brew"
            onPress={() =>
              navigation.navigate("BrewSession", {
                recipeId: recipe.id,
                coffeeGrams: effectiveDose?.coffeeGrams,
                waterGrams: effectiveDose?.waterGrams,
              })
            }
            variant="primary"
            fullWidth
            style={{ marginTop: 12 }}
            accessibilityHint="Opens the guided brewing steps and timer"
          />

          <Section>
            <StepsHeader
              onPress={() => setStepsExpanded((open) => !open)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityState={{ expanded: stepsExpanded }}
              accessibilityLabel={`Recipe steps, ${recipe.steps.length} steps`}
              accessibilityHint={
                stepsExpanded
                  ? "Collapses the brewing steps list"
                  : "Expands to show all brewing steps"
              }
            >
              <StepsHeaderLeft>
                <StepsHeaderTitle>Steps</StepsHeaderTitle>
                <StepsHeaderHint>
                  {stepsExpanded
                    ? "Tap to hide"
                    : `${recipe.steps.length} steps — tap to show`}
                </StepsHeaderHint>
              </StepsHeaderLeft>
              <Ionicons
                name={stepsExpanded ? "chevron-up" : "chevron-down"}
                size={22}
                color={theme.colors.text.secondary}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            </StepsHeader>
            {stepsExpanded
              ? recipe.steps.map((step, index) => (
                  <StepContainer key={step.id}>
                    <StepTitle>
                      {index + 1}. {step.time}
                    </StepTitle>
                    <StepDescription>{step.instruction}</StepDescription>
                  </StepContainer>
                ))
              : null}
          </Section>
        </DetailsContainer>
      </Content>
    </Container>
  );
};
