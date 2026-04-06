import { border, fonts, fontSize, ThemePalette } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/provider/theme-provider";
import { User } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "./avatar";
import Skeleton from "./skeleton";

const Header = ({ title }: { title: string }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data, isPending } = authClient.useSession();
  const user = data?.user as unknown as User;
  const userName = user?.name ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.image ?? "";
  return (
    <View style={styles.header}>
      <View style={styles.headerRight}>
        {isPending ? (
          <Skeleton
            width={46}
            height={46}
            borderRadius={border.borderRadius.full}
          />
        ) : (
          <Avatar name={userName} size="md" variant="circle" uri={avatarUrl} />
        )}

        <Text style={[styles.title]}>{title}</Text>
      </View>

      <Pressable style={styles.iconBtn} hitSlop={8}>
        <MaterialIcons
          name="notifications"
          size={24}
          color={colors.textPrimary}
        />
      </Pressable>
    </View>
  );
};

export { Header };

const createStyles = (colors: ThemePalette) => {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: fontSize["2xl"],
      fontFamily: fonts.Manrope.Bold,
      color: colors.primary,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceContainerHigh,
    },
  });
};
