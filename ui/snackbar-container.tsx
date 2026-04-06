import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SnackbarType = "success" | "error" | "info" | "warning";
type SnackbarPosition = "top" | "bottom" | "center";

interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  position?: SnackbarPosition;
  maxLines?: number;
}

export const SnackbarContainer: React.FC<SnackbarProps> = ({
  message,
  onActionPress,
  type = "info",
  duration = 3000,
  position = "top",
  maxLines = 2,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const progress = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isVisible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isVisible, progress]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onActionPress?.();
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onActionPress]);

  const config = {
    success: {
      icon: "check",
      iconBg: "rgba(52, 211, 153, 0.18)",
      iconColor: "#34D399",
    },
    warning: {
      icon: "warning-amber",
      iconBg: "rgba(245, 158, 11, 0.2)",
      iconColor: "#F59E0B",
    },
    error: {
      icon: "priority-high",
      iconBg: "rgba(248, 113, 113, 0.2)",
      iconColor: "#F87171",
    },
    info: {
      icon: "info-outline",
      iconBg: "rgba(148, 163, 184, 0.2)",
      iconColor: "#CBD5E1",
    },
  }[type];

  const isTop = position === "top";
  const isBottom = position === "bottom";

  return (
    <Animated.View
      style={[
        styles.container,
        isTop && styles.top,
        isBottom && styles.bottom,
        position === "center" && styles.center,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [position === "top" ? -20 : 20, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
          <MaterialIcons
            name={config.icon as never}
            size={19}
            color={config.iconColor}
          />
        </View>
        <Text
          style={styles.messageText}
          numberOfLines={maxLines}
          ellipsizeMode="tail"
        >
          {message}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsVisible(false)}
        style={styles.closeButton}
        hitSlop={8}
      >
        <MaterialIcons name="close" size={20} color="#A3ADBF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#141B35",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#050816",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 7,
    zIndex: 1000,
    width: "100%",
  },
  top: {
    marginTop: Platform.select({ ios: 6, android: 0 }),
  },
  bottom: {
    marginBottom: 10,
  },
  center: {
    alignSelf: "center",
  },
  content: {
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: Platform.select({ ios: 15, android: 14 }),
    color: "#E8EDF7",
    flexShrink: 1,
    lineHeight: 22,
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
});
