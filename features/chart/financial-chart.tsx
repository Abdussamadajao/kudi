import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import type { barDataItem } from "gifted-charts-core";
import React, { useMemo } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { BarChart } from "react-native-gifted-charts/dist/BarChart";

export type WeekDataItem = { day: string; income: number; expense: number };

type FinancialChartProps = {
  data: readonly WeekDataItem[];
  height?: number;
  barWidth?: number;
  maxValue?: number;
  noOfSections?: number;
  formatYLabel?: (value: string) => string;
};

export function FinancialChart({
  data,
  height = 180,
  barWidth = 11,
  maxValue: maxValueProp,
  noOfSections = 4,
  formatYLabel = (v) => v,
}: FinancialChartProps) {
  const { colors } = useTheme();

  const {
    chartData,
    maxValue,
    stepValue,
    wrapStyle,
    labelTextStyle,
    yAxisTextStyle,
  } = useMemo(() => {
    const weekData = data.slice(0, 7);
    const maxVal =
      maxValueProp ??
      Math.max(...weekData.flatMap((d) => [d.income, d.expense]), 1);
    const step = Math.ceil(maxVal / noOfSections / 1000) * 1000 || 1000;
    const roundedMax = step * noOfSections;

    const labelStyle: TextStyle = {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: fonts.Manrope.Medium,
    };
    const items: barDataItem[] = [];
    weekData.forEach((d, i) => {
      items.push({
        value: d.income,
        label: d.day,
        frontColor: colors.primary,
        spacing: 6,
        labelTextStyle: labelStyle,
      });
      items.push({
        value: d.expense,
        label: "",
        frontColor: colors.slate[200],
        spacing: i < weekData.length - 1 ? 14 : 20,
        labelTextStyle: labelStyle,
      });
    });

    return {
      chartData: items,
      maxValue: roundedMax,
      stepValue: step,
      wrapStyle: { width: "100%" as const },
      labelTextStyle: labelStyle,
      yAxisTextStyle: {
        fontSize: 10,
        color: colors.textSecondary,
        fontFamily: fonts.Manrope.Medium,
      } as TextStyle,
    };
  }, [data, maxValueProp, noOfSections, colors]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.slate[700],
          shadowColor: "#000",
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Weekly Activity
        </Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.legendText, { color: colors.textPrimary }]}>
              INCOME
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.slate[400] }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              EXPENSE
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.chartWrap, wrapStyle, { height }]}>
        <BarChart
          data={chartData}
          barWidth={barWidth}
          height={height - 32}
          maxValue={maxValue}
          stepValue={stepValue}
          noOfSections={noOfSections}
          barBorderRadius={4}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          initialSpacing={8}
          xAxisLabelTextStyle={labelTextStyle}
          yAxisTextStyle={yAxisTextStyle}
          yAxisLabelWidth={28}
          formatYLabel={formatYLabel}
          hideAxesAndRules={false}
          rulesColor={colors.slate[200]}
          xAxisColor="transparent"
          yAxisColor="transparent"
          hideRules={false}
          showFractionalValues={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: border.borderRadius.xl,
    padding: 20,
    overflow: "hidden",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  chartWrap: {
    paddingBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.Manrope.Bold,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
  },
});
