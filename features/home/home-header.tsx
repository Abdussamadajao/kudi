import { Avatar } from "@/ui/avatar";
import Skeleton from "@/ui/skeleton";
import { border } from "@/constants/theme";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createHomeHeaderStyles } from "./home-styles";

type HomeHeaderProps = {
  userName: string;
  message: string;
  isPending: boolean;
  avatarUrl: string;
};

export function HomeHeader({
  userName,
  message,
  isPending,
  avatarUrl,
}: HomeHeaderProps) {
  const { colors } = useTheme();
  const styles = useStyles(createHomeHeaderStyles);

  return (
    <View style={styles.headerOuter}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isPending ? (
            <Skeleton
              width={46}
              height={46}
              borderRadius={border.borderRadius.full}
            />
          ) : (
            <Avatar
              name={userName}
              size="md"
              variant="circle"
              uri={avatarUrl}
            />
          )}
          <View style={styles.headerLeftText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>
              {isPending ? <Skeleton width={200} height={20} /> : message}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.notifBtn} accessibilityRole="button">
            <MaterialIcons
              name="notifications"
              size={28}
              color={colors.primary}
            />
            <View style={styles.badge} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
