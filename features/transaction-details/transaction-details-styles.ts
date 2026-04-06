import {
  border,
  fontSize,
  fonts,
  spacing as space,
  ThemePalette,
} from "@/constants/theme";
import { StyleSheet } from "react-native";

const padH = space[5];
const padV = space[3];
const padBottom = space[8];

export const createTransactionDetailsStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: padH,
      paddingVertical: padV,
      minHeight: 48,
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: fontSize.lg,
      fontFamily: fonts.Manrope.Bold,
      color: colors.onSurface,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: padH,
      paddingBottom: padBottom,
    },
    hero: {
      alignItems: "center",
      paddingTop: space[2],
      paddingBottom: space[4],
    },
    heroIconOuter: {
      width: 72,
      height: 72,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: space[3],
    },
    heroIconInner: {
      width: 56,
      height: 56,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    amount: {
      fontSize: fontSize["7xl"],
      fontFamily: fonts.Manrope.Bold,
      marginBottom: space[1],
    },
    categoryTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.onSurface,
    },
    metaLine: {
      marginTop: space[2],
      fontSize: fontSize.sm,
      fontFamily: fonts.Inter.Medium,
      color: colors.onSurfaceVariant,
    },
    card: {
      borderRadius: border.borderRadius.lg,
      backgroundColor: colors.surfaceVariant,
      padding: space[4],
      marginBottom: space[3],
    },
    cardRowHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: space[4],
    },
    cardLabelCaps: {
      fontSize: fontSize.xs,
      fontFamily: fonts.Inter.SemiBold,
      letterSpacing: 0.6,
      color: colors.onSurfaceVariant,
    },
    sourceAccent: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.primary,
    },
    flowRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    flowCol: {
      flex: 1,
    },
    flowColRight: {
      alignItems: "flex-end",
    },
    flowMicro: {
      fontSize: fontSize.xs,
      fontFamily: fonts.Inter.Medium,
      color: colors.onSurfaceVariant,
      marginBottom: space[1],
    },
    flowValue: {
      fontSize: fontSize.md,
      fontFamily: fonts.Inter.SemiBold,
      color: colors.onSurface,
    },
    flowValueAfter: {
      color: colors.primary,
    },
    flowArrow: {
      paddingHorizontal: space[2],
      paddingBottom: space[1],
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: space[2],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant + "55",
    },
    infoRowFirst: {
      paddingTop: 0,
      borderTopWidth: 0,
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoLabel: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Inter.Medium,
      color: colors.onSurfaceVariant,
    },
    infoValue: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Inter.Medium,
      color: colors.onSurface,
      flex: 1,
      textAlign: "right",
      marginLeft: space[3],
    },
    notesHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: space[2],
    },
    tagPill: {
      paddingHorizontal: space[3],
      paddingVertical: space[1],
      borderRadius: border.borderRadius.full,
      backgroundColor: colors.primary + "28",
    },
    tagPillText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.primary,
    },
    notesBody: {
      fontSize: fontSize.md,
      fontFamily: fonts.Inter.Medium,
      color: colors.onSurface,
      lineHeight: 22,
    },
    receipt: {
      marginTop: space[4],
      width: "100%",
      height: 160,
      borderRadius: border.borderRadius.lg,
      backgroundColor: colors.surfaceContainerHigh,
    },
    footer: {
      paddingHorizontal: padH,
      paddingTop: space[2],
      paddingBottom: space[6],
    },
    editBtnOuter: {
      borderRadius: border.borderRadius.lg,
      overflow: "hidden",
    },
    editBtn: {
      paddingVertical: space[4],
      alignItems: "center",
      justifyContent: "center",
    },
    editBtnText: {
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
      color: colors.onPrimary,
    },
    deleteText: {
      marginTop: space[4],
      textAlign: "center",
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.danger,
    },
    centerBlock: {
      flex: 1,
      padding: space[6],
      alignItems: "center",
      justifyContent: "center",
    },
  });
