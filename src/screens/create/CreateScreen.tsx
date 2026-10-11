// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React, { useState } from "react";

import { styled } from "styled-components/native";

import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { StyledProps } from "../../theme/styled-components";

/** Screen not mounted in v1 navigator — loose typing until recipe authoring returns. */
const Container = styled.View<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.primary};
`;

const Header = styled.View<StyledProps>`
  padding: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const Title = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const Content = styled.ScrollView<StyledProps>`
  flex: 1;
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const Section = styled.View<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
`;

const SectionTitle = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h2}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const ImageUploadContainer = styled.TouchableOpacity<StyledProps>`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
`;

const ImagePlaceholder = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
`;

const StepContainer = styled.View<StyledProps>`
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.lg}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: StyledProps) => theme.colors.background.card};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
`;

const StepHeader = styled.View<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const StepTitle = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
`;

const AddStepButton = styled(Button)<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const PublishButton = styled(Button)<StyledProps>`
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xl}px`};
`;

export const CreateScreen = () => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [brewMethod, setBrewMethod] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [steps, setSteps] = useState([{ id: "1", time: "", instruction: "" }]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { id: (steps.length + 1).toString(), time: "", instruction: "" },
    ]);
  };

  const handleUpdateStep = (id: string, field: string, value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing recipe:", {
      title: recipeTitle,
      description: recipeDescription,
      brewMethod,
      difficulty,
      steps,
    });
  };

  return (
    <Container>
      <Header>
        <Title>Create Recipe</Title>
      </Header>
      <Content>
        <Section>
          <SectionTitle>Basic Information</SectionTitle>
          <TextInput
            label="Recipe Title"
            value={recipeTitle}
            onChangeText={setRecipeTitle}
            placeholder="Enter recipe title"
          />
          <TextInput
            label="Description"
            value={recipeDescription}
            onChangeText={setRecipeDescription}
            placeholder="Describe your recipe"
            multiline
            numberOfLines={3}
          />
          <TextInput
            label="Brew Method"
            value={brewMethod}
            onChangeText={setBrewMethod}
            placeholder="e.g., Pour Over, Espresso, French Press"
          />
          <TextInput
            label="Difficulty"
            value={difficulty}
            onChangeText={setDifficulty}
            placeholder="e.g., Easy, Medium, Hard"
          />
        </Section>

        <Section>
          <SectionTitle>Recipe Image</SectionTitle>
          <ImageUploadContainer>
            <ImagePlaceholder>Tap to add an image</ImagePlaceholder>
          </ImageUploadContainer>
        </Section>

        <Section>
          <SectionTitle>Brewing Steps</SectionTitle>
          {steps.map((step) => (
            <StepContainer key={step.id}>
              <StepHeader>
                <StepTitle>Step {step.id}</StepTitle>
              </StepHeader>
              <TextInput
                label="Time"
                value={step.time}
                onChangeText={(value) =>
                  handleUpdateStep(step.id, "time", value)
                }
                placeholder="e.g., 0:00"
              />
              <TextInput
                label="Instruction"
                value={step.instruction}
                onChangeText={(value) =>
                  handleUpdateStep(step.id, "instruction", value)
                }
                placeholder="Enter step instruction"
                multiline
                numberOfLines={2}
              />
            </StepContainer>
          ))}
          <AddStepButton
            title="Add Step"
            onPress={handleAddStep}
            variant="secondary"
          />
        </Section>

        <PublishButton
          title="Publish Recipe"
          onPress={handlePublish}
          fullWidth
        />
      </Content>
    </Container>
  );
};
