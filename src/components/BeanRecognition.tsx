// Postponed past v1 — only non-v1 screens use this; see docs/v2_backlog.md
import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { aiService, BeanAnalysis } from "../services/ai";
import { StyledProps } from "../theme/styled-components";

interface BeanRecognitionProps {
  onAnalysisComplete?: (analysis: BeanAnalysis) => void;
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

const SectionTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const CameraButton = styled.TouchableOpacity<StyledProps>`
  background-color: ${({ theme }: StyledProps) => theme.colors.accent.gold};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  padding: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const ButtonText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const ImagePreview = styled.Image<StyledProps>`
  width: 100%;
  height: 200px;
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.md}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.md}px`};
`;

const InfoItem = styled.View<StyledProps>`
  flex-direction: row;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const InfoLabel = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.secondary};
  width: 120px;
`;

const InfoValue = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  flex: 1;
`;

const FlavorTag = styled.View<StyledProps>`
  background-color: ${({ theme }: StyledProps) =>
    theme.colors.background.secondary};
  border-radius: ${({ theme }: StyledProps) => `${theme.borderRadius.sm}px`};
  padding: ${({ theme }: StyledProps) =>
    `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  margin-right: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const FlavorTagText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const FlavorTagsContainer = styled.View<StyledProps>`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const MethodItem = styled.View<StyledProps>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: StyledProps) => `${theme.spacing.xs}px`};
`;

const MethodIcon = styled.View<StyledProps>`
  margin-right: ${({ theme }: StyledProps) => `${theme.spacing.sm}px`};
`;

const MethodText = styled.Text<StyledProps>`
  font-family: ${({ theme }: StyledProps) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: StyledProps) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const RecipeLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const RecipeLinkText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  text-decoration: underline;
`;

export const BeanRecognition: React.FC<BeanRecognitionProps> = ({
  onAnalysisComplete,
  onClose,
}) => {
  const theme = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BeanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      analyzeBean(result.assets[0].uri);
    }
  };

  const analyzeBean = async (uri: string) => {
    setLoading(true);
    try {
      const result = await aiService.analyzeBeanImage(uri);
      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error("Failed to analyze bean image:", error);
      alert("Failed to analyze the bean image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Bean Recognition</Title>
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
          <SectionTitle>Scan Your Beans</SectionTitle>
          <CameraButton onPress={pickImage}>
            <Ionicons
              name="camera"
              size={24}
              color={theme.colors.text.primary}
            />
            <ButtonText>Take a Photo</ButtonText>
          </CameraButton>

          {loading && (
            <View style={{ alignItems: "center", padding: 20 }}>
              <ActivityIndicator
                size="large"
                color={theme.colors.accent.gold}
              />
              <ButtonText>Analyzing your beans...</ButtonText>
            </View>
          )}

          {imageUri && !loading && (
            <ImagePreview source={{ uri: imageUri }} resizeMode="cover" />
          )}

          {analysis && !loading && (
            <>
              <Section>
                <SectionTitle>Bean Information</SectionTitle>
                <InfoItem>
                  <InfoLabel>Bean Type:</InfoLabel>
                  <InfoValue>{analysis.beanType}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Roast Level:</InfoLabel>
                  <InfoValue>{analysis.roastLevel}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Origin:</InfoLabel>
                  <InfoValue>{analysis.origin}</InfoValue>
                </InfoItem>
              </Section>

              <Section>
                <SectionTitle>Flavor Notes</SectionTitle>
                <FlavorTagsContainer>
                  {analysis.flavorNotes.map((note, index) => (
                    <FlavorTag key={index}>
                      <FlavorTagText>{note}</FlavorTagText>
                    </FlavorTag>
                  ))}
                </FlavorTagsContainer>
              </Section>

              <Section>
                <SectionTitle>Recommended Brew Methods</SectionTitle>
                {analysis.recommendedBrewMethods.map((method, index) => (
                  <MethodItem key={index}>
                    <MethodIcon>
                      <Ionicons
                        name="cafe"
                        size={20}
                        color={theme.colors.accent.gold}
                      />
                    </MethodIcon>
                    <MethodText>{method}</MethodText>
                  </MethodItem>
                ))}
              </Section>

              <Section>
                <SectionTitle>Recommended Recipes</SectionTitle>
                {analysis.recommendedRecipes.map((recipe, index) => (
                  <RecipeLink key={index}>
                    <Ionicons
                      name="book-outline"
                      size={20}
                      color={theme.colors.accent.gold}
                    />
                    <RecipeLinkText style={{ marginLeft: 8 }}>
                      {recipe}
                    </RecipeLinkText>
                  </RecipeLink>
                ))}
              </Section>
            </>
          )}
        </Section>
      </ScrollView>
    </Container>
  );
};
