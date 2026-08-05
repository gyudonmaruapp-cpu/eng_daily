import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_NOTIFICATION_ID = "eng-daily-quote-reminder";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Re-schedules (or cancels) the single daily "today's quote" reminder. */
export async function syncDailyNotification(
  enabled: boolean,
  hour: number,
  minute: number
): Promise<boolean> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID).catch(() => {});
  if (!enabled) return true;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let granted = existing === "granted";
  if (!granted) {
    const { status } = await Notifications.requestPermissionsAsync();
    granted = status === "granted";
  }
  if (!granted) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-quote", {
      name: "今日の名言",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIFICATION_ID,
    content: {
      title: "今日の名言",
      body: "今日の一言が届いています。開いて読んでみましょう。",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...(Platform.OS === "android" ? { channelId: "daily-quote" } : null),
    },
  });
  return true;
}
