import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type IonName = ComponentProps<typeof Ionicons>["name"];

/** Distinct icon per method — editorial variety without copying reference app artwork. */
const MAP: Record<string, IonName> = {
  "Pour Over": "water-outline",
  Chemex: "filter-outline",
  Espresso: "cafe-outline",
  "Cold Brew": "snow-outline",
  "French Press": "beaker-outline",
  AeroPress: "albums-outline",
  "Moka Pot": "flame-outline",
  Immersion: "layers-outline",
  Siphon: "analytics-outline",
  Boiled: "bonfire-outline",
  Turkish: "ellipse-outline",
  Cupping: "grid-outline",
};

export function brewMethodIcon(method: string): IonName {
  return MAP[method] ?? "cafe-outline";
}
