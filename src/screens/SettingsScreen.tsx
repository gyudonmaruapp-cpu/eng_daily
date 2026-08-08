import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChevronRight } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../components/ScreenContainer";
import { SegmentedControl } from "../components/SegmentedControl";
import { useAppData } from "../context/AppDataContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { color, fontFamily, space, type FontSizeKey } from "../theme/tokens";

const FONT_SIZES: readonly FontSizeKey[] = ["S", "M", "L"];

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { settings, updateSettings } = useAppData();
  const [pickerOpen, setPickerOpen] = useState(false);

  const timeLabel = `${String(settings.notificationHour).padStart(2, "0")}:${String(
    settings.notificationMinute
  ).padStart(2, "0")}`;

  const pickerValue = new Date();
  pickerValue.setHours(settings.notificationHour, settings.notificationMinute, 0, 0);

  return (
    <ScreenContainer>
      <Text style={styles.title}>設定</Text>

      <SectionLabel>通知</SectionLabel>
      <Section>
        <Row>
          <Text style={styles.rowLabel}>通知を受け取る</Text>
          <SegmentedControl
            options={["ON", "OFF"] as const}
            value={settings.notificationsEnabled ? "ON" : "OFF"}
            onChange={(v) => updateSettings({ notificationsEnabled: v === "ON" })}
          />
        </Row>
        <Row last>
          <Text style={styles.rowLabel}>通知時間</Text>
          <Pressable
            style={styles.timeValue}
            disabled={!settings.notificationsEnabled}
            onPress={() => setPickerOpen(true)}
          >
            <Text style={[styles.timeText, !settings.notificationsEnabled && styles.disabledText]}>
              {timeLabel}
            </Text>
            <ChevronRight size={14} color={color.text} opacity={0.5} />
          </Pressable>
        </Row>
      </Section>

      {pickerOpen && (
        <DateTimePicker
          value={pickerValue}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_event, date) => {
            setPickerOpen(Platform.OS === "ios");
            if (date) {
              updateSettings({ notificationHour: date.getHours(), notificationMinute: date.getMinutes() });
            }
          }}
        />
      )}
      {pickerOpen && Platform.OS === "ios" && (
        <Pressable style={styles.pickerDone} onPress={() => setPickerOpen(false)}>
          <Text style={styles.pickerDoneText}>完了</Text>
        </Pressable>
      )}

      <SectionLabel style={styles.sectionGap}>表示</SectionLabel>
      <Section>
        <Row last>
          <Text style={styles.rowLabel}>フォントサイズ</Text>
          <SegmentedControl
            options={FONT_SIZES}
            value={settings.fontSize}
            onChange={(v) => updateSettings({ fontSize: v })}
          />
        </Row>
      </Section>

      <SectionLabel style={styles.sectionGap}>このアプリについて</SectionLabel>
      <Section>
        <Pressable onPress={() => navigation.navigate("Legal")}>
          <Row>
            <Text style={styles.rowLabel}>利用規約・プライバシー</Text>
            <ChevronRight size={14} color={color.text} opacity={0.4} />
          </Row>
        </Pressable>
        <Row last>
          <Text style={styles.rowLabel}>バージョン</Text>
          <Text style={styles.versionText}>{Constants.expoConfig?.version ?? "1.0.0"}</Text>
        </Row>
      </Section>
    </ScreenContainer>
  );
}

function SectionLabel({ children, style }: { children: string; style?: object }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

function Row({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <View style={[styles.row, !last && styles.rowBorder]}>{children}</View>;
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.headingBold, fontSize: 30, color: color.text, marginBottom: space[4] },
  sectionLabel: {
    fontSize: 13,
    color: color.text,
    opacity: 0.55,
    marginBottom: 4,
  },
  sectionGap: { marginTop: space[6] },
  section: { borderTopWidth: 2, borderTopColor: color.divider },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space[3],
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: color.divider },
  rowLabel: { fontSize: 14, color: color.text },
  timeValue: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { fontSize: 14, color: color.text, opacity: 0.7 },
  disabledText: { opacity: 0.35 },
  versionText: { fontSize: 13, color: color.text, opacity: 0.55 },
  pickerDone: { alignSelf: "flex-end", paddingVertical: space[2] },
  pickerDoneText: { color: color.accent, fontFamily: fontFamily.headingBold, fontSize: 14 },
});
