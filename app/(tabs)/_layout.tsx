import CreateModal from "@/ui/create-modal";
import { FABTab, TabItem } from "@/ui/navigation/custom-tab";
import { border, ThemePalette } from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="dashboard" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="transactions" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            // // Prevent this slot from being navigated to as a real tab
            // href: null,
            tabBarIcon: () => <FABTab onPress={() => setOpen(true)} />,
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Reports",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="report" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabItem name="profile" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>

      <CreateModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopWidth: 0,
      borderWidth: 1,
      borderColor: colors.surface,
      height: 80,
      paddingBottom: 40,
      paddingTop: 10,
      position: "absolute",
      borderRadius: 50,
      bottom: 30,
      left: 16,
      right: 16,
      // Ambient glow
      shadowColor: "#10b981",
      shadowOffset: { width: 1, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 11,

      // overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",

      marginHorizontal: 16,
    },
    buttonContainer: {
      position: "absolute",
      right: 16,
      bottom: 130,
      zIndex: 1000,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: border.borderRadius.full,
      backgroundColor: colors.primary,
    },
  });
