import type { ColorScheme } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MODES: ColorScheme[] = ["dark", "light"];

export function ThemeSegmentControl({
  mode,
  onSelect,
}: {
  mode: ColorScheme;
  onSelect: (next: ColorScheme) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.track}>
      {MODES.map((m) => {
        const selected = mode === m;
        return (
          <Pressable
            key={m}
            onPress={() => onSelect(m)}
            style={[
              styles.pill,
              {
                backgroundColor: selected
                  ? colors.primary + "40"
                  : "transparent",
                borderColor: selected ? colors.primary : "transparent",
                borderWidth: selected ? 1 : 0,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: selected ? colors.primary : colors.onSurfaceVariant,
                },
              ]}
            >
              {m === "dark" ? "Dark" : "Light"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: border.borderRadius.full,
    flexDirection: "row",
    gap: spacing[2],
    padding: spacing[2],
  },
  pill: {
    borderRadius: spacing[24],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  pillText: {
    fontFamily: fonts.Inter.Medium,
    fontSize: fontSize.sm,
  },
});
