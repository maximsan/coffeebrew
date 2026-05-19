/**
 * Navigation types for the v1 “happy path”:
 * Home tab → recipe list → recipe details → brew session.
 * Legacy param lists below support deferred screens (see `docs/v2_backlog.md`).
 */

import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Main: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  History: undefined;
  RecipeDetails: {
    recipeId: string;
    sessionCoffee?: number;
    sessionWater?: number;
  };
  EditDose: {
    recipeId: string;
    coffeeGrams: number;
    waterGrams: number;
    brewMethod: string;
  };
  BrewSession: {
    recipeId: string;
    coffeeGrams?: number;
    waterGrams?: number;
  };
  BrewComplete: {
    recipeId: string;
    recipeTitle: string;
    brewMethod: string;
    brewTime: string;
    difficulty: string;
    stepCount: number;
    coffeeGrams: number;
    waterGrams: number;
    /** Wall-clock ms when the brew session screen first loaded the recipe. */
    startedAt: number;
  };
};

/** Deferred — not used in v1 navigator (`docs/v2_backlog.md`). */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/** Deferred — not used in v1 navigator (`docs/v2_backlog.md`). */
export type RecipesStackParamList = {
  RecipesList: undefined;
  RecipeDetails: { recipeId: string };
  FilterRecipes: undefined;
};

/** Deferred — not used in v1 navigator (`docs/v2_backlog.md`). */
export type CommunityStackParamList = {
  CommunityFeed: undefined;
  UserProfile: { userId: string };
  PostDetails: { postId: string };
};

/** Deferred — not used in v1 navigator (`docs/v2_backlog.md`). */
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Achievements: undefined;
  MyRecipes: undefined;
  SavedRecipes: undefined;
  BrewingHistory: undefined;
  AccountSettings: undefined;
  Preferences: undefined;
  Notifications: undefined;
};
