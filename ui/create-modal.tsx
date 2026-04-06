import BlurBackdrop, { BlurBackdropProps } from "@/ui/blur-backdrop";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SCAN_BLUE = "#4299E1";

const OPTIONS = [
  {
    id: "income",
    title: "Add Income",
    subtitle: "Salary, dividends, gifts",
    icon: "add" as const,
    iconColorKey: "income" as const,
    onPress: () => {
      router.push("/add-income");
    },
  },
  {
    id: "expense",
    title: "Add Expense",
    subtitle: "Bills, food, shopping",
    icon: "remove" as const,
    iconColorKey: "expense" as const,
    onPress: () => {
      router.push("/add-expenses");
    },
  },
  // {
  //   id: "scan",
  //   title: "Scan Receipt",
  //   subtitle: "Automatic entry from photo",
  //   icon: "document-scanner" as const,
  //   iconColorKey: "scan" as const,
  //   onPress: () => {
  //     console.log("Scan Receipt");
  //   },
  // },
  // {
  //   id: "transfer",
  //   title: "Transfer",
  //   subtitle: "Move money between accounts",
  //   icon: "swap-horiz" as const,
  //   iconColorKey: "warning" as const,
  //   onPress: () => {
  //     console.log("Transfer");
  //   },
  // },
] as const;

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateModal({ visible, onClose }: CreateModalProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) modalRef.current?.present();
    else modalRef.current?.dismiss();
  }, [visible]);

  const closeModal = useCallback(() => modalRef.current?.dismiss(), []);
  const snapPoints = useMemo(() => ["45%"], []);

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

  const getIconBg = (key: (typeof OPTIONS)[number]["iconColorKey"]) => {
    // if (key === "scan") return SCAN_BLUE;
    return colors[key];
  };

  const renderItem = useCallback(
    ({
      item: opt,
      index,
    }: {
      item: (typeof OPTIONS)[number];
      index: number;
    }) => (
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          index > 0 && styles.optionRowBorder,
          { borderColor: colors.slate[700] },
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => {
          closeModal();
          opt.onPress();
        }}
      >
        <View
          style={[
            styles.optionRowLeft,
            { backgroundColor: `${getIconBg(opt.iconColorKey)}20` },
          ]}
        >
          <View
            style={[
              styles.optionIconWrap,
              { backgroundColor: getIconBg(opt.iconColorKey) },
            ]}
          >
            <MaterialIcons name={opt.icon} size={22} color="#fff" />
          </View>
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
            {opt.title}
          </Text>
          <Text
            style={[styles.optionSubtitle, { color: colors.textSecondary }]}
          >
            {opt.subtitle}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
    ),
    [colors, closeModal],
  );

  const ListHeader = useCallback(
    () => (
      <>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Add Transaction
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose the type of entry you want to record
        </Text>
      </>
    ),
    [colors],
  );

  const ListFooter = useCallback(
    () => (
      <View style={[styles.footerWrap, { borderColor: colors.slate[700] }]}>
        <Pressable onPress={closeModal} style={styles.dismissWrap}>
          <Text style={[styles.dismissText, { color: colors.textPrimary }]}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    ),
    [closeModal, colors],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      onDismiss={onClose}
      backgroundStyle={[
        styles.background,
        { backgroundColor: colors.surfaceContainer },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.slate[300],
        marginTop: 10,
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetFlatList
        data={[...OPTIONS]}
        keyExtractor={(opt: (typeof OPTIONS)[number]) => opt.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: {
    borderRadius: border.borderRadius.lg,
    overflow: "hidden",
  },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: fontSize["xl"],
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.Medium,
    textAlign: "center",
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingRight: 8,
  },
  optionRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  optionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  optionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    // marginRight: 14,
  },
  optionText: { flex: 1 },
  optionTitle: {
    fontSize: fontSize["md"],
    fontFamily: fonts.Manrope.SemiBold,
  },
  optionSubtitle: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.Medium,
    marginTop: 2,
  },
  dismissWrap: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dismissText: {
    fontSize: fontSize["md"],
    fontFamily: fonts.Manrope.Medium,
  },
  footerWrap: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
