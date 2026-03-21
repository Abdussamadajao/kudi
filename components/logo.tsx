import { images } from "@/constants";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Logo = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.headerContainer}>
      <View />
      <View style={styles.header}>
        <Image source={images.logo} style={styles.headerIconImage} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Kódi
        </Text>
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 24,
    gap: 5,
  },
  headerIconImage: { width: 30, height: 30 },
  headerTitle: { fontSize: 24, fontFamily: fonts.Manrope.Bold },
});
