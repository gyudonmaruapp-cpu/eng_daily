import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Quote } from "../data/types";
import { color, fontFamily, fontSizeScale, type FontSizeKey } from "../theme/tokens";

interface Props {
  quote: Quote;
  /** Smaller card used in the share sheet. Defaults to the full Home size. */
  compact?: boolean;
  fontSize?: FontSizeKey;
}

const HOLE_COUNT = 5;

/** The memo-pad quote card: punch holes, a dashed perforation, ruled lines
 * and a red margin rule — Modernist's grid language plus the notebook
 * motif requested in the design chat. */
export function QuoteMemoCard({ quote, compact = false, fontSize = "M" }: Props) {
  const lineHeight = compact ? 21 : 27;
  const scale = fontSizeScale[fontSize];
  const quoteSize = (compact ? 17 : 25) * scale;

  return (
    <View style={styles.card}>
      <View style={[styles.holesRow, compact && styles.holesRowCompact]}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <View key={i} style={[styles.hole, compact && styles.holeCompact]} />
        ))}
      </View>
      <View style={[styles.body, compact ? styles.bodyCompact : styles.bodyFull]}>
        <RuledLines lineHeight={lineHeight} />
        <View style={[styles.marginRule, compact && styles.marginRuleCompact]} />
        <View style={compact ? styles.textIndentCompact : styles.textIndentFull}>
          <Text style={[styles.quoteText, { fontSize: quoteSize, lineHeight: quoteSize * 1.35 }]}>
            &ldquo;{quote.en}&rdquo;
          </Text>
          <Text style={[styles.author, compact && styles.authorCompact]}>— {quote.author}</Text>
        </View>
      </View>
    </View>
  );
}

function RuledLines({ lineHeight }: { lineHeight: number }) {
  const [height, setHeight] = React.useState(0);
  const count = Math.ceil(height / lineHeight) + 1;
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.ruleLine, { top: (i + 1) * lineHeight }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderColor: color.text },
  holesRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderStyle: "dashed",
    borderBottomColor: color.divider,
  },
  holesRowCompact: { paddingVertical: 7, paddingHorizontal: 16 },
  hole: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: color.bg,
    borderWidth: 1.5,
    borderColor: color.text,
  },
  holeCompact: { width: 11, height: 11, borderRadius: 6 },
  body: { position: "relative", overflow: "hidden" },
  bodyFull: { padding: 16, paddingLeft: 40 },
  bodyCompact: { padding: 12, paddingLeft: 34 },
  ruleLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: color.divider,
  },
  marginRule: {
    position: "absolute",
    left: 28,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: color.accent300,
  },
  marginRuleCompact: { left: 22 },
  textIndentFull: {},
  textIndentCompact: {},
  quoteText: {
    fontFamily: fontFamily.quote,
    color: color.text,
    marginBottom: 12,
  },
  author: {
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    color: color.accent700,
  },
  authorCompact: { fontSize: 11 },
});
