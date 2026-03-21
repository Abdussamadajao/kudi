import type { ThemePalette } from "@/constants";
import { border, fonts, fontSize, spacing } from "@/constants/theme";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DEBIT_AMOUNT = "#FB923C";

export type RecentTransactionRow = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const PLACEHOLDER_ITEMS: RecentTransactionRow[] = [
  {
    id: "1",
    title: "Whole Foods Market",
    subtitle: "Today • 2:45 PM",
    amount: -42000,
    icon: "shopping-cart",
  },
  {
    id: "2",
    title: "Monthly Salary",
    subtitle: "Yesterday • 9:00 AM",
    amount: 500000,
    icon: "account-balance",
  },
  {
    id: "3",
    title: "Tesla Supercharger",
    subtitle: "24 Oct • 8:12 PM",
    amount: -8500,
    icon: "directions-car",
  },
];

type RecentTransactionsProps = {
  items?: RecentTransactionRow[];
};

export function RecentTransactions({
  items = PLACEHOLDER_ITEMS,
}: RecentTransactionsProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Pressable
          onPress={() => router.push("/transact")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="View all transactions"
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {items.map((tx) => {
          const isCredit = tx.amount >= 0;
          const amountText = isCredit
            ? `+${formatPrice(tx.amount)}`
            : formatPrice(tx.amount);
          return (
            <View key={tx.id} style={styles.row}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.surfaceContainerHigh },
                ]}
              >
                <MaterialIcons name={tx.icon} size={22} color={colors.icons} />
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
                    { color: isCredit ? colors.income : colors.expense },
                  ]}
                >
                  {amountText}
                </Text>
                <Text style={styles.typeLabel}>
                  {isCredit ? "CREDIT" : "DEBIT"}
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
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing[3],
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
