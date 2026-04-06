import { Avatar } from "@/ui/avatar";
import { Skeleton } from "@/ui/skeleton";
import type { ThemePalette } from "@/constants/theme";
import { border, fontSize, fonts, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ProfileUserCard({
  name,
  email,
  memberSinceLabel,
  imageUri,
  colors,
  isPending = false,
}: {
  name: string;
  email: string;
  memberSinceLabel: string;
  imageUri: string;
  colors: ThemePalette;
  isPending?: boolean;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer }]}>
      <View style={styles.avatarWrap}>
        {isPending ? (
          <Skeleton
            width={96}
            height={96}
            borderRadius={border.borderRadius.full}
          />
        ) : (
          <Avatar name={name} size={118} variant="circle" uri={imageUri} />
        )}
      </View>
      {isPending ? (
        <Skeleton
          width={180}
          height={24}
          borderRadius={border.borderRadius.lg}
        />
      ) : (
        <Text style={[styles.name, { color: colors.onSurface }]}>{name}</Text>
      )}
      {isPending ? (
        <Skeleton
          width={220}
          height={18}
          borderRadius={border.borderRadius.lg}
          style={{ marginTop: spacing[2], marginBottom: spacing[3] }}
        />
      ) : (
        <Text style={[styles.email, { color: colors.primary }]}>{email}</Text>
      )}
      <View
        style={[styles.badge, { backgroundColor: colors.surfaceContainerLow }]}
      >
        {isPending ? (
          <Skeleton
            width={132}
            height={12}
            borderRadius={border.borderRadius.full}
          />
        ) : (
          <Text style={[styles.badgeText, { color: colors.onSurfaceVariant }]}>
            {memberSinceLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: border.borderRadius.lg,
    marginBottom: spacing[6],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  avatarWrap: {
    marginBottom: spacing[4],
    position: "relative",
  },
  avatarRing: {
    borderRadius: border.borderRadius.full,
    borderWidth: 3,
    elevation: 4,
    padding: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  avatar: {
    borderRadius: border.borderRadius.full,
    height: 96,
    width: 96,
  },
  statusDot: {
    borderRadius: border.borderRadius.full,
    borderWidth: 3,
    bottom: 4,
    height: 16,
    position: "absolute",
    right: 4,
    width: 16,
  },
  name: {
    fontFamily: fonts.Manrope.Bold,
    fontSize: fontSize.xl,
    marginBottom: spacing[1],
  },
  email: {
    fontFamily: fonts.Inter.Medium,
    fontSize: fontSize.md,
    marginBottom: spacing[3],
  },
  badge: {
    borderRadius: border.borderRadius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  badgeText: {
    fontFamily: fonts.Inter.SemiBold,
    fontSize: fontSize.xs,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
