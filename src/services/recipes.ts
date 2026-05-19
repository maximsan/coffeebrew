import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import bundledRaw from "../data/recipes.json";

// Recipe schema for validation
export const recipeSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  brewTime: z.string(),
  difficulty: z.string(),
  brewMethod: z.string(),
  coffeeGrams: z.number().positive().optional(),
  waterGrams: z.number().positive().optional(),
  steps: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      instruction: z
        .string()
        .min(5, "Instruction must be at least 5 characters"),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
});

export type Recipe = z.infer<typeof recipeSchema>;

// Recipe creation data schema
export const recipeCreationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  brewTime: z.string(),
  difficulty: z.string(),
  brewMethod: z.string(),
  coffeeGrams: z.number().positive().optional(),
  waterGrams: z.number().positive().optional(),
  steps: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      instruction: z
        .string()
        .min(5, "Instruction must be at least 5 characters"),
    }),
  ),
});

export type RecipeCreationData = z.infer<typeof recipeCreationSchema>;

const LEGACY_RECIPES_KEY = "recipes";
const USER_RECIPES_KEY = "brew_master_user_recipes_v1";

function parseRecipeFromJson(row: Record<string, unknown>): Recipe {
  return recipeSchema.parse({
    ...row,
    createdAt: new Date(String(row.createdAt)),
    updatedAt: new Date(String(row.updatedAt)),
  });
}

/** Curated catalog shipped with the app (`src/data/recipes.json`). */
export const bundledRecipes: Recipe[] = (
  bundledRaw as Record<string, unknown>[]
).map((row) => parseRecipeFromJson(row));

/** IDs from the shipped `recipes.json` catalog (used for bundled images). */
export const BUNDLED_RECIPE_IDS = new Set(bundledRecipes.map((r) => r.id));

const bundledIds = BUNDLED_RECIPE_IDS;

function parseStoredRecipes(json: string): Recipe[] {
  const parsed = JSON.parse(json) as Record<string, unknown>[];
  return parsed.map((row) =>
    parseRecipeFromJson({
      ...row,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }),
  );
}

async function persistUserRecipes(recipes: Recipe[]): Promise<void> {
  await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
}

function newUserRecipeId(): string {
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Recipe service
class RecipeService {
  private userRecipes: Recipe[] = [];

  /** Built-in recipes (read-only in UI). */
  getBundledRecipes(): Recipe[] {
    return bundledRecipes;
  }

  // Initialize the service
  async init(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LEGACY_RECIPES_KEY);

      const stored = await AsyncStorage.getItem(USER_RECIPES_KEY);
      if (stored) {
        this.userRecipes = parseStoredRecipes(stored);
      } else {
        this.userRecipes = [];
      }
    } catch (error) {
      console.error("Failed to initialize recipe service:", error);
    }
  }

  private allRecipes(): Recipe[] {
    return [...bundledRecipes, ...this.userRecipes];
  }

  // Get all recipes
  async getAllRecipes(): Promise<Recipe[]> {
    return this.allRecipes();
  }

  // Get recipe by ID
  async getRecipeById(id: string): Promise<Recipe | null> {
    return this.allRecipes().find((recipe) => recipe.id === id) || null;
  }

  // Get recipes by user ID
  async getRecipesByUserId(userId: string): Promise<Recipe[]> {
    return this.allRecipes().filter((recipe) => recipe.userId === userId);
  }

  // Create a new recipe
  async createRecipe(
    data: RecipeCreationData,
    userId: string,
  ): Promise<Recipe> {
    try {
      recipeCreationSchema.parse(data);

      const newRecipe: Recipe = {
        ...data,
        id: newUserRecipeId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      };

      recipeSchema.parse(newRecipe);

      this.userRecipes.push(newRecipe);
      await persistUserRecipes(this.userRecipes);

      return newRecipe;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Update a recipe
  async updateRecipe(
    id: string,
    data: Partial<RecipeCreationData>,
  ): Promise<Recipe> {
    try {
      if (bundledIds.has(id)) {
        throw new Error("Built-in recipes cannot be edited");
      }

      const recipeIndex = this.userRecipes.findIndex(
        (recipe) => recipe.id === id,
      );
      if (recipeIndex === -1) {
        throw new Error("Recipe not found");
      }

      const updatedRecipe: Recipe = {
        ...this.userRecipes[recipeIndex],
        ...data,
        id,
        userId: this.userRecipes[recipeIndex].userId,
        createdAt: this.userRecipes[recipeIndex].createdAt,
        updatedAt: new Date(),
      };

      recipeSchema.parse(updatedRecipe);

      this.userRecipes[recipeIndex] = updatedRecipe;
      await persistUserRecipes(this.userRecipes);

      return updatedRecipe;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  // Delete a recipe
  async deleteRecipe(id: string): Promise<void> {
    try {
      if (bundledIds.has(id)) {
        throw new Error("Built-in recipes cannot be deleted");
      }

      const recipeIndex = this.userRecipes.findIndex(
        (recipe) => recipe.id === id,
      );
      if (recipeIndex === -1) {
        throw new Error("Recipe not found");
      }

      this.userRecipes.splice(recipeIndex, 1);
      await persistUserRecipes(this.userRecipes);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    }
  }

  // Filter recipes
  async filterRecipes(filters: {
    difficulty?: string;
    brewMethod?: string;
    brewTime?: string;
  }): Promise<Recipe[]> {
    return this.allRecipes().filter((recipe) => {
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.brewMethod && recipe.brewMethod !== filters.brewMethod) {
        return false;
      }
      if (filters.brewTime && recipe.brewTime !== filters.brewTime) {
        return false;
      }
      return true;
    });
  }

  // Search recipes
  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.allRecipes().filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowercaseQuery) ||
        recipe.description.toLowerCase().includes(lowercaseQuery) ||
        recipe.brewMethod.toLowerCase().includes(lowercaseQuery),
    );
  }
}

// Export a singleton instance
export const recipeService = new RecipeService();
