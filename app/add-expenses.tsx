import BlurBackdrop, { BlurBackdropProps } from "@/components/blur-backdrop";
import Button from "@/components/button";
import DatePicker from "@/components/formik-inputs/date-picker";
import { border, fonts, fontSize } from "@/constants/theme";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food", icon: "restaurant" as const },
  { id: "transport", label: "Transport", icon: "directions-car" as const },
  { id: "bills", label: "Bills", icon: "business" as const },
  { id: "shopping", label: "Shopping", icon: "shopping-bag" as const },
  { id: "entertainment", label: "Entertainment", icon: "movie" as const },
  { id: "other", label: "Other", icon: "more-horiz" as const },
] as const;

type CategoryItem = (typeof EXPENSE_CATEGORIES)[number];

const INCOME_SOURCES = [
  {
    id: "salary",
    label: "Salary",
    icon: "work" as const,
    total: 500000,
    remaining: 320000,
  },
  {
    id: "freelance",
    label: "Freelance",
    icon: "computer" as const,
    total: 150000,
    remaining: 50000,
  },
  {
    id: "dividends",
    label: "Dividends",
    icon: "trending-up" as const,
    total: 80000,
    remaining: 80000,
  },
] as const;

type IncomeSourceItem = (typeof INCOME_SOURCES)[number];

