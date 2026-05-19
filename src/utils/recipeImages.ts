import type { ImageSourcePropType } from "react-native";
import { BUNDLED_RECIPE_IDS } from "../services/recipes";

const defaultRecipe = require("../../assets/images/recipes/default-recipe.jpg");

/** Static art for each catalog recipe id. Run `npm run download-recipe-images` in `app/` to refresh JPEGs from Unsplash. */
const CATALOG: Record<string, ImageSourcePropType> = {
  "1": require("../../assets/images/recipes/recipe-01.jpg"),
  "2": require("../../assets/images/recipes/recipe-02.jpg"),
  "3": require("../../assets/images/recipes/recipe-03.jpg"),
  "4": require("../../assets/images/recipes/recipe-04.jpg"),
  "5": require("../../assets/images/recipes/recipe-05.jpg"),
  "6": require("../../assets/images/recipes/recipe-06.jpg"),
  "7": require("../../assets/images/recipes/recipe-07.jpg"),
  "8": require("../../assets/images/recipes/recipe-08.jpg"),
  "9": require("../../assets/images/recipes/recipe-09.jpg"),
  "10": require("../../assets/images/recipes/recipe-10.jpg"),
  "11": require("../../assets/images/recipes/recipe-11.jpg"),
  "12": require("../../assets/images/recipes/recipe-12.jpg"),
  "13": require("../../assets/images/recipes/recipe-13.jpg"),
  "14": require("../../assets/images/recipes/recipe-14.jpg"),
};

/**
 * Image for list/detail: bundled recipes use local assets; user recipes use `imageUrl` (e.g. file URI).
 */
export function recipeImageSource(
  recipeId: string,
  imageUrl?: string | null,
): ImageSourcePropType {
  if (BUNDLED_RECIPE_IDS.has(recipeId)) {
    return CATALOG[recipeId] ?? defaultRecipe;
  }
  if (imageUrl && imageUrl.length > 0 && !imageUrl.includes("example.com")) {
    return { uri: imageUrl };
  }
  return defaultRecipe;
}
