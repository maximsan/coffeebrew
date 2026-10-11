// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { styled, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ImagePickerComponent } from "../../components/ImagePicker";
import { recipeService } from "../../services/recipes";
import { authService } from "../../services/auth";
import { StyledProps } from "../../theme/styled-components";

type CreateScreenNavigationProp = NavigationProp<ParamListBase>;

const Container = styled.View<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const ContentContainer = styled.View<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const FormGroup = styled.View<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Label = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const Input = styled.TextInput<StyledProps>`
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const TextArea = styled(TextInput)<StyledProps>`
  height: 120px;
  text-align-vertical: top;
`;

const StepContainer = styled.View<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const StepHeader = styled.View<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const StepTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const StepInput = styled.TextInput<StyledProps>`
  flex: 1;
  margin: 0 ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.sm}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
`;

const AddStepButton = styled.TouchableOpacity<StyledProps>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const AddStepText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-left: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const DeleteStepButton = styled.TouchableOpacity<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const ButtonContainer = styled.View<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Button = styled.TouchableOpacity<
  { variant: "primary" | "secondary" } & StyledProps
>`
  flex: 1;
  background-color: ${({
    theme,
    variant,
  }: StyledProps & { variant: "primary" | "secondary" }) =>
    variant === "primary"
      ? theme.colors.accent.gold
      : theme.colors.background.secondary};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  align-items: center;
  margin: 0 ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const ButtonText = styled.Text<
  { variant: "primary" | "secondary" } & StyledProps
>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({
    theme,
    variant,
  }: StyledProps & { variant: "primary" | "secondary" }) =>
    variant === "primary"
      ? theme.colors.text.primary
      : theme.colors.text.primary};
`;

const SectionTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

export const CreateRecipeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [brewTime, setBrewTime] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [brewMethod, setBrewMethod] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const handleStepChange = (text: string, index: number): void => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const handleSaveRecipe = async () => {
    if (
      !title ||
      !description ||
      !brewTime ||
      !brewMethod ||
      steps.some((step) => !step)
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert("Error", "You must be logged in to create a recipe");
        return;
      }

      const trimmedSteps = steps
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const recipeData = {
        title,
        description,
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        brewTime: `${brewTime} min`,
        difficulty,
        brewMethod,
        steps: trimmedSteps.map((instruction, index) => ({
          id: String(index + 1),
          time: "0:00",
          instruction,
        })),
      };

      await recipeService.createRecipe(recipeData, user.id);
      Alert.alert("Success", "Recipe created successfully");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Failed to create recipe");
      console.error(error);
    }
  };

  const handleImageSelected = (uri: string) => {
    setImageUrl(uri);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <ContentContainer>
            <FormGroup>
              <Label>Recipe Image</Label>
              <ImagePickerComponent
                imageUri={imageUrl}
                onImageSelected={handleImageSelected}
                size="medium"
              />
            </FormGroup>

            <FormGroup>
              <Label>Title</Label>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Enter recipe title"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="Enter recipe description"
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
              />
            </FormGroup>

            <FormGroup>
              <Label>Brew Time (minutes)</Label>
              <Input
                value={brewTime}
                onChangeText={setBrewTime}
                placeholder="Enter brew time in minutes"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="numeric"
              />
            </FormGroup>

            <FormGroup>
              <Label>Difficulty</Label>
              <Input
                value={difficulty}
                onChangeText={setDifficulty}
                placeholder="Enter difficulty level"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </FormGroup>

            <FormGroup>
              <Label>Brew Method</Label>
              <Input
                value={brewMethod}
                onChangeText={setBrewMethod}
                placeholder="Enter brew method"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </FormGroup>

            <SectionTitle>Brewing Steps</SectionTitle>
            {steps.map((step, index) => (
              <StepContainer key={index}>
                <StepHeader>
                  <StepTitle>Step {index + 1}</StepTitle>
                  <DeleteStepButton onPress={() => handleDeleteStep(index)}>
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={theme.colors.functional.error}
                    />
                  </DeleteStepButton>
                </StepHeader>
                <StepInput
                  value={step}
                  onChangeText={(text: string) => handleStepChange(text, index)}
                  placeholder={`Enter step ${index + 1}`}
                  placeholderTextColor={theme.colors.text.tertiary}
                  multiline
                />
              </StepContainer>
            ))}

            <AddStepButton onPress={handleAddStep}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.colors.text.primary}
              />
              <AddStepText>Add Step</AddStepText>
            </AddStepButton>

            <ButtonContainer>
              <Button variant="secondary" onPress={() => navigation.goBack()}>
                <ButtonText variant="secondary">Cancel</ButtonText>
              </Button>
              <Button variant="primary" onPress={handleSaveRecipe}>
                <ButtonText variant="primary">Save Recipe</ButtonText>
              </Button>
            </ButtonContainer>
          </ContentContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
