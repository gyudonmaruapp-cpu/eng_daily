import React from "react";
import { ChevronRight, Heart, Share } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";
import { QuoteMemoCard } from "../components/QuoteMemoCard";
import { Button } from "../components/Button";
import { useAppData } from "../context/AppDataContext";
import { color, fontFamily, space } from "../theme/tokens";
import { quoteById } from "../utils/date";

export function QuoteDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "QuoteDetail">>();
  const { isFavorite, toggleFavorite, settings } = useAppData();

  const quote = quoteById(route.params.quoteId);
  if (!quote) return null;
  const favorite = isFavorite(quote.id);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
        <ChevronRight size={16} color={color.text} style={styles.backIcon} />
        <Text style={styles.backText}>もどる</Text>
      </Pressable>

      <QuoteMemoCard quote={quote} fontSize={settings.fontSize} />

      <View style={styles.textBlock}>
        <Text style={styles.sectionLabel}>和訳</Text>
        <Text style={styles.translation}>{quote.ja}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.sectionLabel, styles.memoLabel]}>MEMO</Text>
        <Text style={styles.memo}>{quote.note}</Text>
      </View>

      <View style={styles.actionsRow}>
        <Button
          label="お気に入りに追加"
          variant="secondary"
          style={styles.flexButton}
          icon={<Heart size={18} color={favorite ? color.accent : color.text} fill={favorite ? color.accent : "none"} />}
          onPress={() => toggleFavorite(quote.id)}
        />
        <Button
          label="シェア"
          variant="secondary"
          style={styles.flexButton}
          icon={<Share size={18} color={color.text} />}
          onPress={() => navigation.navigate("Share", { quoteId: quote.id })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space[6] },
  back: { flexDirection: "row", alignItems: "center", marginBottom: space[4] },
  backIcon: { transform: [{ rotate: "180deg" }] },
  backText: { fontFamily: fontFamily.bodyMedium, fontSize: 14, color: color.text, marginLeft: 2 },
  textBlock: { paddingTop: space[4] },
  sectionLabel: {
    fontFamily: fontFamily.headingBold,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: color.text,
    opacity: 0.55,
    marginBottom: 6,
  },
  memoLabel: { color: color.accent, opacity: 1 },
  translation: { fontSize: 15, color: color.text },
  memo: { fontSize: 13, color: color.text, opacity: 0.8 },
  actionsRow: { flexDirection: "row", gap: space[2], paddingTop: space[6] },
  flexButton: { flex: 1 },
});
