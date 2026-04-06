import { ThemePalette } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const useStyles = <T extends StyleSheet.NamedStyles<T>>(
  createStyles: (colors: ThemePalette) => T,
): T => {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [colors]);
};
