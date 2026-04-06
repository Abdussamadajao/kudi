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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik, type FormikHelpers } from "formik";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialValues: RegisterValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const { snackbar } = useSnackbar();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: RegisterValues,
    setFieldError: FormikHelpers<RegisterValues>["setFieldError"],
  ) => {
    setIsLoading(true);
    const data = {
      name: values.fullName,
      email: values.email,
      password: values.password,
    };

    await authClient.signUp
      .email(data, {
        onSuccess: (_context) => {
          router.replace("/(auth)/verify-email");
          snackbar({
            message: "Registration successful",
            type: "success",
          });
        },
        onError: (context) => {
          if (context.response.status === 422) {
            setFieldError("email", "Email already in use");
            snackbar({
              message: "Email already in use",
              type: "error",
            });
          } else {
            snackbar({
              message: context.error.message ?? "Registration failed",
              type: "error",
            });
          }
        },
      })
      .finally(() => {
        setIsLoading(false);
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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Start tracking your finances & taxes
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={(values, { setFieldError }) => {
              handleSubmit(values, setFieldError);
            }}
          >
            {({ handleSubmit }) => (
              <>
                <FormikTextfield
                  name="fullName"
                  label="Full name"
                  placeholder="Jane Doe"
                  autoCapitalize="words"
                  autoComplete="name"
                  leftIcon={
                    <MaterialIcons
                      name="person"
                      size={22}
                      color={colors.gray[500]}
                    />
                  }
                  containerStyle={styles.inputRow}
                />
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
                  autoComplete="password-new"
                  leftIcon={
                    <MaterialIcons
                      name="lock"
                      size={22}
                      color={colors.gray[500]}
                    />
                  }
                  containerStyle={styles.inputRow}
                />
                <FormikTextfield
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password-new"
                  leftIcon={
                    <MaterialIcons
                      name="lock-outline"
                      size={22}
                      color={colors.gray[500]}
                    />
                  }
                  containerStyle={styles.inputRow}
                />

                <Button
                  style={styles.signUpBtn}
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <Text style={styles.signUpText}>Create account</Text>
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
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button
              style={styles.linkBtn}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.footerLink}>Sign in</Text>
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
      // padding: 24,
      overflow: "hidden",
      paddingHorizontal: 24,
      paddingBottom: 24,
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
    inputRow: { marginBottom: 1 },
    signUpBtn: {
      height: 54,
      marginBottom: 16,
      borderRadius: border.borderRadius.full,
    },
    signUpText: {
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