export default function AddExpenses() {
  const { colors } = useTheme();
  const categoryModalRef = useRef<BottomSheetModal>(null);
  const incomeSourceModalRef = useRef<BottomSheetModal>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState<string>("salary");

  const openCategoryModal = useCallback(() => {
    categoryModalRef.current?.present();
  }, []);
  const closeCategoryModal = useCallback(() => {
    categoryModalRef.current?.dismiss();
  }, []);

  const openIncomeSourceModal = useCallback(() => {
    incomeSourceModalRef.current?.present();
  }, []);
  const closeIncomeSourceModal = useCallback(() => {
    incomeSourceModalRef.current?.dismiss();
  }, []);

  const selectedIncome =
    INCOME_SOURCES.find((s) => s.id === selectedIncomeId) ?? INCOME_SOURCES[0];
  const incomePercent = Math.round(
    (selectedIncome.remaining / selectedIncome.total) * 100,
  );

  const renderCategoryBackdrop = useCallback(
    (props: BlurBackdropProps) => (
      <BlurBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const onSelectCategory = useCallback(
    (cat: CategoryItem) => {
      closeCategoryModal();
      if (cat.id === "other") {
        router.push("/new-category");
      } else {
        setCategory(cat.id);
      }
    },
    [closeCategoryModal],
  );

  const renderCategoryItem = useCallback(
    ({ item: cat }: { item: CategoryItem }) => {
      const selected = category === cat.id;
      return (
        <Pressable
          style={({ pressed }) => [
            categoryModalStyles.optionRow as ViewStyle,
            { borderColor: colors.slate[700] },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => onSelectCategory(cat)}
        >
          <View
            style={[
              categoryModalStyles.optionIconWrap as ViewStyle,
              {
                backgroundColor: selected ? colors.primary : colors.slate[800],
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
              categoryModalStyles.optionLabel as TextStyle,
              { color: colors.textPrimary },
            ]}
          >
            {cat.label}
          </Text>
          {selected && (
            <MaterialIcons name="check" size={22} color={colors.primary} />
          )}
        </Pressable>
      );
    },
    [colors, category, onSelectCategory],
  );

  const pickReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0])
      setReceiptUri(result.assets[0].uri);
  };

  const handleSave = () => {
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
          Add Expense
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
          <Pressable
            onPress={openIncomeSourceModal}
            style={[
              styles.incomeCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.slate[700],
              },
            ]}
          >
            <View style={styles.incomeCardHeader}>
              <Text
                style={[
                  styles.incomeCardLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {selectedIncome.label.toUpperCase()} ACCOUNT
              </Text>
              <MaterialIcons
                name="swap-vert"
                size={20}
                color={colors.textSecondary}
              />
            </View>
            <Text
              style={[styles.incomeCardTotal, { color: colors.textPrimary }]}
            >
              {formatPrice(selectedIncome.total)}
              <Text
                style={[
                  styles.incomeCardTotalSuffix,
                  { color: colors.textSecondary },
                ]}
              >
                {" "}
                total
              </Text>
            </Text>
            <View
              style={[
                styles.incomeCardBarWrap,
                { backgroundColor: colors.slate[700] },
              ]}
            >
              <View
                style={[
                  styles.incomeCardBarGreen,
                  {
                    width: `${incomePercent}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  styles.incomeCardBarRed,
                  {
                    flex: 1,
                    backgroundColor: colors.expense,
                  },
                ]}
              />
            </View>
            <View style={styles.incomeCardFooter}>
              <Text
                style={[styles.incomeCardRemaining, { color: colors.primary }]}
              >
                {formatPrice(selectedIncome.remaining)} remaining
              </Text>
              <Text
                style={[
                  styles.incomeCardPercent,
                  { color: colors.textSecondary },
                ]}
              >
                {incomePercent}% left
              </Text>
            </View>
          </Pressable>

          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: colors.primary }]}>
              AMOUNT
            </Text>
            <View style={styles.amountRow}>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary }]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                maxLength={16}
              />
            </View>
          </View>

          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                CATEGORY
              </Text>
              <Pressable hitSlop={8} onPress={openCategoryModal}>
                <Text style={[styles.viewAll, { color: colors.primary }]}>
                  View All
                </Text>
              </Pressable>
            </View>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const selected = category === cat.id;
                const isOther = cat.id === "other";
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() =>
                      isOther
                        ? router.push("/new-category")
                        : setCategory(cat.id)
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
            <DatePicker label="DATE" value={date} onChange={setDate} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              NOTES
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

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              UPLOAD RECEIPT
            </Text>
            <Pressable
              onPress={pickReceipt}
              style={[
                styles.uploadArea,
                receiptUri && styles.uploadAreaWithImage,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.slate[800],
                },
              ]}
            >
              {receiptUri ? (
                <>
                  <Image
                    source={{ uri: receiptUri }}
                    style={styles.receiptImage}
                    resizeMode="cover"
                  />
                  <Pressable
                    style={[
                      styles.removeReceipt,
                      { backgroundColor: colors.danger },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      setReceiptUri(null);
                    }}
                  >
                    <MaterialIcons name="close" size={18} color="#fff" />
                  </Pressable>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="cloud-upload"
                    size={40}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.uploadText, { color: colors.textPrimary }]}
                  >
                    Tap to upload
                  </Text>
                  <Text
                    style={[styles.uploadHint, { color: colors.textSecondary }]}
                  >
                    PNG, JPG up to 10MB
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>

        <BottomSheetModal
          ref={categoryModalRef}
          snapPoints={["50%"]}
          enablePanDownToClose
          enableDismissOnClose
          backgroundStyle={[
            categoryModalStyles.background as ViewStyle,
            { backgroundColor: colors.cardBackground },
          ]}
          handleIndicatorStyle={{
            backgroundColor: colors.slate[400],
            width: 40,
            height: 4,
            marginTop: 10,
          }}
          backdropComponent={renderCategoryBackdrop}
        >
          <Text
            style={[
              categoryModalStyles.title as TextStyle,
              { color: colors.textPrimary },
            ]}
          >
            Select Category
          </Text>
          <BottomSheetFlatList
            data={[...EXPENSE_CATEGORIES]}
            keyExtractor={(cat: CategoryItem) => cat.id}
            renderItem={renderCategoryItem}
            contentContainerStyle={categoryModalStyles.listContent as ViewStyle}
          />
        </BottomSheetModal>

        <BottomSheetModal
          ref={incomeSourceModalRef}
          snapPoints={["60%"]}
          enablePanDownToClose
          enableDismissOnClose
          backgroundStyle={[
            categoryModalStyles.background as ViewStyle,
            { backgroundColor: colors.cardBackground },
          ]}
          handleIndicatorStyle={{
            backgroundColor: colors.slate[400],
            width: 40,
            height: 4,
            marginTop: 10,
          }}
          backdropComponent={renderCategoryBackdrop}
        >
          <Text
            style={[
              incomeSourceModalStyles.title as TextStyle,
              { color: colors.textPrimary },
            ]}
          >
            Select Income Source
          </Text>
          <BottomSheetScrollView
            contentContainerStyle={incomeSourceModalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {INCOME_SOURCES.map((source) => {
              const selected = selectedIncomeId === source.id;
              const pct = Math.round((source.remaining / source.total) * 100);
              return (
                <Pressable
                  key={source.id}
                  onPress={() => setSelectedIncomeId(source.id)}
                  style={[
                    incomeSourceModalStyles.sourceCard,
                    {
                      backgroundColor: selected
                        ? colors.primary + "12"
                        : colors.cardBackground,
                      borderColor: selected
                        ? colors.primary
                        : colors.slate[700],
                    },
                  ]}
                >
                  <View
                    style={[
                      incomeSourceModalStyles.sourceIconWrap,
                      {
                        backgroundColor: selected
                          ? colors.primary + "25"
                          : colors.slate[700],
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={source.icon}
                      size={24}
                      color={selected ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={incomeSourceModalStyles.sourceBody}>
                    <Text
                      style={[
                        incomeSourceModalStyles.sourceLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {source.label}
                    </Text>
                    <Text
                      style={[
                        incomeSourceModalStyles.sourceRemaining,
                        {
                          color: selected
                            ? colors.primary
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {formatPrice(source.remaining)} remaining
                    </Text>
                    <Text
                      style={[
                        incomeSourceModalStyles.sourceTotal,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Total: {formatPrice(source.total)}
                    </Text>
                    <View
                      style={[
                        incomeSourceModalStyles.sourceBarWrap,
                        { backgroundColor: colors.slate[700] },
                      ]}
                    >
                      <View
                        style={[
                          incomeSourceModalStyles.sourceBarFill,
                          {
                            width: `${pct}%`,
                            backgroundColor: selected
                              ? colors.primary
                              : colors.slate[600],
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={incomeSourceModalStyles.sourceRight}>
                    <Text
                      style={[
                        incomeSourceModalStyles.sourcePct,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {pct}%
                    </Text>
                    <View
                      style={[
                        incomeSourceModalStyles.radio,
                        {
                          borderColor: selected
                            ? colors.primary
                            : colors.slate[600],
                          backgroundColor: selected
                            ? colors.primary + "40"
                            : "transparent",
                        },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            incomeSourceModalStyles.radioInner,
                            { backgroundColor: colors.primary },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                closeIncomeSourceModal();
              }}
              style={[
                incomeSourceModalStyles.confirmBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={incomeSourceModalStyles.confirmBtnText}>
                Confirm Selection
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </BottomSheetScrollView>
        </BottomSheetModal>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button onPress={handleSave} style={styles.saveBtn}>
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Save Expense</Text>
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
  incomeCard: {
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  incomeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  incomeCardLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  incomeCardTotal: {
    fontSize: fontSize["2xl"],
    fontFamily: fonts.Manrope.Bold,
  },
  incomeCardTotalSuffix: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.Medium,
  },
  incomeCardBarWrap: {
    height: 8,
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 10,
  },
  incomeCardBarGreen: {
    height: "100%",
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  incomeCardBarRed: {
    height: "100%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  incomeCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  incomeCardRemaining: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  incomeCardPercent: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
  },
  amountSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: fontSize.lg,
    fontFamily: fonts.Manrope.Medium,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
    textAlign: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dollarSign: {
    fontSize: fontSize["8xl"],
    fontFamily: fonts.Manrope.Bold,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize["8xl"],
    fontFamily: fonts.Manrope.Bold,
    paddingVertical: 0,
    textAlign: "center",
  },
  categorySection: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  viewAll: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryItem: {
    width: "31%",
    borderRadius: border.borderRadius.lg,
    padding: 12,
    alignItems: "center",
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.SemiBold,
  },
  field: { marginBottom: 18 },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 100,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Medium,
    textAlignVertical: "top",
  },
  uploadArea: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    overflow: "hidden",
  },
  uploadAreaWithImage: {
    height: 160,
    padding: 0,
  },
  receiptImage: {
    ...StyleSheet.absoluteFillObject,
  },
  removeReceipt: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 8,
  },
  uploadHint: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 4,
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
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Bold,
  },
});

const categoryModalStyles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.SemiBold,
  },
});

const incomeSourceModalStyles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: border.borderRadius.lg,
    borderWidth: 2,
    marginBottom: 12,
  },
  sourceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  sourceBody: { flex: 1, minWidth: 0 },
  sourceLabel: {
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Bold,
  },
  sourceRemaining: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
    marginTop: 2,
  },
  sourceTotal: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
    marginTop: 2,
  },
  sourceBarWrap: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
  },
  sourceBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  sourceRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  sourcePct: {
    fontSize: fontSize.xs,
    fontFamily: fonts.Manrope.Medium,
    marginBottom: 6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: border.borderRadius.lg,
    marginTop: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Bold,
  },
});
