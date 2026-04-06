import Skeleton from "@/ui/skeleton";
import { border, fonts, fontSize, spacing, ThemePalette } from "@/constants";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import type { IncomeTransaction } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { ComponentProps, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const INCOME_STREAMS: {
  tag: string;
  title: string;
  amount: number;
  remaining: number;
  percent: number;
  barColor: "income" | "expense";
  icon: ComponentProps<typeof MaterialIcons>["name"];
}[] = [
  {
    tag: "Monthly",
    title: "Salary",
    amount: 500000,
    remaining: 320000,
    percent: 64,
    barColor: "income",
    icon: "payments",
  },
  {
    tag: "Dividends",
    title: "Tech Portfolio",
    amount: 125500,
    remaining: 12000,
    percent: 10,
    barColor: "expense",
    icon: "trending-up",
  },
  {
    tag: "Active",
    title: "Side Hustle",
    amount: 85000,
    remaining: 85000,
    percent: 100,
    barColor: "income",
    icon: "storefront",
  },
];

const Income = ({
  label = "Income Streams",
  isLabel = true,
  incomeTransactions,
  isLoading = false,
}: {
  label?: string;
  isLabel?: boolean;
  incomeTransactions: IncomeTransaction[];
  isLoading?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      {isLabel ? <Text style={styles.incomeStreamsTitle}>{label}</Text> : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.incomeStreamsScrollContent}
        style={styles.incomeStreamsScroll}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`income-skeleton-${i}`} width={220} height={130} />
            ))
          : incomeTransactions.map((incomeTransaction) => {
              const barTint =
                incomeTransaction.type === "INCOME"
                  ? colors.income
                  : colors.expense;
              return (
                <Card
                  key={incomeTransaction.id}
                  incomeTransaction={incomeTransaction}
                  barTint={barTint}
                />
              );
            })}
      </ScrollView>
    </>
  );
};

export default Income;

const Card = ({
  incomeTransaction,
  barTint,
}: {
  incomeTransaction: IncomeTransaction;
  barTint: string;
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width: screenW } = Dimensions.get("window");
  const incomeCardW = Math.min(268, Math.round(screenW * 0.72));
  return (
    <View
      key={incomeTransaction.id}
      style={[
        styles.incomeStreamCard,
        {
          width: incomeCardW,
        },
      ]}
    >
      <View style={styles.incomeStreamTop}>
        <Text style={styles.incomeStreamLabel}>
          {incomeTransaction.source_name}
        </Text>
        <Text style={styles.incomeStreamTag}>{incomeTransaction.tag}</Text>
      </View>
      <Text style={styles.incomeStreamAmount}>
        {formatPrice(Number(incomeTransaction.amount))}
      </Text>
      <View style={styles.incomeStreamMeta}>
        <Text style={styles.incomeStreamMetaText}>
          {formatPrice(incomeTransaction.summary.remaining)} remaining
        </Text>
        <Text style={styles.incomeStreamMetaText}>
          {incomeTransaction.summary.percentage}%
        </Text>
      </View>
      <View style={styles.incomeStreamTrack}>
        <View
          style={[
            styles.incomeStreamFill,
            {
              width: `${incomeTransaction.summary.percentage}%`,
              backgroundColor: barTint,
            },
          ]}
        />
      </View>
    </View>
  );
};

export const createStyles = (theme: ThemePalette) => {
  return StyleSheet.create({
    incomeStreamsTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.Manrope.Bold,
      marginBottom: spacing[3],
      color: theme.onSurface,
    },
    incomeStreamsScroll: {
      marginHorizontal: -16,
    },
    incomeStreamsScrollContent: {
      paddingHorizontal: 16,
      gap: 12,
      paddingBottom: 4,
    },
    incomeStreamCard: {
      borderRadius: border.borderRadius.xl,
      padding: spacing[4],
      gap: spacing[2],
      backgroundColor: theme.surfaceVariant,
    },
    incomeStreamTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    incomeStreamIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary + "28",
    },
    incomeStreamTag: {
      fontSize: fontSize.xs,
      fontFamily: fonts.Manrope.SemiBold,
      color: theme.onSurfaceVariant,
    },
    incomeStreamLabel: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.Medium,
      color: theme.onSurfaceVariant,
    },
    incomeStreamAmount: {
      fontSize: fontSize["2xl"],
      fontFamily: fonts.Manrope.ExtraBold,
      letterSpacing: -0.3,
      marginTop: 2,
      color: theme.onSurface,
    },
    incomeStreamMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing[2],
    },
    incomeStreamMetaText: {
      fontSize: 11,
      fontFamily: fonts.Manrope.Medium,
      color: theme.onSurfaceVariant,
    },
    incomeStreamTrack: {
      height: 4,
      borderRadius: 2,
      overflow: "hidden",
      marginTop: spacing[3],
      backgroundColor: theme.outlineVariant + "44",
    },
    incomeStreamFill: {
      height: "100%",
      borderRadius: 2,
    },
  });
};
