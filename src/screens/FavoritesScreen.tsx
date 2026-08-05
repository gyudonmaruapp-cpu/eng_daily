import React, { useMemo } from "react";
import { Heart } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAppData } from "../context/AppDataContext";
import { color, fontFamily, space } from "../theme/tokens";
import { quoteById } from "../utils/date";

export function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favoriteIds, toggleFavorite } = useAppData();

  const rows = useMemo(
    () =>
      favoriteIds
        .map((id) => quoteById(id))
        .filter((q): q is NonNullable<typeof q> => !!q),
    [favoriteIds]
  );

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.title}>お気に入り</Text>

      <FlatList
        data={rows}
        keyExtractor={(q) => q.id}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        ListEmptyComponent={
          <Text style={styles.empty}>まだお気に入りはありません。ホームでハートを押すと追加されます。</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate("QuoteDetail", { quoteId: item.id })}
          >
            <Pressable hitSlop={8} onPress={() => toggleFavorite(item.id)}>
              <Heart size={18} color={color.accent} fill={color.accent} style={styles.heartIcon} />
            </Pressable>
            <View style={styles.rowMain}>
              <Text style={styles.rowQuote}>&ldquo;{item.en}&rdquo;</Text>
              <Text style={styles.rowAuthor}>{item.author}</Text>
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.headingBold, fontSize: 30, color: color.text, marginBottom: space[4] },
  list: { flex: 1, borderTopWidth: 2, borderTopColor: color.divider },
  rowDivider: { height: 1, backgroundColor: color.divider },
  row: { flexDirection: "row", alignItems: "flex-start", gap: space[3], paddingVertical: space[4] },
  heartIcon: { marginTop: 2 },
  rowMain: { flex: 1, minWidth: 0 },
  rowQuote: { fontSize: 14, fontFamily: fontFamily.bodyMedium, color: color.text, lineHeight: 19 },
  rowAuthor: { fontSize: 11, opacity: 0.55, color: color.text, marginTop: 2 },
  empty: { fontSize: 13, color: color.text, opacity: 0.6, paddingTop: space[6], textAlign: "center" },
});
