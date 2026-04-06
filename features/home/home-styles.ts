import {
  border,
  fonts,
  fontSize,
  spacing,
  ThemePalette,
} from "@/constants/theme";
import { StyleSheet } from "react-native";

export const createHomeScreenStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: { flex: 1 },
    content: { paddingBottom: 140 },
    sectionBlock: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 1,
    },
  });

export const createHomeHeaderStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    headerOuter: {
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      paddingBottom: 10,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
    headerLeftText: { gap: 2 },
    greeting: {
      fontSize: 13,
      fontFamily: fonts.Manrope.Medium,
      color: colors.slate[500],
    },
    name: {
      fontSize: 18,
      fontFamily: fonts.Manrope.Bold,
      color: colors.textPrimary,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    notifBtn: {
      width: 40,
      height: 40,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "20",
    },
    badge: {
      position: "absolute",
      top: 8,
      right: 10,
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 2,
      backgroundColor: colors.danger,
      borderColor: colors.background,
    },
  });

export const createNetWorthCardStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    cardsRow: {
      gap: 16,
      paddingRight: 24,
      paddingTop: 6,
      paddingBottom: 6,
    },
    netWorthCard: {
      borderRadius: border.borderRadius.xl,
      padding: spacing[10],
      overflow: "hidden",
      shadowOpacity: 0.18,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
      backgroundColor: colors.surfaceVariant,
      shadowColor: colors.primary,
    },
    netWorthGlow: {
      position: "absolute",
      top: -96,
      right: -96,
      width: 256,
      height: 256,
      borderRadius: 128,
      backgroundColor: colors.primary + "1A",
    },
    netWorthInner: {
      position: "relative",
      zIndex: 1,
      gap: spacing[2],
    },
    netWorthLabel: {
      fontSize: 10,
      fontFamily: fonts.Manrope.Bold,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: colors.primary,
    },
    netWorthAmountBlock: {
      gap: spacing[2],
    },
    netWorthAmount: {
      fontSize: fontSize["8xl"],
      fontFamily: fonts.Manrope.ExtraBold,
      letterSpacing: -1.2,
      lineHeight: fontSize["8xl"] * 1.05,
      color: colors.onSurface,
    },
    netWorthTrendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      marginTop: spacing[1],
    },
    netWorthTrendText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.Bold,
      color: colors.primary,
    },
  });
