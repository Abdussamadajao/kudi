import {
  useCategories,
  useIncomeSummary,
  useIncomeTransactions,
  useTransaction,
  useUpdateTransaction,
} from "@/actions";
import { border } from "@/constants/theme";
import ReceiptUploadField from "@/features/expenses/components/receipt-upload-field";
import { FormikIncomeField } from "@/features/transactions/components/income-field";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import Button from "@/ui/button";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { FormikDatePicker } from "@/ui/form/date-picker";
import { FormikTextfield } from "@/ui/form/text-field";
import { Skeleton } from "@/ui/skeleton";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { createAddExpensesStyles } from "./add-expenses-styles";
import {
  ExpenseCategoriesModal,
  type ExpenseCategoryItem,
} from "./expense-categories-modal";
import {
  IncomeSourcesModal,
  type IncomeSourceItem,
} from "./income-sources-modal";
import { IncomeSummaryCard } from "./income-summary-card";

type EditExpenseValues = {
  amount: string;
  categoryId: string;
  date: Date;
  notes: string;
  incomeId: string;
  receiptUrl: string | null;
};

const editExpenseSchema = Yup.object({
  amount: Yup.string()
    .required("Enter an amount")
    .test("positive", "Enter a valid amount", (v) => {
      const n = parseFloat((v ?? "").replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  categoryId: Yup.string().required("Select a category"),
  date: Yup.date().required(),
  incomeId: Yup.string().required("Select income source"),
  notes: Yup.string(),
});

function isValidMaterialIcon(
  name: string,
): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

function parseTxAmount(amount: string): number {
  const n = Number.parseFloat(amount);
  return Number.isNaN(n) ? 0 : n;
}

export function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useStyles(createAddExpensesStyles);

  const {
    data: tx,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
    refetch: refetchTx,
  } = useTransaction(id ?? "");

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesQueryError,
    refetch: refetchCategories,
    isRefetching: isCategoriesRefetching,
  } = useCategories();

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction(id ?? "");

  const {
    data: incomeTxResponse,
    refetch: refetchIncomeTransactions,
    isRefetching: isIncomeTransactionsRefetching,
  } = useIncomeTransactions();

  const [selectedIncomeId, setSelectedIncomeId] = useState("");
  const {
    data: incomeSummary,
    isPending: isIncomeSummaryPending,
    refetch: refetchIncomeSummary,
  } = useIncomeSummary(selectedIncomeId, !!selectedIncomeId);

  const categoryModalRef = useRef<BottomSheetModal>(null);
  const incomeSourceModalRef = useRef<BottomSheetModal>(null);

  const expenseCategories = useMemo<ExpenseCategoryItem[]>(() => {
    const list = categoriesData ?? [];
    return list
      .filter((item) => item.type === "EXPENSE")
      .map((item) => ({
        id: item.id,
        label: item.name,
        icon: isValidMaterialIcon(item.icon) ? item.icon : "receipt-long",
      }));
  }, [categoriesData]);

  const incomeSources = useMemo<IncomeSourceItem[]>(() => {
    const incomeTx = incomeTxResponse?.data ?? [];
    return incomeTx.map((row) => {
      const value = Number.parseFloat(row.amount);
      const total = Number.isNaN(value) ? 0 : value;
      return {
        id: row.id,
        label: row.source_name?.trim() || row.category.name,
        icon: isValidMaterialIcon(row.category.icon) ? row.category.icon : "work",
        total,
        remaining: total,
      };
    });
  }, [incomeTxResponse?.data]);

  useEffect(() => {
    if (!tx || tx.type !== "EXPENSE") return;
    const next = tx.income_id ?? incomeSources[0]?.id ?? "";
    if (next) setSelectedIncomeId(next);
  }, [tx, incomeSources]);

  const initialValues = useMemo<EditExpenseValues | null>(() => {
    if (!tx || tx.type !== "EXPENSE") return null;
    const raw = parseTxAmount(tx.amount);
    return {
      amount: raw === 0 ? "" : String(raw),
      categoryId: tx.category_id,
      date: new Date(tx.recorded_at),
      notes: tx.notes ?? "",
      incomeId: tx.income_id ?? incomeSources[0]?.id ?? "",
      receiptUrl: tx.receipt_url,
    };
  }, [tx, incomeSources]);

  const handleSubmit = async (values: EditExpenseValues) => {
    if (!id) return;
    await updateTransaction({
      amount: parseFloat(values.amount.replace(/,/g, "")),
      category_id: values.categoryId,
      income_id: values.incomeId || null,
      recorded_at: values.date.toISOString(),
      notes: values.notes?.trim() ? values.notes : undefined,
      receipt_url: values.receiptUrl ?? undefined,
    });
    router.back();
  };

  if (!id) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Edit Expense
          </Text>
          <View style={styles.headerRight} />
        </View>
        <ErrorView
          title="Missing expense"
          message="Open this screen from a transaction."
        />
      </SafeAreaView>
    );
  }

  if (isTxLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Edit Expense
          </Text>
          <View style={styles.headerRight} />
        </View>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Skeleton width="100%" height={56} borderRadius={12} />
          <Skeleton
            width="100%"
            height={120}
            borderRadius={16}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isTxError || !tx || tx.type !== "EXPENSE") {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Edit Expense
          </Text>
          <View style={styles.headerRight} />
        </View>
        <ErrorView
          error={txError}
          title="Could not load expense"
          message="Try again or go back."
          onRetry={refetchTx}
        />
      </SafeAreaView>
    );
  }

  if (!initialValues) return null;

  const originalIncomeId = tx.income_id ?? "";
  const originalAmount = parseTxAmount(tx.amount);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Edit Expense
        </Text>
        <View style={styles.headerRight} />
      </View>

      <Formik<EditExpenseValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={editExpenseSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          const selectedIncome = incomeSources.find(
            (s) => s.id === values.incomeId,
          );
          const summaryTotal = Number.parseFloat(
            incomeSummary?.summary?.total?.toString() ?? "0",
          );
          const summaryRemaining = Number.parseFloat(
            incomeSummary?.summary?.remaining?.toString() ?? "0",
          );
          const totalAmount = Number.isNaN(summaryTotal)
            ? (selectedIncome?.total ?? 0)
            : summaryTotal;
          const remainingDisplay = Number.isNaN(summaryRemaining)
            ? (selectedIncome?.remaining ?? 0)
            : summaryRemaining;
          let maxAllowedAmount = remainingDisplay;
          if (
            values.incomeId === originalIncomeId &&
            originalIncomeId.length > 0
          ) {
            maxAllowedAmount = remainingDisplay + originalAmount;
          }
          const incomePercent = Math.round(
            (remainingDisplay / (totalAmount || 1)) * 100,
          );

          const amountNum = parseFloat((values.amount ?? "").replace(/,/g, ""));
          const amountExceedsRemaining =
            !Number.isNaN(amountNum) && amountNum > maxAllowedAmount;
          const amountAccent = amountExceedsRemaining
            ? colors.expense
            : colors.primary;

          return (
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={0}
            >
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={
                      isIncomeSummaryPending ||
                      isIncomeTransactionsRefetching ||
                      isCategoriesRefetching
                    }
                    onRefresh={() => {
                      refetchTx();
                      refetchIncomeSummary();
                      refetchIncomeTransactions();
                      refetchCategories();
                    }}
                  />
                }
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {isCategoriesError && categoriesData === undefined ? (
                  <ErrorView
                    error={categoriesQueryError}
                    onRetry={refetchCategories}
                    title="Could not load categories"
                    message="Pull to refresh or try again."
                    style={{ marginBottom: 16 }}
                  />
                ) : null}
                <View style={styles.amountSection}>
                  <Text style={[styles.amountLabel, { color: amountAccent }]}>
                    AMOUNT
                  </Text>
                  <FormikIncomeField
                    name="amount"
                    maxLength={16}
                    showFormikError
                    accentColor={
                      amountExceedsRemaining ? colors.expense : undefined
                    }
                  />
                  {amountExceedsRemaining ? (
                    <View style={styles.amountExceedsRow}>
                      <MaterialIcons
                        name="warning"
                        size={20}
                        color={colors.warning}
                      />
                      <Text
                        style={[
                          styles.amountExceedsText,
                          { color: colors.warning },
                        ]}
                      >
                        This exceeds available balance
                      </Text>
                    </View>
                  ) : null}
                </View>

                <IncomeSummaryCard
                  onPress={() => incomeSourceModalRef.current?.present()}
                  incomeLabel={selectedIncome?.label ?? "Income"}
                  totalAmount={totalAmount}
                  remainingAmount={remainingDisplay}
                  incomePercent={incomePercent}
                  isLoading={!!selectedIncomeId && isIncomeSummaryPending}
                />

                <View style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <Text
                      style={[styles.fieldLabel, { color: colors.textPrimary }]}
                    >
                      CATEGORY
                    </Text>
                    <Pressable
                      hitSlop={8}
                      onPress={() => categoryModalRef.current?.present()}
                    >
                      <Text style={[styles.viewAll, { color: colors.primary }]}>
                        View All
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.categoryGrid}>
                    {isCategoriesLoading
                      ? Array.from({ length: 6 }).map((_, idx) => (
                          <View
                            key={`cat-skeleton-${idx}`}
                            style={[
                              styles.categoryItem,
                              {
                                backgroundColor: colors.slate[800],
                                borderColor: colors.slate[700],
                                borderWidth: 2,
                                borderRadius: border.borderRadius.lg,
                              },
                            ]}
                          >
                            <View style={styles.categoryIconWrap}>
                              <Skeleton
                                width={48}
                                height={48}
                                borderRadius={24}
                              />
                            </View>
                            <View
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 12,
                              }}
                            >
                              <Skeleton width={70} height={12} />
                            </View>
                          </View>
                        ))
                      : expenseCategories.slice(0, 6).map((cat) => {
                          const selected = values.categoryId === cat.id;
                          return (
                            <Pressable
                              key={cat.id}
                              onPress={() =>
                                setFieldValue("categoryId", cat.id)
                              }
                              style={[
                                styles.categoryItem,
                                {
                                  backgroundColor: selected
                                    ? colors.slate[800]
                                    : "transparent",
                                  borderColor: selected
                                    ? colors.primary
                                    : colors.slate[700],
                                  borderWidth: selected ? 2 : 1,
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.categoryIconWrap,
                                  {
                                    backgroundColor: selected
                                      ? colors.primary
                                      : colors.slate[800],
                                  },
                                ]}
                              >
                                <MaterialIcons
                                  name={cat.icon}
                                  size={24}
                                  color={selected ? "#fff" : colors.primary}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.categoryLabel,
                                  {
                                    color: selected
                                      ? colors.textPrimary
                                      : colors.textSecondary,
                                  },
                                ]}
                              >
                                {cat.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                  </View>
                </View>

                <View style={styles.field}>
                  <FormikDatePicker name="date" label="DATE" showFormikError />
                </View>

                <View style={styles.field}>
                  <FormikTextfield
                    name="notes"
                    label="NOTES"
                    placeholder="Add a description..."
                    multiline
                    numberOfLines={3}
                    containerStyle={{
                      backgroundColor: colors.slate[800],
                      borderColor: colors.slate[700],
                      minHeight: 100,
                      alignItems: "flex-start",
                      paddingVertical: 12,
                      borderRadius: 12,
                    }}
                    style={{
                      color: colors.textPrimary,
                      minHeight: 76,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <ReceiptUploadField
                  value={values.receiptUrl}
                  onChange={(url) => setFieldValue("receiptUrl", url)}
                />
              </ScrollView>

              <ExpenseCategoriesModal
                modalRef={categoryModalRef}
                styles={styles}
                categories={expenseCategories}
                selectedCategoryId={values.categoryId}
                onSelectCategory={(catId) => {
                  categoryModalRef.current?.dismiss();
                  setFieldValue("categoryId", catId);
                }}
              />

              <IncomeSourcesModal
                modalRef={incomeSourceModalRef}
                styles={styles}
                sources={incomeSources}
                selectedIncomeId={values.incomeId}
                onSelectIncome={(incomeRowId) => {
                  setFieldValue("incomeId", incomeRowId);
                  setSelectedIncomeId(incomeRowId);
                }}
                onConfirm={() => incomeSourceModalRef.current?.dismiss()}
              />

              <View
                style={[styles.footer, { backgroundColor: colors.background }]}
              >
                <Button
                  onPress={() => handleSubmit()}
                  style={styles.saveBtn}
                  disabled={isUpdating || amountExceedsRemaining}
                  loading={isUpdating}
                >
                  <MaterialIcons name="check" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>Update Expense</Text>
                </Button>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
