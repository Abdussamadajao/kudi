import { CategoryType } from "@/types/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type CategoriesHeaderProps = {
  styles: any;
  activeTab: CategoryType;
  onChangeTab: (tab: CategoryType) => void;
};

export function CategoriesHeader({
  styles,
  activeTab,
  onChangeTab,
}: CategoriesHeaderProps) {
  return (
    <>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityRole="button"
        >
          <MaterialIcons name="arrow-back" size={22} style={styles.headerIcon} />
        </Pressable>

        <Text style={styles.headerTitle}>Categories</Text>

        <Pressable
          onPress={() => router.push("/new-category")}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityRole="button"
        >
          <MaterialIcons name="add" size={22} style={styles.addHeaderIcon} />
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.tabsWrap}>
          {(["INCOME", "EXPENSE"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
                onPress={() => onChangeTab(tab)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab === "INCOME" ? "Income" : "Expense"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}
