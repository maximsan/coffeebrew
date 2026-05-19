import "styled-components/native";
import { Theme } from "./types";

declare module "styled-components/native" {
  export interface DefaultTheme extends Theme {}
}
