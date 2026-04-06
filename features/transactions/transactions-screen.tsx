import TransactionsFilterModal from "@/features/transactions/transactions-filter-modal";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { Header } from "@/ui/header";
import SearchBar from "@/ui/search-bar";
import SegmentedTabs from "@/ui/segmented-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionsList } from "./transactions-list";
import { createTransactionsStyles } from "./transactions-styles";
import { TABS } from "./types";
import { useTransactionsScreen } from "./use-transactions-screen";

export function TransactionsScreen() {
  const { colors } = useTheme();
  const styles = useStyles(createTransactionsStyles);
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    filterOpen,
    setFilterOpen,
    appliedFilter,
    setAppliedFilter,
    filterActive,
    filterCategories,
    filteredSections,
    isLoading,
    isError,
    error: transactionsError,
    refetch,
    hasAnyData,
    hasResults,
    searchQuery,
  } = useTransactionsScreen();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header title=" Transactions" />

      <View style={styles.searchRow}>
        <SearchBar search={search} setSearch={setSearch} />
        <View style={styles.filterBtnWrap}>
          <Pressable
            onPress={() => setFilterOpen(true)}
            style={styles.filterBtn}
            hitSlop={8}
          >
            <MaterialIcons name="tune" size={22} color={colors.onPrimary} />
          </Pressable>
          {filterActive ? <View style={styles.filterActiveDot} /> : null}
        </View>
      </View>

      <SegmentedTabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <TransactionsList
        styles={styles}
        isLoading={isLoading}
        isError={isError}
        error={transactionsError}
        onRetry={refetch}
        hasResults={hasResults}
        hasAnyData={hasAnyData}
        searchQuery={searchQuery}
        filteredSections={filteredSections}
        incomeColor={colors.income}
        expenseColor={colors.expense}
      />

      <TransactionsFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilter}
        initial={appliedFilter}
        categories={filterCategories}
      />
    </SafeAreaView>
  );
}
