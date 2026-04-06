import Skeleton from "@/ui/skeleton";
import { border } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createAddExpensesStyles } from "./add-expenses-styles";

export type IncomeSummaryCardProps = {
  onPress: () => void;
  incomeLabel: string;
  totalAmount: number;
  remainingAmount: number;
  incomePercent: number;
  isLoading?: boolean;
};

export function IncomeSummaryCard({
  onPress,
  incomeLabel,
  totalAmount,
  remainingAmount,
  incomePercent,
  isLoading = false,
}: IncomeSummaryCardProps) {
  const { colors } = useTheme();
  const styles = useStyles(createAddExpensesStyles);

  const cardShell = [
    styles.incomeCard,
    {
      backgroundColor: colors.cardBackground,
      borderColor: colors.slate[700],
    },
  ];

  if (isLoading) {
    return (
      <Pressable onPress={onPress} style={cardShell}>
        <View style={styles.incomeCardHeader}>
          <Skeleton
            width="42%"
            height={12}
            borderRadius={border.borderRadius.DEFAULT}
          />
          <Skeleton
            width={20}
            height={20}
            borderRadius={border.borderRadius.DEFAULT}
          />
        </View>
        <Skeleton
          width="58%"
          height={28}
          borderRadius={border.borderRadius.DEFAULT}
          style={{ marginTop: 2 }}
        />
        <Skeleton
          width="100%"
          height={8}
          borderRadius={4}
          style={{ marginTop: 12, marginBottom: 10 }}
        />
        <View style={styles.incomeCardFooter}>
          <Skeleton
            width="48%"
            height={14}
            borderRadius={border.borderRadius.DEFAULT}
          />
          <Skeleton
            width="22%"
            height={12}
            borderRadius={border.borderRadius.DEFAULT}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={cardShell}>
      <View style={styles.incomeCardHeader}>
        <Text style={[styles.incomeCardLabel, { color: colors.textSecondary }]}>
          {incomeLabel.toUpperCase()}{" "}
        </Text>
        <MaterialIcons
          name="swap-vert"
          size={20}
          color={colors.textSecondary}
        />
      </View>
      <Text style={[styles.incomeCardTotal, { color: colors.textPrimary }]}>
        {formatPrice(totalAmount)}
        <Text
          style={[
            styles.incomeCardTotalSuffix,
            { color: colors.textSecondary },
          ]}
        >
          {" "}
          total
        </Text>
      </Text>
      <View
        style={[
          styles.incomeCardBarWrap,
          { backgroundColor: colors.slate[700] },
        ]}
      >
        <View
          style={[
            styles.incomeCardBarGreen,
            {
              width: `${incomePercent}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <View
          style={[
            styles.incomeCardBarRed,
            { flex: 1, backgroundColor: colors.expense },
          ]}
        />
      </View>
      <View style={styles.incomeCardFooter}>
        <Text style={[styles.incomeCardRemaining, { color: colors.primary }]}>
          {formatPrice(remainingAmount)} remaining
        </Text>
        <Text
          style={[styles.incomeCardPercent, { color: colors.textSecondary }]}
        >
          {incomePercent}% left
        </Text>
      </View>
    </Pressable>
  );
}
