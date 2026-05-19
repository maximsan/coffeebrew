import {
  formatRatioParts,
  getRecipeDose,
  liquidLabelForMethod,
} from "../recipeDose";
import type { Recipe } from "../recipes";

const baseRecipe: Recipe = {
  id: "custom",
  title: "Test Recipe",
  description: "A test recipe for local service behavior.",
  brewTime: "3:00",
  difficulty: "Easy",
  brewMethod: "Pour Over",
  steps: [{ id: "step-1", time: "0:30", instruction: "Bloom the coffee." }],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  userId: "test-user",
};

describe("recipe dose helpers", () => {
  it("uses recipe-specific coffee and water dose when present", () => {
    expect(
      getRecipeDose({ ...baseRecipe, coffeeGrams: 20, waterGrams: 320 }),
    ).toEqual({
      coffeeGrams: 20,
      waterGrams: 320,
    });
  });

  it("falls back to a safe default for unknown recipes without dose values", () => {
    expect(getRecipeDose(baseRecipe)).toEqual({
      coffeeGrams: 15,
      waterGrams: 250,
    });
  });

  it("formats brew ratio parts and espresso liquid label", () => {
    expect(formatRatioParts(18, 300)).toEqual({ left: 1, right: 16.7 });
    expect(liquidLabelForMethod("Espresso")).toBe("Yield");
    expect(liquidLabelForMethod("Pour Over")).toBe("Water");
  });
});
