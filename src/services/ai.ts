// Postponed past v1 — mock service for deferred AI UI; see app/docs/v2_backlog.md
import { Recipe } from "./recipes";
import { z } from "zod";

// Recipe analysis schema
const recipeAnalysisSchema = z.object({
  score: z.number().min(0).max(10),
  suggestions: z.array(z.string()),
  flavorProfile: z.object({
    acidity: z.number().min(0).max(10),
    body: z.number().min(0).max(10),
    sweetness: z.number().min(0).max(10),
    bitterness: z.number().min(0).max(10),
    complexity: z.number().min(0).max(10),
  }),
  brewingParameterSuggestions: z.object({
    grindSize: z.string(),
    waterTemperature: z.string(),
    brewRatio: z.string(),
    brewTime: z.string(),
  }),
});

export type RecipeAnalysis = z.infer<typeof recipeAnalysisSchema>;

// Bean analysis schema
const beanAnalysisSchema = z.object({
  beanType: z.string(),
  roastLevel: z.string(),
  origin: z.string(),
  flavorNotes: z.array(z.string()),
  recommendedBrewMethods: z.array(z.string()),
  recommendedRecipes: z.array(z.string()),
});

export type BeanAnalysis = z.infer<typeof beanAnalysisSchema>;

// Personalized recommendations schema
const personalizedRecommendationsSchema = z.object({
  recipes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      imageUrl: z.string(),
      brewTime: z.number(),
      difficulty: z.string(),
      brewMethod: z.string(),
      matchScore: z.number().min(0).max(100),
    }),
  ),
  insights: z.array(z.string()),
  flavorPreferences: z.object({
    acidity: z.number().min(0).max(10),
    body: z.number().min(0).max(10),
    sweetness: z.number().min(0).max(10),
    bitterness: z.number().min(0).max(10),
  }),
});

export type PersonalizedRecommendations = z.infer<
  typeof personalizedRecommendationsSchema
>;

// Mock data for development
const mockRecipeAnalysis: RecipeAnalysis = {
  score: 8.5,
  suggestions: [
    "Consider using a slightly finer grind for better extraction",
    "Try extending the bloom time to 45 seconds for more flavor development",
    "Experiment with water temperature between 195-205°F for optimal extraction",
  ],
  flavorProfile: {
    acidity: 7,
    body: 6,
    sweetness: 8,
    bitterness: 5,
    complexity: 7,
  },
  brewingParameterSuggestions: {
    grindSize: "Medium-fine",
    waterTemperature: "200°F (93°C)",
    brewRatio: "1:16",
    brewTime: "3-4 minutes",
  },
};

const mockBeanAnalysis: BeanAnalysis = {
  beanType: "Arabica",
  roastLevel: "Medium",
  origin: "Ethiopia",
  flavorNotes: ["Floral", "Citrus", "Chocolate"],
  recommendedBrewMethods: ["Pour Over", "Aeropress"],
  recommendedRecipes: ["Ethiopian Light Roast", "Morning Bright"],
};

// Mock data for personalized recommendations
const mockPersonalizedRecommendations: PersonalizedRecommendations = {
  recipes: [
    {
      id: "recipe1",
      title: "Ethiopian Light Roast",
      description: "A bright, fruity coffee with floral notes",
      imageUrl: "https://example.com/ethiopian.jpg",
      brewTime: 240,
      difficulty: "Medium",
      brewMethod: "Pour Over",
      matchScore: 95,
    },
    {
      id: "recipe2",
      title: "Morning Bright",
      description: "A light, citrusy coffee perfect for mornings",
      imageUrl: "https://example.com/morning.jpg",
      brewTime: 180,
      difficulty: "Easy",
      brewMethod: "Aeropress",
      matchScore: 88,
    },
    {
      id: "recipe3",
      title: "Espresso-Style Aeropress",
      description: "A strong, concentrated coffee with rich body",
      imageUrl: "https://example.com/espresso.jpg",
      brewTime: 120,
      difficulty: "Hard",
      brewMethod: "Aeropress",
      matchScore: 82,
    },
  ],
  insights: [
    "You tend to prefer lighter roasts with fruity notes",
    "Your brewing style is consistent with medium-fine grind settings",
    "You might enjoy trying a Chemex for a cleaner cup profile",
  ],
  flavorPreferences: {
    acidity: 7,
    body: 5,
    sweetness: 6,
    bitterness: 4,
  },
};

