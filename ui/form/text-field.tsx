import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useField } from "formik";
import React, { useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type BaseProps = TextInputProps & {
  label: string;
  leftIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  error?: string;
  border?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperText?: string;
  helperTextStyle?: StyleProp<TextStyle>;
};

type TextfieldProps = BaseProps & {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
};

type FormikTextfieldProps = BaseProps & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const TextfieldUI = ({
  label,
  leftIcon,
  secureTextEntry,
  error,
  border: borderVariant,
  style,
  value = "",
  onChangeText,
  onBlur,
  containerStyle,
  labelStyle,
  helperText,
  helperTextStyle,
  ...props
}: BaseProps & {
  value: string;
  onChangeText?: (t: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
}) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { marginBottom: 12, gap: 6 },
        label: {
          fontSize: 15,
          fontWeight: "600",
          marginBottom: 6,
          marginLeft: 4,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
        },
        inputRow: {
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          width: "100%",
          borderRadius: border.borderRadius.lg,
          backgroundColor: colors.background,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: colors.gray[200],
          fontFamily: fonts.Manrope.Regular,
        },
        inputRowError: { borderColor: colors.danger },
        leftIconWrap: { marginLeft: 1 },
        input: {
          flex: 1,
          fontSize: 16,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 2,
        },
        helperText: {
          color: colors.textSecondary,
          fontSize: 12,
          lineHeight: 16,
          marginTop: 4,
          marginLeft: 4,
          fontFamily: fonts.Manrope.Regular,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          borderVariant && { borderColor: colors.gray[300] },
          error && styles.inputRowError,
          containerStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrap}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <MaterialCommunityIcons
                name="eye"
                size={24}
                color={colors.textSecondary}
              />
            ) : (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color={colors.textSecondary}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {helperText ? (
        <Text style={[styles.helperText, helperTextStyle]}>{helperText}</Text>
      ) : null}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const Textfield = ({
  value,
  onChangeText,
  onBlur,
  error,
  ...rest
}: TextfieldProps) => (
  <TextfieldUI
    value={value ?? ""}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    {...rest}
  />
);

export const FormikTextfield = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}: FormikTextfieldProps) => {
  const [field, meta, helpers] = useField({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      return validate ? validate(val) : undefined;
    },
  });
  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);
  return (
    <TextfieldUI
      value={field.value ?? ""}
      onChangeText={helpers.setValue}
      onBlur={(e) => {
        helpers.setTouched(true);
        rest.onBlur?.(e);
      }}
      error={error}
      {...rest}
    />
  );
};

export default Textfield;
