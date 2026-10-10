/** Brew-path's font files, keyed by the family name the theme refers to. */
export const fontFiles = {
  Fraunces: require("../../assets/fonts/Fraunces-Variable.ttf"),
  "IBMPlexSans-Regular": require("../../assets/fonts/IBMPlexSans-Regular.ttf"),
  "IBMPlexSans-Medium": require("../../assets/fonts/IBMPlexSans-Medium.ttf"),
  "IBMPlexMono-Medium": require("../../assets/fonts/IBMPlexMono-Medium.ttf"),
};

export type FontName = keyof typeof fontFiles;
