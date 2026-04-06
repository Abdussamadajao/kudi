import {
  useDeleteTransaction,
  useIncomeSummary,
  useTransaction,
} from "@/actions/transactions";
import { isValidMaterialIcon } from "@/features/transactions/transactions-utils";
import { useStyles } from "@/hooks/useStyles";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import type { AnyTransaction } from "@/types";
import { isExpense } from "@/types/transactions";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { Skeleton } from "@/ui/skeleton";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createTransactionDetailsStyles } from "./transaction-details-styles";

function parseAmount(tx: AnyTransaction): number {
  const n = Number.parseFloat(tx.amount);
  return Number.isNaN(n) ? 0 : n;
}

function parseMoney(amount: string): number {
  const n = Number.parseFloat(amount);
  return Number.isNaN(n) ? 0 : n;
}

function formatDetailDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDetailTime(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useStyles(createTransactionDetailsStyles);
  const {
    data: tx,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransaction(id ?? "");

  const incomeId =
    tx && isExpense(tx) && tx.income_id ? tx.income_id : undefined;
  const {
    data: incomeSummary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useIncomeSummary(incomeId ?? "", !!incomeId);

  const deleteMutation = useDeleteTransaction();

  const amountNum = tx ? parseAmount(tx) : 0;
  const isIncomeTx = tx?.type === "INCOME";
  const recordedAt = tx ? new Date(tx.recorded_at) : new Date();

  const sourceLabel = useMemo(() => {
    if (!tx) return "";
    if (isExpense(tx)) {
      if (incomeId && incomeSummary) {
        return (
          incomeSummary.source_name?.trim() ||
          incomeSummary.category?.name ||
          "Linked income"
        );
      }
      if (tx.income) {
        return (
          tx.income.source_name?.trim() ||
          tx.income.category?.name ||
          "Linked income"
        );
      }
      return tx.source_name?.trim() || "—";
    }
    return tx.source_name?.trim() || tx.category.name;
  }, [tx, incomeId, incomeSummary]);

  const beforeAfter = useMemo(() => {
    if (!tx || !isExpense(tx) || !incomeId || !incomeSummary?.summary) {
      return null;
    }
    const remaining = incomeSummary.summary.remaining;
    const expenseAmt = parseAmount(tx);
    const list = incomeSummary.expenses ?? [];
    const sorted = [...list].sort((a, b) => {
      const ta = new Date(a.recorded_at).getTime();
      const tb = new Date(b.recorded_at).getTime();
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
    const idx = sorted.findIndex((e) => e.id === tx.id);
    if (idx === -1) {
      const after = remaining;
      const before = after + expenseAmt;
      return { before, after };
    }
    const sumExpensesAfter = sorted
      .slice(idx + 1)
      .reduce((s, e) => s + parseMoney(e.amount), 0);
    const after = remaining + sumExpensesAfter;
    const before = after + expenseAmt;
    return { before, after };
  }, [tx, incomeId, incomeSummary]);

  const openEdit = useCallback(() => {
    if (!tx) return;
    const dateIso = tx.recorded_at;
    if (tx.type === "EXPENSE") {
      router.push({
        pathname: "/edit-expense",
        params: {
          id: tx.id,
          amount: String(parseAmount(tx)),
          category: tx.category_id,
          date: dateIso,
          notes: tx.notes ?? "",
          receiptUri: tx.receipt_url ?? "",
        },
      });
    } else {
      router.push({
        pathname: "/edit-income",
        params: {
          id: tx.id,
          amount: String(parseAmount(tx)),
          incomeSource: tx.source_name ?? "",
          date: dateIso,
          notes: tx.notes ?? "",
          tag: tx.tag ?? "",
        },
      });
    }
  }, [tx]);

  const confirmDelete = useCallback(() => {
    if (!tx) return;
    Alert.alert(
      "Delete transaction",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const incomeIdForInvalidation =
              tx.type === "EXPENSE" ? (tx.income_id ?? undefined) : undefined;
            deleteMutation.mutate(
              { id: tx.id, incomeId: incomeIdForInvalidation },
              { onSuccess: () => router.back() },
            );
          },
        },
      ],
      { cancelable: true },
    );
  }, [tx, deleteMutation]);

  const iconName = useMemo(() => {
    if (!tx) return "receipt-long" as const;
    return isValidMaterialIcon(tx.category.icon)
      ? tx.category.icon
      : "receipt-long";
  }, [tx]);

  const iconBg = tx?.category.color ?? colors.primary;

  if (!id) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.centerBlock}>
          <Text style={styles.metaLine}>Missing transaction.</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={styles.sourceAccent}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerBtn}
            hitSlop={12}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={[styles.hero, { paddingHorizontal: 20 }]}>
          <Skeleton width={72} height={72} borderRadius={999} />
          <Skeleton width={160} height={40} style={{ marginTop: 16 }} />
          <Skeleton width={120} height={18} style={{ marginTop: 12 }} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Skeleton width="100%" height={100} borderRadius={16} />
          <Skeleton
            width="100%"
            height={140}
            borderRadius={16}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !tx) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.onSurface}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={styles.headerBtn} />
        </View>
        <ErrorView
          error={error}
          title="Could not load transaction"
          message="Try again or go back."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const amountColor = isIncomeTx ? colors.income : colors.expense;
  const signedAmount = isIncomeTx
    ? `+${formatPrice(amountNum)}`
    : `-${formatPrice(amountNum)}`;

  const showSourceFlow =
    isExpense(tx) && incomeId && beforeAfter && !summaryLoading;
  const showSourceSimple = isExpense(tx) && !incomeId;

  const gradientColors = [...colors.primaryGradient] as [string, string];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction</Text>
        <Pressable onPress={openEdit} style={styles.headerBtn} hitSlop={12}>
          <MaterialIcons name="edit" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[styles.heroIconOuter, { backgroundColor: iconBg + "30" }]}
          >
            <View style={[styles.heroIconInner, { backgroundColor: iconBg }]}>
              <MaterialIcons name={iconName} size={28} color="#fff" />
            </View>
          </View>
          <Text style={[styles.amount, { color: amountColor }]}>
            {signedAmount}
          </Text>
          <Text style={styles.categoryTitle}>{tx.category.name}</Text>
          <Text style={styles.metaLine}>
            {formatDetailDate(recordedAt)} • {formatDetailTime(recordedAt)}
          </Text>
        </View>

        {isExpense(tx) ? (
          <View style={styles.card}>
            <View style={styles.cardRowHeader}>
              <Text style={styles.cardLabelCaps}>SOURCE ACCOUNT</Text>
              <Text style={styles.sourceAccent} numberOfLines={1}>
                {sourceLabel}
              </Text>
            </View>
            {summaryLoading && incomeId ? (
              <ActivityIndicator color={colors.primary} />
            ) : showSourceFlow && beforeAfter ? (
              <View style={styles.flowRow}>
                <View style={styles.flowCol}>
                  <Text style={styles.flowMicro}>Before</Text>
                  <Text style={styles.flowValue}>
                    {formatPrice(beforeAfter.before)}
                  </Text>
                </View>
                <View style={styles.flowArrow}>
                  <MaterialIcons
                    name="arrow-forward"
                    size={18}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <View style={[styles.flowCol, styles.flowColRight]}>
                  <Text style={styles.flowMicro}>After</Text>
                  <Text style={[styles.flowValue, styles.flowValueAfter]}>
                    {formatPrice(beforeAfter.after)}
                  </Text>
                </View>
              </View>
            ) : showSourceSimple ? (
              <Text style={styles.notesBody}>
                Spending from this account is not linked to a tracked income
                pool.
              </Text>
            ) : incomeId && !summaryLoading ? (
              <Text style={styles.notesBody}>
                {summaryError
                  ? "Could not load pool balance."
                  : "Pool balance unavailable."}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={[styles.infoRow, styles.infoRowFirst]}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{tx.category.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>
              {tx.type === "INCOME" ? "Income" : "Expense"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDetailDate(recordedAt)}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{formatDetailTime(recordedAt)}</Text>
          </View>
        </View>

        {(tx.notes?.trim() || tx.tag || tx.receipt_url) && (
          <View style={styles.card}>
            <View style={styles.notesHeader}>
              <Text style={styles.cardLabelCaps}>NOTES</Text>
              {tx.tag ? (
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>{tx.tag}</Text>
                </View>
              ) : (
                <View />
              )}
            </View>
            {tx.notes?.trim() ? (
              <Text style={styles.notesBody}>{tx.notes.trim()}</Text>
            ) : null}
            {tx.receipt_url ? (
              <Image
                source={{ uri: tx.receipt_url }}
                style={styles.receipt}
                resizeMode="cover"
              />
            ) : null}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={openEdit}
          style={styles.editBtnOuter}
          disabled={deleteMutation.isPending}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>Edit Transaction</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={confirmDelete}
          disabled={deleteMutation.isPending}
          hitSlop={8}
        >
          <Text style={styles.deleteText}>Delete Transaction</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
