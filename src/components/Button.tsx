import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { color, fontFamily, space } from "../theme/tokens";

type Variant = "primary" | "secondary" | "ghost";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  block?: boolean;
  disabled?: boolean;
}

/** Modernist buttons: flush-left labels, flat (no radius), pressed state one
 * ramp-step darker than the resting fill. */
export function Button({ label, onPress, variant = "secondary", icon, style, block, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        block && styles.block,
        pressed && !disabled && variantPressedStyle(variant),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon}
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.labelPrimary,
            variant === "ghost" && styles.labelGhost,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function variantPressedStyle(variant: Variant) {
  if (variant === "primary") return { backgroundColor: color.accent700 };
  if (variant === "ghost") return { backgroundColor: "rgba(236,48,19,0.18)" };
  return { backgroundColor: "rgba(32,30,29,0.14)" };
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: space[2],
    paddingHorizontal: space[3] * 1.2,
    borderRadius: 0,
    justifyContent: "flex-start",
  },
  primary: { backgroundColor: color.accent },
  secondary: { borderWidth: 1, borderColor: color.divider },
  ghost: { paddingHorizontal: space[1] },
  block: { width: "100%" },
  disabled: { opacity: 0.45 },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: {
    fontFamily: fontFamily.headingBold,
    fontSize: 14,
    color: color.text,
  },
  labelPrimary: { color: color.bg },
  labelGhost: { color: color.accent },
});
