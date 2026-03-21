import Button from "@/components/button";
import { FormikDatePicker } from "@/components/formik-inputs/date-picker";
import { FormikIncomeField } from "@/components/formik-inputs/income-field";
import { FormikTextfield } from "@/components/formik-inputs/text-field";
import { border, fonts, fontSize, spacing } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Yup from "yup";

const CATEGORY_OPTIONS = [
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "business", label: "Business" },
  { id: "investment", label: "Investment" },
  { id: "gift", label: "Gift" },
  { id: "other", label: "Other" },
] as const;

type CategoryId = (typeof CATEGORY_OPTIONS)[number]["id"];

type AddIncomeValues = {
  amount: string;
  sourceName: string;
  categoryId: CategoryId;
  date: Date;
  notes: string;
};

const CATEGORY_IDS = CATEGORY_OPTIONS.map((c) => c.id);

const addIncomeSchema = Yup.object({
  amount: Yup.string()
    .required("Enter an amount")
    .test("positive", "Enter a valid amount", (v) => {
      const n = parseFloat((v ?? "").replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  sourceName: Yup.string(),
  categoryId: Yup.string()
    .oneOf([...CATEGORY_IDS])
    .required(),
  date: Yup.date().required(),
  notes: Yup.string(),
});

const initialValues: AddIncomeValues = {
  amount: "",
  sourceName: CATEGORY_OPTIONS[0].label,
  categoryId: "salary",
  date: new Date(),
  notes: "",
};

function formatAmountPreview(raw: string): string {
  const n = parseFloat((raw ?? "").replace(/,/g, ""));
  if (!raw || Number.isNaN(n)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const HEADER_BAR_HEIGHT = 56;

export default function AddIncome() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
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
          Add Income
        </Text>
      </View>

      <Formik<AddIncomeValues>
        initialValues={initialValues}
        validationSchema={addIncomeSchema}
        onSubmit={() => {
          router.back();
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          const categoryLabel =
            CATEGORY_OPTIONS.find((c) => c.id === values.categoryId)?.label ??
            "Income";
          const previewTitle = values.sourceName.trim() || categoryLabel;
          const previewAmount = formatAmountPreview(values.amount);

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
                        placeholder={categoryLabel}
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
                      <Text
                        style={[
                          styles.upperLabel,
                          { color: colors.textPrimary },
                        ]}
                      >
                        CATEGORY
                      </Text>
                      <View style={styles.categoryGrid}>
                        {CATEGORY_OPTIONS.map((opt) => {
                          const selected = values.categoryId === opt.id;
                          return (
                            <Pressable
                              key={opt.id}
                              onPress={() => {
                                setFieldValue("categoryId", opt.id);
                                setFieldValue("sourceName", opt.label);
                              }}
                              style={[
                                styles.categoryChip,
                                {
                                  backgroundColor: selected
                                    ? colors.primary + "22"
                                    : inputBg,
                                  borderColor: selected
                                    ? colors.primary
                                    : inputBorder,
                                  borderWidth: selected ? 2 : 1,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.categoryChipText,
                                  {
                                    color: selected
                                      ? colors.primary
                                      : colors.textSecondary,
                                  },
                                ]}
                              >
                                {opt.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
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
                          added
                        </Text>
                      </Text>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.saveRow}>
                  <Button onPress={() => handleSubmit()} style={styles.saveBtn}>
                    <Text
                      style={[styles.saveBtnText, { color: colors.onPrimary }]}
                    >
                      Save Income
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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 48,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    fontSize: fontSize["2xl"],
    fontFamily: fonts.Manrope.Bold,
  },
  headerRight: { width: 40 },
  scroll: { flexGrow: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  amountSection: {
    marginTop: 30,
    marginBottom: 12,
    alignItems: "center",
    alignSelf: "stretch",
  },
  formCard: {
    borderRadius: border.borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    marginTop: 8,
  },
  field: { marginBottom: 20 },
  upperLabel: {
    fontSize: fontSize["xs"],
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    width: "47%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  categoryChipText: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.SemiBold,
  },
  saveRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: border.borderRadius.full,
    padding: 0,
    paddingHorizontal: 22,
  },
  saveBtnText: {
    fontSize: fontSize["md"],
    fontFamily: fonts.Manrope.Bold,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: border.borderRadius.xl,
    borderWidth: 1,
    marginTop: 18,
  },
  previewIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  previewTextCol: { flex: 1 },
  previewMeta: {
    fontSize: 10,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  previewLine: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.Medium,
  },
});
