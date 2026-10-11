import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { StyledProps } from "../../theme/styled-components";
import { recipeService, Recipe } from "../../services/recipes";
import { brewHistoryService, BrewLogEntry } from "../../services/brewHistory";
import { recipeImageSource } from "../../utils/recipeImages";
import { brewMethodIcon } from "../../theme/brewMethodVisual";
import { Button } from "../../components/Button";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "HomeScreen"
>;

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

const Section = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xl}px`};
`;

const ScreenTitle = styled.Text<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const Subtitle = styled.Text<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const SessionStrip = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px ${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.lg}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const SessionCopy = styled(View)<StyledProps>`
  flex: 1;
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const SessionTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.displaySmall};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const SessionHint = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const SessionBadge = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.textMedium};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
`;

const BentoGrid = styled(View)<StyledProps>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xl}px`};
`;

const BentoTile = styled(TouchableOpacity)<StyledProps>`
  flex: 1;
  min-width: 46%;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.lg}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const BentoTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const BentoHint = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  line-height: 18px;
`;

const SectionTitle = styled.Text<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h2}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const SectionCaption = styled.Text<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const MethodRow = styled(ScrollView).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-grow: 0;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
`;

const MethodOrb = styled(TouchableOpacity)`
  width: 76px;
  align-items: center;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const OrbCircle = styled(View)<{ $selected?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({
    theme,
    $selected,
  }: {
    theme: DefaultTheme;
    $selected?: boolean;
  }) =>
    $selected ? theme.colors.accent.gold : theme.colors.functional.border};
  background-color: ${({
    theme,
    $selected,
  }: {
    theme: DefaultTheme;
    $selected?: boolean;
  }) =>
    $selected ? theme.colors.background.card : theme.colors.background.primary};
`;

const OrbLabel = styled(Text)<StyledProps>`
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 76px;
`;

const RecipeTitle = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h3}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const RecipeDescription = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
`;

const RecipeMeta = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const MetaText = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const Centered = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.xl}px`};
  align-items: center;
`;

const ErrorText = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.error};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const RecentRow = styled(TouchableOpacity)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const RecentTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.displaySmall};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const RecentMeta = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const ViewAllHint = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

