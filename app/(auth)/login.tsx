import { AuthBgDecor } from "@/features/auth/components/auth-bg-decor";
import { FormikTextfield } from "@/ui/form/text-field";
import Logo from "@/ui/logo";
import Button from "@/ui/button";
import { ThemedKeyboardAvoidingView } from "@/ui/themed-keyboard-avoiding-view";
import { images } from "@/constants";
import { border, fonts, ThemePalette } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/provider/snackbar";
import { useTheme } from "@/provider/theme-provider";
import { useAuthStore } from "@/stores";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

type LoginValues = { email: string; password: string };

const initialValues: LoginValues = { email: "", password: "" };

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const router = useRouter();
  const { snackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { colors } = useTheme();
  const { setUser } = useAuthStore();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { setUnverifiedEmail: setUnverifiedEmailStore } = useAuthStore();

  async function getToken() {
    const { data } = await authClient.getSession();
    console.log("stored token:", data);
  }

  useEffect(() => {
    getToken();
  }, []);

  async function handleResendVerification() {
    if (!unverifiedEmail) return;
    setIsResending(true);

    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: unverifiedEmail,
          type: "email-verification" as const,
        },
        {
          onSuccess: () => {
            snackbar({
              message: "Verification email sent successfully",
              type: "success",
            });
            setIsResending(false);
          },
          onError: () => {
            snackbar({
              message: "Failed to send verification email",
              type: "error",
            });
            setIsResending(false); // ✅ missing before
          },
        },
      );
    } catch (_error) {
      snackbar({
        message: "Failed to send verification email",
        type: "error",
      });
      setIsResending(false);
    }
  }

  async function onSubmit({ email, password }: LoginValues) {
    setIsLoading(true);
    setUnverifiedEmail(null);
    setUnverifiedEmailStore(null);
    try {
      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: (context) => {
            console.log("context:", context);
            setUser({
              user: context.data.user,
              session: context.data.session,
            });

            setIsLoading(false); // ✅ stop here
            // router.replace("/(tabs)");
          },
          onError: (context) => {
            if (context.error.status === 403) {
              setUnverifiedEmail(email);
              setUnverifiedEmailStore(email);
              snackbar({
                message:
                  "Please verify your email address to be able to login.",
                type: "error",
              });

              setIsLoading(false); // ✅ important
              return;
            }

            snackbar({
              message: context.error.message,
              type: "error",
            });

            setIsLoading(false); // ✅ stop here too
          },
        },
      );
    } catch (error) {
      snackbar({
        message: "Something went wrong",
        type: "error",
      });

      setIsLoading(false); // ✅ fallback
    }
  }

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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to track your finances & taxes
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
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
                <FormikTextfield
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password"
                  leftIcon={
                    <MaterialIcons
                      name="lock"
                      size={22}
                      color={colors.gray[500]}
                    />
                  }
                  containerStyle={styles.inputRow}
                />

                <Button
                  style={[styles.forgotWrap, styles.linkBtn]}
                  onPress={() => router.push("/(auth)/forgot-password")}
                >
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </Button>

                {unverifiedEmail && (
                  <View style={styles.unverifiedEmailContainer}>
                    <Text style={styles.unverifiedEmailText}>
                      {" "}
                      Please verify your email address to be able to login.
                    </Text>
                    <Button
                      style={styles.unverifiedEmailButton}
                      onPress={handleResendVerification}
                      loading={isResending}
                    >
                      <Text style={styles.unverifiedEmailButtonText}>
                        Resend verification email
                      </Text>
                    </Button>
                  </View>
                )}

                <Button
                  style={styles.signInBtn}
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </Button>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button style={styles.googleBtn} onPress={() => {}}>
                  <Image source={images.google} style={styles.googleIconWrap} />
                  <Text style={styles.googleText}>Continue with Google</Text>
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button
              style={styles.linkBtn}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.footerLink}>Create account</Text>
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
      fontFamily: fonts.Manrope.Regular,
    },
    inputRow: { marginBottom: 16 },
    forgotWrap: { alignSelf: "flex-end", marginBottom: 20 },
    linkBtn: {
      backgroundColor: "transparent",
      height: undefined,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    forgot: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      fontFamily: fonts.Manrope.SemiBold,
    },
    signInBtn: {
      height: 54,
      marginBottom: 16,
      borderRadius: border.borderRadius.full,
    },
    signInText: {
      fontSize: 16,
      fontWeight: "700",
      color: "white",
      fontFamily: fonts.Manrope.Bold,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
      gap: 12,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.gray[200],
    },
    dividerText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.gray[500],
      textTransform: "uppercase",
      letterSpacing: 1,
      fontFamily: fonts.Manrope.Medium,
    },
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: border.borderRadius.full,
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: "white",
    },
    googleIconWrap: { width: 24, height: 24, resizeMode: "cover" },
    googleText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.gray[700],
      fontFamily: fonts.Manrope.Medium,
    },
    footer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: fonts.Manrope.Regular,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: fonts.Manrope.Bold,
    },
    unverifiedEmailContainer: {
      marginBottom: 16,
    },
    unverifiedEmailText: {
      fontSize: 14,
      color: colors.warning,
      fontFamily: fonts.Manrope.Regular,
      marginBottom: 8,
    },
    unverifiedEmailButton: {
      backgroundColor: "transparent",
      height: undefined,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: border.borderRadius.full,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    unverifiedEmailButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: fonts.Manrope.Bold,
    },
  });
