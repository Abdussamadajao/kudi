import {
  type ThemePalette,
  border,
  fontSize,
  fonts,
  spacing,
} from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/provider/snackbar";
import { useTheme } from "@/provider/theme-provider";
import Button from "@/ui/button";
import { FormikTextfield } from "@/ui/form/text-field";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik, useFormikContext } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const symbolRegex = /[^a-zA-Z0-9]/;

const schema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/\d/, "Include a number")
    .matches(symbolRegex, "Include a symbol")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "New passwords must match"),
});

const initialValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function passwordStrength(password: string) {
  if (!password) return { score: 0, label: "" as string };
  let score = 0;
  if (password.length >= 8) score += 30;
  if (password.length >= 12) score += 15;
  if (/\d/.test(password)) score += 20;
  if (symbolRegex.test(password)) score += 20;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
  score = Math.min(100, score);
  const label =
    score === 0 ? "" : score < 40 ? "Weak" : score < 70 ? "Fair" : "Strong";
  return { score, label };
}

function strengthAccentColor(colors: ThemePalette, score: number) {
  if (score < 40) return colors.danger;
  if (score < 70) return colors.warning;
  return colors.income;
}

function NewPasswordStrength() {
  const { values } = useFormikContext<ChangePasswordValues>();
  const { colors } = useTheme();
  const { score, label } = useMemo(
    () => passwordStrength(values.newPassword),
    [values.newPassword],
  );
  const accent = strengthAccentColor(colors, score);

  if (!values.newPassword.trim()) return null;

  return (
    <View style={strengthStyles.block}>
      <View style={strengthStyles.row}>
        <Text style={[strengthStyles.strengthText, { color: accent }]}>
          {label}
        </Text>
        <Text style={[strengthStyles.strengthText, { color: accent }]}>
          {score}%
        </Text>
      </View>
      <View
        style={[
          strengthStyles.track,
          { backgroundColor: colors.surfaceContainerHigh },
        ]}
      >
        <View
          style={[
            strengthStyles.fill,
            {
              width: `${score}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

const strengthStyles = StyleSheet.create({
  block: { marginBottom: spacing[3], marginTop: -spacing[1] },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[2],
  },
  strengthText: {
    fontFamily: fonts.Inter.SemiBold,
    fontSize: fontSize.sm,
  },
  track: {
    borderRadius: border.borderRadius.full,
    height: 4,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    borderRadius: border.borderRadius.full,
    height: "100%",
  },
});

function FormCard({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.card}>{children}</View>;
}

export function ChangePasswordScreen() {
  const { colors } = useTheme();
  const { snackbar } = useSnackbar();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);
  const fieldLabelStyle = useMemo(
    () => ({
      color: colors.onSurfaceVariant,
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.xs,
      letterSpacing: 0.6,
      marginBottom: spacing[2],
      marginLeft: 0,
      textTransform: "uppercase" as const,
    }),
    [colors.onSurfaceVariant],
  );

  const fieldContainerStyle = useMemo(
    () => ({
      backgroundColor: colors.surfaceContainerLowest,
      borderColor: colors.border + "40",
      borderRadius: border.borderRadius.DEFAULT,
      borderWidth: 1,
    }),
    [colors.surfaceContainerLowest, colors.border],
  );

  const fieldInputStyle = useMemo(
    () => ({
      color: colors.onSurface,
      fontFamily: fonts.Inter.Medium,
      fontSize: fontSize.md,
    }),
    [colors.onSurface],
  );

  const onSubmit = useCallback(async (data: ChangePasswordValues) => {
    setIsPasswordChangeLoading(true);
    const payload = {
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true,
    };

    await authClient.changePassword(payload, {
      onSuccess: () => {
        snackbar({ message: "Password updated.", type: "success" });
        setIsPasswordChangeLoading(false);
      },
      onError: (context) => {
        const message =
          context.error.message ??
          "Failed to update password. Please try again.";
        snackbar({ message, type: "error" });
        setIsPasswordChangeLoading(false);
      },
    });
  }, []);
  return (
    <Formik<ChangePasswordValues>
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <SafeAreaView edges={["top"]} style={styles.safe}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerSide}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.onSurface}
              />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Change Password</Text>
            </View>
            <View style={styles.headerSide} />
          </View>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
              >
                Update your password to keep your account secure
              </Text>

              <FormCard>
                <FormikTextfield
                  name="currentPassword"
                  label="Current password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  placeholder="Enter your current password"
                />
                <FormikTextfield
                  name="newPassword"
                  label="New password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  placeholder="Enter your new password"
                  helperText="Must be at least 8 characters, include a number and a symbol."
                  helperTextStyle={{
                    color: colors.onSurfaceVariant,
                    fontFamily: fonts.Inter.Regular,
                  }}
                />
                <NewPasswordStrength />
                <FormikTextfield
                  name="confirmPassword"
                  label="Confirm new password"
                  secureTextEntry
                  labelStyle={fieldLabelStyle}
                  containerStyle={fieldContainerStyle}
                  style={fieldInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  placeholder="Confirm your new password"
                />
                <Pressable
                  onPress={() => router.push("/(auth)/forgot-password")}
                  style={styles.forgotRow}
                  hitSlop={8}
                >
                  <Text style={[styles.forgotLink, { color: colors.income }]}>
                    Forgot password?
                  </Text>
                </Pressable>
              </FormCard>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                style={styles.saveBtn}
                loading={isPasswordChangeLoading}
                onPress={() => handleSubmit()}
              >
                <Text style={[styles.saveBtnText, { color: colors.onPrimary }]}>
                  Update Password
                </Text>
                <MaterialIcons
                  name="refresh"
                  size={22}
                  color={colors.onPrimary}
                />
              </Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 48,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
    },
    headerSide: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 44,
      paddingVertical: spacing[2],
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      color: colors.onSurface,
      fontFamily: fonts.Manrope.Bold,
      fontSize: fontSize.lg,
    },
    subtitle: {
      fontFamily: fonts.Inter.Regular,
      fontSize: fontSize.sm,
      lineHeight: 20,
      marginBottom: spacing[6],
    },
    scroll: { flexGrow: 1 },
    scrollContent: {
      paddingBottom: spacing[12],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
    },
    card: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: border.borderRadius.lg,
      marginBottom: spacing[5],
      padding: spacing[4],
    },
    forgotRow: {
      alignSelf: "flex-start",
      marginTop: spacing[2],
    },
    forgotLink: {
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.sm,
    },
    footer: {
      backgroundColor: colors.background,
      paddingBottom: spacing[8],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
    },
    saveBtn: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
    },
    saveBtnText: {
      fontFamily: fonts.Inter.SemiBold,
      fontSize: fontSize.md,
    },
  });
