import BlurBackdrop, { BlurBackdropProps } from "@/ui/blur-backdrop";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { createAddExpensesStyles } from "./add-expenses-styles";

export type ExpenseCategoryItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  styles: ReturnType<typeof createAddExpensesStyles>;
  categories: ExpenseCategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
};

export function ExpenseCategoriesModal({
  modalRef,
  styles,
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const { colors } = useTheme();

  const renderBackdrop = useCallback(
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

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["50%"]}
      enablePanDownToClose
      enableDismissOnClose
      backgroundStyle={[styles.modalBackground, { backgroundColor: colors.cardBackground }]}
      handleIndicatorStyle={{
        backgroundColor: colors.slate[400],
        width: 40,
        height: 4,
        marginTop: 10,
      }}
      backdropComponent={renderBackdrop}
    >
      <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Category</Text>
      <BottomSheetFlatList
        data={categories}
        keyExtractor={(cat) => cat.id}
        renderItem={({ item: cat }) => {
          const selected = selectedCategoryId === cat.id;
          return (
            <Pressable
              style={({ pressed }) => [
                styles.categoryOptionRow,
                { borderColor: colors.slate[700] },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <View
                style={[
                  styles.categoryOptionIconWrap,
                  { backgroundColor: selected ? colors.primary : colors.slate[800] },
                ]}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={24}
                  color={selected ? "#fff" : colors.primary}
                />
              </View>
              <Text style={[styles.categoryOptionLabel, { color: colors.textPrimary }]}>
                {cat.label}
              </Text>
              {selected && <MaterialIcons name="check" size={22} color={colors.primary} />}
            </Pressable>
          );
        }}
        contentContainerStyle={styles.modalListContent}
      />
    </BottomSheetModal>
  );
}
