import BlurBackdrop, { BlurBackdropProps } from "@/ui/blur-backdrop";
import DateRangePicker, {
  type RangeValue,
} from "@/ui/form/date-range-picker";
import Button from "@/ui/button";
import { border, fonts, fontSize } from "@/constants/theme";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { startOfDay, subDays } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type DateRangePreset = "today" | "this_week" | "this_month" | "custom";

export type TransactionCategoryId = string;

export type TransactionFilter = {
  dateRange: DateRangePreset;
  categoryIds: TransactionCategoryId[];
  amountMin: number;
  amountMax: number;
  customRange: RangeValue | null;
};

const AMOUNT_MIN = 0;
const AMOUNT_MAX = 1_000_000;
const THUMB = 22;
const TRACK_PAD = THUMB / 2;

const DATE_OPTIONS: { id: DateRangePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "custom", label: "Custom" },
];

const DEFAULT_CATEGORIES: {
  id: TransactionCategoryId;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "transport", label: "Transport", icon: "directions-bus" },
  { id: "shopping", label: "Shopping", icon: "shopping-bag" },
  { id: "bills", label: "Bills", icon: "receipt-long" },
  { id: "entertainment", label: "Entertainment", icon: "theater-comedy" },
  { id: "health", label: "Health", icon: "favorite" },
  { id: "investment", label: "Investment", icon: "trending-up" },
];

function defaultCustomRange(): RangeValue {
  const end = startOfDay(new Date());
  const start = subDays(end, 7);
  return { start, end };
}

export const defaultTransactionFilter: TransactionFilter = {
  dateRange: "this_month",
  categoryIds: [],
  amountMin: AMOUNT_MIN,
  amountMax: AMOUNT_MAX,
  customRange: null,
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function AmountRangeSlider({
  low,
  high,
  onChange,
  accent,
  trackBg,
  labelColor,
}: {
  low: number;
  high: number;
  onChange: (next: [number, number]) => void;
  accent: string;
  trackBg: string;
  labelColor: string;
}) {
  const [trackW, setTrackW] = useState(0);
  const dragging = useRef<"low" | "high" | null>(null);

  const valueFromX = useCallback(
    (x: number) => {
      const w = trackW;
      if (w <= 0) return AMOUNT_MIN;
      const inner = w - THUMB;
      const t = clamp((x - TRACK_PAD) / inner, 0, 1);
      return Math.round(AMOUNT_MIN + t * (AMOUNT_MAX - AMOUNT_MIN));
    },
    [trackW],
  );

  const xFromValue = useCallback(
    (v: number) => {
      const w = trackW;
      if (w <= 0) return 0;
      const inner = w - THUMB;
      const t = (v - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN);
      return TRACK_PAD + t * inner;
    },
    [trackW],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX;
          const xl = xFromValue(low);
          const xh = xFromValue(high);
          dragging.current =
            Math.abs(x - xl) <= Math.abs(x - xh) ? "low" : "high";
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX;
          const v = valueFromX(x);
          const step = 1000;
          const rounded = Math.round(v / step) * step;
          if (dragging.current === "low") {
            const next = clamp(rounded, AMOUNT_MIN, high - step);
            onChange([next, high]);
          } else {
            const next = clamp(rounded, low + step, AMOUNT_MAX);
            onChange([low, next]);
          }
        },
        onPanResponderRelease: () => {
          dragging.current = null;
        },
      }),
    [high, low, onChange, valueFromX, xFromValue],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  const lowX = xFromValue(low);
  const highX = xFromValue(high);
  const fillLeft = Math.min(lowX, highX);
  const fillW = Math.abs(highX - lowX);

  return (
    <View>
      <View
        style={[styles.sliderTrack, { backgroundColor: trackBg }]}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
        <View
          pointerEvents="none"
          style={[
            styles.sliderFill,
            {
              left: fillLeft,
              width: fillW,
              backgroundColor: accent,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.sliderThumb,
            { left: lowX - THUMB / 2, borderColor: accent },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.sliderThumb,
            { left: highX - THUMB / 2, borderColor: accent },
          ]}
        />
      </View>
      <View style={styles.sliderEnds}>
        <Text style={[styles.sliderEndText, { color: labelColor }]}>
          {formatPrice(AMOUNT_MIN)}
        </Text>
        <Text style={[styles.sliderEndText, { color: labelColor }]}>
          {formatPrice(AMOUNT_MAX)}+
        </Text>
      </View>
    </View>
  );
}

export interface TransactionsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TransactionFilter) => void;
  initial?: TransactionFilter;
  categories?: {
    id: TransactionCategoryId;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[];
}

