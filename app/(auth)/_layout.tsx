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
        bgDecor: {
          ...StyleSheet.absoluteFillObject,
          zIndex: -1,
          pointerEvents: "none",
        },
        bgBlur: {
          position: "absolute",
          borderRadius: 999,
          opacity: 0.5,
        },
        bgBlur1: {
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          backgroundColor: colors.primary,
        },
        bgBlur2: {
          top: "20%",
          right: "-10%",
          width: "30%",
          height: "30%",
          backgroundColor: colors.slate[200],
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <View style={styles.bgDecor}>
        <View style={[styles.bgBlur, styles.bgBlur1]} />
        <View style={[styles.bgBlur, styles.bgBlur2]} />
      </View>
      <View style={styles.decor} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
