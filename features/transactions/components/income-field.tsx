import { fonts } from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import { useField } from "formik";
import React, { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export type IncomeFieldProps = {
  value: string;
  onChangeText: (raw: string) => void;
  onBlur?: () => void;
  currencySymbol?: string;
  maxLength?: number;
  /** Overrides theme primary for currency + amount (e.g. danger when over limit). */
  accentColor?: string;
};

function sanitizeRaw(text: string, maxRawLen: number): string {
  let t = text.replace(/,/g, "").replace(/[^\d.]/g, "");
  const dot = t.indexOf(".");
  if (dot !== -1) {
    t =
      t.slice(0, dot + 1) +
      t
        .slice(dot + 1)
        .replace(/\./g, "")
        .slice(0, 2);
  }
  if (t.startsWith(".")) t = `0${t}`;
  return t.slice(0, maxRawLen);
}

function formatDisplay(raw: string): string {
  if (!raw) return "";
  const trailingDot = raw.endsWith(".") && raw.split(".").length === 2;
  const body = trailingDot ? raw.slice(0, -1) : raw;
  const [intPart = "", decPart] = body.split(".");
  const intDigits = intPart.replace(/\D/g, "");
  const decDigits =
    decPart !== undefined ? decPart.replace(/\D/g, "").slice(0, 2) : undefined;

  let intFormatted = "";
  if (intDigits !== "") {
    const trimmed = intDigits.replace(/^0+/, "") || "0";
    const n = parseInt(trimmed, 10);
    intFormatted = Number.isNaN(n) ? intDigits : n.toLocaleString("en-NG");
  }

  if (trailingDot) {
    return intFormatted === "" ? "." : `${intFormatted}.`;
  }
  if (decPart !== undefined) {
    const whole = intFormatted === "" ? "0" : intFormatted;
    return `${whole}.${decDigits ?? ""}`;
  }
  return intFormatted;
}

function getDisplayFontSize(raw: string): number {
  const display = formatDisplay(raw) || "0";
  const len = display.length;
  if (len <= 7) return 52;
  if (len <= 10) return 44;
  if (len <= 13) return 36;
  return 28;
}

export function IncomeField({
  value,
  onChangeText,
  onBlur,
  currencySymbol = "₦",
  maxLength = 14,
  accentColor,
}: IncomeFieldProps) {
  const { colors } = useTheme();
  const displaySize = getDisplayFontSize(value);
  const displayValue = formatDisplay(value);
  const tint = accentColor ?? colors.primary;

  const handleAmountChange = (text: string) => {
    onChangeText(sanitizeRaw(text, maxLength));
  };

  return (
    <View style={styles.amountSection}>
      <View style={styles.amountRow}>
        <Text
          style={[
            styles.currencySymbol,
            {
              fontSize: displaySize,
              color: tint,
              lineHeight: displaySize * 0.95,
            },
          ]}
        >
          {currencySymbol}
        </Text>
        <TextInput
          style={[
            styles.amountDisplay,
            { fontSize: displaySize, color: tint },
          ]}
          value={displayValue}
          onChangeText={handleAmountChange}
          onBlur={onBlur}
          keyboardType="decimal-pad"
          selectionColor={tint}
          cursorColor={tint}
          placeholder="0.00"
          placeholderTextColor={tint + "55"}
        />
      </View>
      <Text style={[styles.amountHint, { color: colors.onSurfaceVariant }]}>
        ENTER AMOUNT
      </Text>
    </View>
  );
}

export type FormikIncomeFieldProps = Omit<
  IncomeFieldProps,
  "value" | "onChangeText" | "onBlur"
> & {
  name: string;
  validate?: (value: string) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
  error?: string;
};

export function FormikIncomeField({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  currencySymbol,
  maxLength,
  accentColor,
}: FormikIncomeFieldProps) {
  const { colors } = useTheme();
  const stylesFormik = useMemo(
    () =>
      StyleSheet.create({
        wrap: { alignSelf: "stretch" },
        errorText: {
          color: colors.danger,
          fontSize: 12,
          marginTop: 6,
          marginLeft: 4,
          fontFamily: fonts.Manrope.Medium,
        },
      }),
    [colors],
  );

  const [field, meta, helpers] = useField<string>({
    name,
    validate: (val: string) => {
      if (!required && !val) return undefined;
      return validate ? validate(val) : undefined;
    },
  });

  const error =
    errorOverride ?? (showFormikError && meta.touched ? meta.error : undefined);

  return (
    <View style={stylesFormik.wrap}>
      <IncomeField
        value={field.value ?? ""}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true, true)}
        currencySymbol={currencySymbol}
        maxLength={maxLength}
        accentColor={accentColor}
      />
      {error ? <Text style={stylesFormik.errorText}>{error}</Text> : null}
    </View>
  );
}

export default IncomeField;

const styles = StyleSheet.create({
  amountSection: {
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  currencySymbol: {
    fontFamily: fonts.Manrope.Bold,
    marginBottom: 2,
  },
  amountDisplay: {
    fontFamily: fonts.Manrope.Bold,
    letterSpacing: -1,
    minWidth: 80,
    padding: 0,
    includeFontPadding: false,
  },
  amountHint: {
    fontFamily: fonts.Manrope.SemiBold,
    fontSize: 11,
    letterSpacing: 2.5,
    marginTop: 10,
    textAlign: "center",
  },
});
