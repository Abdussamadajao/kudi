import { FormSwitch } from "@/ui/switch";
import type { ThemePalette } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = keyof typeof MaterialIcons.glyphMap;

function RowDivider({ colors }: { colors: ThemePalette }) {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border + "33" },
      ]}
    />
  );
}

export function SettingsChevronRow({
  icon,
  label,
  colors,
  onPress,
  showDivider = true,
}: {
  icon: IconName;
  label: string;
  colors: ThemePalette;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && { opacity: 0.85 },
        ]}
        accessibilityRole="button"
      >
        <MaterialIcons name={icon} size={22} color={colors.primary} />
        <Text style={[styles.rowLabel, { color: colors.onSurface }]}>
          {label}
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={colors.icons}
        />
      </Pressable>
      {showDivider ? <RowDivider colors={colors} /> : null}
    </>
  );
}

export function SettingsValueRow({
  label,
  value,
  valueAccent,
  colors,
  showDivider = true,
}: {
  label: string;
  value: string;
  valueAccent?: boolean;
  colors: ThemePalette;
  showDivider?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: colors.onSurface }]}>
          {label}
        </Text>
        <Text
          style={[
            styles.valueText,
            {
              color: valueAccent ? colors.primary : colors.onSurface,
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      {showDivider ? <RowDivider colors={colors} /> : null}
    </>
  );
}

export function SettingsToggleRow({
  label,
  value,
  onValueChange,
  colors,
  showDivider = true,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ThemePalette;
  showDivider?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: colors.onSurface }]}>
          {label}
        </Text>
        <FormSwitch
          value={value}
          onChange={onValueChange}
          trackColors={{
            on: colors.primary,
            off: colors.surfaceContainerHigh,
          }}
        />
      </View>
      {showDivider ? <RowDivider colors={colors} /> : null}
    </>
  );
}

export function SettingsThemeRow({
  label,
  children,
  colors,
  showDivider = true,
}: {
  label: string;
  children: React.ReactNode;
  colors: ThemePalette;
  showDivider?: boolean;
}) {
  return (
    <>
      <View style={[styles.row, styles.themeRow]}>
        <Text style={[styles.rowLabel, { color: colors.onSurface }]}>
          {label}
        </Text>
        {children}
      </View>
      {showDivider ? <RowDivider colors={colors} /> : null}
    </>
  );
}

export function SettingsAccentRow({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ThemePalette;
}) {
  return (
    <View style={[styles.row, styles.accentRow]}>
      <Text
        style={[
          styles.rowLabel,
          { color: colors.onSurface, marginRight: spacing[3] },
        ]}
      >
        {label}
      </Text>
      <View style={styles.accentDots}>{children}</View>
    </View>
  );
}

export function SettingsActionRow({
  icon,
  label,
  colors,
  danger,
  onPress,
  showDivider = true,
}: {
  icon: IconName;
  label: string;
  colors: ThemePalette;
  danger?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  const tint = danger ? colors.danger : colors.onSurface;
  const iconColor = danger ? colors.danger : colors.primary;
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && { opacity: 0.85 },
        ]}
        accessibilityRole="button"
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
        <Text style={[styles.rowLabel, { color: tint }]}>{label}</Text>
      </Pressable>
      {showDivider ? <RowDivider colors={colors} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    minHeight: 52,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  themeRow: {
    justifyContent: "space-between",
  },
  accentRow: {
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.Inter.Medium,
    fontSize: fontSize.md,
  },
  valueText: {
    flexShrink: 1,
    fontFamily: fonts.Inter.Medium,
    fontSize: fontSize.sm,
    marginLeft: spacing[2],
    textAlign: "right",
  },
  accentDots: {
    flexDirection: "row",
    gap: spacing[3],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing[4] + 22 + spacing[3],
  },
});
