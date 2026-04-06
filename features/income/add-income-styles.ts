import {
  border,
  fontSize,
  fonts,
  spacing,
  ThemePalette,
} from "@/constants/theme";
import { StyleSheet } from "react-native";

export const createAddIncomeStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      paddingHorizontal: 8,
      paddingVertical: 12,
      minHeight: 48,
    },
    backBtn: { padding: 8 },
    headerTitle: {
      fontSize: fontSize["2xl"],
      fontFamily: fonts.Manrope.Bold,
    },
    headerRight: { width: 40 },
    scroll: { flexGrow: 1 },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    amountSection: {
      marginTop: 30,
      marginBottom: 12,
      alignItems: "center",
      alignSelf: "stretch",
    },
    formCard: {
      borderRadius: border.borderRadius.xl,
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 20,
      marginTop: 8,
    },
    field: { marginBottom: 20 },
    upperLabel: {
      fontSize: fontSize["xs"],
      fontFamily: fonts.Manrope.SemiBold,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    saveRow: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: "center",
    },
    saveBtn: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: 52,
      borderRadius: border.borderRadius.full,
      padding: 0,
      paddingHorizontal: 22,
    },
    saveBtnText: {
      fontSize: fontSize["md"],
      fontFamily: fonts.Manrope.Bold,
    },
    previewCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: border.borderRadius.xl,
      borderWidth: 1,
      marginTop: 18,
    },
    previewIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    previewTextCol: { flex: 1 },
    previewMeta: {
      fontSize: 10,
      fontFamily: fonts.Manrope.SemiBold,
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    previewLine: {
      fontSize: fontSize["sm"],
      fontFamily: fonts.Manrope.Medium,
    },
  });
