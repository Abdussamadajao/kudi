import { useTheme } from "@/provider/theme-provider";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  type KeyboardAvoidingViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
} & Omit<
  KeyboardAvoidingViewProps,
  "behavior" | "keyboardVerticalOffset" | "style" | "children"
>;

export function ThemedKeyboardAvoidingView({
  children,
  style,
  keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0,
  ...rest
}: Props) {
  const { colors } = useTheme();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: colors.background }, style]}
        behavior={"padding"}
        keyboardVerticalOffset={keyboardVerticalOffset}
        {...rest}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
