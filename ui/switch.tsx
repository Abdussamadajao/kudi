import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type SwitchProps = {
  value: SharedValue<boolean>;
  onPress: () => void;
  style?: ViewStyle;
  duration?: number;
  trackColors?: { on: string; off: string };
};

const Switch: React.FC<SwitchProps> = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = { on: "#1E946A", off: "#E0E0E0" },
}) => {
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const progress = useSharedValue(value.value ? 1 : 0);

  useAnimatedReaction(
    () => value.value,
    (v) => {
      progress.value = withTiming(v ? 1 : 0, { duration });
    },
    [duration],
  );

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [trackColors.off, trackColors.on],
    );
    return {
      backgroundColor: color,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      progress.value,
      [0, 1],
      [0, Math.max(0, width.value - height.value)],
    );
    return {
      transform: [{ translateX: moveValue }],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[styles.track, style, trackAnimatedStyle]}
      >
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    alignItems: "flex-start",
    width: 44,
    height: 24,
    paddingLeft: 2,
    paddingRight: 4,
    justifyContent: "center",
  },
  thumb: {
    height: 20,
    width: 20,
    borderRadius: "100%",
    backgroundColor: "#fff",
  },
});

export default Switch;

export const FormSwitch = ({
  value,
  onChange,
  trackColors,
}: {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  trackColors?: { on: string; off: string };
}) => {
  const switchValue = useSharedValue(!!value);
  useEffect(() => {
    switchValue.value = !!value;
  }, [value]);
  return (
    <Switch
      value={switchValue}
      onPress={() => {
        switchValue.value = !switchValue.value;
        onChange(!value);
      }}
      trackColors={trackColors}
    />
  );
};
