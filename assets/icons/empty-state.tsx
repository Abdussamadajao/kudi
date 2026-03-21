import { useTheme } from "@/provider/theme-provider";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface EmptySearchIllustrationProps {
  size?: number;
}

export default function EmptySearchIllustration({
  size = 220,
}: EmptySearchIllustrationProps) {
  const cardW = size * 0.55;
  const cardH = size * 0.5;
  const cx = size / 2;
  const cy = size / 2 - size * 0.02;
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Background radial glow */}
          <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.surface} stopOpacity="1" />
            <Stop
              offset="100%"
              stopColor={colors.surfaceBright}
              stopOpacity="1"
            />
          </RadialGradient>

          {/* Card gradient */}
          <LinearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.surface} stopOpacity="1" />
            <Stop
              offset="100%"
              stopColor={colors.surfaceBright}
              stopOpacity="1"
            />
          </LinearGradient>

          {/* Search button gradient */}
          <RadialGradient id="btnGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="btnGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#bgGlow)"
          rx={16}
        />

        {/* Subtle outer border (dashed effect via two rects) */}
        <Rect
          x={4}
          y={4}
          width={size - 8}
          height={size - 8}
          fill="none"
          stroke="#2a3f58"
          strokeWidth={1}
          strokeDasharray="4 4"
          rx={14}
        />

        {/* Card shadow glow */}
        <Rect
          x={cx - cardW / 2 - 4}
          y={cy - cardH / 2 - 4}
          width={cardW + 8}
          height={cardH + 8}
          fill="none"
          stroke="#1a3a5c"
          strokeWidth={6}
          strokeOpacity={0.4}
          rx={18}
        />

        {/* Card body */}
        <Rect
          x={cx - cardW / 2}
          y={cy - cardH / 2}
          width={cardW}
          height={cardH}
          fill="url(#cardGrad)"
          rx={14}
          stroke="#253a52"
          strokeWidth={1}
        />

        {/* Card dashed border */}
        <Rect
          x={cx - cardW / 2 + 5}
          y={cy - cardH / 2 + 5}
          width={cardW - 10}
          height={cardH - 10}
          fill="none"
          stroke="#2e4a68"
          strokeWidth={1}
          strokeDasharray="5 4"
          rx={10}
        />

        {/* Document lines */}
        <G>
          {/* Line 1 – long */}
          <Rect
            x={cx - cardW * 0.3}
            y={cy - cardH * 0.22}
            width={cardW * 0.6}
            height={cardH * 0.075}
            rx={4}
            fill="#3b5570"
          />
          {/* Line 2 – medium */}
          <Rect
            x={cx - cardW * 0.3}
            y={cy - cardH * 0.06}
            width={cardW * 0.45}
            height={cardH * 0.075}
            rx={4}
            fill="#2e4560"
          />
          {/* Line 3 – short */}
          <Rect
            x={cx - cardW * 0.3}
            y={cy + cardH * 0.1}
            width={cardW * 0.52}
            height={cardH * 0.075}
            rx={4}
            fill="#2e4560"
          />
        </G>

        {/* Search button glow halo */}
        <Circle cx={cx} cy={cy + cardH / 2} r={28} fill="url(#btnGlow)" />

        {/* Search button circle */}
        <Circle cx={cx} cy={cy + cardH / 2} r={18} fill="url(#btnGrad)" />

        {/* Search icon (magnifying glass) */}
        <G>
          {/* Lens circle */}
          <Circle
            cx={cx - 2}
            cy={cy + cardH / 2 - 3}
            r={7}
            fill="none"
            stroke="#e8fff5"
            strokeWidth={2.2}
          />
          {/* Handle */}
          <Line
            x1={cx + 3.5}
            y1={cy + cardH / 2 + 2.5}
            x2={cx + 7.5}
            y2={cy + cardH / 2 + 6.5}
            stroke="#e8fff5"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
