import { useTransaction, useUpdateTransaction } from "@/actions";
import { FormikCategorySelect } from "@/features/categories/components/category-select";
import {
  formatIncomeAmountPreview,
  incomeFormSchema,
  TAG_TABS,
  type IncomeFormValues,
} from "@/features/income/income-form";
import { createAddIncomeStyles } from "@/features/income/add-income-styles";
import { FormikIncomeField } from "@/features/transactions/components/income-field";
import { useStyles } from "@/hooks/useStyles";
import Button from "@/ui/button";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { FormikDatePicker } from "@/ui/form/date-picker";
import { FormikTextfield } from "@/ui/form/text-field";
import { Skeleton } from "@/ui/skeleton";
import SegmentedTabs from "@/ui/segmented-tabs";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function normalizeTag(
  t: string | null | undefined,
): IncomeFormValues["tag"] {
  if (t && (TAG_TABS as readonly string[]).includes(t)) {
    return t as IncomeFormValues["tag"];
  }
  return "Monthly";
}

function parseTxAmount(amount: string): number {
  const n = Number.parseFloat(amount);
  return Number.isNaN(n) ? 0 : n;
}

const HEADER_BAR_HEIGHT = 56;

export function EditIncomeScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useStyles(createAddIncomeStyles);
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const {
    data: tx,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
    refetch: refetchTx,
  } = useTransaction(id ?? "");

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction(id ?? "");

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subShow = Keyboard.addListener(showEvt, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const subHide = Keyboard.addListener(hideEvt, () => {
      setKeyboardHeight(0);
    });
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const initialValues = useMemo<IncomeFormValues | null>(() => {
    if (!tx || tx.type !== "INCOME") return null;
    const raw = parseTxAmount(tx.amount);
    return {
      amount: raw === 0 ? "" : String(raw),
      sourceName: tx.source_name ?? "",
      categoryId: tx.category_id,
      tag: normalizeTag(tx.tag),
      date: new Date(tx.recorded_at),
      notes: tx.notes ?? "",
    };
  }, [tx]);

  const handleUpdate = useCallback(
    async (values: IncomeFormValues) => {
      if (!id) return;
      await updateTransaction({
        amount: parseFloat(values.amount.replace(/,/g, "")),
        source_name: values.sourceName.trim() || undefined,
        category_id: values.categoryId,
        recorded_at: values.date.toISOString(),
        notes: values.notes?.trim() ? values.notes : undefined,
        tag: values.tag,
      });
      router.back();
    },
    [id, updateTransaction],
  );

  const cardBg = colors.surfaceContainerLow;
  const inputBg = colors.surfaceContainerLowest;
  const inputBorder = colors.surface;

  const upperLabelStyle = {
    fontSize: fontSize["xs"],
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
    color: colors.textPrimary,
    marginBottom: 8,
    marginLeft: 0,
  };

  const inputContainerStyle = {
    backgroundColor: inputBg,
    borderColor: inputBorder,
    height: 52 as const,
    borderRadius: border.borderRadius.lg,
  };

  const notesContainerStyle = {
    backgroundColor: inputBg,
    borderColor: inputBorder,
    minHeight: 100,
    height: 100,
    alignItems: "flex-start" as const,
    paddingVertical: 12,
    borderRadius: border.borderRadius.lg,
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
            Edit Income
          </Text>
        </View>
        <ErrorView
          title="Missing income"
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
            Edit Income
          </Text>
        </View>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Skeleton width="100%" height={56} borderRadius={12} />
          <Skeleton
            width="100%"
            height={200}
            borderRadius={16}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isTxError || !tx || tx.type !== "INCOME") {
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
            Edit Income
          </Text>
        </View>
        <ErrorView
          error={txError}
          title="Could not load income"
          message="Try again or go back."
          onRetry={refetchTx}
        />
      </SafeAreaView>
    );
  }

  if (!initialValues) return null;

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
          Edit Income
        </Text>
      </View>

      <Formik<IncomeFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={incomeFormSchema}
        onSubmit={handleUpdate}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          const previewTitle = values.sourceName.trim() || "Income";
          const previewAmount = formatIncomeAmountPreview(values.amount);

          const keyboardPad =
            keyboardHeight > 0
              ? Math.round(keyboardHeight * (Platform.OS === "ios" ? 0.4 : 1))
              : 0;
          const scrollBottomPad = 40 + insets.bottom + keyboardPad;

          return (
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={insets.top + HEADER_BAR_HEIGHT}
              enabled
            >
              <>
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: scrollBottomPad },
                  ]}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.amountSection}>
                    <FormikIncomeField
                      name="amount"
                      maxLength={16}
                      showFormikError
                    />
                  </View>

                  <View
                    style={[
                      styles.formCard,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: inputBorder,
                      },
                    ]}
                  >
                    <View style={styles.field}>
                      <FormikTextfield
                        name="sourceName"
                        label="SOURCE NAME"
                        placeholder="e.g march salary"
                        labelStyle={upperLabelStyle}
                        containerStyle={inputContainerStyle}
                        style={{
                          fontSize: fontSize["md"],
                          fontFamily: fonts.Manrope.Medium,
                        }}
                        showFormikError
                      />
                    </View>

                    <View style={styles.field}>
                      <FormikCategorySelect
                        name="categoryId"
                        categoryType="INCOME"
                        required
                      />
                    </View>

                    <View style={styles.field}>
                      <Text
                        style={[
                          styles.upperLabel,
                          { color: colors.textPrimary },
                        ]}
                      >
                        TAG
                      </Text>
                      <SegmentedTabs
                        tabs={TAG_TABS}
                        activeTab={values.tag}
                        onChange={(tag) => setFieldValue("tag", tag)}
                      />
                    </View>

                    <View style={styles.field}>
                      <Text
                        style={[
                          styles.upperLabel,
                          { color: colors.textPrimary },
                        ]}
                      >
                        DATE
                      </Text>
                      <FormikDatePicker
                        name="date"
                        label=""
                        calendarIconColor={colors.primary}
                        backgroundColor={inputBg}
                        borderColor={inputBorder}
                        showFormikError
                      />
                    </View>

                    <View style={[styles.field, { marginBottom: 0 }]}>
                      <FormikTextfield
                        name="notes"
                        label="NOTE (OPT)"
                        placeholder="Add some..."
                        multiline
                        numberOfLines={3}
                        labelStyle={upperLabelStyle}
                        containerStyle={notesContainerStyle}
                        style={{
                          fontSize: fontSize["md"],
                          fontFamily: fonts.Manrope.Medium,
                          minHeight: 76,
                          textAlignVertical: "top",
                        }}
                        showFormikError
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.previewCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: inputBorder,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.previewIcon,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <MaterialIcons
                        name="check"
                        size={18}
                        color={colors.background}
                      />
                    </View>
                    <View style={styles.previewTextCol}>
                      <Text
                        style={[
                          styles.previewMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        PREVIEW
                      </Text>
                      <Text style={styles.previewLine}>
                        <Text style={{ color: colors.primary }}>
                          {previewTitle}
                        </Text>
                        <Text style={{ color: colors.primary }}>
                          {" "}
                          {previewAmount}
                        </Text>
                        <Text style={{ color: colors.textSecondary }}>
                          {" "}
                          updated
                        </Text>
                      </Text>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.saveRow}>
                  <Button
                    onPress={() => handleSubmit()}
                    style={styles.saveBtn}
                    disabled={isUpdating}
                  >
                    <Text
                      style={[styles.saveBtnText, { color: colors.onPrimary }]}
                    >
                      Update Income
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={22}
                      color={colors.onPrimary}
                    />
                  </Button>
                </View>
              </>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
