import { border } from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  /** Defaults to border.borderRadius.DEFAULT (8) */
  borderRadius?: number;
  /** Override the base colour (defaults to surfaceVariant) */
  baseColor?: string;
  /** Override the shimmer highlight (defaults to surfaceContainerHighest) */
  highlightColor?: string;
  /** Pulse speed in ms — default 1100 */
  speed?: number;
  style?: ViewStyle;
}

// ─── Primitive ────────────────────────────────────────────────────────────────

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  borderRadius = border.borderRadius.DEFAULT,
  baseColor,
  highlightColor,
  speed = 1100,
  style,
}) => {
  const { colors } = useTheme();

  const base = baseColor ?? colors.surfaceVariant;
  const highlight = highlightColor ?? colors.surfaceContainerHighest;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: speed,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: speed,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [speed]);

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [base, highlight],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: bgColor }, style]}
    />
  );
};

// ─── Preset: List Item ────────────────────────────────────────────────────────
// Avatar circle + title + subtitle line

export const SkeletonListItem: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.row, style]}>
    <Skeleton width={46} height={46} borderRadius={border.borderRadius.full} />
    <View style={styles.listText}>
      <Skeleton width="55%" height={14} />
      <Skeleton width="38%" height={11} style={{ marginTop: 8 }} />
    </View>
  </View>
);

// ─── Preset: Card ─────────────────────────────────────────────────────────────
// Image banner + title + two body lines

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={style}>
    <Skeleton width="100%" height={156} borderRadius={border.borderRadius.lg} />
    <View style={styles.cardBody}>
      <Skeleton width="70%" height={15} />
      <Skeleton width="100%" height={12} style={{ marginTop: 10 }} />
      <Skeleton width="85%" height={12} style={{ marginTop: 6 }} />
    </View>
  </View>
);

// ─── Preset: Profile Header ───────────────────────────────────────────────────
// Matches your avatarWrap pattern (46px border wrap / 40px inner img)

export const SkeletonProfile: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.row, style]}>
    <Skeleton width={46} height={46} borderRadius={border.borderRadius.full} />
    <View style={styles.profileText}>
      <Skeleton width={130} height={15} />
      <Skeleton
        width={80}
        height={11}
        borderRadius={border.borderRadius.full}
        style={{ marginTop: 8 }}
      />
    </View>
  </View>
);

// ─── Preset: Stat Tile ────────────────────────────────────────────────────────
// Icon circle + value + label — for dashboard summary rows

export const SkeletonStat: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.statTile, style]}>
    <Skeleton width={44} height={44} borderRadius={border.borderRadius.full} />
    <Skeleton width={64} height={13} style={{ marginTop: 10 }} />
    <Skeleton width={44} height={10} style={{ marginTop: 6 }} />
  </View>
);

// ─── Preset: Transaction Row ──────────────────────────────────────────────────
// Icon + label + amount — matches typical finance list items in your app

export const SkeletonTransaction: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.row, style]}>
    <Skeleton width={40} height={40} borderRadius={border.borderRadius.lg} />
    <View style={styles.listText}>
      <Skeleton width="45%" height={13} />
      <Skeleton width="28%" height={10} style={{ marginTop: 7 }} />
    </View>
    <View style={styles.trailingAmount}>
      <Skeleton width={60} height={14} />
    </View>
  </View>
);

// ─── Utility: Repeat ─────────────────────────────────────────────────────────

export const SkeletonList: React.FC<{
  count?: number;
  gap?: number;
  renderItem: (index: number) => React.ReactNode;
  style?: ViewStyle;
}> = ({ count = 4, gap = 16, renderItem, style }) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={i > 0 ? { marginTop: gap } : undefined}>
        {renderItem(i)}
      </View>
    ))}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    flex: 1,
    marginLeft: 12,
  },
  cardBody: {
    paddingTop: 12,
  },
  profileText: {
    marginLeft: 12,
  },
  statTile: {
    alignItems: "center",
  },
  trailingAmount: {
    marginLeft: "auto",
    alignItems: "flex-end",
  },
});

export default Skeleton;
