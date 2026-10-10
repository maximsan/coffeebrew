import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "../../navigation/types";
import { StyledProps } from "../../theme/styled-components";
import { Button } from "../../components/Button";
import { liquidLabelForMethod } from "../../services/recipeDose";
import { brewHistoryService } from "../../services/brewHistory";

type T = { theme: DefaultTheme };

type Route = RouteProp<HomeStackParamList, "BrewComplete">;
type Nav = NativeStackNavigationProp<HomeStackParamList, "BrewComplete">;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: T) => theme.colors.background.primary};
`;

const TopBar = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: T) => `${theme.spacing.md}px ${theme.spacing.lg}px`};
`;

const CloseLink = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.textMedium};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: T) => theme.colors.accent.gold};
`;

const Content = styled(ScrollView)<StyledProps>`
  flex: 1;
  padding: 0 ${({ theme }: T) => `${theme.spacing.lg}px`};
  padding-bottom: ${({ theme }: T) => `${theme.spacing.xl}px`};
`;

const Hero = styled(View)<StyledProps>`
  align-items: center;
  margin-top: ${({ theme }: T) => `${theme.spacing.md}px`};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.lg}px`};
`;

const MugRing = styled(View)<StyledProps>`
  width: 112px;
  height: 112px;
  border-radius: 56px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: T) => theme.colors.background.secondary};
  border-width: 2px;
  border-color: ${({ theme }: T) => theme.colors.functional.border};
`;

const Headline = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.display};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }: T) => `${theme.spacing.sm}px`};
`;

const Subhead = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: T) => theme.colors.text.secondary};
  text-align: center;
  line-height: 22px;
  padding-horizontal: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

const SummaryCard = styled(View)<StyledProps>`
  margin-top: ${({ theme }: T) => `${theme.spacing.xl}px`};
  padding: ${({ theme }: T) => `${theme.spacing.lg}px`};
  border-radius: ${({ theme }: T) => `${theme.borderRadius.lg}px`};
  background-color: ${({ theme }: T) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: T) => theme.colors.functional.border};
`;

const CardStamp = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: T) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.sm}px`};
`;

const MethodTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.display};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h2}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.lg}px`};
`;

const StatGrid = styled(View)<StyledProps>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

const StatCell = styled(View)<StyledProps>`
  width: 47%;
  padding: ${({ theme }: T) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: T) => `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: T) => theme.colors.background.secondary};
`;

const StatLabel = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: T) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.xs}px`};
`;

const StatValue = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.display};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
`;

const WaveDecoration = styled(View)<StyledProps>`
  height: 4px;
  margin-top: ${({ theme }: T) => `${theme.spacing.lg}px`};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.sm}px`};
  border-radius: 2px;
  background-color: ${({ theme }: T) => theme.colors.accent.gold};
  opacity: 0.2;
`;

const Actions = styled(View)<StyledProps>`
  margin-top: ${({ theme }: T) => `${theme.spacing.lg}px`};
  gap: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

function formatStamp(): string {
  const d = new Date();
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };
  return d.toLocaleString(undefined, opts);
}

export const BrewCompleteScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const {
    recipeId,
    recipeTitle,
    brewMethod,
    brewTime,
    difficulty,
    stepCount,
    coffeeGrams,
    waterGrams,
    startedAt,
  } = route.params;

  const liquidLabel = liquidLabelForMethod(brewMethod);
  const historySaveAttemptedRef = useRef(false);

  useEffect(() => {
    if (historySaveAttemptedRef.current) {
      return;
    }
    historySaveAttemptedRef.current = true;
    const finishedAt = new Date().toISOString();
    const startedIso = new Date(startedAt).toISOString();
    void (async () => {
      try {
        await brewHistoryService.init();
        await brewHistoryService.addEntry({
          recipeId,
          recipeTitle,
          brewMethod,
          startedAt: startedIso,
          finishedAt,
          coffeeGrams,
          waterGrams,
          stepCount,
        });
      } catch (e) {
        console.warn("brew history save failed", e);
        Alert.alert(
          "Could not save to history",
          "Your brew is complete, but the app could not write this session to local storage. Nothing was synced.",
        );
      }
    })();
  }, [
    recipeId,
    recipeTitle,
    brewMethod,
    startedAt,
    coffeeGrams,
    waterGrams,
    stepCount,
  ]);

  const backHome = () => {
    navigation.popToTop();
  };

  const notesPlaceholder = () => {
    Alert.alert(
      "Tasting notes",
      "A dedicated journal is on the roadmap — for now, jot flavors in your favorite notes app.",
    );
  };

  return (
    <Container>
      <TopBar>
        <TouchableOpacity
          onPress={backHome}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Done"
          accessibilityHint="Returns to the recipe home screen"
        >
          <CloseLink>Done</CloseLink>
        </TouchableOpacity>
      </TopBar>

      <Content>
        <Hero>
          <MugRing>
            <Ionicons
              name="leaf-outline"
              size={44}
              color={theme.colors.functional.water}
            />
          </MugRing>
          <WaveDecoration />
          <Headline>Nicely done</Headline>
          <Subhead>
            Take a sip while it cools — warm cups suit bright acids; cooler cups
            highlight sweetness.
          </Subhead>
        </Hero>

        <SummaryCard>
          <CardStamp>{formatStamp()}</CardStamp>
          <MethodTitle numberOfLines={2}>{recipeTitle}</MethodTitle>
          <StatGrid>
            <StatCell>
              <StatLabel>Coffee</StatLabel>
              <StatValue>{coffeeGrams} g</StatValue>
            </StatCell>
            <StatCell>
              <StatLabel>{liquidLabel}</StatLabel>
              <StatValue>{waterGrams} g</StatValue>
            </StatCell>
            <StatCell>
              <StatLabel>Target time</StatLabel>
              <StatValue>{brewTime}</StatValue>
            </StatCell>
            <StatCell>
              <StatLabel>Difficulty</StatLabel>
              <StatValue>{difficulty}</StatValue>
            </StatCell>
            <StatCell>
              <StatLabel>Method</StatLabel>
              <StatValue numberOfLines={2}>{brewMethod}</StatValue>
            </StatCell>
            <StatCell>
              <StatLabel>Steps guided</StatLabel>
              <StatValue>{stepCount}</StatValue>
            </StatCell>
          </StatGrid>
        </SummaryCard>

        <Actions>
          <Button title="Back to home" onPress={backHome} fullWidth />
          <Button
            title="Jot a quick note"
            onPress={notesPlaceholder}
            variant="outline"
            fullWidth
          />
        </Actions>

        {Platform.OS === "ios" ? (
          <Text style={{ height: theme.spacing.lg }} />
        ) : null}
      </Content>
    </Container>
  );
};
