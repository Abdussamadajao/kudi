import { fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
type AvatarVariant = "circle" | "rounded" | "square";
type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps {
  /** Image URI */
  uri?: string;
  /** Name used to derive initials when no image is available */
  name?: string;
  /** Explicit initials override (max 2 chars) */
  initials?: string;
  /** Preset or custom pixel size (controls the outer wrap) */
  size?: AvatarSize;
  /** Shape variant */
  variant?: AvatarVariant;
  /** Presence dot */
  status?: AvatarStatus;
  /** Border colour on the outer wrap */
  borderColor?: string;
  /** Background colour for the initials fallback */
  color?: string;
  /** Called when avatar is tapped */
  onPress?: () => void;
  /** Extra style on the outer wrap */
  style?: ViewStyle;
  /** Extra style on the initials text */
  textStyle?: TextStyle;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<string, number> = {
  xs: 28,
  sm: 36,
  md: 46, // matches your default (46 wrap / 40 img)
  lg: 56,
  xl: 68,
  "2xl": 84,
};

/** How many pixels smaller the inner image is vs the outer wrap */
const INNER_INSET = 6;
const BORDER_WIDTH = 2;

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "#22C55E",
  offline: "#94A3B8",
  away: "#F59E0B",
  busy: "#EF4444",
};

const INITIALS_PALETTE = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#14B8A6",
  "#0EA5E9",
  "#F97316",
  "#84CC16",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveSize(size: AvatarSize): number {
  if (typeof size === "number") return size;
  return SIZE_MAP[size] ?? SIZE_MAP.md;
}

function getInitials(name?: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pickColor(name?: string): string {
  if (!name) return INITIALS_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return INITIALS_PALETTE[Math.abs(hash) % INITIALS_PALETTE.length];
}

function radiusFor(variant: AvatarVariant, size: number): number {
  if (variant === "circle") return size / 2;
  if (variant === "rounded") return size * 0.22;
  return 4;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  initials,
  size = "md",
  variant = "circle",
  status,
  borderColor,
  color,
  onPress,
  style,
  textStyle,
}) => {
  const [imgError, setImgError] = useState(false);
  const { colors } = useTheme();
  const wrapSize = resolveSize(size);
  const imgSize = wrapSize - INNER_INSET;
  const wrapRadius = radiusFor(variant, wrapSize);
  const imgRadius = radiusFor(variant, imgSize);
  const bgColor = color ?? pickColor(name);
  const showImage = !!uri && !imgError;

  const badgeSize = Math.max(Math.round(wrapSize * 0.27), 8);
  const badgeOffset = Math.round(wrapSize * 0.03);

  const inner = (
    <View
      style={[
        styles.wrap,
        {
          width: wrapSize,
          height: wrapSize,
          borderRadius: wrapRadius,
          borderColor: borderColor ?? colors.secondary,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: imgSize, height: imgSize, borderRadius: imgRadius }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={[
            styles.initialsWrap,
            {
              width: imgSize,
              height: imgSize,
              borderRadius: imgRadius,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              { fontSize: imgSize * 0.36 },
              textStyle,
            ]}
          >
            {getInitials(name, initials)}
          </Text>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: STATUS_COLORS[status],
              bottom: badgeOffset,
              right: badgeOffset,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
};

// ─── Avatar Group ─────────────────────────────────────────────────────────────

export interface AvatarGroupProps {
  avatars: Pick<AvatarProps, "uri" | "name" | "initials" | "color">[];
  size?: AvatarSize;
  variant?: AvatarVariant;
  borderColor?: string;
  max?: number;
  overlap?: number;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = "md",
  variant = "circle",
  borderColor = "#FFFFFF",
  max = 4,
  overlap,
  style,
}) => {
  const px = resolveSize(size);
  const gap = overlap ?? Math.round(px * 0.3);
  const visible = avatars.slice(0, max);
  const extra = avatars.length - max;

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {visible.map((a, i) => (
        <View
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -gap, zIndex: visible.length - i }}
        >
          <Avatar
            {...a}
            size={size}
            variant={variant}
            borderColor={borderColor}
          />
        </View>
      ))}

      {extra > 0 && (
        <View style={{ marginLeft: -gap, zIndex: 0 }}>
          <Avatar
            initials={`+${extra}`}
            size={size}
            variant={variant}
            color="#475569"
            borderColor={borderColor}
          />
        </View>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrap: {
    borderWidth: BORDER_WIDTH,
    borderStyle: "solid",
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#FFFFFF",
    fontFamily: fonts.Manrope.SemiBold,
    letterSpacing: 0.5,
    includeFontPadding: false,
    textTransform: "uppercase",
  },
  badge: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default Avatar;
