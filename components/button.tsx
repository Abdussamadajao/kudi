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
  variant?: "primary" | "secondary" | "tertiary";
  loading?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  variant,
  loading = false,
  children,
  style,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[styles.base, { backgroundColor: colors.primary }, style]}
      {...props}
    >
      {loading ? <ActivityIndicator size="small" color="white" /> : children}
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