class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analyzes a recipe and provides improvement suggestions
   */
  public async analyzeRecipe(recipe: Recipe): Promise<RecipeAnalysis> {
    // In a real app, this would call an AI API
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    try {
      // Validate the mock data against the schema
      return recipeAnalysisSchema.parse(mockRecipeAnalysis);
    } catch (error) {
      console.error("Error validating recipe analysis:", error);
      throw new Error("Failed to analyze recipe");
    }
  }

  /**
   * Analyzes a coffee bean image and provides information about the bean
   */
  public async analyzeBeanImage(imageUri: string): Promise<BeanAnalysis> {
    // In a real app, this would call an AI API for image recognition
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

    try {
      // Validate the mock data against the schema
      return beanAnalysisSchema.parse(mockBeanAnalysis);
    } catch (error) {
      console.error("Error validating bean analysis:", error);
      throw new Error("Failed to analyze bean image");
    }
  }

  /**
   * Suggests recipes based on user preferences and available beans
   */
  public async suggestRecipes(
    preferences: {
      preferredMethods: string[];
      preferredFlavors: string[];
      preferredStrength: "light" | "medium" | "strong";
    },
    availableBeans: string[],
  ): Promise<string[]> {
    // In a real app, this would call an AI API for personalized recommendations
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

    // Mock recipe suggestions based on preferences
    const suggestions: string[] = [];

    if (preferences.preferredMethods.includes("Pour Over")) {
      suggestions.push("Classic Pour Over");
    }

    if (preferences.preferredMethods.includes("Aeropress")) {
      suggestions.push("Aeropress Inverted Method");
    }

    if (preferences.preferredFlavors.includes("Fruity")) {
      suggestions.push("Fruit-Forward Light Roast");
    }

    if (preferences.preferredStrength === "strong") {
      suggestions.push("Espresso-Style Aeropress");
    }

    return suggestions;
  }

  /**
   * Provides personalized recipe recommendations based on user preferences and history
   */
  public async getPersonalizedRecommendations(
    userId: string,
    preferences: {
      preferredMethods: string[];
      preferredFlavors: string[];
      preferredStrength: "light" | "medium" | "strong";
      roastPreference: "light" | "medium" | "dark";
    },
  ): Promise<PersonalizedRecommendations> {
    // In a real app, this would call an AI API for personalized recommendations
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call

    try {
      // Validate the mock data against the schema
      return personalizedRecommendationsSchema.parse(
        mockPersonalizedRecommendations,
      );
    } catch (error) {
      console.error("Error validating personalized recommendations:", error);
      throw new Error("Failed to generate personalized recommendations");
    }
  }

  /**
   * Analyzes a user's brewing history to provide insights and recommendations
   */
  public async analyzeBrewingHistory(userId: string): Promise<{
    insights: string[];
    improvementAreas: string[];
    strengths: string[];
  }> {
    // In a real app, this would analyze the user's brewing history
    // For now, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    return {
      insights: [
        "Your brew times have become more consistent over the last month",
        "You tend to prefer lighter roasts with fruity notes",
        "Your water temperature is consistently at the optimal range",
      ],
      improvementAreas: [
        "Try experimenting with different grind sizes",
        "Consider extending bloom time for more flavor development",
        "Document your brewing parameters more consistently",
      ],
      strengths: [
        "Consistent water temperature",
        "Good ratio management",
        "Attention to detail in brewing steps",
      ],
    };
  }
}

export const aiService = AIService.getInstance();
