import { useCreateCategory } from "@/actions/categories";
import Button from "@/ui/button";
import { border, fonts, fontSize, ThemePalette } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import {
  FlatList,
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
import * as Yup from "yup";

type NewCategoryValues = {
  name: string;
  iconIndex: number;
  colorIndex: number;
  type: CategoryType;
};

const initialValues: NewCategoryValues = {
  name: "",
  iconIndex: 0,
  colorIndex: 0,
  type: "EXPENSE",
};

const schema = Yup.object({
  name: Yup.string().trim().required("Category name is required"),
});

const CATEGORY_ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  "folder",
  "directions-car",
  "restaurant",
  "shopping-bag",
  "description",
  "sports-esports",
  "favorite",
  "card-giftcard",
  "local-cafe",
  "home",
  "flight",
  "music-note",
  "fitness-center",
  "school",
  "local-gas-station",
  "theater-comedy",
  "work",
  "business",
  "construction",
  "factory",
  "home",
  "hotel",
  "house",
  "apartment",
  "house-siding",
] as const;

const COLOR_SWATCHES = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#6B7280",
  "#a855f7",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#f43f5e",
  "#16a34a",
  "#f59e0b",
];

export default function NewCategory() {
  const { colors } = useTheme();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();
  const styles = useStyles(createStyles);
  const [showAllIcons, setShowAllIcons] = useState(false);
  const visibleIcons = useMemo(
    () => (showAllIcons ? CATEGORY_ICONS : CATEGORY_ICONS.slice(0, 10)),
    [showAllIcons],
  );

  const handleSubmit = async (values: NewCategoryValues) => {
    await createCategory({
      name: values.name,
      icon: CATEGORY_ICONS[values.iconIndex],
      color: COLOR_SWATCHES[values.colorIndex],
      type: values.type,
    });
    router.back();
  };
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
            size={20}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>New Category</Text>
        <View style={styles.headerRight} />
      </View>

      <Formik<NewCategoryValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values) => {
          // TODO: persist { name: values.name, type: values.type, icon: CATEGORY_ICONS[values.iconIndex], color: COLOR_SWATCHES[values.colorIndex] }
          await handleSubmit(values);
        }}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
        }) => {
          const swatchColor = COLOR_SWATCHES[values.colorIndex];
          const nameError = touched.name && errors.name;

          return (
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
                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Category Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      nameError ? styles.inputError : styles.inputDefault,
                    ]}
                    placeholder="e.g Fine Dining"
                    placeholderTextColor={colors.textSecondary}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    autoCapitalize="words"
                  />
                  {nameError ? (
                    <Text style={[styles.errorText, { color: colors.danger }]}>
                      {errors.name}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Type</Text>
                  <View style={styles.typeSwitchRow}>
                    {(["INCOME", "EXPENSE"] as const).map((type) => {
                      const selected = values.type === type;
                      return (
                        <Pressable
                          key={type}
                          onPress={() => setFieldValue("type", type)}
                          style={[
                            styles.typeSwitchBtn,
                            selected
                              ? styles.typeSwitchBtnActive
                              : styles.typeSwitchBtnInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.typeSwitchText,
                              selected
                                ? styles.typeSwitchTextActive
                                : styles.typeSwitchTextInactive,
                            ]}
                          >
                            {type === "INCOME" ? "Income" : "Expense"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.fieldLabel}>Select Icon</Text>
                    <Pressable onPress={() => setShowAllIcons((prev) => !prev)}>
                      <Text
                        style={[styles.sectionHint, { color: colors.primary }]}
                      >
                        {showAllIcons ? "Show Less" : "Browse All"}
                      </Text>
                    </Pressable>
                  </View>
                  <FlatList
                    data={visibleIcons}
                    numColumns={5}
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.iconGridRow}
                    style={styles.iconGrid}
                    renderItem={({ item: icon, index }) => {
                      const selected = values.iconIndex === index;
                      return (
                        <Pressable
                          style={[
                            styles.iconCell,
                            styles.iconCellDefault,
                            selected && {
                              backgroundColor: swatchColor,
                            },
                          ]}
                          onPress={() => setFieldValue("iconIndex", index)}
                        >
                          <MaterialIcons
                            name={icon}
                            size={24}
                            color={selected ? "#fff" : undefined}
                            style={
                              !selected ? styles.iconUnselected : undefined
                            }
                          />
                        </Pressable>
                      );
                    }}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Vault Color</Text>
                  <FlatList
                    data={COLOR_SWATCHES}
                    numColumns={5}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    scrollEnabled={false}
                    style={styles.colorGrid}
                    columnWrapperStyle={styles.colorGridRow}
                    renderItem={({ item: hex, index }) => {
                      const selected = values.colorIndex === index;
                      return (
                        <Pressable
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: hex },
                            selected && styles.colorSwatchSelected,
                          ]}
                          onPress={() => setFieldValue("colorIndex", index)}
                        >
                          {selected && (
                            <MaterialIcons
                              name="check"
                              size={18}
                              color="#fff"
                            />
                          )}
                        </Pressable>
                      );
                    }}
                  />
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  onPress={() => handleSubmit()}
                  style={styles.saveBtn}
                  disabled={!values.name.trim()}
                  loading={isPending}
                >
                  <Text style={styles.saveBtnText}>Create Category</Text>
                  <MaterialIcons name="add" size={22} color="#fff" />
                </Button>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 8,
      minHeight: 48,
    },
    backBtn: { padding: 8, width: 40 },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
    },
    headerIcon: {
      color: colors.textPrimary,
    },
    headerRight: { width: 40 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
    section: { marginBottom: 22 },
    typeSwitchRow: {
      flexDirection: "row",
      backgroundColor: colors.slate[800],
      borderColor: colors.slate[700],
      borderRadius: border.borderRadius.full,
      borderWidth: 1,
      padding: 4,
    },
    typeSwitchBtn: {
      flex: 1,
      borderRadius: border.borderRadius.full,
      paddingVertical: 9,
      alignItems: "center",
      justifyContent: "center",
    },
    typeSwitchBtnActive: {
      backgroundColor: colors.primary,
    },
    typeSwitchBtnInactive: {
      backgroundColor: "transparent",
    },
    typeSwitchText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
    },
    typeSwitchTextActive: {
      color: colors.onPrimary,
    },
    typeSwitchTextInactive: {
      color: colors.textPrimary,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    sectionHint: {
      fontSize: fontSize.xs,
      fontFamily: fonts.Manrope.SemiBold,
    },
    fieldLabel: {
      color: colors.textPrimary,
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.slate[800],
      color: colors.textPrimary,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: border.borderRadius.lg,
      borderWidth: 1,
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Medium,
    },
    inputDefault: {
      borderColor: colors.slate[700],
    },
    inputError: {
      borderColor: colors.danger,
    },
    errorText: {
      fontSize: 12,
      fontFamily: fonts.Manrope.Medium,
      marginTop: 4,
    },
    iconGrid: {},
    iconGridRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 8,
    },
    iconCell: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: border.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.slate[700],
    },
    iconCellDefault: {
      backgroundColor: colors.slate[800],
    },
    iconUnselected: {
      color: colors.textPrimary,
    },
    colorGrid: {
      marginTop: 4,
    },
    colorGridRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 10,
    },
    colorSwatch: {
      width: 63,
      height: 63,
      borderRadius: border.borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    colorSwatchSelected: {
      borderWidth: 2,
      borderColor: "#fff",
    },
    footer: {
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 48,
    },
    saveBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: border.borderRadius.full,
      minHeight: 52,
    },
    saveBtnText: {
      color: "#fff",
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
    },
  });
