import type { ThemePalette } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ProfileAboutRow({
  appName,
  version,
  colors,
}: {
  appName: string;
  version: string;
  colors: ThemePalette;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.logo, { backgroundColor: colors.primary + "35" }]}>
        <Text style={[styles.logoLetter, { color: colors.primary }]}>K</Text>
      </View>
      <Text style={[styles.name, { color: colors.onSurface }]}>
        {appName}
      </Text>
      <Text style={[styles.version, { color: colors.onSurfaceVariant }]}>
        {version}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    minHeight: 56,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  logo: {
    alignItems: "center",
    borderRadius: border.borderRadius.full,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  logoLetter: {
    fontFamily: fonts.Manrope.Bold,
    fontSize: fontSize.lg,
  },
  name: {
    flex: 1,
    fontFamily: fonts.Inter.SemiBold,
    fontSize: fontSize.md,
  },
  version: {
    fontFamily: fonts.Inter.Regular,
    fontSize: fontSize.xs,
  },
});
