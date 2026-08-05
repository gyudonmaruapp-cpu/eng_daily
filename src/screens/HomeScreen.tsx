import React, { useEffect, useMemo } from "react";
import { Heart, Share } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { TabParamList } from "../navigation/TabNavigator";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";
import { QuoteMemoCard } from "../components/QuoteMemoCard";
import { Button } from "../components/Button";
import { OutlineTag } from "../components/Tag";
import { useAppData } from "../context/AppDataContext";
import { color, fontFamily, space } from "../theme/tokens";
import { dateKey, dayOfYear, formatJapaneseDate, quoteForDate } from "../utils/date";

type Props = BottomTabScreenProps<TabParamList, "今日">;

export function HomeScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isFavorite, toggleFavorite, markViewed, settings } = useAppData();

  const today = useMemo(() => new Date(), []);
  const todayId = dateKey(today);
  const quote = quoteForDate(today);

  useEffect(() => {
    markViewed(todayId);
  }, [todayId, markViewed]);

  if (!quote) {
    return (
      <ScreenContainer>
        <Text>本日の名言データが見つかりませんでした。</Text>
      </ScreenContainer>
    );
  }

  const favorite = isFavorite(quote.id);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateLabel}>{formatJapaneseDate(today)}</Text>
          <Text style={styles.title}>今日の名言</Text>
        </View>
        <OutlineTag>{`DAY ${dayOfYear(today)}`}</OutlineTag>
      </View>

      <QuoteMemoCard quote={quote} fontSize={settings.fontSize} />

      <View style={styles.textBlock}>
        <Text style={styles.sectionLabel}>和訳</Text>
        <Text style={styles.translation}>{quote.ja}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.sectionLabel, styles.memoLabel]}>MEMO</Text>
        <Text style={styles.memo}>{quote.note}</Text>
      </View>

      <View style={styles.spacer} />

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

      <Pressable
        style={styles.archiveButton}
        onPress={() => navigation.navigate("Tabs", { screen: "アーカイブ" })}
      >
        <Text style={styles.archiveButtonText}>アーカイブを見る（過去にめくった分）</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space[6] },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: space[4],
  },
  dateLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: color.text,
    opacity: 0.55,
  },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: 32,
    color: color.text,
    marginTop: 2,
  },
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
  spacer: { flex: 1, minHeight: space[4] },
  actionsRow: { flexDirection: "row", gap: space[2], paddingVertical: space[4] },
  flexButton: { flex: 1 },
  archiveButton: {
    borderTopWidth: 2,
    borderTopColor: color.divider,
    paddingTop: space[3],
    paddingBottom: space[2],
  },
  archiveButtonText: {
    fontFamily: fontFamily.headingBold,
    fontSize: 14,
    color: color.accent700,
  },
});
