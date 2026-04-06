import { formatPrice } from "@/lib/custom";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { createNetWorthCardStyles } from "./home-styles";

type NetWorthCardProps = {
  amount?: number;
  trendLabel?: string;
};

export function NetWorthCard({
  amount = 245000,
  trendLabel = "+12% vs last month",
}: NetWorthCardProps) {
  const { colors } = useTheme();
  const styles = useStyles(createNetWorthCardStyles);
  const { width: screenW } = Dimensions.get("window");
  const cardW = Math.round(screenW * 0.92);

  return (
    <View style={styles.cardsRow}>
      <View style={[styles.netWorthCard, { width: cardW }]}>
        <View style={styles.netWorthGlow} />
        <View style={styles.netWorthInner}>
          <Text style={styles.netWorthLabel}>Total Net Worth</Text>
          <View style={styles.netWorthAmountBlock}>
            <Text style={styles.netWorthAmount}>{formatPrice(amount)}</Text>
            <View style={styles.netWorthTrendRow}>
              <MaterialIcons
                name="trending-up"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.netWorthTrendText}>{trendLabel}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
