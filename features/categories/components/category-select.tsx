import { useCategories } from "@/actions";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useField } from "formik";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Select } from "@/ui/form/select";

type FormikCategorySelectProps = {
  name: string;
  categoryType: CategoryType;
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  required?: boolean;
  showFormikError?: boolean;
  onCategoryChange?: (category: { id: string; name: string } | null) => void;
  onAddCustomCategory?: () => void;
};

function isValidMaterialIcon(
  name: string,
): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

export function FormikCategorySelect({
  name,
  categoryType,
  label = "CATEGORY",
  placeholder = "Select category",
  modalTitle = "Select Category",
  required = false,
  showFormikError = true,
  onCategoryChange,
  onAddCustomCategory,
}: FormikCategorySelectProps) {
  const { colors } = useTheme();
  const {
    data: categoriesData,
    isLoading,
    isError: isCategoriesError,
    error: categoriesQueryError,
    refetch: refetchCategories,
  } = useCategories();
  const categories = categoriesData ?? [];
  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val) => {
      const empty = !val || val.trim() === "";
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return undefined;
    },
  });

  const filtered = useMemo(
    () => categories.filter((category) => category.type === categoryType),
    [categories, categoryType],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        optionRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minHeight: 40,
        },
        iconWrap: {
          width: 30,
          height: 30,
          borderRadius: border.borderRadius.full,
          alignItems: "center",
          justifyContent: "center",
        },
        optionLabel: {
          fontSize: fontSize.md,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textPrimary,
        },
        infoText: {
          fontSize: 12,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textSecondary,
          marginBottom: 10,
        },
        addCustomBtn: {
          paddingHorizontal: 12,
          height: 32,
          borderRadius: border.borderRadius.full,
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: colors.primary + "14",
          alignItems: "center",
          justifyContent: "center",
        },
        addCustomBtnText: {
          fontSize: 12,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.primary,
        },
        selectedIconWrap: {
          width: 24,
          height: 24,
          borderRadius: border.borderRadius.full,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );

  const error =
    showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined;
  const selectedCategory =
    filtered.find((category) => category.id === (field.value || "")) ?? null;

  return (
    <Select
      value={field.value || null}
      onChange={(value) => {
        const nextValue = value ?? "";
        helpers.setValue(nextValue);
        helpers.setTouched(true);
        const selected =
          filtered.find((category) => category.id === nextValue) ?? null;
        onCategoryChange?.(
          selected ? { id: selected.id, name: selected.name } : null,
        );
      }}
      label={label}
      placeholder={isLoading ? "Loading categories..." : placeholder}
      modalTitle={modalTitle}
      modalHeaderRight={(closeModal) => (
        <Pressable
          style={styles.addCustomBtn}
          onPress={() => {
            closeModal();
            if (onAddCustomCategory) {
              onAddCustomCategory();
              return;
            }
            router.push("/new-category");
          }}
        >
          <Text style={styles.addCustomBtnText}>Add custom category</Text>
        </Pressable>
      )}
      listDisabled={isLoading || (isCategoriesError && !categoriesData)}
      error={error}
      leftIcon={
        selectedCategory ? (
          <View
            style={[
              styles.selectedIconWrap,
              { backgroundColor: selectedCategory.color + "30" },
            ]}
          >
            <MaterialIcons
              name={
                isValidMaterialIcon(selectedCategory.icon)
                  ? selectedCategory.icon
                  : "receipt-long"
              }
              size={14}
              color={selectedCategory.color || colors.primary}
            />
          </View>
        ) : undefined
      }
      options={filtered.map((category) => ({
        value: category.id,
        label: category.name,
        children: (
          <View style={styles.optionRow}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: category.color + "30" },
              ]}
            >
              <MaterialIcons
                name={
                  isValidMaterialIcon(category.icon)
                    ? category.icon
                    : "receipt-long"
                }
                size={18}
                color={category.color || colors.primary}
              />
            </View>
            <Text style={styles.optionLabel}>{category.name}</Text>
          </View>
        ),
      }))}
      renderListHeader={() => (
        <>
          {isLoading ? (
            <Text style={styles.infoText}>Loading categories...</Text>
          ) : null}
          {isCategoriesError && categoriesData === undefined ? (
            <ErrorView
              compact
              error={categoriesQueryError}
              onRetry={refetchCategories}
              retryLabel="Retry"
            />
          ) : null}
        </>
      )}
    />
  );
}

export default FormikCategorySelect;
