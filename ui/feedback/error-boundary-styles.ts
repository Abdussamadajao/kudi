import { border, fonts, fontSize, spacing, ThemePalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const createErrorBoundaryStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing[8],
      gap: spacing[3],
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    iconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing[2],
      backgroundColor: colors.surfaceVariant,
    },
    title: {
      fontSize: fontSize.lg,
      fontFamily: fonts.Manrope.Bold,
      textAlign: "center",
      color: colors.textPrimary,
    },
    message: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.Medium,
      textAlign: "center",
      lineHeight: 22,
      color: colors.textSecondary,
    },
    retryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: border.borderRadius.full,
      marginTop: spacing[2],
      backgroundColor: colors.primary,
    },
    retryText: {
      color: colors.onPrimary,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.sm,
    },
    compactContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: spacing[3],
    },
    compactText: {
      fontSize: 13,
      fontFamily: fonts.Manrope.Medium,
      color: colors.textSecondary,
    },
    compactRetry: {
      fontSize: 13,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.primary,
    },
    boundaryContainer: {
      flexGrow: 1,
    },
    fieldError: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    fieldErrorText: {
      fontSize: 12,
      fontFamily: fonts.Manrope.Medium,
      color: colors.danger,
    },
    alert: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      padding: spacing[3],
      borderRadius: border.borderRadius.lg,
    },
    alertText: {
      flex: 1,
      fontSize: 13,
      fontFamily: fonts.Manrope.Medium,
    },
    alertClose: {
      padding: 2,
    },
    alertError: {
      backgroundColor: colors.danger + "14",
    },
    alertWarning: {
      backgroundColor: colors.warning + "14",
    },
    alertInfo: {
      backgroundColor: colors.primary + "14",
    },
    alertSuccess: {
      backgroundColor: colors.income + "14",
    },
    alertFgError: {
      color: colors.danger,
    },
    alertFgWarning: {
      color: colors.warning,
    },
    alertFgInfo: {
      color: colors.primary,
    },
    alertFgSuccess: {
      color: colors.income,
    },
  });
