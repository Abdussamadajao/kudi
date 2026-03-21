import Button from "@/components/button";
import DatePicker from "@/components/formik-inputs/date-picker";
import Select from "@/components/formik-inputs/select";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUICK_TAGS = ["Monthly", "Bonus", "One-time"] as const;

const INCOME_SOURCE_OPTIONS = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "gift", label: "Gift" },
  { value: "investment", label: "Investment" },
];

function parseInitialDate(param: string | undefined): Date {
  if (!param) return new Date();
  const d = new Date(param);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function parseTag(param: string | undefined): (typeof QUICK_TAGS)[number] {
  if (!param) return "Monthly";
  const t = param as (typeof QUICK_TAGS)[number];
  return QUICK_TAGS.includes(t) ? t : "Monthly";
}

export default function EditIncome() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    id?: string;
    amount?: string;
    incomeSource?: string;
    date?: string;
    notes?: string;
    tag?: string;
  }>();

  const [amount, setAmount] = useState(() => params.amount ?? "");
  const [incomeSource, setIncomeSource] = useState(
    () => params.incomeSource ?? "",
  );
  const [date, setDate] = useState(() => parseInitialDate(params.date));
  const [notes, setNotes] = useState(() => params.notes ?? "");
  const [selectedTag, setSelectedTag] = useState<
    (typeof QUICK_TAGS)[number]
  >(() => parseTag(params.tag));

  const handleUpdate = () => {
    // TODO: persist update with params.id
    router.back();
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
          Edit Income
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.amountSection}>
            <View style={styles.amountLabelRow}>
              <Text style={[styles.amountLabel, { color: colors.primary }]}>
                AMOUNT RECEIVED
              </Text>
            </View>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={(text) =>
                setAmount(text.toLocaleLowerCase().trim())
              }
              keyboardType="decimal-pad"
              maxLength={16}
            />
          </View>

          <View style={[styles.formCard]}>
            <View style={styles.field}>
              <Select
                label="Income Source"
                value={incomeSource}
                onChange={(value) => setIncomeSource(value || "")}
                options={INCOME_SOURCE_OPTIONS}
                placeholder="Select source"
                snapPoints={["37%"]}
              />
            </View>

            <View style={styles.field}>
              <DatePicker label="Date" value={date} onChange={setDate} />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                Notes (Optional)
              </Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: colors.slate[800],
                    borderColor: colors.slate[700],
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Add a description..."
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <Text style={[styles.quickTagsLabel, { color: colors.textPrimary }]}>
            QUICK TAGS
          </Text>
          <View style={styles.quickTagsRow}>
            {QUICK_TAGS.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => setSelectedTag(tag)}
                style={[
                  styles.tag,
                  {
                    backgroundColor:
                      selectedTag === tag ? colors.primary : colors.slate[800],
                    borderColor: colors.slate[700],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: selectedTag === tag ? "#fff" : colors.textPrimary,
                    },
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button onPress={handleUpdate} style={styles.saveBtn}>
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Update Income</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 48,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    fontSize: fontSize["lg"],
    fontFamily: fonts.Manrope.Bold,
  },
  headerRight: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  amountSection: {
    marginTop: 40,
    marginBottom: 20,
  },
  amountLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: fontSize["lg"],
    fontFamily: fonts.Manrope.Medium,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  amountInput: {
    fontSize: fontSize["10xl"],
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
  },
  formCard: {
    paddingVertical: 20,
    marginVertical: 1,
  },
  field: { marginBottom: 18 },
  fieldLabel: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.SemiBold,
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 108,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: fontSize["md"],
    fontFamily: fonts.Manrope.Medium,
    textAlignVertical: "top",
  },
  quickTagsLabel: {
    fontSize: fontSize["xs"],
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  quickTagsRow: {
    flexDirection: "row",
    gap: 10,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: border.borderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.SemiBold,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 54,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: fontSize["md"],
    fontFamily: fonts.Manrope.Bold,
  },
});
