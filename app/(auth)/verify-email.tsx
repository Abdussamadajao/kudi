import { AuthBgDecor } from "@/features/auth/components/auth-bg-decor";
import Logo from "@/ui/logo";
import Button from "@/ui/button";
import { ThemedKeyboardAvoidingView } from "@/ui/themed-keyboard-avoiding-view";
import { border, fonts, ThemePalette } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/provider/snackbar";
import { useTheme } from "@/provider/theme-provider";
import { useAuthStore } from "@/stores";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { OtpInput, type OtpInputRef } from "react-native-otp-entry";
import * as Yup from "yup";

const OTP_DIGITS = 6;
const OTP_RESEND_SECONDS = 10 * 60;

function formatMMSS(totalSeconds: number) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export default function VerifyEmail() {
  const router = useRouter();
  const { snackbar } = useSnackbar();
  const { colors } = useTheme();
  const { unverifiedEmail, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRef = useRef<OtpInputRef | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secondsLeft]);

  const onSubmit = async (values: { code: string }) => {
    try {
      await authClient.emailOtp.verifyEmail(
        {
          email: unverifiedEmail as string,
          otp: values.code,
        },
        {
          onSuccess: (context) => {
            setUser({
              user: context.data.user,
              session: context.data.session,
            });
            snackbar({
              message: "Email verified successfully",
              type: "success",
            });
            setIsLoading(false);
            router.replace("/login");
          },
          onError: () => {
            snackbar({
              message: "Failed to verify email",
              type: "error",
            });
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedKeyboardAvoidingView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Button style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.textPrimary}
            />
          </Button>
        </View>

        <View style={styles.card}>
          <View style={styles.decor} />

          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              Enter the {OTP_DIGITS}-digit code we sent to your inbox.
            </Text>
          </View>

          <Formik
            initialValues={{ code: "" }}
            validationSchema={Yup.object({
              code: Yup.string()
                .matches(/^\d{6}$/, "Enter the 6-digit code")
                .required("Enter the 6-digit code"),
            })}
            onSubmit={(values) => onSubmit(values)}
          >
            {({ values, setFieldValue, submitForm }) => {
              const canVerify = /^\d{6}$/.test(values.code);

              const onResend = () => {
                setSecondsLeft(OTP_RESEND_SECONDS);
                snackbar({
                  message: "Resent verification code (UI)",
                  type: "info",
                });
                setFieldValue("code", "");
                otpRef.current?.clear();
                setTimeout(() => otpRef.current?.focus(), 0);
              };

              return (
                <>
                  <View style={styles.otpRow}>
                    <OtpInput
                      ref={(r) => {
                        otpRef.current = r;
                      }}
                      numberOfDigits={OTP_DIGITS}
                      type="numeric"
                      autoFocus
                      hideStick
                      focusColor={colors.primary}
                      onTextChange={(text) => setFieldValue("code", text)}
                      onFilled={(text) => setFieldValue("code", text)}
                      blurOnFilled={false}
                      theme={{
                        containerStyle: { width: "auto" },
                        pinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background,
                          borderWidth: 1,
                          borderColor: colors.gray[200],
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        pinCodeTextStyle: {
                          fontSize: 18,
                          fontWeight: "700",
                          color: colors.textPrimary,
                          fontFamily: fonts.Manrope.Bold,
                        },
                        placeholderTextStyle: {
                          fontSize: 18,
                          fontWeight: "700",
                          color: colors.textSecondary,
                          fontFamily: fonts.Manrope.Bold,
                        },
                        focusedPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background,
                          borderWidth: 1,
                          borderColor: colors.primary,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        filledPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background,
                          borderWidth: 1,
                          borderColor: colors.primary,
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        disabledPinCodeContainerStyle: {
                          width: 44,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor: colors.background,
                          borderWidth: 1,
                          borderColor: colors.gray[200],
                          marginHorizontal: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: 0.6,
                        },
                      }}
                    />
                  </View>

                  <Button
                    style={styles.submitBtn}
                    onPress={() => submitForm()}
                    disabled={!canVerify}
                    loading={isLoading}
                  >
                    <Text style={styles.submitText}>Verify</Text>
                  </Button>

                  <Button
                    style={[
                      styles.linkBtn,
                      { alignSelf: "center", marginTop: 8 },
                    ]}
                    onPress={onResend}
                    disabled={secondsLeft > 0}
                  >
                    <Text style={styles.footerLink}>
                      {secondsLeft > 0
                        ? `Resend in ${formatMMSS(secondsLeft)}`
                        : "Resend code"}
                    </Text>
                  </Button>
                </>
              );
            }}
          </Formik>
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
    header: { marginBottom: 20, alignItems: "center" },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
      fontFamily: fonts.Manrope.Bold,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      fontFamily: fonts.Manrope.Regular,
      lineHeight: 20,
    },
    otpRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginTop: 18,
      marginBottom: 16,
    },
    otpBox: {
      width: 44,
      height: 52,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.gray[200],
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: fonts.Manrope.Bold,
    },
    submitBtn: {
      height: 54,
      borderRadius: border.borderRadius.full,
      marginBottom: 12,
    },
    submitText: {
      fontSize: 16,
      fontWeight: "700",
      color: "white",
      fontFamily: fonts.Manrope.Bold,
    },
    linkBtn: {
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
