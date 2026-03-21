import { ThemePalette } from "@/constants";
import { useTheme } from "@/provider/theme-provider";
import React, { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text>profile</Text>
    </SafeAreaView>
  );
};

const createStyles = (palette: ThemePalette) => {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
  });
};
export default Profile;
