// Postponed past V1 — not in the V1 navigator; see docs/v2_backlog.md
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  Text,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styled, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { BrewTimer } from "../../components/BrewTimer";
import { Rating } from "../../components/Rating";
import { Comments } from "../../components/Comments";
import { recipeService, Recipe } from "../../services/recipes";
import { recipeImageSource } from "../../utils/recipeImages";
import { authService } from "../../services/auth";
import { StyledProps } from "../../theme/styled-components";
import { User } from "../../types/user";
import { Comment } from "../../types/comment";

/** Parse recipe `brewTime` like `3:30` into seconds for the demo timer. */
function brewTimeToSeconds(brewTime: string): number {
  const trimmed = brewTime.trim();
  const colon = trimmed.split(":");
  if (colon.length === 2) {
    const m = parseInt(colon[0], 10);
    const s = parseInt(colon[1], 10);
    if (Number.isFinite(m) && Number.isFinite(s) && m >= 0 && s >= 0) {
      return m * 60 + s;
    }
  }
  const n = Number(trimmed);
  if (Number.isFinite(n) && n > 0) {
    return n * 60;
  }
  return 180;
}

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const StyledScrollView = styled(ScrollView)<StyledProps>`
  flex: 1;
`;

const HeaderImage = styled(Image)<StyledProps>`
  width: 100%;
  height: 200px;
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const ContentContainer = styled(View)<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Title = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const Description = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const InfoContainer = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const InfoItem = styled(View)<StyledProps>`
  align-items: center;
`;

const InfoLabel = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const InfoValue = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const SectionTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const StepsSection = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
`;

const StepsHeader = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const StepsHeaderLeft = styled(View)`
  flex: 1;
  padding-right: 12px;
`;

const StepsHeaderTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const StepsHeaderHint = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const StepItem = styled(View)<StyledProps>`
  flex-direction: row;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const StepColumn = styled(View)`
  flex: 1;
`;

const StepTimeLabel = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const StepNumber = styled(View)<StyledProps>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const StepNumberText = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.onAccent};
`;

const StepText = styled(Text)<StyledProps>`
  flex: 1;
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const ActionButtons = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const ActionButton = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const ActionButtonText = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-left: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const RatingContainer = styled(View)<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const RatingHeader = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const RatingTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const AverageRating = styled(Text)<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
`;

export const RecipeDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadError(null);
        const recipeId = (route.params as { recipeId?: string }).recipeId;
        if (!recipeId) {
          setLoadError("Missing recipe.");
          return;
        }
        await recipeService.init();
        const recipeData = await recipeService.getRecipeById(recipeId);
        if (!recipeData) {
          setLoadError("Recipe not found.");
          return;
        }
        setRecipe(recipeData);

        // TODO: Replace with actual API call
        const mockComments: Comment[] = [
          {
            id: "1",
            userId: "user1",
            userName: "Coffee Lover",
            text: "This recipe is amazing! The flavor is perfect.",
            createdAt: new Date("2023-05-15"),
          },
          {
            id: "2",
            userId: "user2",
            userName: "Barista Pro",
            text: "I've been using this method for years. Great instructions!",
            createdAt: new Date("2023-05-10"),
          },
        ];
        setComments(mockComments);

        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch {
        setLoadError("Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params]);

  const handleShare = async () => {
    if (!recipe) return;

    try {
      await Share.share({
        message: `Check out this coffee recipe: ${recipe.title}\n\n${recipe.description}`,
        title: recipe.title,
      });
    } catch {
      Alert.alert("Error", "Failed to share recipe");
    }
  };

  const handleFavorite = () => {
    // Would implement favorite functionality
    Alert.alert("Info", "Favorite functionality will be implemented soon");
  };

  const handleRatingChange = async (value: number) => {
    if (!recipe || !currentUser) return;

    try {
      setUserRating(value);
      // TODO: Implement API call to save rating
      // await recipeService.saveRating(recipe.id, currentUser.id, value);
    } catch {
      Alert.alert("Error", "Failed to save rating");
    }
  };

  const handleAddComment = async (text: string) => {
    if (!currentUser || !recipe) return;

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        text,
        createdAt: new Date(),
      };

      // TODO: Implement API call to save comment
      // await recipeService.saveComment(recipe.id, newComment);
      setComments([newComment, ...comments]);
    } catch {
      Alert.alert("Error", "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!recipe) return;

    try {
      // TODO: Implement API call to delete comment
      // await recipeService.deleteComment(recipe.id, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch {
      Alert.alert("Error", "Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <Container>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <InfoValue>Loading...</InfoValue>
        </View>
      </Container>
    );
  }

  if (loadError || !recipe) {
    return (
      <Container>
        <ContentContainer style={{ flex: 1, justifyContent: "center" }}>
          <Title accessibilityRole="header">Recipe</Title>
          <Description accessibilityRole="alert">
            {loadError ?? "Recipe not found."}
          </Description>
          <ActionButton
            onPress={() => navigation.goBack()}
            style={{ alignSelf: "flex-start", marginTop: 16 }}
          >
            <ActionButtonText>Go back</ActionButtonText>
          </ActionButton>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StyledScrollView>
        <HeaderImage
          source={recipeImageSource(recipe.id, recipe.imageUrl)}
          resizeMode="cover"
        />
        <ContentContainer>
          <Title>{recipe.title}</Title>
          <Description>{recipe.description}</Description>

          <InfoContainer>
            <InfoItem>
              <InfoLabel>Brew Time</InfoLabel>
              <InfoValue>{recipe.brewTime}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Difficulty</InfoLabel>
              <InfoValue>{recipe.difficulty}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Method</InfoLabel>
              <InfoValue>{recipe.brewMethod}</InfoValue>
            </InfoItem>
          </InfoContainer>

          <ActionButtons>
            <ActionButton onPress={handleShare}>
              <Ionicons
                name="share-outline"
                size={24}
                color={theme.colors.text.primary}
              />
              <ActionButtonText>Share</ActionButtonText>
            </ActionButton>
            <ActionButton onPress={handleFavorite}>
              <Ionicons
                name="heart-outline"
                size={24}
                color={theme.colors.text.primary}
              />
              <ActionButtonText>Favorite</ActionButtonText>
            </ActionButton>
          </ActionButtons>

          <StepsSection>
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
                  <StepItem key={step.id}>
                    <StepNumber>
                      <StepNumberText>{index + 1}</StepNumberText>
                    </StepNumber>
                    <StepColumn>
                      <StepTimeLabel>{step.time}</StepTimeLabel>
                      <StepText>{step.instruction}</StepText>
                    </StepColumn>
                  </StepItem>
                ))
              : null}
          </StepsSection>

          <SectionTitle>Brew Timer</SectionTitle>
          <BrewTimer
            initialTime={brewTimeToSeconds(recipe.brewTime)}
            onComplete={() =>
              Alert.alert("Timer Complete", "Your coffee is ready!")
            }
            vibrate={true}
          />

          <RatingContainer>
            <RatingHeader>
              <RatingTitle>Rate this Recipe</RatingTitle>
              <AverageRating>4.5 (128 ratings)</AverageRating>
            </RatingHeader>
            <Rating
              value={userRating}
              onValueChange={handleRatingChange}
              size={28}
            />
          </RatingContainer>

          <SectionTitle>Comments</SectionTitle>
          <Comments
            comments={comments}
            currentUserId={currentUser?.id || ""}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        </ContentContainer>
      </StyledScrollView>
    </Container>
  );
};
