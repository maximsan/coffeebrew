import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled, useTheme, DefaultTheme } from "styled-components/native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "../../navigation/types";
import { StyledProps } from "../../theme/styled-components";
import {
  formatRatioParts,
  liquidLabelForMethod,
} from "../../services/recipeDose";

type R = RouteProp<HomeStackParamList, "EditDose">;
type N = NativeStackNavigationProp<HomeStackParamList, "EditDose">;

type T = { theme: DefaultTheme };

const Safe = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: T) => theme.colors.background.primary};
`;

const Content = styled(ScrollView)<StyledProps>`
  flex: 1;
  padding: ${({ theme }: T) => `${theme.spacing.lg}px`};
`;

const HeaderRow = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }: T) => `${theme.spacing.lg}px`};
`;

const HeaderBtn = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.textMedium};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: T) => theme.colors.accent.gold};
`;

const HeaderTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
`;

const SectionTitle = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

const Card = styled(View)<StyledProps>`
  padding: ${({ theme }: T) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: T) => `${theme.borderRadius.lg}px`};
  background-color: ${({ theme }: T) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }: T) => theme.colors.functional.border};
  margin-bottom: ${({ theme }: T) => `${theme.spacing.lg}px`};
`;

const Row = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${({ theme }: T) => `${theme.spacing.sm}px`};
`;

const Label = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: T) => theme.colors.text.secondary};
`;

const ValueUnit = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: baseline;
`;

const ValueNum = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: T) => theme.colors.text.primary};
`;

const Unit = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.textMedium};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: T) => theme.colors.accent.gold};
  margin-left: 4px;
`;

const Stepper = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
`;

const StepBtn = styled(TouchableOpacity)<StyledProps>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }: T) => `${theme.borderRadius.md}px`};
  background-color: ${({ theme }: T) => theme.colors.background.tertiary};
  align-items: center;
  justify-content: center;
`;

const RatioRow = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }: T) => `${theme.spacing.md}px`};
  margin-top: ${({ theme }: T) => `${theme.spacing.sm}px`};
  border-top-width: 1px;
  border-top-color: ${({ theme }: T) => theme.colors.functional.border};
`;

const RatioText = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.h3}px`};
  color: ${({ theme }: T) => theme.colors.accent.gold};
`;

const Hint = styled(Text)<StyledProps>`
  font-family: ${({ theme }: T) => theme.typography.fontFamily.text};
  font-size: ${({ theme }: T) => `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: T) => theme.colors.text.tertiary};
  line-height: 20px;
  margin-top: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

const DoneBtnWrap = styled(View)<StyledProps>`
  margin-top: ${({ theme }: T) => `${theme.spacing.md}px`};
`;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export const EditDoseScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<R>();
  const navigation = useNavigation<N>();
  const {
    recipeId,
    coffeeGrams: initialC,
    waterGrams: initialW,
    brewMethod,
  } = route.params;

  const liquidLabel = liquidLabelForMethod(brewMethod);

  const [coffee, setCoffee] = useState(initialC);
  const [water, setWater] = useState(initialW);
  const [ratioLocked, setRatioLocked] = useState(true);
  const ratioRef = React.useRef(initialW / Math.max(1, initialC));

  const ratioParts = useMemo(
    () => formatRatioParts(coffee, water),
    [coffee, water],
  );

  const bumpCoffee = useCallback(
    (delta: number) => {
      setCoffee((c0) => {
        const c = clamp(Math.round(c0 + delta), 5, 120);
        if (ratioLocked) {
          const w = clamp(Math.round(c * ratioRef.current), 20, 3000);
          setWater(w);
        }
        return c;
      });
    },
    [ratioLocked],
  );

  const bumpWater = useCallback(
    (delta: number) => {
      setWater((w0) => {
        const w = clamp(Math.round(w0 + delta), 20, 3000);
        if (ratioLocked) {
          const c = clamp(Math.round(w / ratioRef.current), 5, 120);
          setCoffee(c);
        }
        return w;
      });
    },
    [ratioLocked],
  );

  const toggleLock = useCallback(() => {
    setRatioLocked((prev) => {
      const next = !prev;
      if (next) {
        ratioRef.current = water / Math.max(1, coffee);
      }
      return next;
    });
  }, [coffee, water]);

  const save = useCallback(() => {
    navigation.navigate({
      name: "RecipeDetails",
      params: {
        recipeId,
        sessionCoffee: coffee,
        sessionWater: water,
      },
      merge: true,
    });
  }, [navigation, recipeId, coffee, water]);

  const cancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Safe behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Container>
        <Content keyboardShouldPersistTaps="handled">
          <HeaderRow>
            <TouchableOpacity onPress={cancel} hitSlop={12}>
              <HeaderBtn>Cancel</HeaderBtn>
            </TouchableOpacity>
            <HeaderTitle>Edit dose</HeaderTitle>
            <View style={{ width: 56 }} />
          </HeaderRow>

          <SectionTitle>Dose amount</SectionTitle>
          <Card>
            <Row>
              <Label>Coffee</Label>
              <Stepper>
                <StepBtn
                  onPress={() => bumpCoffee(-1)}
                  accessibilityLabel="Less coffee"
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={theme.colors.text.primary}
                  />
                </StepBtn>
                <ValueUnit style={{ marginHorizontal: 16 }}>
                  <ValueNum>{coffee}</ValueNum>
                  <Unit>g</Unit>
                </ValueUnit>
                <StepBtn
                  onPress={() => bumpCoffee(1)}
                  accessibilityLabel="More coffee"
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={theme.colors.text.primary}
                  />
                </StepBtn>
              </Stepper>
            </Row>
            <Row>
              <Label>{liquidLabel}</Label>
              <Stepper>
                <StepBtn
                  onPress={() => bumpWater(-5)}
                  accessibilityLabel={`Less ${liquidLabel}`}
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={theme.colors.text.primary}
                  />
                </StepBtn>
                <ValueUnit style={{ marginHorizontal: 16 }}>
                  <ValueNum>{water}</ValueNum>
                  <Unit>g</Unit>
                </ValueUnit>
                <StepBtn
                  onPress={() => bumpWater(5)}
                  accessibilityLabel={`More ${liquidLabel}`}
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={theme.colors.text.primary}
                  />
                </StepBtn>
              </Stepper>
            </Row>
            <RatioRow>
              <Label>Ratio</Label>
              <TouchableOpacity
                onPress={toggleLock}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RatioText>
                  {ratioParts.left} : {ratioParts.right}
                </RatioText>
                <Ionicons
                  style={{ marginLeft: 8 }}
                  name={ratioLocked ? "lock-closed" : "lock-open-outline"}
                  size={22}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            </RatioRow>
          </Card>

          <Hint>
            {ratioLocked
              ? "Ratio stays linked — change coffee or water and the other follows."
              : "Ratio unlocked — adjust coffee and water independently."}
          </Hint>

          <DoneBtnWrap>
            <TouchableOpacity onPress={save} activeOpacity={0.85}>
              <View
                style={{
                  backgroundColor: theme.colors.accent.gold,
                  borderRadius: theme.borderRadius.md,
                  paddingVertical: theme.spacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.typography.fontFamily.textMedium,
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.onAccent,
                  }}
                >
                  Done
                </Text>
              </View>
            </TouchableOpacity>
          </DoneBtnWrap>
        </Content>
      </Container>
    </Safe>
  );
};
