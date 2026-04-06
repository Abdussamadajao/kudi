import { AuthBgDecor } from "@/features/auth/components/auth-bg-decor";
import { FormikTextfield } from "@/ui/form/text-field";
import Logo from "@/ui/logo";
import Button from "@/ui/button";
import { ThemedKeyboardAvoidingView } from "@/ui/themed-keyboard-avoiding-view";
import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Yup from "yup";

type Values = { password: string; confirmPassword: string };

const initialValues: Values = { password: "", confirmPassword: "" };

const schema = Yup.object({
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

function extractTokensFromUrl(url: string): {
  access_token?: string;
  refresh_token?: string;
} {
  const params: Record<string, string> = {};
  const addPairs = (segment: string) => {
    segment.split("&").forEach((pair) => {
      const eq = pair.indexOf("=");
      if (eq === -1) return;
      const key = decodeURIComponent(pair.slice(0, eq));
      const val = decodeURIComponent(pair.slice(eq + 1));
      params[key] = val;
    });
  };
  const hashIdx = url.indexOf("#");
  if (hashIdx !== -1) addPairs(url.slice(hashIdx + 1));
  const qIdx = url.indexOf("?");
  if (qIdx !== -1) {
    const end = hashIdx === -1 ? url.length : hashIdx;
    addPairs(url.slice(qIdx + 1, end));
  }
  return {
    access_token: params.access_token,
    refresh_token: params.refresh_token,
  };
}

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();
  const { colors } = useTheme();
  const [phase, setPhase] = useState<"loading" | "ready" | "invalid">(
    "loading",
  );

  const styles = StyleSheet.create({
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
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingWrap: { flex: 1 },
  });

  if (phase === "loading") {
    return (
      <ThemedKeyboardAvoidingView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <AuthBgDecor />
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </View>
      </ThemedKeyboardAvoidingView>
    );
  }

  if (phase === "invalid") {
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
              <Text style={styles.title}>Link expired</Text>
              <Text style={styles.subtitle}>
                This reset link is invalid or has expired. Request a new one
                from the sign-in screen.
              </Text>
            </View>
            <Button
              style={styles.submitBtn}
              onPress={() => router.replace("/(auth)/forgot-password")}
            >
              <Text style={styles.submitText}>Request new link</Text>
            </Button>
            <Button
              style={[styles.linkBtn, { alignSelf: "center", marginTop: 12 }]}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.footerLink}>Back to sign in</Text>
            </Button>
          </View>
          <AuthBgDecor />
        </ScrollView>
      </ThemedKeyboardAvoidingView>
    );
  }

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
            <Text style={styles.title}>Set new password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password you haven’t used before on this app.
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              console.log(values);
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <>
                <FormikTextfield
                  name="password"
                  label="New password"
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
                  style={styles.submitBtn}
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                >
                  <Text style={styles.submitText}>Update password</Text>
                </Button>
              </>
            )}
          </Formik>
        </View>
        <AuthBgDecor />
      </ScrollView>
    </ThemedKeyboardAvoidingView>
  );
}
