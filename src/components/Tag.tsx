import React from "react";
import { StyleSheet, Text } from "react-native";
import { color, fontFamily } from "../theme/tokens";

export function OutlineTag({ children }: { children: string }) {
  return <Text style={styles.tag}>{children}</Text>;
}

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderColor: color.accent,
    color: color.accent,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.2,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
});
