// Postponed past v1 — mock service for deferred gamification; see app/docs/v2_backlog.md
import { z } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(["brewing", "exploration", "social", "mastery"]),
  points: z.number(),
  isUnlocked: z.boolean(),
  progress: z.number().min(0).max(100),
  unlockedAt: z.string().optional(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// Badge schema
export const badgeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  level: z.enum(["bronze", "silver", "gold", "platinum"]),
  isUnlocked: z.boolean(),
  unlockedAt: z.string().optional(),
});

export type Badge = z.infer<typeof badgeSchema>;

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: "first_brew",
    title: "First Brew",
    description: "Complete your first coffee brew",
    icon: "coffee",
    category: "brewing",
    points: 10,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "brew_master",
    title: "Brew Master",
    description: "Brew coffee 50 times",
    icon: "trophy",
    category: "mastery",
    points: 50,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "bean_explorer",
    title: "Bean Explorer",
    description: "Try 10 different types of coffee beans",
    icon: "compass",
    category: "exploration",
    points: 30,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    description: "Share 5 recipes with the community",
    icon: "share-social",
    category: "social",
    points: 20,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "perfect_brew",
    title: "Perfect Brew",
    description: "Get a perfect score on a recipe analysis",
    icon: "star",
    category: "mastery",
    points: 40,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "bean_recognizer",
    title: "Bean Recognizer",
    description: "Use bean recognition 10 times",
    icon: "camera",
    category: "exploration",
    points: 25,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "recipe_creator",
    title: "Recipe Creator",
    description: "Create and publish 5 recipes",
    icon: "create",
    category: "brewing",
    points: 35,
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "community_leader",
    title: "Community Leader",
    description: "Get 50 likes on your recipes",
    icon: "people",
    category: "social",
    points: 45,
    isUnlocked: false,
    progress: 0,
  },
];

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: "beginner_brewer",
    title: "Beginner Brewer",
    description: "Complete your first 5 brews",
    icon: "coffee",
    level: "bronze",
    isUnlocked: false,
  },
  {
    id: "intermediate_brewer",
    title: "Intermediate Brewer",
    description: "Complete 25 brews with good consistency",
    icon: "coffee",
    level: "silver",
    isUnlocked: false,
  },
  {
    id: "advanced_brewer",
    title: "Advanced Brewer",
    description: "Master 5 different brewing methods",
    icon: "coffee",
    level: "gold",
    isUnlocked: false,
  },
  {
    id: "expert_brewer",
    title: "Expert Brewer",
    description: "Achieve perfect scores on 10 different recipes",
    icon: "coffee",
    level: "platinum",
    isUnlocked: false,
  },
  {
    id: "bean_enthusiast",
    title: "Bean Enthusiast",
    description: "Try 20 different types of coffee beans",
    icon: "leaf",
    level: "gold",
    isUnlocked: false,
  },
  {
    id: "community_contributor",
    title: "Community Contributor",
    description: "Share 20 recipes and get 100 likes",
    icon: "people",
    level: "silver",
    isUnlocked: false,
  },
];

class AchievementService {
  private static instance: AchievementService;
  private achievements: Achievement[] = [];
  private badges: Badge[] = [];
  private storageKey = "achievements_data";

  private constructor() {}

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  /**
   * Initialize the achievement service
   */
  public async initialize(): Promise<void> {
    try {
      const storedData = await AsyncStorage.getItem(this.storageKey);
      if (storedData) {
        const data = JSON.parse(storedData);
        this.achievements = data.achievements || mockAchievements;
        this.badges = data.badges || mockBadges;
      } else {
        this.achievements = [...mockAchievements];
        this.badges = [...mockBadges];
        await this.saveData();
      }
    } catch (error) {
      console.error("Failed to initialize achievements:", error);
      this.achievements = [...mockAchievements];
      this.badges = [...mockBadges];
    }
  }

