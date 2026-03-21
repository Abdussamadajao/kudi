import { border, fonts, fontSize, spacing, ThemePalette } from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export type WealthVelocityTab = "GROWTH" | "PROJECTION";

function buildPath(
  points: { x: number; y: number }[],
  svgHeight: number,
): { line: string; area: string } {
  if (points.length < 2) return { line: "", area: "" };

  const d: string[] = [];
  d.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  const line = d.join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L ${last.x} ${svgHeight} L ${first.x} ${svgHeight} Z`;

  return { line, area };
}

const DEMO_GROWTH: number[] = [
  0.82, 0.75, 0.68, 0.6, 0.55, 0.52, 0.48, 0.42, 0.38, 0.4, 0.45, 0.5, 0.48,
  0.44, 0.38, 0.3, 0.22, 0.18, 0.2, 0.25, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08,
  0.12, 0.18, 0.28, 0.38, 0.48, 0.55, 0.6, 0.55, 0.5, 0.55, 0.62, 0.7, 0.78,
  0.85, 0.9, 0.88, 0.85, 0.8, 0.7, 0.62, 0.55, 0.5, 0.45, 0.4, 0.3, 0.2,
  0.12, 0.06,
];

const DEMO_PROJECTION: number[] = DEMO_GROWTH.map((v) =>
  Math.min(1, Math.max(0, v * 0.88 + 0.06)),
);

type WealthVelocityChartProps = {
  cardWidth: number;
  activeTab?: WealthVelocityTab;
  onTabChange?: (tab: WealthVelocityTab) => void;
  growthData?: number[];
  projectionData?: number[];
  chartHeight?: number;
};

const WealthVelocityChart = ({
  cardWidth,
  activeTab: activeTabProp,
  onTabChange,
  growthData = DEMO_GROWTH,
  projectionData = DEMO_PROJECTION,
  chartHeight = 168,
}: WealthVelocityChartProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [internalTab, setInternalTab] = useState<WealthVelocityTab>("GROWTH");
  const tab = activeTabProp ?? internalTab;

  const setTab = (t: WealthVelocityTab) => {
    onTabChange?.(t);
    if (activeTabProp === undefined) setInternalTab(t);
  };

  const data = tab === "GROWTH" ? growthData : projectionData;
  const innerPad = spacing[4];
  const svgWidth = Math.max(1, cardWidth - innerPad * 2);
  const gradId = useMemo(
    () => `wealthVel_${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const PADDING = { top: 12, bottom: 8, left: 0, right: 0 };
  const chartW = svgWidth - PADDING.left - PADDING.right;
  const chartInnerH = chartHeight - PADDING.top - PADDING.bottom;

  const { line, area } = useMemo(() => {
    if (data.length < 2) return { line: "", area: "" };
    const pts = data.map((v, i) => ({
      x: PADDING.left + (i / (data.length - 1)) * chartW,
      y: PADDING.top + v * chartInnerH,
    }));
    return buildPath(pts, chartHeight);
  }, [data, chartW, chartInnerH, chartHeight]);

  const tabs: WealthVelocityTab[] = ["GROWTH", "PROJECTION"];

  return (
    <View
      style={[
        styles.rightCard,
        {
          width: cardWidth,
          shadowColor: colors.primary,
        },
      ]}
    >
      <View style={styles.rightHeader}>
        <Text style={[styles.rightTitle, { color: colors.textPrimary }]}>
          Wealth Velocity
        </Text>
        <View style={styles.wealthTabRow}>
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                activeOpacity={0.7}
                style={styles.wealthTabBtn}
              >
                <Text
                  style={[
                    styles.wealthTabText,
                    { color: colors.onSurfaceVariant },
                    active && { color: colors.primary },
                  ]}
                >
                  {t}
                </Text>
                {active ? (
                  <View
                    style={[
                      styles.wealthTabUnderline,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ width: svgWidth, height: chartHeight }}>
        {line ? (
          <Svg width={svgWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.primary}
                  stopOpacity={0.35}
                />
                <Stop
                  offset="60%"
                  stopColor={colors.primaryGradient[0]}
                  stopOpacity={0.1}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.background}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Path d={area} fill={`url(#${gradId})`} />
            <Path
              d={line}
              fill="none"
              stroke={colors.primary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : null}
      </View>
    </View>
  );
};

const HomeChart = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const screenW = Dimensions.get("window").width;
  const leftCardW = Math.min(268, Math.round(screenW * 0.62));
  const rightCardW = Math.min(380, Math.round(screenW * 0.92));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chartScroll}
      contentContainerStyle={styles.chartScrollContent}
    >
      <View style={[styles.leftCard, { width: leftCardW }]}>
        <View
          style={[
            styles.leftIconWrap,
            { backgroundColor: colors.primary + "1A" },
          ]}
        >
          <MaterialIcons name="auto-awesome" size={18} color={colors.primary} />
        </View>

        <Text style={[styles.leftTitle, { color: colors.textPrimary }]}>
          You saved{" "}
          <Text
            style={{
              color: colors.primary,
              fontFamily: fonts.Manrope.ExtraBold,
            }}
          >
            ₦20,000
          </Text>{" "}
          more than last month.
        </Text>

        <Text style={[styles.leftSub, { color: colors.textSecondary }]}>
          Your grocery spending decreased by 14%, allowing for higher
          contribution to your{" "}
          <Text style={{ color: colors.textPrimary }}>Emerald Vault</Text>{" "}
          savings.
        </Text>

        <View style={styles.leftLinkRow}>
          <Text style={[styles.leftLink, { color: colors.primary }]}>
            View analysis
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={16}
            color={colors.primary}
          />
        </View>
      </View>

      <WealthVelocityChart cardWidth={Math.max(rightCardW, leftCardW + 48)} />
    </ScrollView>
  );
};

export default HomeChart;

export { WealthVelocityChart };

export const createStyles = (_colors: ThemePalette) => {
  return StyleSheet.create({
    chartScroll: {
      marginHorizontal: -16,
    },
    chartScrollContent: {
      paddingHorizontal: 16,
      gap: 12,
      paddingBottom: 4,
    },
    leftCard: {
      borderRadius: border.borderRadius.xl,
      padding: spacing[4],
      backgroundColor: _colors.surfaceContainer,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      minHeight: 170,
    },
    leftIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[3],
    },
    leftTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.Manrope.Bold,
      lineHeight: 22,
      marginBottom: spacing[2],
    },
    leftSub: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.Medium,
      lineHeight: 18,
      marginBottom: spacing[3],
    },
    leftLinkRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: "auto",
    },
    leftLink: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
    },

    rightCard: {
      borderRadius: border.borderRadius.xl,
      padding: spacing[4],
      backgroundColor: _colors.surfaceContainer,
      shadowOpacity: 0.14,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
      minHeight: 220,
    },
    rightHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[3],
    },
    rightTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
      letterSpacing: 0.2,
    },
    wealthTabRow: {
      flexDirection: "row",
      gap: spacing[4],
    },
    wealthTabBtn: {
      alignItems: "center",
      minWidth: 72,
      gap: 3,
    },
    wealthTabText: {
      fontSize: 11,
      fontFamily: fonts.Manrope.SemiBold,
      letterSpacing: 1.1,
    },
    wealthTabUnderline: {
      height: 1.5,
      width: "100%",
      borderRadius: 2,
    },
  });
};
