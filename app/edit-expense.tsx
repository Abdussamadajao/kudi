import BlurBackdrop, { BlurBackdropProps } from "@/components/blur-backdrop";
import Button from "@/components/button";
import DatePicker from "@/components/formik-inputs/date-picker";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
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

function parseInitialDate(param: string | undefined): Date {
  if (!param) return new Date();
  const d = new Date(param);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default function EditExpense() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    id?: string;
    amount?: string;
    category?: string;
    date?: string;
    notes?: string;
    receiptUri?: string;
  }>();

  const categoryModalRef = useRef<BottomSheetModal>(null);
  const [amount, setAmount] = useState(() => params.amount ?? "");
  const [category, setCategory] = useState<string>(() => params.category ?? "");
  const [date, setDate] = useState(() => parseInitialDate(params.date));
  const [notes, setNotes] = useState(() => params.notes ?? "");
  const [receiptUri, setReceiptUri] = useState<string | null>(
    () => params.receiptUri ?? null,
  );

  const openCategoryModal = useCallback(() => {
    categoryModalRef.current?.present();
  }, []);
  const closeCategoryModal = useCallback(() => {
    categoryModalRef.current?.dismiss();
  }, []);

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

  const pickReceipt = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0])
      setReceiptUri(result.assets[0].uri);
  }, []);

  const handleUpdate = useCallback(() => {
    // TODO: persist update with params.id
    router.back();
  }, []);

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
          Edit Expense
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

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button onPress={handleUpdate} style={styles.saveBtn}>
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Update Expense</Text>
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
