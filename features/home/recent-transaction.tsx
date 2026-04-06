import Skeleton from "@/ui/skeleton";
import type { ThemePalette } from "@/constants";
import { border, fonts, fontSize, spacing } from "@/constants/theme";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatAmount } from "../transactions/transactions-utils";

const DEBIT_AMOUNT = "#FB923C";

export type RecentTransactionRow = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  isIncome: boolean;
  iconType: "INCOME" | "EXPENSE";
};

type RecentTransactionsProps = {
  items?: RecentTransactionRow[];
  isLoading?: boolean;
};

export function RecentTransactions({
  items = [],
  isLoading = false,
}: RecentTransactionsProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Pressable
          onPress={() => router.push("/transactions")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="View all transactions"
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <View key={`recent-skeleton-${i}`} style={styles.row}>
                <Skeleton width={48} height={48} borderRadius={24} />
                <View style={styles.middle}>
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="40%" height={11} style={{ marginTop: 8 }} />
                </View>
                <View style={styles.right}>
                  <Skeleton width={70} height={14} />
                  <Skeleton width={40} height={10} style={{ marginTop: 8 }} />
                </View>
              </View>
            ))
          : items.map((tx) => {
              const isCredit = tx.amount >= 0;
              const amountText = isCredit
                ? `+${formatPrice(tx.amount)}`
                : formatPrice(tx.amount);
              return (
                <View key={tx.id} style={styles.row}>
                  <View
                    style={[
                      styles.txIconWrap,
                      { backgroundColor: tx.iconBg + "30" },
                    ]}
                  >
                    <View
                      style={[
                        styles.txIconInner,
                        { backgroundColor: tx.iconBg },
                      ]}
                    >
                      <MaterialIcons name={tx.icon} size={18} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.middle}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {tx.title}
                    </Text>
                    <Text style={styles.rowMeta} numberOfLines={1}>
                      {tx.subtitle}
                    </Text>
                  </View>
                  <View style={styles.right}>
                    <Text
                      style={[
                        styles.amount,
                        { color: tx.isIncome ? colors.income : colors.expense },
                      ]}
                    >
                      {formatAmount(tx.amount, tx.isIncome)}
                    </Text>
                    <Text style={styles.typeLabel}>
                      {tx.isIncome ? "INCOME" : "EXPENSE"}
                    </Text>
                  </View>
                </View>
              );
            })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    wrapper: {
      gap: spacing[4],
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.Manrope.Bold,
      color: colors.onSurface,
    },
    viewAll: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.Medium,
      color: colors.income,
    },
    list: {
      gap: spacing[6],
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    txIconWrap: {
      width: 52,
      height: 52,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    txIconInner: {
      width: 42,
      height: 42,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    middle: {
      flex: 1,
      minWidth: 0,
    },
    rowTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.SemiBold,
      color: colors.onSurface,
    },
    rowMeta: {
      marginTop: 2,
      fontSize: fontSize.sm,
      fontFamily: fonts.Inter.Regular,
      color: colors.textSecondary,
    },
    right: {
      alignItems: "flex-end",
      marginLeft: spacing[2],
    },
    amount: {
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
    },
    typeLabel: {
      marginTop: 2,
      fontSize: 10,
      fontFamily: fonts.Inter.Medium,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: colors.textSecondary,
    },
  });
