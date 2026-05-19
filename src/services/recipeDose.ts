import type { Recipe } from "./recipes";

/** Curated defaults aligned with each catalog recipe’s steps (g). */
export const RECIPE_DOSE_DEFAULTS: Record<
  string,
  { coffeeGrams: number; waterGrams: number }
> = {
  "1": { coffeeGrams: 18, waterGrams: 250 },
  "2": { coffeeGrams: 18, waterGrams: 36 },
  "3": { coffeeGrams: 120, waterGrams: 720 },
  "4": { coffeeGrams: 30, waterGrams: 500 },
  "5": { coffeeGrams: 15, waterGrams: 250 },
  "6": { coffeeGrams: 22, waterGrams: 330 },
  "7": { coffeeGrams: 17, waterGrams: 240 },
  "8": { coffeeGrams: 20, waterGrams: 320 },
  "9": { coffeeGrams: 22, waterGrams: 360 },
  "10": { coffeeGrams: 25, waterGrams: 400 },
  "11": { coffeeGrams: 32, waterGrams: 500 },
  "12": { coffeeGrams: 7, waterGrams: 70 },
  "13": { coffeeGrams: 18, waterGrams: 180 },
  "14": { coffeeGrams: 12, waterGrams: 200 },
};

const FALLBACK = { coffeeGrams: 15, waterGrams: 250 };

export function getRecipeDose(recipe: Recipe): {
  coffeeGrams: number;
  waterGrams: number;
} {
  if (
    recipe.coffeeGrams != null &&
    recipe.waterGrams != null &&
    recipe.coffeeGrams > 0 &&
    recipe.waterGrams > 0
  ) {
    return {
      coffeeGrams: recipe.coffeeGrams,
      waterGrams: recipe.waterGrams,
    };
  }
  return RECIPE_DOSE_DEFAULTS[recipe.id] ?? FALLBACK;
}

export function formatRatioParts(
  coffeeGrams: number,
  waterGrams: number,
): { left: number; right: number } {
  const c = Math.max(1, coffeeGrams);
  const r = waterGrams / c;
  const rounded = Math.round(r * 10) / 10;
  return { left: 1, right: rounded };
}

export function liquidLabelForMethod(brewMethod: string): string {
  return brewMethod === "Espresso" ? "Yield" : "Water";
}
