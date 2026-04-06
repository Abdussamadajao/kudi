import { useTransactions } from "@/actions";
import {
  defaultTransactionFilter,
  type TransactionFilter,
} from "@/features/transactions/transactions-filter-modal";
import { useTheme } from "@/provider/theme-provider";
import type { Transaction } from "@/types";
import { endOfDay, isWithinInterval, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
  getSectionLabel,
  getToday,
  isValidMaterialIcon,
} from "./transactions-utils";
import {
  FilterCategory,
  TabType,
  TransactionSection,
  UiTransaction,
} from "./types";

export function useTransactionsScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<TransactionFilter>(
    defaultTransactionFilter,
  );
  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error: transactionsError,
    refetch,
  } = useTransactions();

  const allTransactions = useMemo<UiTransaction[]>(() => {
    const transactions = transactionsResponse?.data ?? [];
    return transactions.map((tx: Transaction) => {
      const amount = Number.parseFloat(tx.amount);
      const recordedAt = new Date(tx.recorded_at);
      const createdAt = new Date(tx.created_at);
      return {
        id: tx.id,
        title: tx.source_name?.trim() || tx.category.name,
        subtitle: tx.category.name,
        amount: Number.isNaN(amount) ? 0 : amount,
        isIncome: tx.type === "INCOME",
        categoryId: tx.category.id,
        recordedAt,
        createdAt,
        icon: isValidMaterialIcon(tx.category.icon)
          ? tx.category.icon
          : "receipt-long",
        iconBg: tx.category.color || colors.primary,
        time: recordedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [transactionsResponse?.data, colors.primary]);

  const filterCategories = useMemo<FilterCategory[]>(() => {
    const map = new Map<string, FilterCategory>();
    allTransactions.forEach((tx) => {
      if (!map.has(tx.categoryId)) {
        map.set(tx.categoryId, {
          id: tx.categoryId,
          label: tx.subtitle,
          icon: tx.icon,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [allTransactions]);

  const filterActive = useMemo(() => {
    const d = defaultTransactionFilter;
    if (appliedFilter.dateRange !== d.dateRange) return true;
    if (appliedFilter.categoryIds.length > 0) return true;
    if (
      appliedFilter.amountMin !== d.amountMin ||
      appliedFilter.amountMax !== d.amountMax
    ) {
      return true;
    }
    if (appliedFilter.customRange != null) return true;
    return false;
  }, [appliedFilter]);

  const filteredSections = useMemo<TransactionSection[]>(() => {
    let list = [...allTransactions];
    if (activeTab === "Income") list = list.filter((t) => t.isIncome);
    if (activeTab === "Expense") list = list.filter((t) => !t.isIncome);

    const { dateRange, categoryIds, amountMin, amountMax, customRange } =
      appliedFilter;
    const today = getToday();
    if (dateRange === "today") {
      list = list.filter(
        (t) => startOfDay(t.recordedAt).getTime() === today.getTime(),
      );
    } else if (dateRange === "this_week") {
      const weekStart = startOfDay(subDays(today, 6));
      list = list.filter((t) =>
        isWithinInterval(t.recordedAt, {
          start: weekStart,
          end: endOfDay(today),
        }),
      );
    } else if (dateRange === "custom" && customRange) {
      const s = startOfDay(customRange.start);
      const e = endOfDay(customRange.end);
      list = list.filter((t) =>
        isWithinInterval(t.recordedAt, { start: s, end: e }),
      );
    }

    if (categoryIds.length > 0) {
      list = list.filter((t) => categoryIds.includes(t.categoryId));
    }

    list = list.filter((t) => {
      const a = Math.abs(t.amount);
      return a >= amountMin && a <= amountMax;
    });

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const byDay = new Map<number, UiTransaction[]>();
    for (const tx of list) {
      const dayKey = startOfDay(tx.createdAt).getTime();
      const bucket = byDay.get(dayKey) ?? [];
      bucket.push(tx);
      byDay.set(dayKey, bucket);
    }

    const dayKeys = Array.from(byDay.keys()).sort((a, b) => b - a);
    return dayKeys.map((key) => ({
      label: getSectionLabel(new Date(key)),
      data: byDay.get(key)!,
    }));
  }, [allTransactions, activeTab, search, appliedFilter]);

  return {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    filterOpen,
    setFilterOpen,
    appliedFilter,
    setAppliedFilter,
    isLoading,
    isError,
    error: transactionsError,
    refetch,
    filteredSections,
    filterCategories,
    filterActive,
    hasAnyData: allTransactions.length > 0,
    hasResults: filteredSections.some((s) => s.data.length > 0),
    searchQuery: search.trim(),
  };
}
