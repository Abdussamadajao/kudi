import { useTheme } from "@/provider/theme-provider";
import { Checkbox as ExpoCheckbox } from "expo-checkbox";
import { useField } from "formik";
import React from "react";
import { Text, View } from "react-native";

type CheckboxProps = {
  name: string;
  label?: string;
  validate?: (value: boolean) => string | undefined;
  disabled?: boolean;
  color?: string;
};

const Checkbox = ({
  name,
  label,
  validate,
  disabled,
  color: colorProp,
}: CheckboxProps) => {
  const { colors } = useTheme();
  const color = colorProp ?? colors.primary;

  const [field, meta, helpers] = useField({
    name,
    validate,
  });

  const value = Boolean(field.value);
  const error = meta.touched ? meta.error : undefined;

  return (
    <View
      style={{
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <ExpoCheckbox
        value={value}
        onValueChange={helpers.setValue}
        color={color}
        disabled={disabled}
        onBlur={() => helpers.setTouched(true)}
        style={[
          value && { backgroundColor: "transparent" },
          { borderColor: color },
        ]}
      />
      {label && (
        <Text style={{ color: colors.textPrimary }}>{label}</Text>
      )}
      {error && (
        <Text style={{ color: colors.danger }}>{error}</Text>
      )}
    </View>
  );
};

export default Checkbox;
