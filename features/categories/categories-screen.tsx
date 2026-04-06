import { useCategories } from "@/actions/categories";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { CategoryType } from "@/types/categories";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoriesContent } from "./categories-content";
import { CategoriesHeader } from "./categories-header";
import { createCategoriesStyles } from "./categories-styles";

export function CategoriesScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<CategoryType>("INCOME");
  const styles = useStyles(createCategoriesStyles);
  const {
    data: categories,
    isLoading,
    error,
    refetch,
    isRefetching,
    isRefetchError,
  } = useCategories();

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) => category.type === activeTab);
  }, [categories, activeTab]);
  const showError = !!error || isRefetchError;

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea]}>
      <CategoriesHeader
        styles={styles}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
      <CategoriesContent
        styles={styles}
        colors={{ primary: colors.primary }}
        isRefetching={isRefetching}
        refetch={refetch}
        showError={showError}
        queryError={error}
        isLoading={isLoading}
        categories={categories}
        filteredCategories={filteredCategories}
        activeTab={activeTab}
      />
    </SafeAreaView>
  );
}
