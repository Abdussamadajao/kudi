import { AuthBgDecor } from "@/features/auth/components/auth-bg-decor";
import { useTheme } from "@/provider/theme-provider";
import { Stack } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        decor: {
          position: "absolute",
          top: -60,
          right: -60,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: colors.primary + "20",
          zIndex: 0,
          pointerEvents: "none",
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <AuthBgDecor />
      <View style={styles.decor} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
