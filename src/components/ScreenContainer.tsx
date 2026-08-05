import React from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { color, space } from "../theme/tokens";

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

/** Shared full-screen background + horizontal padding used by every tab. */
export function ScreenContainer({ children, scroll = true, contentStyle }: Props) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Wrapper
        style={styles.fill}
        contentContainerStyle={scroll ? [styles.content, contentStyle] : undefined}
      >
        {scroll ? children : <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  fill: { flex: 1 },
  content: { paddingHorizontal: space[4], paddingTop: space[3], flexGrow: 1 },
});
