import { border, fonts, fontSize } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { useField } from "formik";
import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type BaseProps = Omit<TextInputProps, "multiline"> & {
  label: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

type TextAreaProps = BaseProps & {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
};

type FormikTextAreaProps = BaseProps & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

const TextAreaUI = ({
  label,
  error,
  style,
  containerStyle,
  labelStyle,
  value = "",
  onChangeText,
  onBlur,
  placeholder = "Add a description...",
  ...props
}: BaseProps & {
  value: string;
  onChangeText?: (t: string) => void;
  onBlur?: NonNullable<TextInputProps["onBlur"]>;
}) => {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { marginBottom: 18 },
        label: {
          fontSize: fontSize.sm,
          fontFamily: fonts.Manrope.SemiBold,
          color: colors.textPrimary,
          marginBottom: 8,
        },
        input: {
          minHeight: 100,
          padding: 14,
          borderRadius: border.borderRadius.lg,
          borderWidth: 1,
          fontSize: fontSize.md,
          fontFamily: fonts.Manrope.Medium,
          textAlignVertical: "top",
          backgroundColor: colors.slate[800],
          borderColor: colors.slate[700],
          color: colors.textPrimary,
        },
        inputError: { borderColor: colors.danger },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 4,
          fontFamily: fonts.Manrope.Medium,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={3}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export const TextArea = ({
  value,
  onChangeText,
  onBlur,
  error,
  ...rest
}: TextAreaProps) => (
  <TextAreaUI
    value={value ?? ""}
    onChangeText={onChangeText}
    onBlur={onBlur}
    error={error}
    {...rest}
  />
);

export const FormikTextArea = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}: FormikTextAreaProps) => {
  const [field, meta, helpers] = useField({
    name,
    validate: (val: string) => {
      if (!required && !val?.trim()) return undefined;
      if (required && !val?.trim()) return "Required";
      return validate ? validate(val) : undefined;
    },
  });
  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);
  return (
    <TextAreaUI
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

export default TextArea;
