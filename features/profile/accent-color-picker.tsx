import type { ThemePalette } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type AccentId = "teal" | "blue" | "purple";

const ACCENTS: { id: AccentId; hex: string }[] = [
  { id: "teal", hex: "#4ADE80" },
  { id: "blue", hex: "#3B82F6" },
  { id: "purple", hex: "#A78BFA" },
];

export function AccentColorPicker({
  selected,
  onSelect,
  colors,
}: {
  selected: AccentId;
  onSelect: (id: AccentId) => void;
  colors: ThemePalette;
}) {
  return (
    <>
      {ACCENTS.map(({ id, hex }) => {
        const active = selected === id;
        return (
          <Pressable
            key={id}
            onPress={() => onSelect(id)}
            style={[
              styles.outer,
              {
                borderColor: active ? colors.primary : "transparent",
                borderWidth: active ? 2 : 0,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <View style={[styles.inner, { backgroundColor: hex }]} />
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    padding: 2,
    width: 32,
  },
  inner: {
    borderRadius: 999,
    height: 22,
    width: 22,
  },
});
