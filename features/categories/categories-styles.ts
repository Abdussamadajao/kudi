import { border, fontSize, fonts, spacing, ThemePalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const createCategoriesStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    headerRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      marginBottom: spacing[2],
    },
    iconBtn: {
      alignItems: "center",
      height: 36,
      justifyContent: "center",
      width: 36,
    },
    headerTitle: {
      color: colors.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.lg,
    },
    headerIcon: {
      color: colors.onSurface,
    },
    addHeaderIcon: {
      color: colors.primary,
    },
    filterRow: {
      marginTop: spacing[1],
      marginBottom: spacing[2],
      paddingHorizontal: spacing[4],
    },
    tabsWrap: {
      backgroundColor: colors.surfaceContainerLow,
      borderColor: colors.border + "66",
      borderRadius: border.borderRadius.xl,
      borderWidth: 1,
      flexDirection: "row",
      padding: 4,
    },
    tab: {
      alignItems: "center",
      borderRadius: border.borderRadius.lg,
      flex: 1,
      paddingVertical: spacing[2],
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    tabInactive: {
      backgroundColor: "transparent",
    },
    tabLabel: {
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.sm,
    },
    tabLabelActive: {
      color: colors.onPrimary,
    },
    tabLabelInactive: {
      color: colors.onSurfaceVariant,
    },
    scroll: { flex: 1, marginTop: spacing[1] },
    content: {
      gap: spacing[3],
      paddingBottom: 120,
      paddingHorizontal: spacing[4],
    },
    sectionWrap: {
      gap: spacing[2],
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 2,
    },
    sectionTitle: {
      color: colors.onSurfaceVariant,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.xs,
      letterSpacing: 0.2,
    },
    sectionCount: {
      color: colors.onSurfaceVariant,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.xs,
    },
    card: {
      alignItems: "center",
      borderRadius: border.borderRadius.lg,
      borderWidth: 1,
      flexDirection: "row",
      minHeight: 74,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    cardSurface: {
      backgroundColor: colors.surfaceContainerLow,
      borderColor: colors.border + "66",
    },
    iconWrap: {
      alignItems: "center",
      borderRadius: border.borderRadius.full,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    cardText: {
      flex: 1,
      marginLeft: spacing[3],
      marginRight: spacing[2],
    },
    cardTitle: {
      color: colors.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.md,
    },
    cardActions: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing[2],
    },
    colorDot: {
      borderRadius: border.borderRadius.full,
      height: 6,
      width: 6,
    },
    editIcon: {
      color: colors.icons,
    },
    editBtn: {
      alignItems: "center",
      height: 24,
      justifyContent: "center",
      width: 24,
    },
    lockIcon: {
      color: colors.onSurfaceVariant,
    },
    feedbackCard: {
      borderRadius: border.borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border + "55",
      backgroundColor: colors.surfaceContainerLow,
      minHeight: 180,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing[4],
    },
    feedbackTitle: {
      color: colors.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.lg,
      textAlign: "center",
    },
    feedbackSubtitle: {
      color: colors.onSurfaceVariant,
      fontFamily: fonts.Manrope.Medium,
      fontSize: fontSize.sm,
      marginTop: spacing[1],
      textAlign: "center",
    },
    retryBtn: {
      marginTop: spacing[3],
      backgroundColor: colors.primary,
      borderRadius: border.borderRadius.full,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    retryBtnText: {
      color: colors.onPrimary,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.sm,
    },
    fab: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: border.borderRadius.full,
      bottom: spacing[8],
      elevation: 5,
      height: 56,
      justifyContent: "center",
      position: "absolute",
      right: spacing[5],
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      width: 56,
    },
    fabIcon: {
      color: colors.onPrimary,
    },
  });
