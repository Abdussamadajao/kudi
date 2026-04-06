import { useTheme } from "@/provider/theme-provider";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  style,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.surfaceVariant
        : variant === "tertiary"
          ? colors.surfaceContainerHigh
          : "transparent";
  const borderColor =
    variant === "ghost"
      ? colors.outlineVariant
      : variant === "secondary"
        ? colors.outlineVariant
        : "transparent";
  const indicatorColor =
    variant === "primary" ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: borderColor === "transparent" ? 0 : 1,
        },
        disabled && {
          opacity: 0.5,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    padding: 12,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
