import { AuthBgDecor } from "@/features/auth/components/auth-bg-decor";
import { FormikTextfield } from "@/ui/form/text-field";
import Logo from "@/ui/logo";
import Button from "@/ui/button";
import { ThemedKeyboardAvoidingView } from "@/ui/themed-keyboard-avoiding-view";
import { border, fonts, ThemePalette } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/provider/snackbar";
import { useTheme } from "@/provider/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

type Values = { email: string };

const initialValues: Values = { email: "" };

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles(createStyles);
  const { snackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (values: Values) => {
    setIsSubmitting(true);
    await authClient.emailOtp
      .requestPasswordReset(
        {
          email: values.email,
        },
        {
          onSuccess: () => {
            snackbar({
              message: "Password reset request sent",
              type: "success",
            });
            setIsSubmitting(false);
          },
          onError: () => {
            snackbar({
              message: "Failed to send reset link",
              type: "error",
            });
            setIsSubmitting(false);
          },
        },
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ThemedKeyboardAvoidingView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.decor} />
          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we’ll send you a link to reset your password.
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ handleSubmit }) => (
              <>
                <FormikTextfield
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  leftIcon={
                    <MaterialIcons
                      name="mail"
                      size={22}
                      color={colors.gray[500]}
                    />
                  }
                  containerStyle={styles.inputRow}
                />
                <Button
                  style={styles.submitBtn}
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                >
                  <Text style={styles.submitText}>Send reset link</Text>
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.footer}>
            <Button
              style={styles.linkBtn}
              onPress={() => router.replace("/(auth)/login")}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.footerLink}>Back to sign in</Text>
            </Button>
          </View>
        </View>
        <AuthBgDecor />
      </ScrollView>
    </ThemedKeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1 },
    scroll: {
      flexGrow: 1,
      padding: 24,
      paddingBottom: 48,
      justifyContent: "center",
    },
    topRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backBtn: {
      backgroundColor: "transparent",
      height: undefined,
      paddingVertical: 8,
      paddingHorizontal: 8,
      marginLeft: -8,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: border.borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      overflow: "hidden",
    },
    decor: {
      position: "absolute",
      top: -60,
      right: -60,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.primary + "20",
    },
    header: { marginBottom: 24, alignItems: "center" },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
      fontFamily: fonts.Manrope.Bold,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      fontFamily: fonts.Manrope.Regular,
    },
    inputRow: { marginBottom: 16 },
    submitBtn: {
      height: 54,
      marginBottom: 16,
      borderRadius: border.borderRadius.full,
    },
    submitText: {
      fontSize: 16,
      fontWeight: "700",
      color: "white",
      fontFamily: fonts.Manrope.Bold,
    },
    footer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    linkBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: "transparent",
      height: undefined,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: fonts.Manrope.Bold,
    },
  });
