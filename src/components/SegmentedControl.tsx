import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color, fontFamily } from "../theme/tokens";

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.seg}>
      {options.map((opt, i) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.opt, i > 0 && styles.optBorder, active && styles.optActive]}
          >
            <Text style={[styles.optText, active && styles.optTextActive]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: color.divider,
    overflow: "hidden",
  },
  opt: { paddingVertical: 7, paddingHorizontal: 12 },
  optBorder: { borderLeftWidth: 1, borderLeftColor: color.divider },
  optActive: { backgroundColor: color.accent },
  optText: { fontFamily: fontFamily.body, fontSize: 13, color: color.text },
  optTextActive: { color: color.bg },
});
