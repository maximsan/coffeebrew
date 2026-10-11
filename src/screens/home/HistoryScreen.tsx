import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { styled, DefaultTheme, useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import {
  brewHistoryService,
  BrewLogEntry,
  MAX_BREW_HISTORY_ENTRIES,
} from "../../services/brewHistory";
import { StyledProps } from "../../theme/styled-components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "History">;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const HeaderPad = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  padding-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const Title = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.heading};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const Caption = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const Row = styled(TouchableOpacity)<StyledProps>`
  margin-horizontal: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.border};
`;

const RowTitle = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.serifText};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

const RowMeta = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const EmptyBox = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.xl}px`};
  align-items: center;
`;

const EmptyText = styled.Text<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 22px;
`;

function formatFinished(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDurationMinutes(
  startedIso: string,
  finishedIso: string,
): string {
  try {
    const a = new Date(startedIso).getTime();
    const b = new Date(finishedIso).getTime();
    const m = Math.max(0, Math.round((b - a) / 60000));
    if (m === 0) {
      return "< 1 min";
    }
    return `${m} min`;
  } catch {
    return "—";
  }
}

export const HistoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [entries, setEntries] = useState<BrewLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await brewHistoryService.init();
    const list = await brewHistoryService.getAll();
    setEntries(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      load().finally(() => {
        if (active) {
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const renderItem: ListRenderItem<BrewLogEntry> = useCallback(
    ({ item }) => (
      <Row
        onPress={() =>
          navigation.navigate("RecipeDetails", { recipeId: item.recipeId })
        }
        accessibilityRole="button"
        accessibilityLabel={`${item.recipeTitle}, ${item.brewMethod}`}
      >
        <RowTitle numberOfLines={2}>{item.recipeTitle}</RowTitle>
        <RowMeta>
          {item.brewMethod} · {formatFinished(item.finishedAt)} ·{" "}
          {formatDurationMinutes(item.startedAt, item.finishedAt)}
        </RowMeta>
      </Row>
    ),
    [navigation],
  );

  if (loading) {
    return (
      <Container>
        <HeaderPad>
          <Title>Brew history</Title>
        </HeaderPad>
        <EmptyBox>
          <ActivityIndicator color={theme.colors.accent.gold} size="large" />
        </EmptyBox>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        style={{ flex: 1 }}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <HeaderPad>
            <Title>Brew history</Title>
            <Caption>
              Stored on this device only — last {MAX_BREW_HISTORY_ENTRIES}{" "}
              brews.
            </Caption>
          </HeaderPad>
        }
        ListEmptyComponent={
          <EmptyBox>
            <EmptyText>
              No brews logged yet. Finish a guided session from a recipe to see
              it here.
            </EmptyText>
          </EmptyBox>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent.gold}
            colors={[theme.colors.accent.gold]}
          />
        }
      />
    </Container>
  );
};
