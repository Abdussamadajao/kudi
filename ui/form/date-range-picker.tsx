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
  getMonth,
  isSameDay,
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

function formatRangeInput(d: Date) {
  return format(d, "MMM d, yyyy");
}

export type RangeValue = { start: Date; end: Date };

type BaseDateRangePickerProps = {
  style?: StyleProp<ViewStyle>;
  label: string;
  leftIcon?: React.ReactNode;
  error?: string;
};

export type DateRangePickerProps = BaseDateRangePickerProps & {
  value?: RangeValue;
  onChange: (start: Date, end: Date) => void;
};

export type FormikDateRangePickerProps = BaseDateRangePickerProps & {
  name: string;
  validate?: (value: RangeValue | undefined) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const DateRangePickerUI: React.FC<DateRangePickerProps> = ({
  style,
  label,
  value,
  leftIcon,
  onChange,
  error,
}) => {
  const { colors } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const initialStart = value ? new Date(value.start) : new Date();
  const initialEnd = value ? new Date(value.end) : new Date();
  const [rangeStart, setRangeStart] = useState<Date>(initialStart);
  const [rangeEnd, setRangeEnd] = useState<Date>(initialEnd);
  const [viewMonth, setViewMonth] = useState(initialStart.getMonth());
  const [viewYear, setViewYear] = useState(initialStart.getFullYear());
  const [activeRangeField, setActiveRangeField] = useState<"start" | "end">(
    "start",
  );

  const openModal = useCallback(() => {
    const start = value ? new Date(value.start) : new Date();
    const end = value ? new Date(value.end) : new Date();
    setRangeStart(start);
    setRangeEnd(end);
    setViewMonth(start.getMonth());
    setViewYear(start.getFullYear());
    setActiveRangeField("start");
    modalRef.current?.present();
  }, [value]);
  const closeModal = useCallback(() => modalRef.current?.dismiss(), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        select: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: border.borderRadius.lg,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        },
        selectError: { borderColor: colors.danger, borderWidth: 1 },
        leftSection: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        },
        iconWrapper: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${colors.primary}20`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        },
        textSection: { flex: 1 },
        label: {
          fontSize: 12,
          fontFamily: fonts.Manrope.Regular,
          color: colors.textSecondary,
          marginBottom: 2,
        },
        value: {
          fontSize: 16,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
        },
        modalBackground: {
          backgroundColor: colors.surfaceContainer,
          borderTopLeftRadius: border.borderRadius.xl,
          borderTopRightRadius: border.borderRadius.xl,
        },
        handleIndicator: {
          backgroundColor: colors.slate[400],
          width: 40,
          height: 4,
        },
        modalContent: { paddingBottom: 40 },
        modalHeader: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingTop: 4,
          paddingBottom: 16,
        },
        headerSide: {
          width: 56,
          flexDirection: "row",
          alignItems: "center",
        },
        headerSideRight: { justifyContent: "flex-end" },
        modalTitle: {
          flex: 1,
          fontSize: 17,
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
          textAlign: "center",
        },
        brandMark: {
          fontSize: 13,
          fontFamily: fonts.Manrope.ExtraBold,
          color: colors.primary,
          letterSpacing: 0.5,
        },
        activeRangeCard: {
          marginHorizontal: 16,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: border.borderRadius.xl,
          backgroundColor: colors.surfaceContainerHigh,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        },
        activeRangeLabel: {
          fontSize: 10,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textSecondary,
          letterSpacing: 0.6,
          marginBottom: 10,
        },
        activeRangeRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        },
        activeRangeDateBtn: {
          flex: 1,
          minWidth: 0,
        },
        activeRangeDateText: {
          fontSize: 14,
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
        },
        activeRangeArrow: {
          paddingHorizontal: 4,
        },
        monthRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          paddingTop: 22,
        },
        chevronBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.surfaceContainerHigh,
          alignItems: "center",
          justifyContent: "center",
        },
        monthYear: {
          fontSize: 18,
          fontFamily: fonts.Manrope.Bold,
          color: colors.textPrimary,
        },
        weekdayRow: {
          flexDirection: "row",
          paddingHorizontal: 12,
          paddingTop: 18,
          justifyContent: "space-around",
        },
        weekday: {
          width: 36,
          textAlign: "center",
          fontSize: 11,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textSecondary,
        },
        calendarGrid: {
          backgroundColor: "transparent",
        },
        dayCell: {
          width: "14.28%",
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        dayCellSelectedInner: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        dayText: {
          fontSize: 15,
          fontFamily: fonts.Manrope.Medium,
          color: colors.textPrimary,
        },
        dayTextOther: { color: colors.textSecondary, opacity: 0.45 },
        dayTextInRange: { color: colors.textPrimary },
        dayTextSelected: { color: "#fff" },
        applyRangeSection: {
          paddingHorizontal: 16,
          paddingTop: 28,
          marginTop: 8,
        },
        applyRangeBtn: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          paddingVertical: 16,
          borderRadius: border.borderRadius.full,
          gap: 10,
        },
        applyRangeBtnText: {
          fontSize: 16,
          fontFamily: fonts.Manrope.Bold,
          color: "#0F172A",
        },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 4,
          fontFamily: fonts.Manrope.Medium,
        },
      }),
    [colors],
  );

  const displayValue = value
    ? `${format(value.start, "d MMM")} - ${format(value.end, "d MMM yyyy")}`
    : "Select range...";

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

  const onSelectDayRange = useCallback(
    (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      if (activeRangeField === "start") {
        setRangeStart(d);
        setRangeEnd(d);
        setActiveRangeField("end");
      } else {
        const end =
          d.getTime() >= rangeStart.getTime() ? d : new Date(rangeStart);
        const start =
          d.getTime() >= rangeStart.getTime()
            ? new Date(rangeStart)
            : new Date(d);
        setRangeStart(start);
        setRangeEnd(end);
      }
    },
    [activeRangeField, rangeStart],
  );

  const handleApplyRange = useCallback(() => {
    const start = new Date(rangeStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(rangeEnd);
    end.setHours(23, 59, 59, 999);
    onChange(start, end);
    closeModal();
  }, [rangeStart, rangeEnd, onChange, closeModal]);

  const isInRange = useCallback(
    (date: Date) => {
      const t = date.getTime();
      const s = rangeStart.getTime();
      const e = rangeEnd.getTime();
      return t >= s && t <= e;
    },
    [rangeStart, rangeEnd],
  );

  const rangeCellStyle = useCallback(
    (date: Date, inRange: boolean) => {
      if (!inRange) return null;
      const prev = addDays(date, -1);
      const next = addDays(date, 1);
      const prevInRange = isInRange(prev);
      const nextInRange = isInRange(next);
      const radius = border.borderRadius.full;
      return {
        backgroundColor: `${colors.primary}28`,
        ...(prevInRange
          ? {}
          : { borderTopLeftRadius: radius, borderBottomLeftRadius: radius }),
        ...(nextInRange
          ? {}
          : { borderTopRightRadius: radius, borderBottomRightRadius: radius }),
      };
    },
    [isInRange, colors.primary],
  );

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
      <View style={style}>
        <Pressable
          style={[styles.select, error && styles.selectError]}
          onPress={openModal}
        >
          <View style={styles.leftSection}>
            <View style={styles.iconWrapper}>
              {leftIcon ?? (
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={colors.primary}
                />
              )}
            </View>
            <View style={styles.textSection}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value} numberOfLines={1}>
                {displayValue}
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="expand-more"
            size={20}
            color={colors.textSecondary}
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
            <View style={styles.headerSide}>
              <Pressable onPress={closeModal} hitSlop={12}>
                <MaterialIcons name="close" size={24} color={colors.primary} />
              </Pressable>
            </View>
            <Text style={styles.modalTitle}>Select Dates</Text>
            <View style={[styles.headerSide, styles.headerSideRight]}>
              <Text style={styles.brandMark}>Ini </Text>
            </View>
          </View>

          <View style={styles.activeRangeCard}>
            <Text style={styles.activeRangeLabel}>ACTIVE RANGE</Text>
            <View style={styles.activeRangeRow}>
              <Pressable
                style={styles.activeRangeDateBtn}
                onPress={() => {
                  setActiveRangeField("start");
                  setViewMonth(rangeStart.getMonth());
                  setViewYear(rangeStart.getFullYear());
                }}
              >
                <Text
                  style={[
                    styles.activeRangeDateText,
                    {
                      color:
                        activeRangeField === "start"
                          ? colors.primary
                          : colors.textPrimary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {formatRangeInput(rangeStart)}
                </Text>
              </Pressable>
              <View style={styles.activeRangeArrow}>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Pressable
                style={styles.activeRangeDateBtn}
                onPress={() => {
                  setActiveRangeField("end");
                  setViewMonth(rangeEnd.getMonth());
                  setViewYear(rangeEnd.getFullYear());
                }}
              >
                <Text
                  style={[
                    styles.activeRangeDateText,
                    {
                      color:
                        activeRangeField === "end"
                          ? colors.primary
                          : colors.textPrimary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {formatRangeInput(rangeEnd)}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.chevronBtn}>
              <MaterialIcons
                name="chevron-left"
                size={22}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {format(viewDate, "MMMM yyyy")}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.chevronBtn}>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={colors.textPrimary}
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
            key="range-calendar"
            data={cells}
            numColumns={7}
            keyExtractor={(_, index) => `range-day-${index}`}
            renderItem={({ item }) => {
              const { date, currentMonth } = item;
              const inRangeBand = isInRange(date);
              const isStart = isSameDay(date, rangeStart);
              const isEnd = isSameDay(date, rangeEnd);
              return (
                <TouchableOpacity
                  style={[
                    styles.dayCell,
                    inRangeBand && rangeCellStyle(date, true),
                  ]}
                  onPress={() => onSelectDayRange(date)}
                  activeOpacity={0.85}
                >
                  {isStart || isEnd ? (
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
                        inRangeBand && styles.dayTextInRange,
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
            style={styles.calendarGrid}
          />
          <View style={styles.applyRangeSection}>
            <Pressable style={styles.applyRangeBtn} onPress={handleApplyRange}>
              <Text style={styles.applyRangeBtnText}>Apply Range</Text>
              <MaterialIcons name="calendar-today" size={22} color="#0F172A" />
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

function toRangeValue(v: unknown): RangeValue | undefined {
  if (v == null || typeof v !== "object") return undefined;
  const o = v as { start?: unknown; end?: unknown };
  const start =
    o.start instanceof Date
      ? o.start
      : typeof o.start === "string"
        ? new Date(o.start)
        : undefined;
  const end =
    o.end instanceof Date
      ? o.end
      : typeof o.end === "string"
        ? new Date(o.end)
        : undefined;
  if (
    !start ||
    !end ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  )
    return undefined;
  return { start, end };
}

export const FormikDateRangePicker: React.FC<FormikDateRangePickerProps> = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}) => {
  const [field, meta, helpers] = useField<
    RangeValue | { start: string; end: string } | undefined
  >({
    name,
    validate: (val) => {
      const range = toRangeValue(val);
      const empty = !range;
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return validate ? validate(range) : undefined;
    },
  });
  const value = toRangeValue(field.value);
  const error =
    errorOverride ??
    (showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined);
  return (
    <DateRangePickerUI
      value={value}
      onChange={(start, end) => {
        helpers.setValue({ start, end });
        helpers.setTouched(true);
      }}
      error={error}
      {...rest}
    />
  );
};

export { DateRangePickerUI as DateRangePicker };
export default DateRangePickerUI;
