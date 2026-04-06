import type { ThemePalette } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function SettingsSection({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ThemePalette;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.onSurfaceVariant }]}>
        {title}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing[5],
  },
  title: {
    fontFamily: fonts.Inter.SemiBold,
    fontSize: fontSize.xs,
    letterSpacing: 1.2,
    marginBottom: spacing[2],
    marginLeft: spacing[1],
    textTransform: "uppercase",
  },
  card: {
    borderRadius: border.borderRadius.lg,
    overflow: "hidden",
  },
});