function formatRecentFinished(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

type RecipeCardProps = {
  recipe: Recipe;
  onPress: () => void;
  variant: "featured" | "default";
};

const RecipeCard = React.memo(function RecipeCard({
  recipe,
  onPress,
  variant,
}: RecipeCardProps) {
  const metaRight =
    variant === "featured" ? recipe.difficulty : recipe.brewMethod;
  return (
    <Card
      imageSource={recipeImageSource(recipe.id, recipe.imageUrl)}
      onPress={onPress}
    >
      <RecipeTitle>{recipe.title}</RecipeTitle>
      <RecipeDescription numberOfLines={variant === "default" ? 2 : undefined}>
        {recipe.description}
      </RecipeDescription>
      <RecipeMeta>
        <MetaText>⏱ {recipe.brewTime}</MetaText>
        <MetaText>{metaRight}</MetaText>
      </RecipeMeta>
    </Card>
  );
});

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [recentBrews, setRecentBrews] = useState<BrewLogEntry[]>([]);

  const loadRecent = useCallback(async () => {
    await brewHistoryService.init();
    const r = await brewHistoryService.getRecent(3);
    setRecentBrews(r);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecent();
    }, [loadRecent]),
  );

  const load = useCallback(
    () =>
      recipeService
        .init()
        .then(() => recipeService.getAllRecipes())
        .then((list) => {
          setRecipes(list);
          return loadRecent();
        })
        .catch(() => {
          setError("Could not load recipes.");
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        }),
    [loadRecent],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const filteredRecipes = useMemo(() => {
    if (!methodFilter) {
      return recipes;
    }
    return recipes.filter((r) => r.brewMethod === methodFilter);
  }, [recipes, methodFilter]);

  const brewMethodsSorted = useMemo(() => {
    const set = new Set(recipes.map((r) => r.brewMethod));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  const featured = useMemo(
    () => filteredRecipes.slice(0, 2),
    [filteredRecipes],
  );
  const featuredIds = useMemo(
    () => new Set(featured.map((r) => r.id)),
    [featured],
  );
  const restRecipes = useMemo(
    () => filteredRecipes.filter((r) => !featuredIds.has(r.id)),
    [filteredRecipes, featuredIds],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.colors.accent.gold}
        colors={[theme.colors.accent.gold]}
      />
    ),
    [refreshing, onRefresh, theme.colors.accent.gold],
  );

  const openMoreTab = useCallback(() => {
    const tab = navigation.getParent();
    tab?.navigate("More" as never);
  }, [navigation]);

  const retryLoad = useCallback(() => {
    setError(null);
    setLoading(true);
    void load();
  }, [load]);

  if (loading) {
    return (
      <Container>
        <Centered
          accessibilityLiveRegion="polite"
          accessibilityLabel="Loading recipes"
        >
          <ActivityIndicator size="large" color={theme.colors.accent.gold} />
        </Centered>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content contentContainerStyle={{ paddingTop: 24 }}>
          <ScreenTitle accessibilityRole="header">Brew Master</ScreenTitle>
          <ErrorText accessibilityRole="alert">{error}</ErrorText>
          <Button
            title="Try again"
            onPress={retryLoad}
            fullWidth
            accessibilityHint="Reloads the recipe list from storage"
          />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content refreshControl={refreshControl}>
        <ScreenTitle>Brew Master</ScreenTitle>
        <Subtitle>Recipes for calmer mornings</Subtitle>

        <Section>
          <SectionTitle>Recent brews</SectionTitle>
          {recentBrews.length === 0 ? (
            <SectionCaption>
              Complete a guided brew to build your on-device log.
            </SectionCaption>
          ) : (
            <>
              {recentBrews.map((b) => (
                <RecentRow
                  key={b.id}
                  onPress={() =>
                    navigation.navigate("RecipeDetails", {
                      recipeId: b.recipeId,
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${b.recipeTitle}, ${formatRecentFinished(b.finishedAt)}`}
                >
                  <RecentTitle numberOfLines={2}>{b.recipeTitle}</RecentTitle>
                  <RecentMeta>
                    {b.brewMethod} · {formatRecentFinished(b.finishedAt)}
                  </RecentMeta>
                </RecentRow>
              ))}
              <TouchableOpacity
                onPress={() => navigation.navigate("History")}
                accessibilityRole="button"
                accessibilityLabel="View full brew history"
              >
                <ViewAllHint>View all brew history</ViewAllHint>
              </TouchableOpacity>
            </>
          )}
        </Section>

        <SessionStrip>
          <Ionicons
            name="bluetooth-outline"
            size={22}
            color={theme.colors.text.tertiary}
          />
          <SessionCopy>
            <SessionTitle>Gear & scales</SessionTitle>
            <SessionHint>
              Timers work offline — Bluetooth pairing arrives later.
            </SessionHint>
          </SessionCopy>
          <SessionBadge>Soon</SessionBadge>
        </SessionStrip>

        <BentoGrid>
          <BentoTile onPress={() => setMethodFilter(null)} activeOpacity={0.85}>
            <BentoTitle>Every method</BentoTitle>
            <BentoHint>
              Clear filters — browse the full library like a tasting flight.
            </BentoHint>
          </BentoTile>
          <BentoTile onPress={openMoreTab} activeOpacity={0.85}>
            <BentoTitle>Slower corners</BentoTitle>
            <BentoHint>
              Notes, roadmap, and settings — keep the counter uncluttered.
            </BentoHint>
          </BentoTile>
        </BentoGrid>

        <Section>
          <SectionTitle>Brew methods</SectionTitle>
          <SectionCaption>Select a guide to narrow the list.</SectionCaption>
          <MethodRow contentContainerStyle={{ paddingVertical: 4 }}>
            <MethodOrb onPress={() => setMethodFilter(null)}>
              <OrbCircle $selected={methodFilter === null}>
                <Ionicons
                  name="apps-outline"
                  size={26}
                  color={
                    methodFilter === null
                      ? theme.colors.accent.gold
                      : theme.colors.text.tertiary
                  }
                />
              </OrbCircle>
              <OrbLabel numberOfLines={2}>All</OrbLabel>
            </MethodOrb>
            {brewMethodsSorted.map((method) => {
              const sel = methodFilter === method;
              return (
                <MethodOrb key={method} onPress={() => setMethodFilter(method)}>
                  <OrbCircle $selected={sel}>
                    <Ionicons
                      name={brewMethodIcon(method)}
                      size={26}
                      color={
                        sel
                          ? theme.colors.accent.gold
                          : theme.colors.text.tertiary
                      }
                    />
                  </OrbCircle>
                  <OrbLabel numberOfLines={2}>{method}</OrbLabel>
                </MethodOrb>
              );
            })}
          </MethodRow>
        </Section>

        {featured.length > 0 && (
          <Section>
            <SectionTitle>Featured</SectionTitle>
            {featured.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                variant="featured"
                onPress={() =>
                  navigation.navigate("RecipeDetails", {
                    recipeId: recipe.id,
                  })
                }
              />
            ))}
          </Section>
        )}

        <Section>
          <SectionTitle>All recipes</SectionTitle>
          {restRecipes.length === 0 ? (
            <SectionCaption>No recipes for this filter yet.</SectionCaption>
          ) : (
            restRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                variant="default"
                onPress={() =>
                  navigation.navigate("RecipeDetails", { recipeId: recipe.id })
                }
              />
            ))
          )}
        </Section>
      </Content>
    </Container>
  );
};
