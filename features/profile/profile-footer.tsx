import type { ThemePalette } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ProfileFooter({
  colors,
  onLogout,
}: {
  colors: ThemePalette;
  onLogout?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onLogout}
        style={[
          styles.logout,
          { backgroundColor: colors.surfaceContainer },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <Text style={[styles.logoutText, { color: colors.danger }]}>
          Log Out
        </Text>
      </Pressable>
      <Text
        style={[styles.secureNote, { color: colors.onSurfaceVariant }]}
      >
        SECURE SESSION AES-256
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing[4],
    paddingBottom: spacing[8],
  },
  logout: {
    alignItems: "center",
    borderRadius: border.borderRadius.full,
    marginBottom: spacing[4],
    paddingVertical: spacing[4],
  },
  logoutText: {
    fontFamily: fonts.Inter.SemiBold,
    fontSize: fontSize.md,
  },
  secureNote: {
    fontFamily: fonts.Inter.Medium,
    fontSize: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
});
