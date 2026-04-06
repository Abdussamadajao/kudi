import BlurBackdrop, { BlurBackdropProps } from "@/ui/blur-backdrop";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { createAddExpensesStyles } from "./add-expenses-styles";

export type IncomeSourceItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  total: number;
  remaining: number;
};

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  styles: ReturnType<typeof createAddExpensesStyles>;
  sources: IncomeSourceItem[];
  selectedIncomeId: string;
  onSelectIncome: (id: string) => void;
  onConfirm: () => void;
};

export function IncomeSourcesModal({
  modalRef,
  styles,
  sources,
  selectedIncomeId,
  onSelectIncome,
  onConfirm,
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
      snapPoints={["60%"]}
      enablePanDownToClose
      enableHandlePanningGesture
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      backgroundStyle={[
        styles.modalBackground,
        { backgroundColor: colors.cardBackground },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.slate[400],
        width: 40,
        height: 4,
        marginTop: 10,
      }}
      backdropComponent={renderBackdrop}
    >
      <Text style={[styles.incomeModalTitle, { color: colors.textPrimary }]}>
        Select Income Source
      </Text>
      <BottomSheetScrollView
        contentContainerStyle={styles.incomeModalScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sources.map((source) => {
          const selected = selectedIncomeId === source.id;
          const pct = Math.round((source.remaining / source.total) * 100);
          return (
            <Pressable
              key={source.id}
              onPress={() => onSelectIncome(source.id)}
              style={[
                styles.incomeSourceCard,
                {
                  backgroundColor: selected
                    ? colors.primary + "12"
                    : colors.cardBackground,
                  borderColor: selected ? colors.primary : colors.slate[700],
                },
              ]}
            >
              <View
                style={[
                  styles.incomeSourceIconWrap,
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
              <View style={styles.incomeSourceBody}>
                <Text
                  style={[
                    styles.incomeSourceLabel,
                    { color: colors.textPrimary },
                  ]}
                >
                  {source.label}
                </Text>
                <Text
                  style={[
                    styles.incomeSourceRemaining,
                    { color: selected ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {formatPrice(source.remaining)}
                </Text>
              </View>
              <View style={styles.incomeSourceRight}>
                <View
                  style={[
                    styles.incomeSourceRadio,
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
                        styles.incomeSourceRadioInner,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </BottomSheetScrollView>
      <View style={styles.incomeSourceConfirmBtnWrap}>
        <Pressable
          onPress={onConfirm}
          style={[
            styles.incomeSourceConfirmBtn,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.incomeSourceConfirmBtnText}>
            Confirm Selection
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
