import { border, fonts, fontSize, spacing, ThemePalette } from "@/constants";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { ComponentProps, useMemo } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const INCOME_STREAMS: {
  id: string;
  tag: string;
  title: string;
  amount: number;
  remaining: number;
  percent: number;
  barColor: "income" | "expense";
  icon: ComponentProps<typeof MaterialIcons>["name"];
}[] = [
  {
    id: "salary",
    tag: "Monthly",
    title: "Salary",
    amount: 500000,
    remaining: 320000,
    percent: 64,
    barColor: "income",
    icon: "payments",
  },
  {
    id: "portfolio",
    tag: "Dividends",
    title: "Tech Portfolio",
    amount: 125500,
    remaining: 12000,
    percent: 10,
    barColor: "expense",
    icon: "trending-up",
  },
  {
    id: "side-hustle",
    tag: "Active",
    title: "Side Hustle",
    amount: 85000,
    remaining: 85000,
    percent: 100,
    barColor: "income",
    icon: "storefront",
  },
];

export type IncomeStreamId = (typeof INCOME_STREAMS)[number]["id"];

export const IncomeSelect = ({
  selectedIncomeId,
  onSelectIncome,
}: {
  selectedIncomeId?: IncomeStreamId | null;
  onSelectIncome: (incomeId: IncomeStreamId | null) => void;
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.incomeStreamsScrollContent}
        style={styles.incomeStreamsScroll}
      >
        {INCOME_STREAMS.map((stream) => {
          const barTint =
            stream.barColor === "income" ? colors.income : colors.expense;
          return (
            <Card
              key={stream.title}
              stream={stream}
              barTint={barTint}
              isSelected={selectedIncomeId === stream.id}
              onPress={() =>
                onSelectIncome(selectedIncomeId === stream.id ? null : stream.id)
              }
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const Card = ({
  stream,
  barTint,
  isSelected,
  onPress,
}: {
  stream: (typeof INCOME_STREAMS)[0];
  barTint: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width: screenW } = Dimensions.get("window");
  const incomeCardW = Math.min(268, Math.round(screenW * 0.72));
  return (
    <Pressable
      onPress={onPress}
      key={stream.title}
      style={[
        styles.incomeStreamCard,
        {
          width: incomeCardW,
          borderColor: isSelected ? colors.primary : colors.outlineVariant,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
    >
      <View style={styles.incomeStreamTop}>
        <Text style={styles.incomeStreamLabel}>{stream.title}</Text>
        <Text style={styles.incomeStreamTag}>{stream.tag}</Text>
      </View>
      <Text style={styles.incomeStreamAmount}>
        {formatPrice(stream.amount)}
      </Text>
      <View style={styles.incomeStreamMeta}>
        <Text style={styles.incomeStreamMetaText}>
          {formatPrice(stream.remaining)} remaining
        </Text>
        <Text style={styles.incomeStreamMetaText}>{stream.percent}%</Text>
      </View>
      <View style={styles.incomeStreamTrack}>
        <View
          style={[
            styles.incomeStreamFill,
            {
              width: `${stream.percent}%`,
              backgroundColor: barTint,
            },
          ]}
        />
      </View>
    </Pressable>
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