export default function TransactionsFilterModal({
  visible,
  onClose,
  onApply,
  initial = defaultTransactionFilter,
  categories = DEFAULT_CATEGORIES,
}: TransactionsFilterModalProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();

  const [dateRange, setDateRange] = useState<DateRangePreset>(
    initial.dateRange,
  );
  const [categoryIds, setCategoryIds] = useState<TransactionCategoryId[]>(
    () => [...initial.categoryIds],
  );
  const [amountMin, setAmountMin] = useState(initial.amountMin);
  const [amountMax, setAmountMax] = useState(initial.amountMax);
  const [customRange, setCustomRange] = useState<RangeValue | null>(
    initial.customRange ?? null,
  );

  useEffect(() => {
    if (visible) modalRef.current?.present();
    else modalRef.current?.dismiss();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setDateRange(initial.dateRange);
    setCategoryIds([...initial.categoryIds]);
    setAmountMin(initial.amountMin);
    setAmountMax(initial.amountMax);
    setCustomRange(initial.customRange ?? null);
  }, [visible, initial]);

  const snapPoints = useMemo(() => ["82%"], []);

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

  const toggleCategory = (id: TransactionCategoryId) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const reset = () => {
    setDateRange(defaultTransactionFilter.dateRange);
    setCategoryIds([]);
    setAmountMin(defaultTransactionFilter.amountMin);
    setAmountMax(defaultTransactionFilter.amountMax);
    setCustomRange(null);
  };

  const apply = () => {
    const range =
      dateRange === "custom" ? (customRange ?? defaultCustomRange()) : null;
    onApply({
      dateRange,
      categoryIds,
      amountMin,
      amountMax,
      customRange: range,
    });
    modalRef.current?.dismiss();
  };

  const chipInactiveBg = colors.surfaceVariant;
  const chipActiveBg = colors.primary;
  const chipInactiveText = colors.textPrimary;
  const chipActiveText = colors.onPrimary;

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      enableDynamicSizing={false}
      enableDismissOnClose
      onDismiss={onClose}
      backgroundStyle={[
        styles.sheetBg,
        { backgroundColor: colors.surfaceContainer },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.slate[400],
        marginTop: 8,
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Filter Transactions
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          DATE RANGE
        </Text>
        <View style={styles.chipRow}>
          {DATE_OPTIONS.map((opt) => {
            const sel = dateRange === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => {
                  setDateRange(opt.id);
                  if (opt.id === "custom") {
                    setCustomRange((prev) => prev ?? defaultCustomRange());
                  }
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: sel ? chipActiveBg : chipInactiveBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: sel ? chipActiveText : chipInactiveText,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {dateRange === "custom" ? (
          <View style={styles.customRangeBlock}>
            <DateRangePicker
              label="Custom range"
              value={customRange ?? defaultCustomRange()}
              onChange={(start, end) => setCustomRange({ start, end })}
            />
          </View>
        ) : null}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          CATEGORIES
        </Text>
        <View style={styles.catGrid}>
          {categories.map((cat) => {
            const sel = categoryIds.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={[
                  styles.catTile,
                  {
                    backgroundColor: sel ? chipActiveBg : chipInactiveBg,
                    borderColor: colors.outlineVariant,
                  },
                ]}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={22}
                  color={sel ? chipActiveText : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.catLabel,
                    { color: sel ? chipActiveText : colors.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>
      <View style={styles.footer}>
        <View style={styles.amountHeader}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            AMOUNT RANGE
          </Text>
          <Text style={[styles.amountSummary, { color: colors.primary }]}>
            {formatPrice(amountMin)} – {formatPrice(amountMax)}
          </Text>
        </View>
        <AmountRangeSlider
          low={amountMin}
          high={amountMax}
          onChange={([a, b]) => {
            setAmountMin(a);
            setAmountMax(b);
          }}
          accent={colors.primary}
          trackBg={colors.surfaceContainerHigh}
          labelColor={colors.textSecondary}
        />
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            paddingTop: 16,
          }}
        >
          <Button onPress={reset} variant="ghost" style={{ flex: 1 }}>
            <Text style={[styles.resetText, { color: colors.textSecondary }]}>
              Reset
            </Text>
          </Button>
          <Button variant="primary" onPress={apply} style={{ flex: 1 }}>
            <Text style={[styles.applyBtnText, { color: "#FFFf" }]}>
              {" "}
              Apply Filters{" "}
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: border.borderRadius.xl,
    borderTopRightRadius: border.borderRadius.xl,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fonts.Manrope.Bold,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  customRangeBlock: {
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: border.borderRadius.full,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  catTile: {
    width: "31%",
    minWidth: "30%",
    aspectRatio: 1,
    maxHeight: 96,
    borderRadius: border.borderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 8,
  },
  catLabel: {
    fontSize: 11,
    fontFamily: fonts.Manrope.SemiBold,
    textAlign: "center",
  },
  amountHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  amountSummary: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.SemiBold,
  },
  sliderTrack: {
    height: THUMB,
    borderRadius: THUMB / 2,
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    height: 6,
    top: (THUMB - 6) / 2,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: "#fff",
    borderWidth: 3,
    top: 0,
  },
  sliderEnds: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderEndText: {
    fontSize: 10,
    fontFamily: fonts.Manrope.Medium,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    marginTop: 28,
    gap: 16,
  },
  resetText: {
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.SemiBold,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: border.borderRadius.lg,
    alignItems: "center",
  },
  applyBtnText: {
    fontSize: fontSize.md,
    fontFamily: fonts.Manrope.Bold,
  },
});
