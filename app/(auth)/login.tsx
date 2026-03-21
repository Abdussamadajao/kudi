import Button from "@/components/button";
import { FormikTextfield } from "@/components/formik-inputs/text-field";
import Logo from "@/components/logo";
import { images } from "@/constants";
import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
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

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { flexGrow: 1, padding: 24, paddingBottom: 48 },
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
    bgDecor: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
      pointerEvents: "none",
    },
    bgBlur: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.5,
    },
    bgBlur1: {
      top: "-10%",
      left: "-10%",
      width: "40%",
      height: "40%",
      backgroundColor: colors.primary,
    },
    bgBlur2: {
      top: "20%",
      right: "-10%",
      width: "30%",
      height: "30%",
      backgroundColor: colors.slate[200],
    },
  });
  return (
    <View style={styles.safe}>
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
              console.log(values);
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
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
                  onPress={() => {}}
                >
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </Button>

                <Button
                  style={styles.signInBtn}
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
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
            <Button style={styles.linkBtn} onPress={() => {}}>
              <Text style={styles.footerLink}>Create account</Text>
            </Button>
          </View>
        </View>

        <View style={styles.bgDecor}>
          <View style={[styles.bgBlur, styles.bgBlur1]} />
          <View style={[styles.bgBlur, styles.bgBlur2]} />
        </View>
      </ScrollView>
    </View>
  );
}
