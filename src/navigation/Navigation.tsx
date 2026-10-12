import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { MainTabParamList, HomeStackParamList } from "./types";

import { HomeScreen } from "../screens/home/HomeScreen";
import { RecipeDetailsScreen } from "../screens/home/RecipeDetailsScreen";
import { EditDoseScreen } from "../screens/home/EditDoseScreen";
import { BrewSessionScreen } from "../screens/home/BrewSessionScreen";
import { BrewCompleteScreen } from "../screens/home/BrewCompleteScreen";
import { HistoryScreen } from "../screens/home/HistoryScreen";
import { MoreScreen } from "../screens/home/MoreScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  const theme = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.heading,
        },
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          /** Used as the iOS back button label from deeper screens (e.g. « Home »). */
          title: "Home",
        }}
      />
      <HomeStack.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        options={{ title: "Recipe" }}
      />
      <HomeStack.Screen
        name="EditDose"
        component={EditDoseScreen}
        options={{ title: "Edit dose", headerShown: false }}
      />
      <HomeStack.Screen
        name="BrewSession"
        component={BrewSessionScreen}
        options={{ title: "Brew" }}
      />
      <HomeStack.Screen
        name="BrewComplete"
        component={BrewCompleteScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Brew history" }}
      />
    </HomeStack.Navigator>
  );
};

const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName =
            route.name === "Home"
              ? focused
                ? "home"
                : "home-outline"
              : focused
                ? "ellipsis-horizontal-circle"
                : "ellipsis-horizontal-circle-outline";
          return (
            <Ionicons name={iconName as never} size={size} color={color} />
          );
        },
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        /** The bar's own background sets it apart from the screen, so no top border. */
        tabBarStyle: { borderTopWidth: 0 },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ title: "More" }}
      />
    </Tab.Navigator>
  );
};

/** V1: single main tree — no auth gate (see `docs/v1_phase0_scope.md`). */
export const Navigation = () => {
  return <TabNavigator />;
};
