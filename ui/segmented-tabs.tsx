import { border, fonts, fontSize, ThemePalette } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SegmentedTabsProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onChange: (tab: T) => void;
};

export default function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: SegmentedTabsProps<T>) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const selected = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.tab,
              styles.tabBorder,
              selected ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selected ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: border.borderRadius.full,
      borderWidth: 1,
    },
    tabText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    inactiveTab: {
      backgroundColor: colors.surfaceVariant,
    },
    tabBorder: {
      borderColor: colors.outlineVariant,
    },
    activeTabText: {
      color: colors.onPrimary,
    },
    inactiveTabText: {
      color: colors.textPrimary,
    },
  });
