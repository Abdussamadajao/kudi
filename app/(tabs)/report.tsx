import { Header } from "@/ui/header";
import {
  border,
  fonts,
  fontSize,
  spacing,
  type ThemePalette,
} from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

const PURPLE_ACCENT = "#8B5CF6";
const DONUT_CHART_SIZE = 200;
const DONUT_TRANSPORT = "#5DADE2";
const DONUT_SHOPPING = "#95A5A6";
const DONUT_BILLS = "#566573";
const OBS_FOOD_BG = "#A0522D";
const OBS_TIP_BG = "#F1C40F";

type DonutSeg = { pct: number; color: string };

function SpendingDonut({
  size,
  strokeWidth,
  segments,
}: {
  size: number;
  strokeWidth: number;
  segments: DonutSeg[];
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let dashOffset = 0;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size}>
      <G transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((seg, i) => {
          const dash = seg.pct * c;
          const gap = c - dash;
          const el = (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              fill="none"
              r={r}
              stroke={seg.color}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-dashOffset}
              strokeLinecap="butt"
              strokeWidth={strokeWidth}
            />
          );
          dashOffset += dash;
          return el;
        })}
      </G>
    </Svg>
  );
}

const Report = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const donutSegments: DonutSeg[] = useMemo(
    () => [
      { pct: 0.45, color: colors.income },
      { pct: 0.25, color: DONUT_TRANSPORT },
      { pct: 0.2, color: DONUT_SHOPPING },
      { pct: 0.1, color: DONUT_BILLS },
    ],
    [colors.income],
  );

  const legend = useMemo(
    () => [
      { label: "Food", pct: "45%", color: colors.income },
      { label: "Transport", pct: "25%", color: DONUT_TRANSPORT },
      { label: "Shopping", pct: "20%", color: DONUT_SHOPPING },
      { label: "Bills", pct: "10%", color: DONUT_BILLS },
    ],
    [colors.income],
  );

  const strokeW = 36;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header title="Insights" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text style={styles.pageEyebrow}>Smart analysis of your finances</Text>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.bulbIconWrap}>
              <Ionicons color={colors.onPrimary} name="bulb" size={18} />
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>SMART INSIGHT</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>
            You saved <Text style={styles.heroAmount}>₦20,000</Text> more than
            last month.
          </Text>
          <Text style={styles.heroSub}>
            Great job! Your intentional spending habits are showing significant
            results in your wealth accumulation path.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.labelCaps}>PERFORMANCE TREND THIS MONTH</Text>
          <Text style={styles.amountLg}>₦180,000</Text>
          <Text style={[styles.labelCaps, styles.labelGap]}>LAST MONTH</Text>
          <View style={styles.trendRow}>
            <Text style={styles.amountMd}>₦220,000</Text>
            <View style={styles.trendPill}>
              <Ionicons
                color={colors.income}
                name="arrow-down"
                size={14}
                style={styles.trendArrow}
              />
              <Text style={styles.trendPillText}>18%</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Observations</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.obsCard}>
          <View style={[styles.obsIcon, { backgroundColor: OBS_FOOD_BG }]}>
            <Ionicons color="#fff" name="trending-up" size={18} />
          </View>
          <Text style={styles.obsText}>
            You spent <Text style={styles.obsEmphasis}>18% more</Text> on food
            this week.
          </Text>
        </View>
        <View style={styles.obsCard}>
          <View style={[styles.obsIcon, { backgroundColor: OBS_TIP_BG }]}>
            <Ionicons color="#1a1a1a" name="bulb" size={18} />
          </View>
          <Text style={styles.obsText}>
            You can save <Text style={styles.obsEmphasis}>₦15,000</Text> by
            reducing subscriptions.
          </Text>
        </View>
        <View style={styles.obsCard}>
          <View style={[styles.obsIcon, { backgroundColor: colors.income }]}>
            <Ionicons color={colors.surface} name="car" size={18} />
          </View>
          <Text style={styles.obsText}>
            Transport costs{" "}
            <Text style={styles.obsPositive}>decreased by 10%</Text>.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Spending Breakdown
        </Text>
        <View style={styles.card}>
          <View style={styles.donutWrap}>
            <SpendingDonut
              segments={donutSegments}
              size={DONUT_CHART_SIZE}
              strokeWidth={strokeW}
            />
            <View pointerEvents="none" style={styles.donutCenter}>
              <Text style={styles.donutLabel}>TOTAL SPENT</Text>
              <Text style={styles.donutValue}>₦180k</Text>
            </View>
          </View>
          <View style={styles.legend}>
            {legend.map((row) => (
              <View key={row.label} style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: row.color }]}
                />
                <Text style={styles.legendLabel}>{row.label}</Text>
                <Text style={styles.legendPct}>{row.pct}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Spending Habits
        </Text>
        <View style={styles.habitCard}>
          <View style={styles.habitIconCircle}>
            <Ionicons color={colors.income} name="calendar" size={22} />
          </View>
          <Text style={styles.habitText}>
            You spend most on <Text style={styles.habitBold}>weekends</Text>.
          </Text>
        </View>
        <View style={styles.habitCard}>
          <View style={styles.habitIconCircle}>
            <Ionicons color={colors.income} name="restaurant" size={22} />
          </View>
          <Text style={styles.habitText}>
            Your highest expense category is{" "}
            <Text style={styles.habitBold}>Food</Text>.
          </Text>
        </View>
        <View style={styles.habitCard}>
          <View style={styles.habitIconCircle}>
            <Ionicons color={colors.income} name="business" size={22} />
          </View>
          <Text style={styles.habitText}>
            You tend to spend more after receiving income.
          </Text>
        </View>

        <View style={[styles.card, styles.ctaCard]}>
          <Text style={styles.ctaTitle}>Build a stronger future</Text>
          <Text style={styles.ctaSub}>
            Set a budget to improve your savings by up to 15%.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              pressed && styles.ctaBtnPressed,
            ]}
          >
            <Text style={styles.ctaBtnText}>Create Budget</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: palette.background,
      flex: 1,
    },
    accentRail: {
      backgroundColor: PURPLE_ACCENT,
      bottom: 0,
      left: 0,
      position: "absolute",
      top: 0,
      width: 4,
      zIndex: 1,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingBottom: spacing[24],
      paddingHorizontal: spacing[4],
      paddingLeft: spacing[4] + 4,
      paddingTop: spacing[3],
    },
    bottomSpacer: { height: 100 },
    pageEyebrow: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      marginBottom: spacing[4],
    },
    card: {
      backgroundColor: palette.surfaceVariant,
      borderRadius: border.borderRadius.lg,
      marginBottom: spacing[4],
      padding: spacing[5],
    },
    cardTopRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[4],
    },
    bulbIconWrap: {
      alignItems: "center",
      backgroundColor: palette.income,
      borderRadius: border.borderRadius.DEFAULT,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    pill: {
      backgroundColor: palette.surfaceContainerLow,
      borderRadius: border.borderRadius.full,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    pillText: {
      color: palette.income,
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.xs,
      letterSpacing: 0.6,
    },
    heroTitle: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.xl,
      lineHeight: 28,
      marginBottom: spacing[3],
    },
    heroAmount: {
      color: palette.income,
      fontFamily: fonts.Manrope.Bold,
    },
    heroSub: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    labelCaps: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.Medium,
      fontSize: fontSize.xs,
      letterSpacing: 0.8,
    },
    labelGap: { marginTop: spacing[4] },
    amountLg: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize["3xl"],
      marginTop: spacing[2],
    },
    amountMd: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.xl,
    },
    trendRow: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: spacing[2],
    },
    trendPill: {
      alignItems: "center",
      backgroundColor: `${palette.income}22`,
      borderRadius: border.borderRadius.full,
      flexDirection: "row",
      marginLeft: spacing[3],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    trendArrow: { marginRight: 4, marginTop: 1 },
    trendPillText: {
      color: palette.income,
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.sm,
    },
    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[3],
    },
    sectionTitle: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.lg,
    },
    sectionTitleSpaced: { marginBottom: spacing[3], marginTop: spacing[2] },
    link: {
      color: palette.income,
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.sm,
    },
    obsCard: {
      alignItems: "center",
      backgroundColor: palette.surfaceVariant,
      borderRadius: border.borderRadius.lg,
      flexDirection: "row",
      marginBottom: spacing[3],
      padding: spacing[4],
    },
    obsIcon: {
      alignItems: "center",
      borderRadius: border.borderRadius.full,
      height: 44,
      justifyContent: "center",
      marginRight: spacing[3],
      width: 44,
    },
    obsText: {
      color: palette.onSurface,
      flex: 1,
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    obsEmphasis: {
      fontFamily: fonts.Inter.SemiBold,
    },
    obsPositive: {
      color: palette.income,
      fontFamily: fonts.Inter.SemiBold,
    },
    donutWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing[2],
    },
    donutCenter: {
      alignItems: "center",
      height: DONUT_CHART_SIZE,
      justifyContent: "center",
      position: "absolute",
      width: DONUT_CHART_SIZE,
    },
    donutLabel: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.Medium,
      fontSize: fontSize.xs,
      letterSpacing: 0.6,
    },
    donutValue: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize["2xl"],
      marginTop: 2,
    },
    legend: { marginTop: spacing[4] },
    legendRow: {
      alignItems: "center",
      flexDirection: "row",
      marginBottom: spacing[3],
    },
    legendDot: {
      borderRadius: 6,
      height: 10,
      marginRight: spacing[3],
      width: 10,
    },
    legendLabel: {
      color: palette.onSurface,
      flex: 1,
      fontFamily: fonts.Inter.Medium,
      fontSize: fontSize.sm,
    },
    legendPct: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.sm,
    },
    habitCard: {
      alignItems: "center",
      backgroundColor: palette.surfaceVariant,
      borderRadius: border.borderRadius.lg,
      marginBottom: spacing[3],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[6],
    },
    habitIconCircle: {
      alignItems: "center",
      backgroundColor: `${palette.income}18`,
      borderRadius: border.borderRadius.full,
      height: 48,
      justifyContent: "center",
      marginBottom: spacing[3],
      width: 48,
    },
    habitText: {
      color: palette.onSurface,
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      lineHeight: 22,
      textAlign: "center",
    },
    habitBold: {
      fontFamily: fonts.Inter.SemiBold,
    },
    ctaCard: { marginTop: spacing[2] },
    ctaTitle: {
      color: palette.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.xl,
      marginBottom: spacing[2],
    },
    ctaSub: {
      color: palette.textSecondary,
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      lineHeight: 20,
      marginBottom: spacing[5],
    },
    ctaBtn: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: border.borderRadius.full,
      paddingVertical: spacing[4],
    },
    ctaBtnPressed: { opacity: 0.88 },
    ctaBtnText: {
      color: palette.onPrimary,
      fontFamily: fonts.Manrope.SemiBold,
      fontSize: fontSize.md,
    },
  });

export default Report;
