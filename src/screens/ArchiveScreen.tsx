import React, { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAppData } from "../context/AppDataContext";
import { color, fontFamily, space } from "../theme/tokens";
import { formatShortDate, quoteById } from "../utils/date";

export function ArchiveScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { viewed } = useAppData();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return viewed
      .map((v) => ({ ...v, quote: quoteById(v.id) }))
      .filter((r): r is typeof r & { quote: NonNullable<typeof r.quote> } => !!r.quote)
      .filter(
        (r) =>
          !q || r.quote.en.toLowerCase().includes(q) || r.quote.author.toLowerCase().includes(q)
      );
  }, [viewed, query]);

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.title}>アーカイブ</Text>
      <Text style={styles.subtitle}>めくった名言だけを振り返れます</Text>

      <View style={styles.searchWrap}>
        <Search size={15} color={color.text} style={styles.searchIcon} opacity={0.5} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="名言・著者で検索"
          placeholderTextColor="rgba(32,30,29,0.45)"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {viewed.length === 0
              ? "まだアーカイブはありません。今日の名言を開くとここに残っていきます。"
              : "該当する名言が見つかりませんでした。"}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate("QuoteDetail", { quoteId: item.id })}
          >
            <Text style={styles.rowDate}>{formatShortDate(new Date(item.viewedAt))}</Text>
            <View style={styles.rowMain}>
              <Text style={styles.rowQuote} numberOfLines={1}>
                &ldquo;{item.quote.en}&rdquo;
              </Text>
              <Text style={styles.rowAuthor}>{item.quote.author}</Text>
            </View>
            <ChevronRight size={14} color={color.text} opacity={0.4} />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.headingBold, fontSize: 30, color: color.text },
  subtitle: { fontSize: 13, color: color.text, opacity: 0.6, marginTop: 4, marginBottom: space[4] },
  searchWrap: { position: "relative", justifyContent: "center", marginBottom: space[4] },
  searchIcon: { position: "absolute", left: 10, zIndex: 1 },
  searchInput: {
    minHeight: 36,
    paddingVertical: 6,
    paddingLeft: 32,
    paddingRight: 10,
    fontSize: 14,
    color: color.text,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.divider,
  },
  list: { flex: 1, borderTopWidth: 2, borderTopColor: color.divider },
  rowDivider: { height: 1, backgroundColor: color.divider },
  row: { flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3] },
  rowDate: { width: 44, fontSize: 11, opacity: 0.55, color: color.text },
  rowMain: { flex: 1, minWidth: 0 },
  rowQuote: { fontSize: 14, fontFamily: fontFamily.bodyMedium, color: color.text },
  rowAuthor: { fontSize: 11, opacity: 0.55, color: color.text, marginTop: 2 },
  empty: { fontSize: 13, color: color.text, opacity: 0.6, paddingTop: space[6], textAlign: "center" },
});
