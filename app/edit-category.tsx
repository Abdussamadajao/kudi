import { useDeleteCategory, useUpdateCategory } from "@/actions/categories";
import Button from "@/ui/button";
import { border, fonts, fontSize, ThemePalette } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import {
  Alert,
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

type EditCategoryValues = {
  name: string;
  iconIndex: number;
  colorIndex: number;
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
];

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

function getInitialValues(params: {
  name?: string;
  icon?: string;
  color?: string;
}): EditCategoryValues {
  const iconIndex = params.icon
    ? Math.max(
        0,
        CATEGORY_ICONS.indexOf(params.icon as (typeof CATEGORY_ICONS)[number]),
      )
    : 0;
  const colorIndex = params.color
    ? Math.max(0, COLOR_SWATCHES.indexOf(params.color))
    : 0;
  return {
    name: params.name ?? "",
    iconIndex: Number.isNaN(iconIndex) ? 0 : iconIndex,
    colorIndex: Number.isNaN(colorIndex) ? 0 : colorIndex,
  };
}

export default function EditCategory() {
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const [showAllIcons, setShowAllIcons] = useState(false);
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
  }>();
  const { mutateAsync: updateCategory, isPending } = useUpdateCategory(
    params.id ?? "",
  );
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory(params.id ?? "");

  const initialValues = useMemo(
    () => getInitialValues(params),
    [params.name, params.icon, params.color],
  );
  const visibleIcons = useMemo(
    () => (showAllIcons ? CATEGORY_ICONS : CATEGORY_ICONS.slice(0, 10)),
    [showAllIcons],
  );

  const handleSubmit = async (values: EditCategoryValues) => {
    await updateCategory({
      name: values.name,
      icon: CATEGORY_ICONS[values.iconIndex],
      color: COLOR_SWATCHES[values.colorIndex],
    });
    router.back();
  };

  const handleDelete = () => {
    if (!params.id) return;
    Alert.alert("Delete Category", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCategory();
          router.back();
        },
      },
    ]);
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
            size={24}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Category</Text>
        <View style={styles.headerRight} />
      </View>

      <Formik<EditCategoryValues>
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values) => {
          // TODO: persist update with params.id: { name, icon: CATEGORY_ICONS[iconIndex], color: COLOR_SWATCHES[colorIndex] }
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
                  <Text style={styles.saveBtnText}>Update Category</Text>
                  <MaterialIcons name="check" size={22} color="#fff" />
                </Button>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={handleDelete}
                  disabled={isDeleting || isPending}
                >
                  <Text style={styles.deleteBtnText}>
                    {isDeleting ? "Deleting..." : "Delete Category"}
                  </Text>
                </Pressable>
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
    deleteBtn: {
      alignItems: "center",
      borderColor: colors.danger,
      borderRadius: border.borderRadius.full,
      borderWidth: 1,
      justifyContent: "center",
      marginTop: 12,
      minHeight: 48,
    },
    deleteBtnText: {
      color: colors.danger,
      fontSize: fontSize.sm,
      fontFamily: fonts.Manrope.SemiBold,
    },
    saveBtnText: {
      color: "#fff",
      fontSize: fontSize.md,
      fontFamily: fonts.Manrope.Bold,
    },
  });
