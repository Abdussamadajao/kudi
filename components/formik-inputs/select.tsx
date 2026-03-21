import BlurBackdrop, { BlurBackdropProps } from "@/components/blur-backdrop";
import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useField } from "formik";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type SelectOption =
  | string
  | { value: string; label?: string; children?: React.ReactNode };

function normalizeOptions(
  opts: SelectOption[],
): { value: string; label: string; children?: React.ReactNode }[] {
  return opts.map((o) =>
    typeof o === "string"
      ? { value: o, label: o }
      : { value: o.value, label: o.label ?? o.value, children: o.children },
  );
}

type BaseSelectProps = {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  style?: StyleProp<ViewStyle>;
  renderListHeader?: (closeModal: () => void) => React.ReactNode;
  listDisabled?: boolean;
  snapPoints?: (string | number)[];
  error?: string;
};

export type SelectProps = BaseSelectProps & {
  value: string | null;
  onChange: (value: string | null) => void;
};

export type FormikSelectProps = BaseSelectProps & {
  name: string;
  validate?: (value: string | null) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const SelectUI: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label = "",
  placeholder = "Select...",
  modalTitle = "Select",
  style,
  renderListHeader,
  listDisabled = false,
  snapPoints: snapPointsProp,
  error,
}) => {
  const { colors } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);

  const items = useMemo(() => normalizeOptions(options), [options]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        selectLabel: {
          fontSize: fontSize["sm"],
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
          letterSpacing: 0.5,
          marginBottom: 8,
        },
        select: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.cardBackground,
          borderRadius: border.borderRadius.lg,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: colors.slate[700],
          minHeight: 56,
        },
        selectError: { borderColor: colors.danger },
        value: {
          flex: 1,
          fontSize: fontSize["md"],
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
          marginRight: 12,
        },
        valuePlaceholder: { color: colors.textSecondary },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 4,
          fontFamily: fonts.Manrope.Medium,
        },
        modalBackground: {
          backgroundColor: colors.cardBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        handleIndicator: {
          backgroundColor: colors.gray[400],
          width: 40,
          height: 4,
        },
        modalContainer: { flex: 1 },
        modalScroll: { flex: 1 },
        scrollContent: {
          paddingHorizontal: 16,
          paddingTop: 50,
          paddingBottom: 34,
        },
        modalHeader: {
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.slate[700],
          backgroundColor: colors.cardBackground,
          zIndex: 1000,
        },
        modalTitle: {
          fontSize: fontSize["lg"],
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
        },
        listWrap: {},
        listDisabled: { opacity: 0.5, pointerEvents: "none" as const },
        optionItem: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.slate[700],
        },
        optionItemContent: { flex: 1, minWidth: 0 },
        optionItemText: {
          flex: 1,
          fontSize: fontSize["md"],
          fontFamily: fonts.Manrope.Medium,
          color: colors.textPrimary,
        },
        optionItemTextDisabled: { color: colors.textSecondary },
      }),
    [colors],
  );

  const openModal = useCallback(() => modalRef.current?.present(), []);
  const closeModal = useCallback(() => modalRef.current?.dismiss(), []);

  const snapPoints = useMemo(() => snapPointsProp ?? ["50%"], [snapPointsProp]);
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

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      closeModal();
    },
    [onChange, closeModal],
  );

  const selectedLabel = value
    ? (items.find((i) => i.value === value)?.label ?? value)
    : null;
  const displayValue = selectedLabel ?? placeholder;

  return (
    <>
      <View style={style}>
        {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
        <Pressable
          style={[styles.select, error && styles.selectError]}
          onPress={openModal}
        >
          <Text
            style={[styles.value, !value && styles.valuePlaceholder]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.gray[500]}
          />
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        enableContentPanningGesture
        enableHandlePanningGesture
        enableDynamicSizing={false}
        backgroundStyle={styles.modalBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <View style={styles.modalContainer}>
          <BottomSheetView style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
          </BottomSheetView>
          <BottomSheetScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.scrollContent}
          >
            {renderListHeader?.(closeModal)}
            <View
              style={[styles.listWrap, listDisabled && styles.listDisabled]}
            >
              {items.map((item) => (
                <Pressable
                  key={item.value}
                  style={styles.optionItem}
                  onPress={() => !listDisabled && handleSelect(item.value)}
                  disabled={listDisabled}
                >
                  {item.children != null ? (
                    <View style={styles.optionItemContent}>
                      {item.children}
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.optionItemText,
                        listDisabled && styles.optionItemTextDisabled,
                      ]}
                    >
                      {item.label}
                    </Text>
                  )}
                  {value === item.value && (
                    <MaterialCommunityIcons
                      name="check"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </>
  );
};

export const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}) => {
  const [field, meta, helpers] = useField<string | null>({
    name,
    validate: (val) => {
      const empty = val == null || val === "";
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return validate ? validate(val) : undefined;
    },
  });
  const value = field.value ?? null;
  const error =
    errorOverride ??
    (showFormikError && meta.touched ? (meta.error as string | undefined) : undefined);
  return (
    <SelectUI
      value={value}
      onChange={(v) => {
        helpers.setValue(v);
        helpers.setTouched(true);
      }}
      error={error}
      {...rest}
    />
  );
};

export { SelectUI as Select };
export default SelectUI;
