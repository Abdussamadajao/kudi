import {
  border,
  fonts,
  fontSize,
  PROFILE_IMAGE,
  spacing,
} from "@/constants/theme";
import { HomeChart, Income, RecentTransactions } from "@/features/home";
import { formatPrice } from "@/lib/custom";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { colors } = useTheme();
  const { width: screenW } = Dimensions.get("window");
  const cardW = Math.round(screenW * 0.92);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={{ backgroundColor: colors.background }}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[styles.avatarWrap, { borderColor: colors.secondary }]}
              >
                <Image
                  source={{ uri: PROFILE_IMAGE }}
                  style={styles.avatarImg}
                />
              </View>
              <View style={styles.headerLeftText}>
                <Text style={[styles.greeting, { color: colors.slate[500] }]}>
                  Welcome back,
                </Text>
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                  Good morning, Abdus-Samad!
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Pressable
                style={[
                  styles.notifBtn,
                  { backgroundColor: colors.primary + "20" },
                ]}
                accessibilityRole="button"
              >
                <MaterialIcons
                  name="notifications"
                  size={28}
                  color={colors.primary}
                />
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.danger,
                      borderColor: colors.background,
                    },
                  ]}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.cardsRow}>
            <View
              style={[
                styles.netWorthCard,
                {
                  width: cardW,
                  backgroundColor: colors.surfaceVariant,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <View
                style={[
                  styles.netWorthGlow,
                  { backgroundColor: colors.primary + "1A" },
                ]}
              />
              <View style={styles.netWorthInner}>
                <Text style={[styles.netWorthLabel, { color: colors.primary }]}>
                  Total Net Worth
                </Text>
                <View style={styles.netWorthAmountBlock}>
                  <Text
                    style={[styles.netWorthAmount, { color: colors.onSurface }]}
                  >
                    {formatPrice(245000)}
                    {/* ₦2,450,000
                    <Text style={styles.netWorthAmountDec}>.00</Text> */}
                  </Text>
                  <View style={styles.netWorthTrendRow}>
                    <MaterialIcons
                      name="trending-up"
                      size={14}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.netWorthTrendText,
                        { color: colors.primary },
                      ]}
                    >
                      +12% vs last month
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Income />
        </View>
        <View style={styles.sectionBlock}>
          <HomeChart />
        </View>

        <View style={styles.sectionBlock}>
          <RecentTransactions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: { flex: 1 },
  content: { paddingBottom: 140 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  headerLeftText: { gap: 2 },
  greeting: {
    fontSize: 13,
    fontFamily: fonts.Manrope.Medium,
  },
  name: { fontSize: 18, fontFamily: fonts.Manrope.Bold },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: border.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: border.borderRadius.full,
    overflow: "hidden",
    borderWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImg: { width: 40, height: 40, borderRadius: border.borderRadius.full },

  sectionBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 1,
  },
  cardsRow: {
    gap: 16,
    paddingRight: 24,
    paddingTop: 6,
    paddingBottom: 6,
  },
  netWorthCard: {
    borderRadius: border.borderRadius.xl,
    padding: spacing[10],
    overflow: "hidden",
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  netWorthGlow: {
    position: "absolute",
    top: -96,
    right: -96,
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  netWorthInner: {
    position: "relative",
    zIndex: 1,
    gap: spacing[2],
  },
  netWorthLabel: {
    fontSize: 10,
    fontFamily: fonts.Manrope.Bold,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  netWorthAmountBlock: {
    gap: spacing[2],
  },
  netWorthAmount: {
    fontSize: fontSize["8xl"],
    fontFamily: fonts.Manrope.ExtraBold,
    letterSpacing: -1.2,
    lineHeight: fontSize["8xl"] * 1.05,
  },
  netWorthAmountDec: {
    fontSize: fontSize["5xl"],
    fontFamily: fonts.Manrope.Bold,
    opacity: 0.85,
  },
  netWorthTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginTop: spacing[1],
  },
  netWorthTrendText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.Manrope.Bold,
  },

  goalCard: {
    // backgroundColor: theme.surface,
    borderWidth: 1,
    // borderColor: colors.slate[100],
  },
  goalStripe: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    // backgroundColor: theme.primary,
  },
  cardLabelDark: {
    // color: theme.slate[500],
    fontSize: 13,
    fontFamily: fonts.Manrope.Medium,
  },
  cardAmountDark: {
    // color: theme.primary,
    fontSize: 28,
    fontFamily: fonts.Manrope.ExtraBold,
    marginTop: 2,
  },
  cardAmountDarkDec: { fontSize: 16, opacity: 0.6 },
  cardIconSoft: {
    backgroundColor: "rgba(16,185,129,0.1)",
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  smartInsightCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    padding: 18,
    paddingRight: 80,
    borderRadius: border.borderRadius.lg,
  },
  smartInsightCardIcon: {
    width: 50,
    height: 50,
    borderRadius: border.borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  smartInsightCardText: {
    flex: 1,
  },
  smartInsightCardTitle: {
    fontSize: fontSize["xs"],
    fontFamily: fonts.Manrope.Bold,
    textTransform: "uppercase",
  },
  smartInsightCardDescription: {
    fontSize: fontSize["sm"],
    fontFamily: fonts.Manrope.Medium,
    textAlign: "left",
  },
});
