import { CategoryIcon } from "@/features/categories/components/category-icon";
import { ErrorView } from "@/ui/feedback/error-boundary";
import { SkeletonListItem } from "@/ui/skeleton";
import { Category, CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

type CategoriesContentProps = {
  styles: any;
  colors: { primary: string };
  isRefetching: boolean;
  refetch: () => void;
  showError: boolean;
  queryError?: unknown;
  isLoading: boolean;
  categories?: Category[];
  filteredCategories: Category[];
  activeTab: CategoryType;
};

export function CategoriesContent({
  styles,
  colors,
  isRefetching,
  refetch,
  showError,
  queryError,
  isLoading,
  categories,
  filteredCategories,
  activeTab,
}: CategoriesContentProps) {
  const MAX_CUSTOM_CATEGORIES = 10;
  const systemCategories = filteredCategories.filter((item) => item.is_system);
  const customCategories = filteredCategories.filter((item) => !item.is_system);

  const renderCategoryRow = (category: Category) => (
    <View key={category.id} style={[styles.card, styles.cardSurface]}>
      <View
        style={[styles.iconWrap, { backgroundColor: category.color + "22" }]}
      >
        <CategoryIcon
          icon={category.icon}
          color={category.color}
          size={20}
          withBackground
        />
      </View>

      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{category.name}</Text>
      </View>
      <View style={styles.cardActions}>
        <View style={[styles.colorDot, { backgroundColor: category.color }]} />
        {category.is_system ? (
          <MaterialIcons name="lock" size={16} style={styles.lockIcon} />
        ) : (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/edit-category",
                params: {
                  id: category.id,
                  name: category.name,
                  icon: category.icon,
                  color: category.color,
                },
              })
            }
            style={styles.editBtn}
            hitSlop={10}
            accessibilityRole="button"
          >
            <MaterialIcons name="edit" size={16} style={styles.editIcon} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderSection = (title: string, data: Category[]) => {
    if (data.length === 0) return null;
    return (
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{data.length}</Text>
        </View>
        {data.map(renderCategoryRow)}
      </View>
    );
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {showError ? (
          <ErrorView
            error={queryError}
            title="Could not load categories"
            message="Pull to refresh or retry."
            onRetry={() => refetch()}
          />
        ) : isLoading && !categories ? (
          Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={[styles.card, styles.cardSurface]}>
              <SkeletonListItem />
            </View>
          ))
        ) : filteredCategories.length === 0 ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>
              No {activeTab.toLowerCase()} categories
            </Text>
            <Text style={styles.feedbackSubtitle}>
              Add one to start organizing your transactions.
            </Text>
          </View>
        ) : (
          <>
            {renderSection("System Categories", systemCategories)}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Categories</Text>
                <Text style={styles.sectionCount}>
                  {customCategories.length} / {MAX_CUSTOM_CATEGORIES} USED
                </Text>
              </View>
              {customCategories.map(renderCategoryRow)}
            </View>
          </>
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/new-category")}
        accessibilityRole="button"
      >
        <MaterialIcons name="add" size={28} style={styles.fabIcon} />
      </Pressable>
    </>
  );
}
