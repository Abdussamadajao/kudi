import { border, fontSize, fonts, spacing } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ProfileHeader({ onEditPress }: { onEditPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={[styles.title, { color: colors.onSurface }]}>
          Profile
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
        >
          Manage your account and preferences
        </Text>
      </View>
      <Pressable
        onPress={onEditPress}
        style={[
          styles.editBtn,
          { backgroundColor: colors.surfaceContainerHigh },
        ]}
        accessibilityLabel="Edit profile"
        accessibilityRole="button"
      >
        <MaterialIcons name="edit" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[6],
  },
  titles: {
    flex: 1,
    paddingRight: spacing[4],
  },
  title: {
    fontFamily: fonts.Manrope.Bold,
    fontSize: fontSize["3xl"],
    marginBottom: spacing[1],
  },
  subtitle: {
    fontFamily: fonts.Inter.Regular,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  editBtn: {
    alignItems: "center",
    borderRadius: border.borderRadius.full,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
