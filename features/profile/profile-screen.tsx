import type { ColorScheme } from "@/constants/theme";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { useAuthStore } from "@/stores";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileAboutRow } from "./profile-about-row";
import { ProfileFooter } from "./profile-footer";
import { ProfileHeader } from "./profile-header";
import { ProfileUserCard } from "./profile-user-card";
import {
  SettingsActionRow,
  SettingsChevronRow,
  SettingsThemeRow,
  SettingsToggleRow,
} from "./settings-rows";
import { SettingsSection } from "./settings-section";
import { ThemeSegmentControl } from "./theme-segment-control";

export function ProfileScreen() {
  const { colors, mode, toggleTheme } = useTheme();
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(false);
  const { logout, user, isHydrating } = useAuthStore();
  const version = useMemo(
    () => `v${Constants.expoConfig?.version ?? "1.0.0"}`,
    [],
  );

  const onThemeSelect = useCallback(
    (next: ColorScheme) => {
      if (next !== mode) toggleTheme();
    },
    [mode, toggleTheme],
  );

  const openEditProfile = useCallback(() => {
    router.push({
      pathname: "/edit-profile",
      params: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        imageUri: user?.avatarUrl ?? user?.image ?? "",
      },
    });
  }, [user?.name, user?.email, user?.avatarUrl, user?.image]);

  const openChangePassword = useCallback(() => {
    router.push("/change-password");
  }, []);

  const openCategoryManagement = useCallback(() => {
    router.push("/categories");
  }, []);

  const onLogout = useCallback(() => {
    logout();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: { backgroundColor: colors.background, flex: 1 },
        scroll: { flex: 1 },
        content: {
          paddingBottom: spacing[24],
          paddingHorizontal: spacing[4],
          paddingTop: spacing[2],
        },
      }),
    [colors.background],
  );

  const profileName = user?.name ?? "";
  const profileEmail = user?.email ?? "";
  const memberSinceLabel = useMemo(() => {
    if (!user?.createdAt) return "MEMBER SINCE";
    const year = new Date(user.createdAt).getFullYear();
    return Number.isNaN(year) ? "MEMBER SINCE" : `MEMBER SINCE ${year}`;
  }, [user?.createdAt]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onEditPress={openEditProfile} />
        <ProfileUserCard
          name={profileName}
          email={profileEmail}
          memberSinceLabel={memberSinceLabel}
          imageUri={user?.avatarUrl ?? user?.image ?? ""}
          colors={colors}
          isPending={isHydrating}
        />

        <SettingsSection title="Account" colors={colors}>
          <SettingsChevronRow
            icon="person-outline"
            label="Edit Profile"
            colors={colors}
            onPress={openEditProfile}
          />
          <SettingsChevronRow
            icon="lock-outline"
            label="Change Password"
            colors={colors}
            onPress={openChangePassword}
          />
          <SettingsChevronRow
            icon="category"
            label="Category Management"
            colors={colors}
            onPress={openCategoryManagement}
            showDivider={false}
          />
          {/* <SettingsChevronRow
            icon="shield"
            label="Security / 2FA"
            colors={colors}
            showDivider={false}
          /> */}
        </SettingsSection>

        <SettingsSection title="Appearance" colors={colors}>
          <SettingsThemeRow label="Theme" colors={colors} showDivider={false}>
            <ThemeSegmentControl mode={mode} onSelect={onThemeSelect} />
          </SettingsThemeRow>
        </SettingsSection>

        <SettingsSection title="Notifications" colors={colors}>
          <SettingsToggleRow
            label="Transaction alerts"
            value={transactionAlerts}
            onValueChange={setTransactionAlerts}
            colors={colors}
          />
          <SettingsToggleRow
            label="Budget alerts"
            value={budgetAlerts}
            onValueChange={setBudgetAlerts}
            colors={colors}
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="Privacy" colors={colors}>
          <SettingsActionRow
            icon="download"
            label="Export Data"
            colors={colors}
          />
          <SettingsActionRow
            icon="delete-outline"
            label="Delete Account"
            colors={colors}
            danger
            showDivider={false}
          />
        </SettingsSection>

        <SettingsSection title="About" colors={colors}>
          <ProfileAboutRow
            appName="Kedi Financial"
            version={version}
            colors={colors}
          />
        </SettingsSection>

        <ProfileFooter colors={colors} onLogout={onLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}
