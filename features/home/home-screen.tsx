import { useIncomeTransactions, useTransactions } from "@/actions";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { getGreeting } from "@/constants/greetings";
import { useStyles } from "@/hooks/useStyles";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/provider/theme-provider";
import { IncomeTransaction, User } from "@/types";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValidMaterialIcon } from "../transactions/transactions-utils";
import HomeChart from "./chart";
import { HomeHeader } from "./home-header";
import { createHomeScreenStyles } from "./home-styles";
import Income from "./income";
import { NetWorthCard } from "./net-worth-card";
import {
  RecentTransactions,
  type RecentTransactionRow,
} from "./recent-transaction";

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(createHomeScreenStyles);
  const {
    data,
    isPending,
    error,
    refetch,
    isRefetching: isSessionRefetching,
  } = authClient.useSession();
  const {
    data: incomeTransactions,
    refetch: refetchIncomeTransactions,
    error: incomeTransactionsError,

    isRefetching: isIncomeTransactionsRefetching,
  } = useIncomeTransactions();
  const {
    data: transactions,
    isPending: isTransactionsPending,
    error: transactionsError,
    refetch: refetchTransactions,
    isRefetching: isTransactionsRefetching,
  } = useTransactions();

  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const { message } = getGreeting({ name: userName });

  const handleRefresh = () => {
    refetch();
    refetchIncomeTransactions();
    refetchTransactions();
  };

  const incomeOnlyTransactions: IncomeTransaction[] = (
    incomeTransactions?.data ?? []
  ).filter((tx): tx is IncomeTransaction => tx.type === "INCOME");
  const recentTransactions: RecentTransactionRow[] = (transactions?.data ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
    )
    .slice(0, 3)
    .map((tx) => ({
      id: tx.id,
      title: tx.source_name?.trim() || tx.category.name,
      subtitle: tx.category.name,
      amount: Number(tx.amount) || 0,
      icon: isValidMaterialIcon(tx.category.icon)
        ? tx.category.icon
        : "receipt-long",
      iconBg: tx.category.color,
      iconType: tx.category.type,
      isIncome: tx.type === "INCOME",
    }));

  if (error || transactionsError || incomeTransactionsError) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <ErrorView
          error={error || transactionsError || incomeTransactionsError}
          onRetry={handleRefresh}
        />
      </SafeAreaView>
    );
  }
  const isRefetching =
    isSessionRefetching ||
    isIncomeTransactionsRefetching ||
    isTransactionsRefetching;

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <HomeHeader
          userName={userName}
          message={message}
          isPending={isPending}
          avatarUrl={user?.avatarUrl ?? user?.image ?? ""}
        />

        <View style={styles.sectionBlock}>
          <NetWorthCard />
        </View>

        <View style={styles.sectionBlock}>
          <Income
            incomeTransactions={incomeOnlyTransactions}
            isLoading={isTransactionsPending}
          />
        </View>
        <View style={styles.sectionBlock}>
          <HomeChart />
        </View>

        <View style={styles.sectionBlock}>
          <RecentTransactions
            items={recentTransactions}
            isLoading={isTransactionsPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
