import React, { useRef, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  Share as RNShare,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { QuoteMemoCard } from "../components/QuoteMemoCard";
import { Button } from "../components/Button";
import { color, fontFamily, space } from "../theme/tokens";
import { quoteById } from "../utils/date";

export function ShareSheetScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Share">>();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const quote = quoteById(route.params.quoteId);
  if (!quote) return null;

  const shareText = `"${quote.en}"\n${quote.ja}\n— ${quote.author}`;

  const captureCardImage = async () => {
    if (!cardRef.current) return null;
    return captureRef(cardRef, { format: "png", quality: 1 });
  };

  const handleSaveImage = async () => {
    setBusy("save");
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("写真ライブラリへのアクセスが必要です", "設定アプリから許可してください。");
        return;
      }
      const uri = await captureCardImage();
      if (!uri) return;
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("保存しました", "写真アプリに画像を保存しました。");
    } catch {
      Alert.alert("保存に失敗しました", "もう一度お試しください。");
    } finally {
      setBusy(null);
    }
  };

  const handleCopyText = async () => {
    await Clipboard.setStringAsync(shareText);
    Alert.alert("コピーしました", "名言のテキストをコピーしました。");
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    Linking.openURL(url).catch(() => Alert.alert("開けませんでした"));
  };

  const handleShareLine = () => {
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
    Linking.openURL(url).catch(() => Alert.alert("開けませんでした"));
  };

  const handleShareInstagram = async () => {
    setBusy("instagram");
    try {
      const uri = await captureCardImage();
      if (!uri) return;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "シェア" });
      } else {
        await RNShare.share({ message: shareText });
      }
    } catch {
      // user cancelled or share failed silently — no toast needed
    } finally {
      setBusy(null);
    }
  };

  const handleShareOther = async () => {
    try {
      await RNShare.share(Platform.OS === "ios" ? { message: shareText } : { message: shareText, title: "シェア" });
    } catch {
      // user cancelled
    }
  };

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => navigation.goBack()} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>シェア</Text>

        <View ref={cardRef} collapsable={false}>
          <QuoteMemoCard quote={quote} compact />
        </View>

        <View style={styles.row}>
          <Button label="画像として保存" variant="primary" style={styles.flex} onPress={handleSaveImage} disabled={busy === "save"} />
          <Button label="テキストをコピー" variant="secondary" style={styles.flex} onPress={handleCopyText} />
        </View>

        <View style={styles.grid}>
          <Button label="Instagramに共有" variant="secondary" style={styles.gridItem} onPress={handleShareInstagram} disabled={busy === "instagram"} />
          <Button label="Xに共有" variant="secondary" style={styles.gridItem} onPress={handleShareX} />
          <Button label="LINEに共有" variant="secondary" style={styles.gridItem} onPress={handleShareLine} />
          <Button label="その他" variant="secondary" style={styles.gridItem} onPress={handleShareOther} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "rgba(45,43,43,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: color.bg,
    borderTopWidth: 2,
    borderTopColor: color.text,
    paddingHorizontal: space[4],
    paddingTop: space[2],
    paddingBottom: space[8],
    gap: space[4],
  },
  handle: { width: 36, height: 3, backgroundColor: color.divider, alignSelf: "center", marginTop: 6 },
  title: { fontFamily: fontFamily.headingBold, fontSize: 20, color: color.text },
  row: { flexDirection: "row", gap: space[2] },
  flex: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
  gridItem: { width: "48%" },
});
