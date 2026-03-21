import { BottomSheetBackdropProps, useBottomSheet } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

export interface BlurBackdropProps extends BottomSheetBackdropProps {
  opacity?: number;
  appearsOnIndex?: number;
  disappearsOnIndex?: number;
  pressBehavior?: "none" | "close" | "collapse" | number;
  onPress?: () => void;
}

const BlurBackdrop: React.FC<BlurBackdropProps> = ({
  animatedIndex,
  style,
  opacity = 0.5,
  appearsOnIndex = 0,
  disappearsOnIndex = -1,
  pressBehavior = "close",
  onPress,
}) => {
  const { close, snapToIndex } = useBottomSheet();
  const [pointerEvents, setPointerEvents] = useState<
    "auto" | "none" | "box-none" | "box-only"
  >("auto");
  const isMounted = useRef(false);

  const handlePress = useCallback(() => {
    onPress?.();
    if (pressBehavior === "close") close();
    else if (pressBehavior === "collapse") snapToIndex(disappearsOnIndex);
    else if (typeof pressBehavior === "number") snapToIndex(pressBehavior);
  }, [close, snapToIndex, disappearsOnIndex, pressBehavior, onPress]);

  const handleTouchability = useCallback((shouldDisable: boolean) => {
    if (isMounted.current) setPointerEvents(shouldDisable ? "none" : "auto");
  }, []);

  const tapGesture = useMemo(
    () => Gesture.Tap().onEnd(() => runOnJS(handlePress)()),
    [handlePress]
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-1, disappearsOnIndex, appearsOnIndex],
        [0, 0, opacity],
        Extrapolation.CLAMP
      ),
    }),
    [appearsOnIndex, disappearsOnIndex, opacity]
  );

  useAnimatedReaction(
    () => animatedIndex.value <= disappearsOnIndex,
    (shouldDisable, prev) => {
      if (shouldDisable !== prev) runOnJS(handleTouchability)(shouldDisable);
    },
    [disappearsOnIndex]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const content = (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, style, animatedStyle]}
      pointerEvents={pointerEvents}
    >
      <BlurView intensity={100} tint="dark" style={styles.blurContainer} />
    </Animated.View>
  );

  return pressBehavior !== "none" ? (
    <GestureDetector gesture={tapGesture}>{content}</GestureDetector>
  ) : (
    content
  );
};

export const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
  },
});

export default BlurBackdrop;
