import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

interface Props {
  icon: string;
  color: string;
  size?: number;
  withBackground?: boolean;
}

export function CategoryIcon({
  icon,
  color,
  size = 24,
  withBackground = false,
}: Props) {
  if (withBackground) {
    const bgSize = size + 16;
    return (
      <View
        style={[
          styles.bg,
          {
            backgroundColor: color + "20",
            width: bgSize,
            height: bgSize,
            borderRadius: bgSize / 2,
          },
        ]}
      >
        <MaterialIcons
          name={icon as MaterialIconName}
          size={size}
          color={color}
        />
      </View>
    );
  }

  return (
    <MaterialIcons name={icon as MaterialIconName} size={size} color={color} />
  );
}

const styles = StyleSheet.create({
  bg: { alignItems: "center", justifyContent: "center" },
});