  /**
   * Save achievement data to storage
   */
  private async saveData(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify({
          achievements: this.achievements,
          badges: this.badges,
        }),
      );
    } catch (error) {
      console.error("Failed to save achievement data:", error);
    }
  }

  /**
   * Get all achievements
   */
  public getAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Get all badges
   */
  public getBadges(): Badge[] {
    return this.badges;
  }

  /**
   * Get achievements by category
   */
  public getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(
      (achievement) => achievement.category === category,
    );
  }

  /**
   * Get badges by level
   */
  public getBadgesByLevel(level: string): Badge[] {
    return this.badges.filter((badge) => badge.level === level);
  }

  /**
   * Get unlocked achievements
   */
  public getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter((achievement) => achievement.isUnlocked);
  }

  /**
   * Get unlocked badges
   */
  public getUnlockedBadges(): Badge[] {
    return this.badges.filter((badge) => badge.isUnlocked);
  }

  /**
   * Get total points earned
   */
  public getTotalPoints(): number {
    return this.achievements
      .filter((achievement) => achievement.isUnlocked)
      .reduce((total, achievement) => total + achievement.points, 0);
  }

  /**
   * Update achievement progress
   */
  public async updateAchievementProgress(
    achievementId: string,
    progress: number,
  ): Promise<Achievement | null> {
    const achievement = this.achievements.find((a) => a.id === achievementId);

    if (!achievement) return null;

    const updatedAchievement = {
      ...achievement,
      progress: Math.min(100, progress),
      isUnlocked: progress >= 100,
      unlockedAt:
        progress >= 100 && !achievement.isUnlocked
          ? new Date().toISOString()
          : achievement.unlockedAt,
    };

    const index = this.achievements.findIndex((a) => a.id === achievementId);
    this.achievements[index] = updatedAchievement;

    await this.saveData();
    return updatedAchievement;
  }

  /**
   * Unlock a badge
   */
  public async unlockBadge(badgeId: string): Promise<Badge | null> {
    const badge = this.badges.find((b) => b.id === badgeId);

    if (!badge || badge.isUnlocked) return null;

    const updatedBadge = {
      ...badge,
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
    };

    const index = this.badges.findIndex((b) => b.id === badgeId);
    this.badges[index] = updatedBadge;

    await this.saveData();
    return updatedBadge;
  }

  /**
   * Check and update achievements based on user actions
   */
  public async checkAchievements(
    action: string,
    data: any,
  ): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];

    switch (action) {
      case "brew_completed":
        await this.updateAchievementProgress("first_brew", 100);
        const brewCount = data.brewCount || 1;
        const brewMasterProgress = Math.min(100, (brewCount / 50) * 100);
        const brewMasterAchievement = await this.updateAchievementProgress(
          "brew_master",
          brewMasterProgress,
        );
        if (brewMasterAchievement?.isUnlocked) {
          unlockedAchievements.push(brewMasterAchievement);
        }
        break;

      case "bean_tried":
        const beanCount = data.beanCount || 1;
        const beanExplorerProgress = Math.min(100, (beanCount / 10) * 100);
        const beanExplorerAchievement = await this.updateAchievementProgress(
          "bean_explorer",
          beanExplorerProgress,
        );
        if (beanExplorerAchievement?.isUnlocked) {
          unlockedAchievements.push(beanExplorerAchievement);
        }
        break;

      case "recipe_shared":
        const shareCount = data.shareCount || 1;
        const socialButterflyProgress = Math.min(100, (shareCount / 5) * 100);
        const socialButterflyAchievement = await this.updateAchievementProgress(
          "social_butterfly",
          socialButterflyProgress,
        );
        if (socialButterflyAchievement?.isUnlocked) {
          unlockedAchievements.push(socialButterflyAchievement);
        }
        break;

      case "perfect_score":
        const perfectBrewAchievement = await this.updateAchievementProgress(
          "perfect_brew",
          100,
        );
        if (perfectBrewAchievement?.isUnlocked) {
          unlockedAchievements.push(perfectBrewAchievement);
        }
        break;

      case "bean_recognition":
        const recognitionCount = data.recognitionCount || 1;
        const beanRecognizerProgress = Math.min(
          100,
          (recognitionCount / 10) * 100,
        );
        const beanRecognizerAchievement = await this.updateAchievementProgress(
          "bean_recognizer",
          beanRecognizerProgress,
        );
        if (beanRecognizerAchievement?.isUnlocked) {
          unlockedAchievements.push(beanRecognizerAchievement);
        }
        break;

      case "recipe_created":
        const recipeCount = data.recipeCount || 1;
        const recipeCreatorProgress = Math.min(100, (recipeCount / 5) * 100);
        const recipeCreatorAchievement = await this.updateAchievementProgress(
          "recipe_creator",
          recipeCreatorProgress,
        );
        if (recipeCreatorAchievement?.isUnlocked) {
          unlockedAchievements.push(recipeCreatorAchievement);
        }
        break;

      case "recipe_liked":
        const likeCount = data.likeCount || 1;
        const communityLeaderProgress = Math.min(100, (likeCount / 50) * 100);
        const communityLeaderAchievement = await this.updateAchievementProgress(
          "community_leader",
          communityLeaderProgress,
        );
        if (communityLeaderAchievement?.isUnlocked) {
          unlockedAchievements.push(communityLeaderAchievement);
        }
        break;
    }

    // Check for badge unlocks based on achievements
    await this.checkBadgeUnlocks();

    return unlockedAchievements;
  }

  /**
   * Check and unlock badges based on achievements
   */
  private async checkBadgeUnlocks(): Promise<void> {
    // Beginner Brewer badge
    if (
      this.achievements.find((a) => a.id === "first_brew")?.isUnlocked &&
      !this.badges.find((b) => b.id === "beginner_brewer")?.isUnlocked
    ) {
      await this.unlockBadge("beginner_brewer");
    }

    // Intermediate Brewer badge
    if (
      this.achievements.find((a) => a.id === "brew_master")?.isUnlocked &&
      !this.badges.find((b) => b.id === "intermediate_brewer")?.isUnlocked
    ) {
      await this.unlockBadge("intermediate_brewer");
    }

    // Bean Enthusiast badge
    if (
      this.achievements.find((a) => a.id === "bean_explorer")?.isUnlocked &&
      !this.badges.find((b) => b.id === "bean_enthusiast")?.isUnlocked
    ) {
      await this.unlockBadge("bean_enthusiast");
    }

    // Community Contributor badge
    if (
      this.achievements.find((a) => a.id === "community_leader")?.isUnlocked &&
      !this.badges.find((b) => b.id === "community_contributor")?.isUnlocked
    ) {
      await this.unlockBadge("community_contributor");
    }
  }
}

export const achievementService = AchievementService.getInstance();
