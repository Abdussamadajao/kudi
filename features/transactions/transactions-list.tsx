import { EmptySearchIllustration } from "@/assets/icons";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { Skeleton, SkeletonList, SkeletonTransaction } from "@/ui/skeleton";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { createTransactionsStyles } from "./transactions-styles";
import { formatAmount } from "./transactions-utils";
import { TransactionSection } from "./types";

type Props = {
  styles: ReturnType<typeof createTransactionsStyles>;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  hasResults: boolean;
  hasAnyData: boolean;
  searchQuery: string;
  filteredSections: TransactionSection[];
  incomeColor: string;
  expenseColor: string;
};

export function TransactionsList({
  styles,
  isLoading,
  isError,
  error,
  onRetry,
  hasResults,
  hasAnyData,
  searchQuery,
  filteredSections,
  incomeColor,
  expenseColor,
}: Props) {
  const router = useRouter();
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        !hasResults && !isLoading && styles.scrollContentEmpty,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <>
          <View style={styles.section}>
            <Skeleton width={72} height={11} style={{ marginBottom: 12 }} />
            <SkeletonList
              count={4}
              gap={10}
              renderItem={() => (
                <View style={styles.card}>
                  <SkeletonTransaction />
                </View>
              )}
            />
          </View>
          <View style={styles.section}>
            <Skeleton width={88} height={11} style={{ marginBottom: 12 }} />
            <SkeletonList
              count={3}
              gap={10}
              renderItem={() => (
                <View style={styles.card}>
                  <SkeletonTransaction />
                </View>
              )}
            />
          </View>
        </>
      ) : isError ? (
        <ErrorView
          error={error}
          title="Could not load transactions"
          message="Pull to refresh or try again."
          onRetry={onRetry}
        />
      ) : hasResults ? (
        filteredSections.map((section) => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>

            {section.data.map((tx) => (
              <Pressable
                key={tx.id}
                onPress={() =>
                  router.push({
                    pathname: "/transactions/[id]",
                    params: {
                      id: tx.id,
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.88 },
                ]}
              >
                <View
                  style={[
                    styles.txIconWrap,
                    { backgroundColor: tx.iconBg + "30" },
                  ]}
                >
                  <View
                    style={[styles.txIconInner, { backgroundColor: tx.iconBg }]}
                  >
                    <MaterialIcons name={tx.icon} size={18} color="#fff" />
                  </View>
                </View>

                <View style={styles.txBody}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.txSubtitle} numberOfLines={1}>
                    {tx.subtitle}
                  </Text>
                </View>

                <View style={styles.amountWrap}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.isIncome ? incomeColor : expenseColor },
                    ]}
                  >
                    {formatAmount(tx.amount, tx.isIncome)}
                  </Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIllustrationWrap}>
            <EmptySearchIllustration />
          </View>
          <Text style={styles.emptyTitle}>
            {!hasAnyData ? "No transactions yet" : "No transactions found"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {!hasAnyData
              ? "When you add income or expenses, they will show up here."
              : searchQuery
                ? `Nothing matches "${searchQuery}". Try another search.`
                : "Nothing matches your filters or tab. Try adjusting them."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
