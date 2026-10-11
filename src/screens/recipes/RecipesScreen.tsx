// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React from "react";
import { FlatList } from "react-native";
import { styled } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RecipesStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { recipeImageSource } from "../../utils/recipeImages";
import { Button } from "../../components/Button";
import { StyledProps } from "../../theme/styled-components";

type RecipesScreenNavigationProp = NativeStackNavigationProp<
  RecipesStackParamList,
  "RecipesList"
>;

interface Recipe {
  id: string;
  title: string;
  description: string;
  brewTime: string;
  difficulty: string;
}

const Container = styled.View<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const Header = styled.View<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const FilterButton = styled(Button)<StyledProps>`
  margin-left: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const Content = styled.View<StyledProps>`
  flex: 1;
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

// Mock data - replace with actual data from API
const recipes: Recipe[] = [
  {
    id: "1",
    title: "Perfect Pour Over",
    description: "A classic pour-over recipe for a clean, balanced cup.",
    brewTime: "3:30",
    difficulty: "Medium",
  },
  {
    id: "2",
    title: "Rich Espresso",
    description: "Full-bodied espresso with perfect crema.",
    brewTime: "0:30",
    difficulty: "Hard",
  },
  {
    id: "3",
    title: "Cold Brew",
    description: "Smooth, low-acid cold brew for hot summer days.",
    brewTime: "12:00",
    difficulty: "Easy",
  },
  {
    id: "4",
    title: "French Press",
    description: "Classic French press for a full-bodied cup.",
    brewTime: "4:00",
    difficulty: "Easy",
  },
];

export const RecipesScreen = () => {
  const navigation = useNavigation<RecipesScreenNavigationProp>();

  const handleFilter = () => {
    // TODO: Implement filter functionality
    navigation.navigate("FilterRecipes");
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <Card
      imageSource={recipeImageSource(item.id)}
      onPress={() =>
        navigation.navigate("RecipeDetails", { recipeId: item.id })
      }
    >
      <RecipeTitle>{item.title}</RecipeTitle>
      <RecipeDescription>{item.description}</RecipeDescription>
      <RecipeMeta>
        <MetaText>⏱ {item.brewTime}</MetaText>
        <MetaText>📊 {item.difficulty}</MetaText>
      </RecipeMeta>
    </Card>
  );

  return (
    <Container>
      <Header>
        <Title>Recipes</Title>
        <FilterButton
          title="Filter"
          onPress={handleFilter}
          variant="secondary"
          size="small"
        />
      </Header>
      <Content>
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Content>
    </Container>
  );
};

const RecipeTitle = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const RecipeDescription = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
`;

const RecipeMeta = styled.View<StyledProps>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const MetaText = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  margin-right: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;
