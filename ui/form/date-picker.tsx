import BlurBackdrop, { BlurBackdropProps } from "@/ui/blur-backdrop";
import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  getHours,
  getMinutes,
  getMonth,
  isSameDay,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useField } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getCalendarCells(year: number, month: number) {
  const monthStart = startOfMonth(new Date(year, month));
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = addDays(gridStart, 41);
  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    currentMonth: getMonth(date) === month,
  }));
}

function formatDisplayDate(d: Date) {
  return format(d, "d MMM yyyy");
}

function formatTime(d: Date) {
  const h = getHours(d);
  const am = h < 12;
  const h12 = h % 12 || 12;
  return { hour: h12, minute: getMinutes(d), am };
}

type BaseDatePickerProps = {
  style?: StyleProp<ViewStyle>;
  label: string;
  leftIcon?: React.ReactNode;
  error?: string;
  calendarIconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export type DatePickerProps = BaseDatePickerProps & {
  value?: Date;
  onChange: (date: Date) => void;
};

export type FormikDatePickerProps = BaseDatePickerProps & {
  name: string;
  validate?: (value: Date | undefined) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

type QuickMode = "today" | "yesterday";

const DatePickerUI: React.FC<DatePickerProps> = ({
  style,
  label,
  value,
  onChange,
  error,
  calendarIconColor,
  backgroundColor,
  borderColor,
}) => {
  const { colors } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const initial = value ? new Date(value) : new Date();
  const [pickerDate, setPickerDate] = useState(initial);
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [quickMode, setQuickMode] = useState<QuickMode>(() => {
    const d = value || new Date();
    const t = new Date();
    if (isSameDay(d, t)) return "today";
    const y = new Date(t);
    y.setDate(y.getDate() - 1);
    if (isSameDay(d, y)) return "yesterday";
    return "today";
  });
  const { hour, minute, am } = formatTime(pickerDate);
  const [hourStr, setHourStr] = useState(String(hour));
  const [minStr, setMinStr] = useState(String(minute).padStart(2, "0"));
  const [isAm, setIsAm] = useState(am);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        selectLabel: {
          fontSize: 12,
          fontFamily: fonts.Manrope.SemiBold,
          letterSpacing: 0.5,
          marginBottom: 8,
          color: colors.textPrimary,
        },
        select: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.slate[700],
          borderRadius: border.borderRadius.lg,
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 56,
        },
        selectError: { borderColor: colors.danger },
        valuePlaceholder: { color: colors.textSecondary },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 4,
          fontFamily: fonts.Manrope.Medium,
        },
        label: {
          fontSize: 12,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
          marginBottom: 2,
        },
        value: {
          fontSize: 16,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
        },
        modalBackground: {
          backgroundColor: colors.cardBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        handleIndicator: {
          backgroundColor: colors.textSecondary,
          width: 40,
          height: 4,
          marginTop: 10,
        },
        modalContent: { paddingBottom: 34 },
        modalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16,
        },
        modalTitle: {
          fontSize: 18,
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
        },
        doneButton: {
          fontSize: 16,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.primary,
        },
        quickRow: {
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 8,
        },
        quickBtn: {
          flex: 1,
          padding: 10,
          width: 200,
          borderRadius: border.borderRadius.xl,
          backgroundColor: colors.slate[700],
          alignItems: "center",
        },
        quickBtnSelected: { backgroundColor: colors.primary },
        quickBtnText: {
          fontSize: 14,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textSecondary,
        },
        quickBtnTextSelected: { color: "#fff" },
        monthRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingTop: 20,
        },
        chevron: { padding: 8 },
        monthYear: {
          fontSize: 18,
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
        },
        weekdayRow: {
          flexDirection: "row",
          paddingHorizontal: 1,
          paddingTop: 16,
          justifyContent: "space-around",
        },
        weekday: {
          width: 36,
          textAlign: "center",
          fontSize: 12,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textSecondary,
        },
        calendarGrid: {},
        dayCell: {
          width: "14.28%",
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        dayCellOther: {},
        dayCellSelected: {},
        dayCellSelectedInner: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        dayText: {
          fontSize: 16,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textPrimary,
        },
        dayTextOther: { color: colors.textSecondary },
        dayTextSelected: { color: "#fff" },
        timeRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 24,
          marginTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.slate[700],
          gap: 12,
        },
        timeLabel: {
          fontSize: 14,
          fontFamily: fonts.Manrope.Regular,
          color: colors.textSecondary,
        },
        timeInputRow: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.slate[700],
          borderRadius: border.borderRadius.DEFAULT,
          paddingHorizontal: 12,
          paddingVertical: 10,
        },
        timeInput: {
          minWidth: 32,
          fontSize: 16,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
          padding: 0,
        },
        timeColon: {
          fontSize: 16,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textSecondary,
        },
        ampmRow: { flexDirection: "row", gap: 8 },
        ampmBtn: {
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: border.borderRadius.DEFAULT,
          backgroundColor: colors.slate[700],
        },
        ampmBtnSelected: { backgroundColor: colors.cardBackground },
        ampmText: {
          fontSize: 14,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textSecondary,
        },
        ampmTextSelected: {
          color: colors.primary,
          fontFamily: fonts.Manrope.SemiBold,
        },
      }),
    [colors],
  );

  const openModal = useCallback(() => {
    const d = value ? new Date(value) : new Date();
    setPickerDate(d);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    const { hour, minute, am } = formatTime(d);
    setHourStr(String(hour));
    setMinStr(String(minute).padStart(2, "0"));
    setIsAm(am);
    if (value) {
      const t = new Date();
      const yesterday = addDays(t, -1);
      setQuickMode(
        isSameDay(d, t)
          ? "today"
          : isSameDay(d, yesterday)
            ? "yesterday"
            : "today",
      );
    }
    modalRef.current?.present();
  }, [value]);
  const closeModal = useCallback(() => modalRef.current?.dismiss(), []);

  const displayValue = value
    ? isSameDay(value, new Date())
      ? `Today, ${format(value, "MMM d")}`
      : formatDisplayDate(value)
    : "Select date...";

  const applyTime = useCallback(
    (h: number, m: number, am: boolean) => {
      const h24 = am ? h % 12 : (h % 12) + 12;
      setPickerDate(setMinutes(setHours(pickerDate, h24), m));
    },
    [pickerDate],
  );

  const handleDone = useCallback(() => {
    const h = parseInt(hourStr, 10) || 12;
    const m = Math.min(59, parseInt(minStr, 10) || 0);
    const h24 = isAm ? h % 12 : (h % 12) + 12;
    onChange(setMinutes(setHours(pickerDate, h24), m));
    closeModal();
  }, [pickerDate, hourStr, minStr, isAm, onChange, closeModal]);

  const setQuick = useCallback((mode: QuickMode) => {
    setQuickMode(mode);
    const d = new Date();
    if (mode === "today") {
      setPickerDate(d);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    } else {
      const yesterday = addDays(d, -1);
      setPickerDate(yesterday);
      setViewMonth(yesterday.getMonth());
      setViewYear(yesterday.getFullYear());
    }
  }, []);

  const viewDate = useMemo(
    () => new Date(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const prevMonth = useCallback(() => {
    const prev = subMonths(viewDate, 1);
    setViewMonth(prev.getMonth());
    setViewYear(prev.getFullYear());
  }, [viewDate]);

  const nextMonth = useCallback(() => {
    const next = addMonths(viewDate, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  }, [viewDate]);

  const onSelectDay = useCallback(
    (date: Date) => {
      const newDate = setMinutes(
        setHours(date, getHours(pickerDate)),
        getMinutes(pickerDate),
      );
      setPickerDate(newDate);
      const t = new Date();
      const yesterday = addDays(t, -1);
      setQuickMode(
        isSameDay(date, t)
          ? "today"
          : isSameDay(date, yesterday)
            ? "yesterday"
            : "today",
      );
    },
    [pickerDate],
  );

  const handleHourBlur = useCallback(() => {
    const h = parseInt(hourStr, 10);
    if (!Number.isNaN(h))
      applyTime(Math.min(12, Math.max(1, h)), parseInt(minStr, 10) || 0, isAm);
  }, [hourStr, minStr, isAm, applyTime]);

  const handleMinBlur = useCallback(() => {
    const m = parseInt(minStr, 10);
    if (!Number.isNaN(m))
      applyTime(
        parseInt(hourStr, 10) || 12,
        Math.min(59, Math.max(0, m)),
        isAm,
      );
  }, [hourStr, minStr, isAm, applyTime]);

  const snapPoints = useMemo(() => ["80%"], []);
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

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  return (
    <>
      {/* <Pressable style={[styles.select, style]} onPress={openModal}>
        <View style={styles.leftSection}>
          <View style={styles.textSection}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {displayValue}
            </Text>
          </View>
        </View>
        <MaterialIcons name="expand-more" size={20} color={colors.gray[500]} />
      </Pressable> */}
      <View style={style}>
        {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
        <Pressable
          style={[
            styles.select,
            {
              backgroundColor: backgroundColor ?? colors.cardBackground,
              borderColor: borderColor ?? colors.slate[700],
            },
            error && styles.selectError,
          ]}
          onPress={openModal}
        >
          <Text
            style={[styles.value, !value && styles.valuePlaceholder]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={calendarIconColor ?? colors.gray[500]}
          />
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        backgroundStyle={styles.modalBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <Pressable onPress={handleDone}>
              <Text style={styles.doneButton}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.quickRow}>
            {(["today", "yesterday"] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.quickBtn,
                  quickMode === mode && styles.quickBtnSelected,
                ]}
                onPress={() => setQuick(mode)}
              >
                <Text
                  style={[
                    styles.quickBtnText,
                    quickMode === mode && styles.quickBtnTextSelected,
                  ]}
                >
                  {mode === "today" ? "Today" : "Yesterday"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.chevron}>
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {format(viewDate, "MMMM yyyy")}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.chevron}>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w, i) => (
              <Text key={i} style={styles.weekday}>
                {w}
              </Text>
            ))}
          </View>

          <FlatList
            key="calendar-list-5"
            data={cells}
            numColumns={7}
            keyExtractor={(_, index) => `day-${index}`}
            renderItem={({ item }) => {
              const { date, currentMonth } = item;
              const selected = isSameDay(date, pickerDate);
              return (
                <TouchableOpacity
                  style={[
                    styles.dayCell,
                    !currentMonth && styles.dayCellOther,
                    selected && styles.dayCellSelected,
                  ]}
                  onPress={() => onSelectDay(date)}
                >
                  {selected ? (
                    <View style={styles.dayCellSelectedInner}>
                      <Text style={[styles.dayText, styles.dayTextSelected]}>
                        {date.getDate()}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.dayText,
                        !currentMonth && styles.dayTextOther,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            style={[
              styles.calendarGrid,
              { backgroundColor: colors.cardBackground },
            ]}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Time</Text>
            <View style={styles.timeInputRow}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={styles.timeInput}
                  value={hourStr}
                  onChangeText={setHourStr}
                  onBlur={handleHourBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="12"
                />
                <Text style={styles.timeColon}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={minStr}
                  onChangeText={(t) =>
                    setMinStr(t.padStart(2, "0").slice(0, 2))
                  }
                  onBlur={handleMinBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="00"
                />

                <View style={styles.ampmRow}>
                  <TouchableOpacity
                    style={[styles.ampmBtn, isAm && styles.ampmBtnSelected]}
                    onPress={() => {
                      setIsAm(true);
                      applyTime(
                        parseInt(hourStr, 10) || 12,
                        parseInt(minStr, 10) || 0,
                        true,
                      );
                    }}
                  >
                    <Text
                      style={[styles.ampmText, isAm && styles.ampmTextSelected]}
                    >
                      AM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.ampmBtn, !isAm && styles.ampmBtnSelected]}
                    onPress={() => {
                      setIsAm(false);
                      applyTime(
                        parseInt(hourStr, 10) || 12,
                        parseInt(minStr, 10) || 0,
                        false,
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.ampmText,
                        !isAm && styles.ampmTextSelected,
                      ]}
                    >
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

function toDate(v: unknown): Date | undefined {
  if (v instanceof Date) return v;
  if (typeof v === "string") return new Date(v);
  return undefined;
}

export const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}) => {
  const [field, meta, helpers] = useField<Date | string | undefined>({
    name,
    validate: (val) => {
      const d = toDate(val);
      const empty = d == null || Number.isNaN(d.getTime());
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return validate ? validate(d) : undefined;
    },
  });
  const value = toDate(field.value);
  const error =
    errorOverride ??
    (showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined);
  return (
    <DatePickerUI
      value={value}
      onChange={(date) => {
        helpers.setValue(date);
        helpers.setTouched(true);
      }}
      error={error}
      {...rest}
    />
  );
};

export { DatePickerUI as DatePicker };
export default DatePickerUI;
