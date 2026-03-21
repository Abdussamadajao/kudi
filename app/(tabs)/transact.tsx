import { EmptySearchIllustration } from "@/assets/icons";
import SearchBar from "@/components/search-bar";
import TransactionsFilterModal, {
  defaultTransactionFilter,
  type TransactionCategoryId,
  type TransactionFilter,
} from "@/components/transactions-filter-modal";
import { border, fonts, fontSize, PROFILE_IMAGE } from "@/constants/theme";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["All", "Income", "Expense", "Savings"] as const;
type TabType = (typeof TABS)[number];

type DateBucket = "today" | "yesterday";

type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  isIncome: boolean;
  categoryId: TransactionCategoryId;
  dateBucket: DateBucket;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  time: string;
};

const MOCK_SECTIONS: { label: string; data: Transaction[] }[] = [
  {
    label: "TODAY",
    data: [
      {
        id: "1",
        title: "Uber",
        subtitle: "Taxi",
        amount: 12.5,
        isIncome: false,
        categoryId: "transport",
        dateBucket: "today",
        icon: "directions-car",
        iconBg: "#F97316",
        time: "04:32 PM",
      },
      {
        id: "2",
        title: "Salary",
        subtitle: "Tech Corp.",
        amount: 4200,
        isIncome: true,
        categoryId: "bills",
        dateBucket: "today",
        icon: "attach-money",
        iconBg: "#22C55E",
        time: "09:00 AM",
      },
      {
        id: "3",
        title: "Walmart",
        subtitle: "Groceries",
        amount: 64.2,
        isIncome: false,
        categoryId: "shopping",
        dateBucket: "today",
        icon: "shopping-cart",
        iconBg: "#8B5CF6",
        time: "08:15 AM",
      },
    ],
  },
  {
    label: "YESTERDAY",
    data: [
      {
        id: "4",
        title: "Starbucks",
        subtitle: "Food & Drink",
        amount: 5.75,
        isIncome: false,
        categoryId: "food",
        dateBucket: "yesterday",
        icon: "local-cafe",
        iconBg: "#8B5CF6",
        time: "10:20 AM",
      },
      {
        id: "5",
        title: "Electric Bill",
        subtitle: "Utilities",
        amount: 112,
        isIncome: false,
        categoryId: "bills",
        dateBucket: "yesterday",
        icon: "bolt",
        iconBg: "#3B82F6",
        time: "09:12 AM",
      },
      {
        id: "6",
        title: "Dividends",
        subtitle: "Investment",
        amount: 24.15,
        isIncome: true,
        categoryId: "investment",
        dateBucket: "yesterday",
        icon: "trending-up",
        iconBg: "#22C55E",
        time: "08:45 AM",
      },
    ],
  },
];

function formatAmount(amount: number, isIncome: boolean): string {
  const sign = isIncome ? "+ " : "- ";
  return sign + formatPrice(Math.abs(amount));
}

export default function Transact() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<TransactionFilter>(
    defaultTransactionFilter,
  );

  const filteredSections = useMemo(() => {
    let list = MOCK_SECTIONS.flatMap((s) => s.data);
    if (activeTab === "Income") list = list.filter((t) => t.isIncome);
    if (activeTab === "Expense") list = list.filter((t) => !t.isIncome);

    const { dateRange, categoryIds, amountMin, amountMax } = appliedFilter;
    if (dateRange === "today") {
      list = list.filter((t) => t.dateBucket === "today");
    } else if (dateRange === "this_week") {
      list = list.filter(
        (t) => t.dateBucket === "today" || t.dateBucket === "yesterday",
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
    const bySection: { label: string; data: Transaction[] }[] = [];
    MOCK_SECTIONS.forEach((sec) => {
      const matched = sec.data.filter((d) => list.some((t) => t.id === d.id));
      if (matched.length) bySection.push({ label: sec.label, data: matched });
    });
    return bySection;
  }, [activeTab, search, appliedFilter]);

  const totalTransactions = useMemo(
    () => MOCK_SECTIONS.reduce((n, s) => n + s.data.length, 0),
    [],
  );
  const hasAnyData = totalTransactions > 0;
  const hasResults = filteredSections.some((s) => s.data.length > 0);
  const searchQuery = search.trim();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Transactions
        </Text>
        <View style={styles.headerRight}>
          <Pressable
            style={[
              styles.iconBtn,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
            hitSlop={8}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            style={[styles.avatarWrap, { borderColor: colors.slate[600] }]}
            hitSlop={4}
          >
            <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchRow}>
        <SearchBar search={search} setSearch={setSearch} />
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.filterBtn, { backgroundColor: colors.primary }]}
          hitSlop={8}
        >
          <MaterialIcons name="tune" size={22} color={colors.onPrimary} />
        </Pressable>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const selected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : colors.surfaceVariant,
                  borderColor: colors.outlineVariant,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: selected ? colors.onPrimary : colors.textPrimary },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          !hasResults && styles.scrollContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {hasResults ? (
          filteredSections.map((section) => (
            <View key={section.label} style={styles.section}>
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                {section.label}
              </Text>

              {section.data.map((tx) => (
                <View
                  key={tx.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surfaceContainerHigh,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                >
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

                  <View style={styles.txBody}>
                    <Text
                      style={[styles.txTitle, { color: colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {tx.title}
                    </Text>
                    <Text
                      style={[
                        styles.txSubtitle,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {tx.subtitle}
                    </Text>
                  </View>

                  <View style={styles.amountWrap}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: tx.isIncome ? colors.income : colors.expense },
                      ]}
                    >
                      {formatAmount(tx.amount, tx.isIncome)}
                    </Text>
                    <Text
                      style={[styles.txTime, { color: colors.textSecondary }]}
                    >
                      {tx.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIllustrationWrap}>
              <EmptySearchIllustration />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {!hasAnyData
                ? "No transactions yet"
                : "No transactions found"}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              {!hasAnyData
                ? "When you add income or expenses, they’ll show up here."
                : searchQuery
                  ? `Nothing matches “${searchQuery}”. Try another search.`
                  : "Nothing matches your filters or tab. Try adjusting them."}
            </Text>
          </View>
        )}
      </ScrollView>

      <TransactionsFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilter}
        initial={appliedFilter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontFamily: fonts.Manrope.Bold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 1,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: border.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: border.borderRadius.full,
    borderWidth: 1,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  scroll: { flex: 1, paddingVertical: 10 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  scrollContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  emptyIllustrationWrap: {
    maxWidth: "100%",
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: fontSize.lg,
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.Medium,
    textAlign: "center",
    lineHeight: 20,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    marginBottom: 10,
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
  txBody: { flex: 1, minWidth: 0 },
  txTitle: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  txSubtitle: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 2,
  },
  amountWrap: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  txAmount: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.Bold,
    textAlign: "right",
  },
  txTime: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: fonts.Manrope.Medium,
  },
  totalCard: {
    // marginHorizontal: 24,
    // marginBottom: 10,
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: fontSize["2xl"],
    fontFamily: fonts.Manrope.Bold,
  },
});
