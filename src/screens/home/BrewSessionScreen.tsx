import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { recipeService, Recipe } from "../../services/recipes";
import { getRecipeDose, liquidLabelForMethod } from "../../services/recipeDose";
import { BrewTimer } from "../../components/BrewTimer";
import { Button } from "../../components/Button";
import { StyledProps } from "../../theme/styled-components";

type BrewSessionRouteProp = RouteProp<HomeStackParamList, "BrewSession">;
type BrewSessionNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "BrewSession"
>;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const Content = styled(ScrollView)<StyledProps>`
  flex: 1;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
`;

const RecipeTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const StepBadge = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const Instruction = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  line-height: 24px;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const Hint = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const NextPreview = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const NextLabel = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const NextMeta = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const NextInstruction = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  line-height: 22px;
`;

const DoseStrip = styled(View)<StyledProps>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px ${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const DoseChunk = styled(View)<StyledProps>`
  min-width: 46%;
`;

const DoseTiny = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
`;

const DoseStrong = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

/** Parses "M:SS" or "MM:SS" into seconds (best-effort for v1). */
export function parseStepTimeToSeconds(time: string): number {
  const trimmed = time.trim();
  const match = /^(\d+):(\d{2})$/.exec(trimmed);
  if (!match) {
    return 180;
  }
  const a = Number(match[1]);
  const b = Number(match[2]);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return 180;
  }
  return a * 60 + b;
}

export const BrewSessionScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<BrewSessionRouteProp>();
  const navigation = useNavigation<BrewSessionNavigationProp>();
  const {
    recipeId,
    coffeeGrams: paramCoffee,
    waterGrams: paramWater,
  } = route.params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const sessionStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (recipe && sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now();
    }
  }, [recipe]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await recipeService.init();
        const r = await recipeService.getRecipeById(recipeId);
        if (!cancelled) {
          if (r) {
            setRecipe(r);
          } else {
            setLoadError("Recipe not found.");
          }
        }
      } catch {
        if (!cancelled) {
          setLoadError("Could not load recipe.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  const step = recipe?.steps[stepIndex];
  const totalSteps = recipe?.steps.length ?? 0;

  const sessionDose = useMemo(() => {
    if (!recipe) {
      return { coffeeGrams: 15, waterGrams: 250 };
    }
    const base = getRecipeDose(recipe);
    return {
      coffeeGrams: paramCoffee ?? base.coffeeGrams,
      waterGrams: paramWater ?? base.waterGrams,
    };
  }, [recipe, paramCoffee, paramWater]);

  const timerInitialSeconds = useMemo(() => {
    if (!step) {
      return 180;
    }
    return Math.max(5, parseStepTimeToSeconds(step.time));
  }, [step]);

  const goNext = useCallback(() => {
    if (!recipe) {
      return;
    }
    const last = stepIndex >= recipe.steps.length - 1;
    if (last) {
      navigation.navigate("BrewComplete", {
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        brewMethod: recipe.brewMethod,
        brewTime: recipe.brewTime,
        difficulty: recipe.difficulty,
        stepCount: recipe.steps.length,
        coffeeGrams: sessionDose.coffeeGrams,
        waterGrams: sessionDose.waterGrams,
        startedAt: sessionStartedAtRef.current ?? Date.now(),
      });
      return;
    }
    setStepIndex((i) => i + 1);
  }, [
    recipe,
    stepIndex,
    navigation,
    sessionDose.coffeeGrams,
    sessionDose.waterGrams,
  ]);

  const skipAhead = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    goNext();
  }, [goNext]);

  if (loadError) {
    return (
      <Container>
        <Content>
          <Instruction accessibilityRole="alert">{loadError}</Instruction>
          <Button
            title="Go back"
            onPress={() => navigation.goBack()}
            accessibilityHint="Returns to the previous screen"
          />
        </Content>
      </Container>
    );
  }

  if (!recipe || !step) {
    return (
      <Container>
        <Content
          contentContainerStyle={{ paddingTop: 48 }}
          accessibilityLabel="Loading brew session"
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

  const isLast = stepIndex >= totalSteps - 1;
  const nextStep = !isLast ? recipe.steps[stepIndex + 1] : null;

  return (
    <Container>
      <Content>
        <DoseStrip>
          <DoseChunk>
            <DoseTiny>Coffee</DoseTiny>
            <DoseStrong>{sessionDose.coffeeGrams} g</DoseStrong>
          </DoseChunk>
          <DoseChunk>
            <DoseTiny>{liquidLabelForMethod(recipe.brewMethod)}</DoseTiny>
            <DoseStrong>{sessionDose.waterGrams} g</DoseStrong>
          </DoseChunk>
        </DoseStrip>
        <RecipeTitle>{recipe.title}</RecipeTitle>
        <StepBadge>
          Step {stepIndex + 1} of {totalSteps} · {step.time}
        </StepBadge>
        <Instruction>{step.instruction}</Instruction>
        {nextStep ? (
          <NextPreview accessibilityLabel="Next brewing step preview">
            <NextLabel>Next step</NextLabel>
            <NextMeta>At {nextStep.time}</NextMeta>
            <NextInstruction numberOfLines={4}>
              {nextStep.instruction}
            </NextInstruction>
          </NextPreview>
        ) : null}
        <Hint>
          Tap Start when you begin this step. When the countdown reaches zero,
          the brew moves on by itself. Use Skip ahead if you finish this step
          early. If you leave the app, time resyncs when you return (see
          README).
        </Hint>
        <BrewTimer
          key={stepIndex}
          initialTime={timerInitialSeconds}
          onComplete={goNext}
        />
        <Button
          title={isLast ? "Finish early" : "Skip ahead"}
          onPress={skipAhead}
          variant="outline"
          fullWidth
          accessibilityLabel={
            isLast
              ? "Finish brew before the timer ends"
              : "Skip to the next step"
          }
          accessibilityHint={
            isLast
              ? "Opens the summary without waiting for the countdown"
              : "Moves on before this step’s timer ends"
          }
        />
      </Content>
    </Container>
  );
};
