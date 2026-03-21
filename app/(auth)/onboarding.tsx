import Button from "@/components/button";
import { images, onboarding } from "@/constants";
import { border, fonts } from "@/constants/theme";
import { useTheme } from "@/provider/theme-provider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useTheme();

  const isLastSlide = activeIndex === onboarding.length - 1;

  const gotoNext = () => {
    if (!isLastSlide) {
      swiperRef.current?.scrollBy(1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  const styles = StyleSheet.create({
    safe: { flex: 1 },
    dotHidden: { width: 0, height: 0 },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 8,
    },
    header: { flexDirection: "row", alignItems: "center", gap: 8 },
    headerIconImage: { width: 32, height: 32 },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: fonts.Manrope.Bold,
    },
    skipBtn: {
      backgroundColor: "transparent",
      height: undefined,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    skipBtnText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      fontFamily: fonts.Manrope.SemiBold,
    },
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
    imageOuterWrapper: { alignItems: "center", marginBottom: 32 },
    imageWrapper: {
      width: 280,
      height: 280,
      borderRadius: 140,
      overflow: "hidden",
    },
    imageContainer: { width: "100%", height: "100%", resizeMode: "cover" },
    imageGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    imageBlob: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: colors.primary + "15",
      top: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 12,
      fontFamily: fonts.Manrope.Bold,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      fontFamily: fonts.Manrope.Regular,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
      gap: 24,
    },
    footerDots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.slate[300],
    },
    dotActive: {
      width: 24,
      backgroundColor: colors.primary,
    },
    nextBtn: {
      height: 54,
      borderRadius: border.borderRadius.full,
    },
    nextBtnText: {
      fontSize: 16,
      fontWeight: "700",
      color: "white",
      fontFamily: fonts.Manrope.Bold,
    },
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dotHidden} />}
        activeDot={<View style={styles.dotHidden} />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map(({ content, image, title }, idx) => (
          <View key={`${title}-${idx}`}>
            <View style={styles.headerContainer}>
              <View />
              <View style={styles.header}>
                <Image source={images.logo} style={styles.headerIconImage} />
                <Text style={styles.headerTitle}>Kódi</Text>
              </View>
              <Button onPress={() => {}} style={styles.skipBtn}>
                <Text style={styles.skipBtnText}>Skip</Text>
              </Button>
            </View>

            <View style={styles.container}>
              <View style={styles.imageOuterWrapper}>
                <View style={styles.imageWrapper}>
                  <Image source={image} style={styles.imageContainer} />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.2)"]}
                    style={styles.imageGradient}
                  />
                </View>
                <View style={styles.imageBlob} />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{content}</Text>
            </View>
          </View>
        ))}
      </Swiper>
      <View style={styles.footer}>
        <View style={styles.footerDots}>
          {onboarding.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
        <Button onPress={gotoNext} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
