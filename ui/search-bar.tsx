import { ThemePalette } from "@/constants";
import { border, fontSize, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export type SearchBarProps = {
  search: string;
  setSearch: (search: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.searchWrap]}>
      <MaterialIcons name="search" size={22} color={colors.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
      />
    </View>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    searchWrap: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: border.borderRadius.lg,
      borderWidth: 1,
      backgroundColor: colors.surfaceContainerLowest,
      borderColor: colors.surface,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Medium,
      paddingVertical: 0,
      color: colors.textPrimary,
    },
  });
